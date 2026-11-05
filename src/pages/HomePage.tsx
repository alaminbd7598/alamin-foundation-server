import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Sparkles,
  Users,
  ShieldCheck,
  HeartHandshake,
  Mail,
  MapPin,
  PlusCircle,
  Clock,
  Globe2,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';
import { SocialEvent } from '../types/event';
import { apiFetchEvents, apiSubscribeNewsletter } from '../services/api';
import { EventCard, EventSkeletonGrid } from '../components/EventCard';
import { GALLERY_ITEMS, COMMUNITY_IMAGES } from '../data/seedEvents';
import { useToast } from '../context/ToastContext';

interface HomePageProps {
  navigate: (to: string) => void;
}

const LIVE_HERO_ACTIVITIES = [
  {
    badge: 'WINTER RELIEF · MIRPUR 10',
    title: 'Winter Clothes & Blanket Distribution Drive',
    location: 'Mirpur 10, Dhaka',
    image: COMMUNITY_IMAGES.heroWinterDrive,
    volunteers: '48 Volunteers Active',
  },
  {
    badge: 'PLANTATION · UTTARA',
    title: '500+ Urban Sapling & Roadside Tree Plantation',
    location: 'Sector 7, Uttara, Dhaka',
    image: COMMUNITY_IMAGES.treePlantation,
    volunteers: '62 Volunteers Active',
  },
  {
    badge: 'CLEANUP · DHANMONDI',
    title: 'Dhanmondi Lake & Walkway Plastic Clean-Up',
    location: 'Dhanmondi Lake, Dhaka',
    image: COMMUNITY_IMAGES.lakeCleanup,
    volunteers: '39 Volunteers Active',
  },
  {
    badge: 'HEALTH CAMP · BANANI',
    title: 'Community Free Medical & Eye Screening Camp',
    location: 'Korail, Banani, Dhaka',
    image: COMMUNITY_IMAGES.medicalCamp,
    volunteers: '27 Volunteers Active',
  },
];

export function HomePage({ navigate }: HomePageProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [nowTime, setNowTime] = useState(() => new Date());
  const [activeSlide, setActiveSlide] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % LIVE_HERO_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadRecentUpcoming() {
      setLoading(true);
      try {
        const data = await apiFetchEvents({ limit: 6 });
        if (mounted) {
          setUpcomingEvents(data.slice(0, 6));
        }
      } catch {
        if (mounted) {
          showToast('Could not load upcoming events.', 'error');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRecentUpcoming();
    return () => {
      mounted = false;
    };
  }, [showToast]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address to subscribe.', 'error');
      return;
    }
    setSubmittingNewsletter(true);
    try {
      const msg = await apiSubscribeNewsletter(newsletterEmail.trim());
      showToast(msg, 'success');
      setNewsletterEmail('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Subscription failed.', 'error');
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  const formattedClock = nowTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = nowTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentActivity = LIVE_HERO_ACTIVITIES[activeSlide];

  return (
    <div className="space-y-24 lg:space-y-28 pb-16">
      {/* 1. HERO / BANNER SECTION — SPACIOUS, FRESH & RESPONSIVE ACROSS 14", 27" & MOBILE */}
      <section className="relative pt-6 sm:pt-8 lg:pt-9 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        {/* Framed Royal Purple & Gold Hero Container with Breathable Padding */}
        <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-[#F5EEFF] via-[#FAF7FF] to-[#FDF8F5] dark:from-[#210A42] dark:via-[#14062B] dark:to-[#0C031A] shadow-[0_24px_65px_-15px_rgba(88,28,135,0.5)] p-5 sm:p-9 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute inset-y-8 right-0 w-[2px] bg-gradient-to-b from-transparent via-amber-400/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ambient-grid-pattern opacity-70" />

          {/* Soft Ambient Glows Inside Box (Clean, Uncluttered Freshness) */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />

          {/* Top Live Clock, Date & Mirpur, Dhaka Location Bar */}
          <div className="relative z-10 flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-5 px-4 sm:px-5 py-2 rounded-2xl sm:rounded-full bg-white/90 dark:bg-[#190833]/90 border border-purple-200 dark:border-purple-500/35 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-purple-100 shadow-sm">
              <span className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                {formattedClock}
              </span>
              <span className="hidden sm:inline text-purple-300 dark:text-purple-700">|</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {formattedDate}
              </span>
              <span className="hidden sm:inline text-purple-300 dark:text-purple-700">|</span>
              <span className="inline-flex items-center gap-1 text-fuchsia-600 dark:text-fuchsia-300 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                Mirpur, Dhaka
              </span>
            </div>
          </div>

          {/* Main 2-Column Social Development Events Platform Banner */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 Columns: Platform Headline, Mission & Actions */}
            <div className="lg:col-span-7 text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-[#230E3F]/90 border border-amber-500/40 dark:border-amber-400/40 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>
                  <span className="text-amber-600 dark:text-amber-400">AL AMIN FOUNDATION</span> · SOCIAL DEVELOPMENT EVENTS PLATFORM
                </span>
              </div>

              <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] uppercase text-slate-900 dark:text-white">
                UNITE FOR MIRPUR.{' '}
                <span className="text-royal-gradient block mt-1.5">
                  LEAD SOCIAL CHANGE.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-purple-100/80 leading-relaxed max-w-xl">
                Create, discover, and join verified neighborhood social service initiatives across Mirpur and Dhaka. From winter clothes and blanket relief to tree plantations, lake cleanups, and free medical camps.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="/upcoming-events"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/upcoming-events');
                  }}
                  className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white btn-luxury-primary inline-flex items-center gap-2.5"
                >
                  <span>Explore Upcoming Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="/create-event"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/create-event');
                  }}
                  className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border border-purple-300 dark:border-purple-400/40 bg-white/90 dark:bg-[#1C0A38]/90 text-slate-900 dark:text-white hover:border-amber-400 dark:hover:border-amber-400/70 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-fuchsia-500 dark:text-amber-400" />
                  <span>Create an Event</span>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Clean Auto-Sliding Multi-Activity Showcase Card */}
            <div className="lg:col-span-5 perspective-container relative">
              <div className="card-3d-tilt relative rounded-2xl overflow-hidden border border-purple-300 dark:border-purple-500/40 bg-[#15072C] shadow-2xl">
                <img
                  key={currentActivity.image}
                  src={currentActivity.image}
                  alt={currentActivity.title}
                  className="w-full h-64 sm:h-72 object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100322] via-[#100322]/40 to-transparent" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fuchsia-600/95 text-white border border-amber-300/40 shadow-sm">
                    {currentActivity.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-tabular font-semibold bg-[#120424]/90 text-amber-300 border border-purple-400/30 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-fuchsia-400" />
                    {currentActivity.volunteers}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="font-serif-display text-lg sm:text-xl font-bold leading-snug text-white line-clamp-2">
                    {currentActivity.title}
                  </h2>
                  <div className="mt-2 flex items-center justify-between text-xs text-purple-200/90">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {currentActivity.location}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {LIVE_HERO_ACTIVITIES.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`View activity slide ${idx + 1}`}
                          onClick={() => setActiveSlide(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeSlide === idx
                              ? 'w-6 bg-amber-400'
                              : 'w-2 bg-purple-400/50 hover:bg-purple-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breathable Gap (mt-9 lg:mt-10) Before 4-Column Bottom Impact Row */}
          <div className="relative z-10 mt-9 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            <div className="h-full flex flex-col justify-between rounded-2xl bg-white/90 dark:bg-[#15072C]/90 border border-purple-200/80 dark:border-purple-500/30 p-5 text-left hover:border-fuchsia-400/60 transition-all shadow-md">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-600 dark:text-fuchsia-400 truncate">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">ACTIVE DRIVES</span>
                </div>
                <p className="mt-2 font-serif-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white whitespace-nowrap uppercase">
                  180+ DRIVES
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-purple-200/70 truncate">
                  Across 7 social categories
                </p>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-400" />
              </div>
            </div>

            <div className="h-full flex flex-col justify-between rounded-2xl bg-white/90 dark:bg-[#15072C]/90 border border-purple-200/80 dark:border-purple-500/30 p-5 text-left hover:border-fuchsia-400/60 transition-all shadow-md">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-600 dark:text-fuchsia-400 truncate">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">VOLUNTEERS</span>
                </div>
                <p className="mt-2 font-serif-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white whitespace-nowrap uppercase">
                  1,450+ JOINED
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-purple-200/70 truncate">
                  Youth &amp; local citizens
                </p>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400" />
              </div>
            </div>

            <div className="h-full flex flex-col justify-between rounded-2xl bg-white/90 dark:bg-[#15072C]/90 border border-purple-200/80 dark:border-purple-500/30 p-5 text-left hover:border-fuchsia-400/60 transition-all shadow-md">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-600 dark:text-fuchsia-400 truncate">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">LIVES IMPACTED</span>
                </div>
                <p className="mt-2 font-serif-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white whitespace-nowrap uppercase">
                  5,200+ HELPED
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-purple-200/70 truncate">
                  Families in Mirpur &amp; Dhaka
                </p>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500" />
              </div>
            </div>

            <div className="h-full flex flex-col justify-between rounded-2xl bg-white/90 dark:bg-[#15072C]/90 border border-purple-200/80 dark:border-purple-500/30 p-5 text-left hover:border-fuchsia-400/60 transition-all shadow-md">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-600 dark:text-fuchsia-400 truncate">
                  <Globe2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">COMMUNITY LED</span>
                </div>
                <p className="mt-2 font-serif-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white whitespace-nowrap uppercase">
                  100% VERIFIED
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-purple-200/70 truncate">
                  Direct citizen initiatives
                </p>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/35 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Features
          </span>
          <h2 className="mt-3 font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase">
            ENGINEERED FOR <span className="text-royal-gradient">COMMUNITY ACTION</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-purple-200/75 text-sm sm:text-base">
            A streamlined ecosystem connecting compassionate organizers with verified volunteers across Mirpur and every neighborhood in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-3d-tilt p-6 rounded-2xl bg-white dark:bg-[#16082E]/90 border border-purple-200/80 dark:border-purple-500/30 shadow-md relative overflow-hidden">
            <span className="absolute top-4 right-5 font-mono-tabular text-xs font-bold text-purple-400/50">
              01
            </span>
            <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white">
              Grassroots Campaign Launch
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 leading-relaxed">
              Launch winter relief, lake cleanups, or food drives in your locality within minutes with structured scheduling.
            </p>
          </div>

          <div className="card-3d-tilt p-6 rounded-2xl bg-white dark:bg-[#16082E]/90 border border-purple-200/80 dark:border-purple-500/30 shadow-md relative overflow-hidden">
            <span className="absolute top-4 right-5 font-mono-tabular text-xs font-bold text-purple-400/50">
              02
            </span>
            <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white">
              Instant Volunteer Roster
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 leading-relaxed">
              Join or leave upcoming community initiatives with one click and view real-time confirmed volunteer lists.
            </p>
          </div>

          <div className="card-3d-tilt p-6 rounded-2xl bg-white dark:bg-[#16082E]/90 border border-purple-200/80 dark:border-purple-500/30 shadow-md relative overflow-hidden">
            <span className="absolute top-4 right-5 font-mono-tabular text-xs font-bold text-purple-400/50">
              03
            </span>
            <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white">
              Protected Organizer Suite
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 leading-relaxed">
              Update schedules, refine descriptions, or manage your created events safely with JWT-verified creator ownership.
            </p>
          </div>

          <div className="card-3d-tilt p-6 rounded-2xl bg-white dark:bg-[#16082E]/90 border border-purple-200/80 dark:border-purple-500/30 shadow-md relative overflow-hidden">
            <span className="absolute top-4 right-5 font-mono-tabular text-xs font-bold text-purple-400/50">
              04
            </span>
            <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mb-5">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 dark:text-white">
              Future-Verified Discovery
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-purple-200/75 leading-relaxed">
              Automated chronological filtering ensures expired drives are hidden so volunteers always see active upcoming causes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (.limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Active Schedule
            </span>
            <h2 className="mt-1.5 font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase">
              RECENT <span className="text-royal-gradient">UPCOMING EVENTS</span>
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-purple-200/75">
              Explore the next 6 scheduled volunteer drives open for citizen participation.
            </p>
          </div>
          <a
            href="/upcoming-events"
            onClick={(e) => {
              e.preventDefault();
              navigate('/upcoming-events');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-300 dark:border-purple-500/35 bg-white dark:bg-[#180833] text-purple-900 dark:text-amber-300 hover:border-fuchsia-400 transition-all self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <EventSkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id || event._id} event={event} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* 4. GALLERY SECTION (6 Visual Impact Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/35 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Field Chronicles
          </span>
          <h2 className="mt-3 font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase">
            HUMANITARIAN <span className="text-royal-gradient">ACTION GALLERY</span>
          </h2>
          <p className="mt-2 text-slate-600 dark:text-purple-200/75 text-sm sm:text-base">
            Documented moments from our recent winter blanket distributions, tree plantations, and lakeside cleanups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative h-72 rounded-2xl overflow-hidden border border-purple-300/70 dark:border-purple-500/35 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120424]/95 via-[#120424]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fuchsia-600/80 text-white border border-amber-300/40 mb-2">
                  {item.impact}
                </span>
                <h3 className="font-serif-display text-lg font-bold leading-snug text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-purple-200/85 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#230A44] via-[#16062C] to-[#0D041A] border border-purple-500/40 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-amber-400/35 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              Humanitarian Dispatch
            </span>
            <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl font-extrabold tracking-tight uppercase">
              SUBSCRIBE TO <span className="text-royal-gradient">CAUSE &amp; RELIEF ALERTS</span>
            </h2>
            <p className="mt-3 text-purple-200/80 text-sm sm:text-base leading-relaxed">
              Receive weekly updates when emergency winter blanket drives, medical camps, or neighborhood cleanups are scheduled in Mirpur and across Dhaka.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-purple-300/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#120424]/90 border border-purple-400/35 text-white placeholder:text-purple-300/50 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submittingNewsletter}
                className="px-7 py-3.5 rounded-xl btn-luxury-primary text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60 shrink-0"
              >
                {submittingNewsletter ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <p className="mt-4 text-xs text-purple-300/60">
              Zero spam policy. Only verified community service dispatches from Alamin Foundation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
