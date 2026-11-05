import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  Users,
  Eye,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { EVENT_CATEGORIES, EventCategory, SocialEvent } from '../types/event';
import { apiDeleteEvent, apiFetchMyEvents, apiUpdateEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EventSkeletonGrid, formatEventDate } from '../components/EventCard';
import { getTomorrowDateString } from './CreateEventPage';
import { validateEventInput } from '../utils/validation';

interface ManageEventsPageProps {
  navigate: (to: string) => void;
}

export function ManageEventsPage({ navigate }: ManageEventsPageProps) {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [myEvents, setMyEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState<SocialEvent | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Donation');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingEvent, setDeletingEvent] = useState<SocialEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadMyEvents() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiFetchMyEvents(token);
        if (mounted) setMyEvents(data);
      } catch (err) {
        if (mounted) {
          showToast(err instanceof Error ? err.message : 'Could not load your events.', 'error');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMyEvents();
    return () => {
      mounted = false;
    };
  }, [token, showToast]);

  const openEditModal = (evt: SocialEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setCategory(evt.category || evt.eventType);
    setLocation(evt.location);
    setThumbnail(evt.thumbnail || evt.thumbnailUrl);
    setDescription(evt.description);
    const parsedDate = new Date(evt.eventDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      setEventDate(parsedDate.toISOString().split('T')[0]);
    } else {
      setEventDate(getTomorrowDateString());
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingEvent) return;

    const isoDate = new Date(`${eventDate}T09:00:00`).toISOString();
    const validation = validateEventInput({
      title,
      description,
      category,
      thumbnail,
      location,
      eventDate: isoDate,
    });

    if (!validation.valid) {
      showToast(validation.error || 'Invalid event data.', 'error');
      return;
    }

    setSaving(true);
    try {
      const targetId = editingEvent.id || editingEvent._id;
      const updated = await apiUpdateEvent(token, targetId, {
        title: title.trim(),
        description: description.trim(),
        category,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        eventDate: isoDate,
      });

      setMyEvents((prev) =>
        prev.map((item) => ((item.id || item._id) === (updated.id || updated._id) ? updated : item))
      );
      showToast('Event updated successfully!', 'success');
      setEditingEvent(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!token || !deletingEvent) return;
    setDeleting(true);
    try {
      const targetId = deletingEvent.id || deletingEvent._id;
      await apiDeleteEvent(token, targetId);
      setMyEvents((prev) => prev.filter((item) => (item.id || item._id) !== targetId));
      showToast(`Deleted "${deletingEvent.title}".`, 'info');
      setDeletingEvent(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete event.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-purple-200 dark:border-purple-500/25">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Creator Console
          </span>
          <h1 className="mt-1 font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            MANAGE <span className="text-royal-gradient">MY EVENTS</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-purple-200/75">
            Update details, dates, or remove initiatives created by{' '}
            <span className="font-semibold text-fuchsia-600 dark:text-amber-300">
              {user?.email}
            </span>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/create-event')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {loading ? (
        <EventSkeletonGrid count={3} />
      ) : myEvents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-purple-300 dark:border-purple-500/35 bg-white/60 dark:bg-[#16082E]/50">
          <h2 className="font-serif-display text-2xl font-bold text-slate-900 dark:text-white">
            You Haven&apos;t Created Any Events Yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 max-w-md mx-auto">
            Start a local cleanup, tree plantation, or winter clothes distribution drive and invite your neighborhood.
          </p>
          <button
            type="button"
            onClick={() => navigate('/create-event')}
            className="mt-6 px-6 py-3 rounded-full btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((evt) => (
            <div key={evt.id} className="perspective-container h-full">
              <article className="card-3d-tilt h-full bg-white dark:bg-[#16082E]/95 rounded-2xl border border-purple-200 dark:border-purple-500/30 overflow-hidden flex flex-col justify-between shadow-md">
                <div>
                  <div className="relative h-48 bg-purple-950 overflow-hidden">
                    <img
                      src={evt.thumbnail}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120424]/90 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fuchsia-600/90 text-white border border-amber-300/40">
                      {evt.category}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-mono-tabular font-semibold bg-[#120424]/85 text-amber-300 flex items-center gap-1.5 border border-purple-400/25">
                      <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                      {formatEventDate(evt.eventDate)}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {evt.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-purple-200/75 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                    <p className="mt-2.5 text-xs text-slate-600 dark:text-purple-200/70 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-purple-100 dark:border-purple-500/20">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/75 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 font-mono-tabular font-semibold text-fuchsia-600 dark:text-amber-300">
                      <Users className="w-3.5 h-3.5" />
                      {evt.participantCount} joined
                    </span>
                  </div>

                  {/* Three Action Buttons: View, Edit, Delete */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="py-2 px-3 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-500/35 text-slate-700 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(evt)}
                      className="py-2 px-3 rounded-xl text-xs font-bold btn-luxury-primary text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingEvent(evt)}
                      className="py-2 px-3 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800/70 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {/* Update Event Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white dark:bg-[#16082E] rounded-3xl border border-purple-200 dark:border-purple-500/40 max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-purple-100 dark:border-purple-500/25">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-600 dark:text-amber-300">
                  Update Initiative
                </span>
                <h2
                  id="edit-modal-title"
                  className="font-serif-display text-2xl font-bold text-slate-900 dark:text-white"
                >
                  Update Event
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-lg border border-purple-200 dark:border-purple-500/35 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                    Event Date (Future Only)
                  </label>
                  <input
                    type="date"
                    required
                    min={getTomorrowDateString()}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white font-mono-tabular focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  required
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-100 dark:border-purple-500/25">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/35 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#16082E] rounded-3xl border border-purple-200 dark:border-purple-500/40 max-w-md w-full p-6 sm:p-7 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-slate-900 dark:text-white">
              Delete Event?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75">
              Are you sure you want to permanently remove{' '}
              <span className="font-semibold text-slate-900 dark:text-amber-300">
                &ldquo;{deletingEvent.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/35 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
