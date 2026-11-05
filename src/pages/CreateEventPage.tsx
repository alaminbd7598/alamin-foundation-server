import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  FileText,
  Tag,
  Type,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { EVENT_CATEGORIES, EventCategory } from '../types/event';
import { PRESET_THUMBNAILS } from '../data/seedEvents';
import { apiCreateEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEventInput } from '../utils/validation';

interface CreateEventPageProps {
  navigate: (to: string) => void;
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CreateEventPage({ navigate }: CreateEventPageProps) {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Donation');
  const [eventDate, setEventDate] = useState(getTomorrowDateString());
  const [location, setLocation] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const minDate = getTomorrowDateString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      showToast('You must be logged in to create an event.', 'error');
      navigate('/login?redirect=/create-event');
      return;
    }

    const validation = validateEventInput({
      title,
      description,
      category,
      thumbnail,
      location,
      eventDate: eventDate ? new Date(`${eventDate}T09:00:00`).toISOString() : '',
    });

    if (!validation.valid) {
      showToast(validation.error || 'Please check your event inputs.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await apiCreateEvent(token, {
        title: title.trim(),
        description: description.trim(),
        category,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        eventDate: new Date(`${eventDate}T09:00:00`).toISOString(),
      });
      showToast('Event created successfully! Redirecting to Upcoming Events...', 'success');
      navigate('/upcoming-events');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        type="button"
        onClick={() => navigate('/upcoming-events')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-200 hover:text-fuchsia-600 dark:hover:text-amber-300 mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upcoming Events
      </button>

      <div className="bg-white dark:bg-[#16082E]/95 rounded-3xl border border-purple-200 dark:border-purple-500/35 p-6 sm:p-10 shadow-2xl">
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/90 border border-amber-400/40 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
            Launch Initiative
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            CREATE A <span className="text-royal-gradient">SOCIAL DEVELOPMENT EVENT</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75">
            Organize a local cleanup, winter relief drive, plantation, or community camp. Only future dates are allowed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label
              htmlFor="event-title"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
            >
              Event Title *
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="event-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Winter Clothes Distribution – Mirpur 10, Dhaka"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          {/* Two Column: Event Type Dropdown & Future-Only Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="event-category"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
              >
                Event Type (Category) *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="event-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="event-date"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
              >
                Event Date (Future Only) *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="event-date"
                  type="date"
                  required
                  min={minDate}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500 transition-colors font-mono-tabular"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="event-location"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
            >
              Location / Area *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="event-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mirpur 10, Dhaka or Hossaini Dalan, Dhaka"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          {/* Thumbnail Image URL + Quick Presets */}
          <div>
            <label
              htmlFor="event-thumbnail"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
            >
              Thumbnail Image URL *
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="event-thumbnail"
                type="url"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-purple-300/75">Quick photo presets:</span>
              {PRESET_THUMBNAILS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setThumbnail(preset.url)}
                  className="text-xs px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-500/35 bg-purple-50 dark:bg-[#1E0B3B] text-slate-700 dark:text-purple-200 hover:border-amber-400 hover:text-fuchsia-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="event-description"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-2"
            >
              Description *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <textarea
                id="event-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what volunteers will do, meeting point, items to bring, and expected community impact..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          {/* Organizer Email Attached Notice & Publish Button */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-purple-100 dark:border-purple-500/20">
            <p className="text-xs text-slate-500 dark:text-purple-300/75">
              Organizer Email attached:{' '}
              <span className="font-mono-tabular font-bold text-fuchsia-600 dark:text-amber-300">
                {user?.email}
              </span>
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
