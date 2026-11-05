import {
  EventCategory,
  EVENT_CATEGORIES,
  EventFormInput,
  JoinedEventRecord,
  SocialEvent,
} from '../types/event';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  firstError?: string;
  error?: string;
}

/**
 * Validates registration and login password rules:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - Minimum length of 6 characters
 */
export function validatePassword(password: string): {
  valid: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasMinLength: boolean;
  message?: string;
  errors: string[];
} {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.trim().length >= 6;
  const errors: string[] = [];

  if (!hasMinLength) {
    errors.push('Password must be at least 6 characters long.');
  }
  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter (A-Z).');
  }
  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter (a-z).');
  }

  return {
    valid: errors.length === 0,
    hasUppercase,
    hasLowercase,
    hasMinLength,
    message: errors[0],
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validateRegistrationInput(input: {
  name: string;
  email: string;
  photoURL: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!validateEmail(input.email || '')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.photoURL || input.photoURL.trim().length < 5) {
    errors.photoURL = 'Please provide a valid profile photo URL.';
  }
  const pwdCheck = validatePassword(input.password || '');
  if (!pwdCheck.valid && pwdCheck.message) {
    errors.password = pwdCheck.message;
  }

  const keys = Object.keys(errors);
  const firstError = keys.length > 0 ? errors[keys[0]] : undefined;
  return {
    valid: keys.length === 0,
    errors,
    firstError,
    error: firstError,
  };
}

/**
 * Ensures the event date is strictly in the future relative to referenceNow.
 */
export function isFutureEventDate(dateStr: string, referenceNow: Date = new Date()): boolean {
  if (!dateStr) return false;
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getTime() > referenceNow.getTime();
}

export function validateEventInput(
  input: Partial<EventFormInput> & { category?: EventCategory; thumbnail?: string },
  referenceNow: Date = new Date()
): ValidationResult {
  const errors: Record<string, string> = {};
  const resolvedCategory = input.eventType || input.category;
  const resolvedThumbnail = input.thumbnailUrl || input.thumbnail;

  if (!input.title || input.title.trim().length < 5) {
    errors.title = 'Event title must be at least 5 characters long.';
  }
  if (!input.description || input.description.trim().length < 20) {
    errors.description =
      'Description must be at least 20 characters to explain the community impact.';
  }
  if (!resolvedCategory || !EVENT_CATEGORIES.includes(resolvedCategory as EventCategory)) {
    errors.eventType = 'Please select a valid event category.';
  }
  if (!resolvedThumbnail || resolvedThumbnail.trim().length < 5) {
    errors.thumbnailUrl = 'Please provide a valid event thumbnail URL.';
  }
  if (!input.location || input.location.trim().length < 3) {
    errors.location = 'Please specify the event location (e.g., Mirpur 10, Dhaka).';
  }
  if (!input.eventDate || !isFutureEventDate(input.eventDate, referenceNow)) {
    errors.eventDate = 'Event date must be a valid future date. Past dates are not allowed.';
  }

  const keys = Object.keys(errors);
  const firstError = keys.length > 0 ? errors[keys[0]] : undefined;
  return {
    valid: keys.length === 0,
    errors,
    firstError,
    error: firstError,
  };
}

/**
 * Filters out any past events and sorts upcoming events by eventDate ascending.
 */
export function filterAndSortUpcomingEvents(
  events: SocialEvent[],
  options?: {
    referenceNow?: Date;
    category?: string;
    search?: string;
    limit?: number;
  }
): SocialEvent[] {
  const now = options?.referenceNow ?? new Date();
  const category = options?.category?.trim();
  const search = options?.search?.trim().toLowerCase();

  const filtered = events.filter((ev) => {
    const eventTime = new Date(ev.eventDate).getTime();
    if (Number.isNaN(eventTime) || eventTime <= now.getTime()) {
      return false;
    }
    const evCat = ev.eventType || ev.category;
    if (category && category !== 'All' && evCat !== category) {
      return false;
    }
    if (search) {
      const hay = `${ev.title} ${ev.location} ${ev.description} ${evCat}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  if (options?.limit && options.limit > 0) {
    return filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Sorts joined event records or events by the event's date ascending (nearest upcoming first).
 */
export function sortJoinedEventsByDate<T extends JoinedEventRecord | SocialEvent>(
  records: T[]
): T[] {
  return [...records].sort((a, b) => {
    const dateA = 'event' in a ? a.event.eventDate : a.eventDate;
    const dateB = 'event' in b ? b.event.eventDate : b.eventDate;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
}
