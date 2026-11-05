import { EventCategory, SocialEvent } from '../types/event';

const API_BASE = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');

export function normalizeEvent(raw: SocialEvent): SocialEvent {
  const participants = (raw.participants || []).map((p) => ({
    ...p,
    email: p.email || p.userEmail,
    name: p.name || p.userName,
    photoURL: p.photoURL || p.userPhoto,
  }));

  return {
    ...raw,
    id: raw.id || raw._id,
    category: raw.category || raw.eventType,
    thumbnail: raw.thumbnail || raw.thumbnailUrl,
    participants,
    participantCount: participants.length,
  };
}

export async function apiFetchEvents(params?: {
  search?: string;
  category?: string;
  limit?: number;
}): Promise<SocialEvent[]> {
  if (params?.limit === 6 && !params.search && (!params.category || params.category === 'All')) {
    const res = await fetch(`${API_BASE}/api/events/upcoming-recent`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to load recent upcoming events.');
    }
    return (data.events || []).map(normalizeEvent);
  }

  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category && params.category !== 'All') query.set('category', params.category);

  const qs = query.toString();
  const res = await fetch(`${API_BASE}/api/events${qs ? `?${qs}` : ''}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load upcoming events.');
  }
  const list = (data.events || []).map(normalizeEvent);
  return params?.limit ? list.slice(0, params.limit) : list;
}

export async function apiFetchEventById(id: string): Promise<SocialEvent> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`);
  const data = await res.json();
  if (!res.ok || !data.success || !data.event) {
    throw new Error(data.message || 'Event not found.');
  }
  return normalizeEvent(data.event);
}

export async function apiCreateEvent(
  token: string,
  input: {
    title: string;
    description: string;
    category: EventCategory;
    thumbnail: string;
    location: string;
    eventDate: string;
  }
): Promise<SocialEvent> {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      eventType: input.category,
      thumbnailUrl: input.thumbnail,
      location: input.location,
      eventDate: input.eventDate,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create event.');
  }
  return normalizeEvent(data.event);
}

export async function apiUpdateEvent(
  token: string,
  id: string,
  input: {
    title: string;
    description: string;
    category: EventCategory;
    thumbnail: string;
    location: string;
    eventDate: string;
  }
): Promise<SocialEvent> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      eventType: input.category,
      thumbnailUrl: input.thumbnail,
      location: input.location,
      eventDate: input.eventDate,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update event.');
  }
  return normalizeEvent(data.event);
}

export async function apiDeleteEvent(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete event.');
  }
}

export async function apiJoinEvent(token: string, id: string): Promise<SocialEvent> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to join event.');
  }
  return normalizeEvent(data.event);
}

export async function apiLeaveEvent(token: string, id: string): Promise<SocialEvent> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}/leave`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to leave event.');
  }
  return normalizeEvent(data.event);
}

export async function apiFetchMyEvents(token: string): Promise<SocialEvent[]> {
  const res = await fetch(`${API_BASE}/api/my-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load your created events.');
  }
  return (data.events || []).map(normalizeEvent);
}

export async function apiFetchJoinedEvents(token: string): Promise<SocialEvent[]> {
  const res = await fetch(`${API_BASE}/api/joined-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load joined events.');
  }
  const records = data.joinedEvents || [];
  return records
    .map((r: { event?: SocialEvent }) => (r.event ? normalizeEvent(r.event) : null))
    .filter(Boolean) as SocialEvent[];
}

export async function apiSubscribeNewsletter(email: string): Promise<string> {
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  return `Subscribed ${email} to Alamin Foundation cause alerts!`;
}
