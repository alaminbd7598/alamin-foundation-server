import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassword,
  validateEventInput,
  filterAndSortUpcomingEvents,
  sortJoinedEventsByDate,
} from './validation';
import { signJwt, verifyJwt, hashPassword, verifyPassword } from './jwt';
import { SocialEvent, JoinedEventRecord } from '../types/event';

test('password validation enforces uppercase, lowercase, and at least 6 characters', () => {
  assert.equal(validatePassword('short').valid, false);
  assert.equal(validatePassword('alllowercase123').valid, false);
  assert.equal(validatePassword('ALLUPPERCASE123').valid, false);
  assert.equal(validatePassword('ValidPass1').valid, true);
});

test('event input validation rejects past dates and accepts future dates', () => {
  const refNow = new Date('2026-11-02T10:00:00Z');

  const pastEvent = validateEventInput(
    {
      title: 'Winter Clothes Distribution',
      description: 'Distributing warm clothes and blankets to families in Mirpur 10.',
      eventType: 'Winter Relief',
      thumbnailUrl: '/src/assets/images/hero_community_drive_1793643466576.jpg',
      location: 'Mirpur 10, Dhaka',
      eventDate: '2026-10-15T10:00:00Z',
    },
    refNow
  );
  assert.equal(pastEvent.valid, false);
  assert.ok(pastEvent.errors.eventDate);

  const futureEvent = validateEventInput(
    {
      title: 'Winter Clothes Distribution',
      description: 'Distributing warm clothes and blankets to families in Mirpur 10.',
      eventType: 'Winter Relief',
      thumbnailUrl: '/src/assets/images/hero_community_drive_1793643466576.jpg',
      location: 'Mirpur 10, Dhaka',
      eventDate: '2026-12-15T10:00:00Z',
    },
    refNow
  );
  assert.equal(futureEvent.valid, true);
});

test('filterAndSortUpcomingEvents excludes past events, sorts ascending, and honors limit(6)', () => {
  const refNow = new Date('2026-11-02T10:00:00Z');
  const mockEvents: SocialEvent[] = [
    {
      _id: 'past-1',
      title: 'Old Cleanup Drive',
      description: 'Past event description that should never appear in upcoming events.',
      eventType: 'Cleanup',
      thumbnailUrl: '/img.jpg',
      location: 'Dhaka',
      eventDate: '2026-09-01T09:00:00Z',
      creatorEmail: 'org@example.com',
      creatorName: 'Organizer',
      creatorPhoto: '/avatar.jpg',
      participants: [],
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z',
    },
    ...Array.from({ length: 7 }, (_, i) => ({
      _id: `future-${i + 1}`,
      title: `Future Event ${i + 1}`,
      description: 'Valid future community development event description.',
      eventType: 'Donation' as const,
      thumbnailUrl: '/img.jpg',
      location: 'Mirpur, Dhaka',
      eventDate: new Date(refNow.getTime() + (7 - i) * 86400000).toISOString(),
      creatorEmail: 'org@example.com',
      creatorName: 'Organizer',
      creatorPhoto: '/avatar.jpg',
      participants: [],
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    })),
  ];

  const recentSix = filterAndSortUpcomingEvents(mockEvents, { referenceNow: refNow, limit: 6 });
  assert.equal(recentSix.length, 6);
  assert.equal(recentSix.some((e) => e._id === 'past-1'), false);
  // Nearest future event should be first
  assert.equal(recentSix[0]._id, 'future-7');
});

test('sortJoinedEventsByDate orders joined events chronologically', () => {
  const baseEvent = (id: string, date: string): JoinedEventRecord => ({
    _id: `join-${id}`,
    eventId: id,
    userEmail: 'volunteer@example.com',
    userName: 'Volunteer',
    userPhoto: '/avatar.jpg',
    joinedAt: '2026-11-01T00:00:00Z',
    event: {
      _id: id,
      title: `Event ${id}`,
      description: 'Community event description here.',
      eventType: 'Plantation',
      thumbnailUrl: '/img.jpg',
      location: 'Dhanmondi, Dhaka',
      eventDate: date,
      creatorEmail: 'org@example.com',
      creatorName: 'Org',
      creatorPhoto: '/avatar.jpg',
      participants: [],
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    },
  });

  const unsorted = [
    baseEvent('late', '2027-02-10T10:00:00Z'),
    baseEvent('early', '2026-11-18T10:00:00Z'),
    baseEvent('mid', '2026-12-05T10:00:00Z'),
  ];

  const sorted = sortJoinedEventsByDate(unsorted);
  assert.deepEqual(
    sorted.map((r) => r.eventId),
    ['early', 'mid', 'late']
  );
});

test('JWT signing and verification and password hashing work accurately', () => {
  const token = signJwt({
    sub: 'user-101',
    email: 'volunteer@alaminfoundation.org',
    name: 'Tahmid Hasan',
  });
  const verified = verifyJwt(token);
  assert.ok(verified);
  assert.equal(verified.email, 'volunteer@alaminfoundation.org');
  assert.equal(verifyJwt(`${token}tampered`), null);

  const hash = hashPassword('CommunityPass1');
  assert.equal(verifyPassword('CommunityPass1', hash), true);
  assert.equal(verifyPassword('WrongPass1', hash), false);
});
