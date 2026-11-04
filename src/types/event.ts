export type EventCategory =
  | 'Donation'
  | 'Cleanup'
  | 'Plantation'
  | 'Winter Relief'
  | 'Food Drive'
  | 'Health Camp'
  | 'Education';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Winter Relief',
  'Food Drive',
  'Health Camp',
  'Education',
];

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  provider?: 'credentials' | 'google' | 'github';
  createdAt: string;
}

export interface EventParticipant {
  userEmail: string;
  userName: string;
  userPhoto: string;
  joinedAt: string;
  email?: string;
  name?: string;
  photoURL?: string;
}

export interface SocialEvent {
  _id: string;
  id?: string;
  title: string;
  description: string;
  eventType: EventCategory;
  category?: EventCategory;
  thumbnailUrl: string;
  thumbnail?: string;
  location: string;
  eventDate: string; // ISO date string
  creatorEmail: string;
  creatorName: string;
  creatorPhoto: string;
  participants: EventParticipant[];
  participantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JoinedEventRecord {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  joinedAt: string;
  event: SocialEvent;
}

export interface EventFormInput {
  title: string;
  description: string;
  eventType: EventCategory;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}
