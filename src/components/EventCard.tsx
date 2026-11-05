import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { SocialEvent } from '../types/event';

interface EventCardProps {
  event: SocialEvent;
  navigate: (to: string) => void;
}

const CATEGORY_STYLES: Record<string, string> = {
  Donation: 'bg-fuchsia-950/85 text-fuchsia-300 border-fuchsia-400/40',
  Cleanup: 'bg-purple-950/85 text-purple-200 border-purple-400/40',
  Plantation: 'bg-emerald-950/85 text-emerald-300 border-emerald-400/40',
  'Winter Relief': 'bg-amber-950/85 text-amber-300 border-amber-400/40',
  'Food Drive': 'bg-rose-950/85 text-rose-300 border-rose-400/40',
  'Health Camp': 'bg-indigo-950/85 text-indigo-300 border-indigo-400/40',
  Education: 'bg-violet-950/85 text-violet-200 border-violet-400/40',
};

export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function EventCard({ event, navigate }: EventCardProps) {
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/events/${event.id}`);
  };

  const eventId = event.id || event._id;
  const eventCategory = event.category || event.eventType;
  const eventThumbnail = event.thumbnail || event.thumbnailUrl;
  const badgeStyle =
    CATEGORY_STYLES[eventCategory] ||
    'bg-purple-950/85 text-amber-300 border-purple-400/40';

  return (
    <div className="perspective-container h-full">
      <article className="card-3d-tilt group h-full bg-white dark:bg-[#16082E]/90 rounded-2xl border border-purple-200/80 dark:border-purple-500/30 overflow-hidden flex flex-col justify-between shadow-md">
        <div>
          {/* Top Metadata Ribbon */}
          <div className="px-4 py-2.5 bg-purple-50/80 dark:bg-[#1E0B3D]/90 border-b border-purple-100 dark:border-purple-500/20 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeStyle}`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              {event.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular font-semibold text-purple-800 dark:text-amber-300">
              <Calendar className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-400" />
              {formatEventDate(event.eventDate)}
            </span>
          </div>

          {/* Thumbnail Container */}
          <div className="relative h-52 overflow-hidden bg-purple-950">
            <img
              src={event.thumbnail}
              alt={event.title}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120524] via-transparent to-transparent opacity-85" />

            {/* Location Pill inside Image Footer */}
            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#120524]/85 text-purple-100 backdrop-blur-md border border-purple-400/25 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 pb-3">
            <h3 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
              <a href={`/events/${event.id}`} onClick={handleViewDetails}>
                {event.title}
              </a>
            </h3>

            <p className="mt-2 text-xs text-slate-600 dark:text-purple-200/75 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/75 pb-3.5 mb-3.5 border-b border-purple-100 dark:border-purple-500/20">
            <span className="inline-flex items-center gap-1.5 truncate max-w-[62%]">
              <Users className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-400 shrink-0" />
              <span className="truncate font-medium">{event.creatorName}</span>
            </span>
            <span className="font-mono-tabular font-bold text-purple-700 dark:text-amber-300">
              {event.participantCount} joined
            </span>
          </div>

          <a
            href={`/events/${event.id}`}
            onClick={handleViewDetails}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary flex items-center justify-center gap-2"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </article>
    </div>
  );
}

export function EventSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-purple-200 dark:border-purple-500/25 bg-white dark:bg-[#16082E] overflow-hidden animate-pulse"
        >
          <div className="h-10 bg-purple-100 dark:bg-purple-950/60" />
          <div className="h-52 bg-purple-200/60 dark:bg-purple-900/40" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-purple-200 dark:bg-purple-900/50 rounded w-3/4" />
            <div className="h-3 bg-purple-100 dark:bg-purple-900/40 rounded w-full" />
            <div className="h-3 bg-purple-100 dark:bg-purple-900/40 rounded w-4/5" />
            <div className="pt-4">
              <div className="h-10 bg-purple-200 dark:bg-purple-900/60 rounded-xl w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
