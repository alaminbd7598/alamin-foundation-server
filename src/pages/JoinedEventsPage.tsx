import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, BookmarkCheck, ArrowRight, Users, Sparkles } from 'lucide-react';
import { SocialEvent } from '../types/event';
import { apiFetchJoinedEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EventSkeletonGrid, formatEventDate } from '../components/EventCard';
import { sortJoinedEventsByDate } from '../utils/validation';

interface JoinedEventsPageProps {
  navigate: (to: string) => void;
}

export function JoinedEventsPage({ navigate }: JoinedEventsPageProps) {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [joinedEvents, setJoinedEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadJoined() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiFetchJoinedEvents(token);
        if (mounted) {
          setJoinedEvents(sortJoinedEventsByDate(data));
        }
      } catch (err) {
        if (mounted) {
          showToast(
            err instanceof Error ? err.message : 'Failed to load joined events.',
            'error'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadJoined();
    return () => {
      mounted = false;
    };
  }, [token, showToast]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-10 pb-6 border-b border-purple-200 dark:border-purple-500/25 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Volunteer Schedule
          </span>
          <h1 className="mt-1 font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            MY <span className="text-royal-gradient">JOINED EVENTS</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-purple-200/75 text-sm sm:text-base">
            All community drives joined by{' '}
            <span className="font-semibold text-fuchsia-600 dark:text-amber-300">
              {user?.email}
            </span>
            , sorted chronologically by event date.
          </p>
        </div>

        <span className="font-mono-tabular text-xs font-bold px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-amber-300 border border-purple-300 dark:border-purple-500/35 self-start sm:self-auto">
          {joinedEvents.length} Confirmed {joinedEvents.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {loading ? (
        <EventSkeletonGrid count={3} />
      ) : joinedEvents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-purple-300 dark:border-purple-500/35 bg-white/60 dark:bg-[#16082E]/50">
          <BookmarkCheck className="w-10 h-10 text-fuchsia-500 dark:text-amber-400 mx-auto mb-3" />
          <h2 className="font-serif-display text-2xl font-bold text-slate-900 dark:text-white">
            No Joined Events Yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 max-w-md mx-auto">
            You haven&apos;t joined any social development events yet. Explore upcoming initiatives in your area and get involved!
          </p>
          <button
            type="button"
            onClick={() => navigate('/upcoming-events')}
            className="mt-6 px-6 py-3 rounded-full btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Browse Upcoming Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents.map((event) => {
            const myRecord = event.participants.find(
              (p) => (p.email || p.userEmail).toLowerCase() === (user?.email || '').toLowerCase()
            );
            return (
              <div key={event.id} className="perspective-container h-full">
                <article className="card-3d-tilt h-full bg-white dark:bg-[#16082E]/95 rounded-2xl border border-purple-200 dark:border-purple-500/30 overflow-hidden flex flex-col justify-between shadow-md">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-purple-950">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120424]/90 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fuchsia-600/90 text-white border border-amber-300/40">
                        {event.category}
                      </span>
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-mono-tabular font-semibold bg-[#120424]/85 text-amber-300 flex items-center gap-1.5 border border-purple-400/25">
                        <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                        {formatEventDate(event.eventDate)}
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                        {event.title}
                      </h2>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-purple-200/75 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                      <p className="mt-2.5 text-xs text-slate-600 dark:text-purple-200/70 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/75 pb-3.5 mb-3.5 border-b border-purple-100 dark:border-purple-500/20">
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-400 shrink-0" />
                        <span>Organizer: {event.creatorName}</span>
                      </span>
                      {myRecord && (
                        <span className="text-[11px] font-mono-tabular font-semibold text-fuchsia-600 dark:text-amber-300">
                          Joined: {new Date(myRecord.joinedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
