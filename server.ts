import express, { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { SocialEvent, User, JoinedEventRecord } from './src/types/event';
import {
  validateRegistrationInput,
  validateEventInput,
  filterAndSortUpcomingEvents,
  sortJoinedEventsByDate,
} from './src/utils/validation';
import { signJwt, verifyJwt, hashPassword, verifyPassword, JwtPayload } from './src/utils/jwt';
import { createInitialSeedEvents } from './src/data/seedEvents';

dotenv.config();

interface StoredUser extends User {
  passwordHash: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  events: SocialEvent[];
  joinedEvents: {
    _id: string;
    eventId: string;
    userEmail: string;
    userName: string;
    userPhoto: string;
    joinedAt: string;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (Array.isArray(parsed.events) && parsed.events.length > 0) {
        for (const ev of parsed.events) {
          if ((ev.eventType as string) === 'Winter Drive') ev.eventType = 'Winter Relief';
          if ((ev.eventType as string) === 'Healthcare') ev.eventType = 'Health Camp';
          if ((ev.eventType as string) === 'Disaster Relief') ev.eventType = 'Food Drive';
        }
        return parsed;
      }
    } catch {
      // Fallback to fresh seed if corrupted
    }
  }

  const seedEvents = createInitialSeedEvents();
  const initialUsers: StoredUser[] = [
    {
      id: 'usr-amina-01',
      name: 'Amina Rahman',
      email: 'amina.rahman@alaminfoundation.org',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      provider: 'credentials',
      passwordHash: hashPassword('AlaminPass123'),
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'usr-tanvir-02',
      name: 'Tanvir Ahmed',
      email: 'tanvir.ahmed@alaminfoundation.org',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      provider: 'credentials',
      passwordHash: hashPassword('AlaminPass123'),
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  const initialJoined: DatabaseSchema['joinedEvents'] = [];
  for (const ev of seedEvents) {
    for (const p of ev.participants) {
      initialJoined.push({
        _id: `join-${ev._id}-${p.userEmail}`,
        eventId: ev._id,
        userEmail: p.userEmail,
        userName: p.userName,
        userPhoto: p.userPhoto,
        joinedAt: p.joinedAt,
      });
    }
  }

  const initialDb: DatabaseSchema = {
    users: initialUsers,
    events: seedEvents,
    joinedEvents: initialJoined,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
  return initialDb;
}

let db: DatabaseSchema = initDatabase();

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

/**
 * MongoDB-compatible chainable cursor supporting .sort() and .limit() operators
 */
class EventCursor {
  private items: SocialEvent[];

  constructor(items: SocialEvent[]) {
    this.items = [...items];
  }

  sort(sortSpec: { eventDate?: 1 | -1 }): this {
    if (sortSpec.eventDate) {
      const dir = sortSpec.eventDate;
      this.items.sort(
        (a, b) => (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) * dir
      );
    }
    return this;
  }

  limit(count: number): this {
    this.items = this.items.slice(0, count);
    return this;
  }

  toArray(): SocialEvent[] {
    return this.items;
  }
}

const eventsCollection = {
  find(query?: { eventDate?: { $gt: string } }) {
    let results = [...db.events];
    if (query?.eventDate?.$gt) {
      const minTime = new Date(query.eventDate.$gt).getTime();
      results = results.filter((ev) => new Date(ev.eventDate).getTime() > minTime);
    }
    return new EventCursor(results);
  },
};

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

function verifyTokenMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access. Valid JWT Bearer token is required.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwt(token);
  if (!decoded) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired JWT token. Please log in again.',
    });
    return;
  }

  req.user = decoded;
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ==========================================
  // AUTHENTICATION ROUTES (/api/auth/*)
  // ==========================================

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, photoURL, password } = req.body || {};

    const validation = validateRegistrationInput({
      name: String(name || ''),
      email: String(email || ''),
      photoURL: String(photoURL || ''),
      password: String(password || ''),
    });

    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: validation.firstError || 'Invalid registration data.',
        errors: validation.errors,
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const newUser: StoredUser = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      name: String(name).trim(),
      email: normalizedEmail,
      photoURL: String(photoURL).trim(),
      provider: 'credentials',
      passwordHash: hashPassword(String(password)),
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDatabase();

    const token = signJwt({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const { passwordHash: _, ...publicUser } = newUser;
    res.status(201).json({
      success: true,
      message: 'Registration completed! Welcome to Alamin Foundation.',
      user: publicUser,
      token,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required to sign in.',
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash: _, ...publicUser } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: publicUser,
      token,
    });
  });

  app.post('/api/auth/oauth', (req: Request, res: Response) => {
    const { provider, name, email, photoURL } = req.body || {};
    const validProvider = provider === 'github' ? 'github' : 'google';

    const normalizedEmail = String(
      email || (validProvider === 'google' ? 'farhan.karim@gmail.com' : 'farhan.dev@github.com')
    )
      .trim()
      .toLowerCase();

    const displayName = String(name || 'Farhan Karim').trim();
    const avatar = String(
      photoURL ||
        `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=d1fae5`
    ).trim();

    let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      user = {
        id: `usr-${crypto.randomUUID().slice(0, 8)}`,
        name: displayName,
        email: normalizedEmail,
        photoURL: avatar,
        provider: validProvider,
        passwordHash: hashPassword(crypto.randomUUID()),
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      saveDatabase();
    }

    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash: _, ...publicUser } = user;
    res.json({
      success: true,
      message: `Signed in with ${validProvider === 'google' ? 'Google' : 'GitHub'} as ${user.name}`,
      user: publicUser,
      token,
    });
  });

  app.get('/api/auth/me', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userEmail = req.user?.email.toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === userEmail);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    const { passwordHash: _, ...publicUser } = user;
    res.json({ success: true, user: publicUser });
  });

  app.patch('/api/auth/profile', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userEmail = req.user?.email.toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === userEmail);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    const { name, photoURL } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      res.status(400).json({ success: false, message: 'Display name must be at least 2 characters.' });
      return;
    }
    if (!photoURL || String(photoURL).trim().length < 5) {
      res.status(400).json({ success: false, message: 'Valid profile photo URL is required.' });
      return;
    }

    user.name = String(name).trim();
    user.photoURL = String(photoURL).trim();

    // Sync creatorName & participant info in events
    for (const ev of db.events) {
      if (ev.creatorEmail.toLowerCase() === user.email.toLowerCase()) {
        ev.creatorName = user.name;
        ev.creatorPhoto = user.photoURL;
      }
      for (const p of ev.participants) {
        if (p.userEmail.toLowerCase() === user.email.toLowerCase()) {
          p.userName = user.name;
          p.userPhoto = user.photoURL;
        }
      }
    }
    for (const j of db.joinedEvents) {
      if (j.userEmail.toLowerCase() === user.email.toLowerCase()) {
        j.userName = user.name;
        j.userPhoto = user.photoURL;
      }
    }

    saveDatabase();

    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash: _, ...publicUser } = user;
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: publicUser,
      token,
    });
  });

  // ==========================================
  // EVENTS ROUTES (/api/events/*)
  // ==========================================

  // Home Page: Show 6 recent upcoming events using .limit(6) operator
  app.get('/api/events/upcoming-recent', (_req: Request, res: Response) => {
    const nowIso = new Date().toISOString();
    const recentUpcoming = eventsCollection
      .find({ eventDate: { $gt: nowIso } })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    res.json({
      success: true,
      count: recentUpcoming.length,
      events: recentUpcoming,
    });
  });

  // Public Upcoming Events Page: Only future events, optional category & search filter
  app.get('/api/events', (req: Request, res: Response) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const upcoming = filterAndSortUpcomingEvents(db.events, {
      referenceNow: new Date(),
      category,
      search,
    });

    res.json({
      success: true,
      count: upcoming.length,
      events: upcoming,
    });
  });

  // Public Single Event Details Page
  app.get('/api/events/:id', (req: Request, res: Response) => {
    const event = db.events.find((e) => e._id === req.params.id);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    res.json({
      success: true,
      event,
    });
  });

  // Private: Create Event
  app.post('/api/events', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body || {};

    const validation = validateEventInput(
      { title, description, eventType, thumbnailUrl, location, eventDate },
      new Date()
    );

    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: validation.firstError || 'Invalid event details.',
        errors: validation.errors,
      });
      return;
    }

    const creatorUser = db.users.find(
      (u) => u.email.toLowerCase() === req.user?.email.toLowerCase()
    );

    const nowIso = new Date().toISOString();
    const newEvent: SocialEvent = {
      _id: `evt-${crypto.randomUUID().slice(0, 8)}`,
      title: String(title).trim(),
      description: String(description).trim(),
      eventType,
      thumbnailUrl: String(thumbnailUrl).trim(),
      location: String(location).trim(),
      eventDate: new Date(String(eventDate)).toISOString(),
      creatorEmail: req.user!.email,
      creatorName: creatorUser?.name || req.user!.name,
      creatorPhoto:
        creatorUser?.photoURL ||
        `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(req.user!.name)}&backgroundColor=d1fae5`,
      participants: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    db.events.push(newEvent);
    saveDatabase();

    res.status(201).json({
      success: true,
      message: 'Social development event created successfully!',
      event: newEvent,
    });
  });

  // Private: Join Event
  app.post('/api/events/:id/join', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const event = db.events.find((e) => e._id === req.params.id);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    if (new Date(event.eventDate).getTime() <= Date.now()) {
      res.status(400).json({
        success: false,
        message: 'Cannot join an event whose date has already passed.',
      });
      return;
    }

    const userEmail = req.user!.email.toLowerCase();
    const alreadyJoined = event.participants.some(
      (p) => p.userEmail.toLowerCase() === userEmail
    );

    if (alreadyJoined) {
      res.status(409).json({
        success: false,
        message: 'You have already joined this event.',
      });
      return;
    }

    const userRecord = db.users.find((u) => u.email.toLowerCase() === userEmail);
    const joinedAt = new Date().toISOString();
    const participant = {
      userEmail: req.user!.email,
      userName: userRecord?.name || req.user!.name,
      userPhoto:
        userRecord?.photoURL ||
        `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(req.user!.name)}&backgroundColor=d1fae5`,
      joinedAt,
    };

    event.participants.push(participant);
    db.joinedEvents.push({
      _id: `join-${crypto.randomUUID().slice(0, 8)}`,
      eventId: event._id,
      userEmail: participant.userEmail,
      userName: participant.userName,
      userPhoto: participant.userPhoto,
      joinedAt,
    });

    saveDatabase();

    res.json({
      success: true,
      message: `You have successfully joined "${event.title}"!`,
      event,
    });
  });

  // Private: Leave Event (Optional toggle shown in video)
  app.post('/api/events/:id/leave', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const event = db.events.find((e) => e._id === req.params.id);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    const userEmail = req.user!.email.toLowerCase();
    event.participants = event.participants.filter(
      (p) => p.userEmail.toLowerCase() !== userEmail
    );
    db.joinedEvents = db.joinedEvents.filter(
      (j) => !(j.eventId === event._id && j.userEmail.toLowerCase() === userEmail)
    );

    saveDatabase();

    res.json({
      success: true,
      message: `You have left "${event.title}".`,
      event,
    });
  });

  // Private: Get Joined Events sorted by event date
  app.get('/api/joined-events', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userEmail = req.user!.email.toLowerCase();

    const joinedRecords: JoinedEventRecord[] = [];
    for (const j of db.joinedEvents) {
      if (j.userEmail.toLowerCase() === userEmail) {
        const matchedEvent = db.events.find((e) => e._id === j.eventId);
        if (matchedEvent) {
          joinedRecords.push({
            ...j,
            event: matchedEvent,
          });
        }
      }
    }

    const sorted = sortJoinedEventsByDate(joinedRecords);
    res.json({
      success: true,
      count: sorted.length,
      joinedEvents: sorted,
    });
  });

  // Private: Get Manage Events (created by the logged-in user)
  app.get('/api/my-events', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const userEmail = req.user!.email.toLowerCase();
    const nowTime = Date.now();
    const myEvents = db.events
      .filter((e) => e.creatorEmail.toLowerCase() === userEmail)
      .sort((a, b) => {
        const timeA = new Date(a.eventDate).getTime();
        const timeB = new Date(b.eventDate).getTime();
        const aUpcoming = timeA > nowTime;
        const bUpcoming = timeB > nowTime;
        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;
        return timeA - timeB;
      });

    res.json({
      success: true,
      count: myEvents.length,
      events: myEvents,
    });
  });

  // Private: Update Event (only creator can update)
  app.put('/api/events/:id', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const event = db.events.find((e) => e._id === req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    if (event.creatorEmail.toLowerCase() !== req.user!.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update events created by your own account.',
      });
      return;
    }

    const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body || {};
    const validation = validateEventInput(
      { title, description, eventType, thumbnailUrl, location, eventDate },
      new Date()
    );

    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: validation.firstError || 'Invalid event update data.',
        errors: validation.errors,
      });
      return;
    }

    event.title = String(title).trim();
    event.description = String(description).trim();
    event.eventType = eventType;
    event.thumbnailUrl = String(thumbnailUrl).trim();
    event.location = String(location).trim();
    event.eventDate = new Date(String(eventDate)).toISOString();
    event.updatedAt = new Date().toISOString();

    saveDatabase();

    res.json({
      success: true,
      message: 'Event updated successfully!',
      event,
    });
  });

  // Private: Delete Event (only creator can delete)
  app.delete('/api/events/:id', verifyTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const idx = db.events.findIndex((e) => e._id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    const event = db.events[idx];
    if (event.creatorEmail.toLowerCase() !== req.user!.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete events created by your own account.',
      });
      return;
    }

    db.events.splice(idx, 1);
    db.joinedEvents = db.joinedEvents.filter((j) => j.eventId !== req.params.id);
    saveDatabase();

    res.json({
      success: true,
      message: 'Event deleted permanently.',
    });
  });

  // ==========================================
  // VITE / STATIC SPA FALLBACK (No 404 on reload)
  // ==========================================
  const distPath = path.resolve(process.cwd(), 'dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Alamin Foundation server running on http://localhost:${PORT}`);
  });
}

startServer();
