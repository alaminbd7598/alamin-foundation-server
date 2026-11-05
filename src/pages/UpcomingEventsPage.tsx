import React, { useEffect, useState } from 'react';
import { Search, X, Calendar, PlusCircle, Sparkles, MapPin } from 'lucide-react';
import { EVENT_CATEGORIES, EventCategory, SocialEvent } from '../types/event';
import { apiFetchEvents } from '../services/api';
import { EventCard, EventSkeletonGrid } from '../components/EventCard';
import { useToast } from '../context/ToastContext';

interface UpcomingEventsPageProps {
  navigate: (to: string) => void;
}

const LOCATION_PRESETS = ['All Areas', 'Mirpur', 'Mohammadpur', 'Dhanmondi', 'Uttara', 'Banani', 'Old Dhaka'];

export function UpcomingEventsPage({ navigate }: UpcomingEventsPageProps) {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      const combinedQuery =
        selectedArea !== 'All Areas' && !searchInput.toLowerCase().includes(selectedArea.toLowerCase())
          ? `${searchInput} ${selectedArea}`.trim()
          : searchInput.trim();
      setDebouncedSearch(combinedQuery);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchInput, selectedArea]);

  useEffect(() => {
    let mounted = true;
    async function loadEvents() {
      setLoading(true);
      try {
        const result = await apiFetchEvents({
          search: debouncedSearch,
          category: selectedCategory,
        });
        if (mounted) {
          setEvents(result);
        }
      } catch {
        if (mounted) {
          showToast('Failed to fetch upcoming events.', 'error');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadEvents();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedCategory, showToast]);

  const clearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setSelectedArea('All Areas');
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) || selectedCategory !== 'All' || selectedArea !== 'All Areas';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Framed Royal Page Header */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-300 dark:border-purple-500/35 bg-gradient-to-br from-[#F6F0FF] via-white to-[#FDF8F5] dark:from-[#200940] dark:via-[#14062A] dark:to-[#0C031A] p-6 sm:p-10 mb-8 shadow-xl">
        <div className="pointer-events-none absolute inset-0 ambient-grid-pattern opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/90 border border-amber-400/40 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
              Verified Future Schedule
            </div>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              UPCOMING <span className="text-royal-gradient">SOCIAL EVENTS</span>
            </h1>
            <p className="mt-2.5 text-slate-600 dark:text-purple-200/80 max-w-2xl text-sm sm:text-base">
              Browse active humanitarian and environmental initiatives across Bangladesh. Past dates are automatically filtered out.
            </p>
          </div>

          <a
            href="/create-event"
            onClick={(e) => {
              e.preventDefault();
              navigate('/create-event');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </a>
        </div>
      </div>

      {/* Royal Search & Multi-Filter Console */}
      <div className="bg-white dark:bg-[#16082E]/95 rounded-2xl border border-purple-200 dark:border-purple-500/35 p-5 mb-8 shadow-lg space-y-4">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Filter events by category"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'btn-luxury-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-purple-200/80 hover:bg-purple-50 dark:hover:bg-purple-900/40'
              }`}
            >
              All
            </button>
            {EVENT_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'btn-luxury-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-purple-200/80 hover:bg-purple-50 dark:hover:bg-purple-900/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search events or areas..."
              aria-label="Search events or areas"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-purple-50/60 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/50 focus:outline-none focus:border-fuchsia-500 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location Quick Filter Bar */}
        <div className="pt-3 border-t border-purple-100 dark:border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-amber-400 mr-1">
              <MapPin className="w-3.5 h-3.5" />
              Area Filter:
            </span>
            {LOCATION_PRESETS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedArea === area
                    ? 'bg-purple-900 text-amber-300 border border-amber-400/50'
                    : 'bg-purple-50 dark:bg-[#1E0B3B] text-slate-600 dark:text-purple-200/75 hover:text-fuchsia-500 dark:hover:text-amber-300'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono-tabular font-semibold text-purple-700 dark:text-purple-300/80">
            Showing {events.length} active {events.length === 1 ? 'initiative' : 'initiatives'}
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <EventSkeletonGrid count={6} />
      ) : events.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-purple-300 dark:border-purple-500/35 bg-white/60 dark:bg-[#16082E]/50">
          <Calendar className="w-10 h-10 text-fuchsia-500 dark:text-amber-400 mx-auto mb-3" />
          <h2 className="font-serif-display text-2xl font-bold text-slate-900 dark:text-white">
            No Matching Initiatives Found
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 max-w-md mx-auto">
            No upcoming drives matched your search or category filter. Reset your filters to view all active initiatives.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 px-6 py-2.5 rounded-full btn-luxury-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}
