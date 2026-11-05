import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { SocialEvent } from '../types/event';
import { apiFetchEventById, apiJoinEvent, apiLeaveEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatEventDate } from '../components/EventCard';

interface EventDetailsPageProps {
  eventId: string;
  navigate: (to: string) => void;
}

export function EventDetailsPage({ eventId, navigate }: EventDetailsPageProps) {
  const [event, setEvent] = useState<SocialEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function loadEvent() {
      setLoading(true);
      try {
        const data = await apiFetchEventById(eventId);
        if (mounted) setEvent(data);
      } catch {
        if (mounted) {
          showToast('Event not found.', 'error');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadEvent();
    return () => {
      mounted = false;
    };
  }, [eventId, showToast]);

  const hasJoined = Boolean(
    user &&
      event?.participants?.some(
        (p) => (p.email || p.userEmail).toLowerCase() === user.email.toLowerCase()
      )
  );

  const handleToggleJoin = async () => {
    if (!user || !token) {
      showToast('Please log in to join this community initiative.', 'info');
      navigate(`/login?redirect=/events/${eventId}`);
      return;
    }

    setJoining(true);
    try {
      if (hasJoined) {
        const updated = await apiLeaveEvent(token, eventId);
        setEvent(updated);
        showToast('You have left this event.', 'info');
      } else {
        const updated = await apiJoinEvent(token, eventId);
        setEvent(updated);
        showToast(`Successfully joined "${updated.title}"!`, 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update participation.', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    } catch {
      showToast('Ready to share this event link.', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-purple-200 dark:bg-purple-900/50 rounded w-48" />
        <div className="h-96 bg-purple-200 dark:bg-purple-900/40 rounded-3xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif-display text-3xl font-bold text-slate-900 dark:text-white">
          Initiative Not Found
        </h1>
        <p className="mt-2 text-slate-600 dark:text-purple-200/75">
          The requested community event may have been removed or rescheduled.
        </p>
        <button
          type="button"
          onClick={() => navigate('/upcoming-events')}
          className="mt-6 px-6 py-2.5 rounded-full btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          Back to Upcoming Events
        </button>
      </div>
    );
  }

  const organizerInitial = (event.creatorName || 'A').charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Back Link */}
      <button
        type="button"
        onClick={() => navigate('/upcoming-events')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-200 hover:text-fuchsia-600 dark:hover:text-amber-300 mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upcoming Events
      </button>

      {/* Main Royal Framed Event Showcase */}
      <div className="rounded-3xl bg-white dark:bg-[#16082E]/95 border border-purple-200 dark:border-purple-500/35 overflow-hidden shadow-2xl">
        {/* Hero Image Banner */}
        <div className="relative h-72 sm:h-96 bg-purple-950 overflow-hidden">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#110422] via-[#110422]/55 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fuchsia-600/90 text-white border border-amber-300/40 shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {event.category}
            </span>
            <h1 className="font-serif-display text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-purple-100/95">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                {formatEventDate(event.eventDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-fuchsia-400" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Participation & Action Bar */}
        <div className="px-6 sm:px-8 py-5 border-b border-purple-100 dark:border-purple-500/25 bg-purple-50/50 dark:bg-[#1D0B3B]/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-500/35 flex items-center justify-center text-fuchsia-600 dark:text-amber-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-display text-base font-extrabold text-slate-900 dark:text-white">
                {event.participantCount} Volunteers Joined
              </p>
              <p className="text-xs text-slate-500 dark:text-purple-300/75">
                Open for verified community registration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share event"
              className="p-3 rounded-xl border border-purple-200 dark:border-purple-500/35 bg-white dark:bg-[#14062B] text-slate-700 dark:text-purple-200 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleJoin}
              disabled={joining}
              className={`px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                hasJoined
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'btn-luxury-primary text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {joining
                  ? 'Processing...'
                  : hasJoined
                  ? 'Joined (Click to Leave)'
                  : 'Join Event'}
              </span>
            </button>
          </div>
        </div>

        {/* Two-Column Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-slate-900 dark:text-white mb-3">
                Initiative Overview &amp; Mission
              </h2>
              <p className="text-slate-600 dark:text-purple-100/80 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Volunteer Guidelines Box */}
            <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-[#1E0B3D]/70 border border-purple-200 dark:border-purple-500/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-amber-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
                Volunteer Field Protocol
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-purple-200/80">
                <li>• Arrive 15 minutes ahead at {event.location} for team briefing and badge check-in.</li>
                <li>• Reusable water bottles, gloves, and safety gear are provided by Alamin Foundation.</li>
                <li>• Coordinate directly with the lead organizer for relief kit distribution assignments.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Organizer & Confirmed Volunteers */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-[#1B0938] border border-purple-200 dark:border-purple-500/30">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-600 dark:text-amber-400 mb-3">
                Initiative Organizer
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full btn-luxury-primary text-white font-bold flex items-center justify-center text-base shrink-0">
                  {organizerInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {event.creatorName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-purple-300/75 truncate">
                    {event.creatorEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-[#1B0938] border border-purple-200 dark:border-purple-500/30">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-400" />
                Confirmed Volunteers ({event.participants.length})
              </p>
              {event.participants.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-purple-300/60">
                  Be the first volunteer to join this community initiative!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {event.participants.map((p, idx) => (
                    <div key={`${p.email}-${idx}`} className="flex items-center gap-2.5">
                      <img
                        src={p.photoURL}
                        alt={p.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                        }}
                        className="w-7 h-7 rounded-full object-cover border border-purple-400/40"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-purple-100 truncate">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
