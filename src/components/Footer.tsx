import React from 'react';
import { HeartHandshake, MapPin, Calendar, PlusCircle } from 'lucide-react';

interface FooterProps {
  navigate: (to: string) => void;
}

const BRAND_SUBTITLE_CHARS = 'SOCIAL DEVELOPMENT PLATFORM'.split('');

export function Footer({ navigate }: FooterProps) {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-[#120524] dark:bg-[#090214] text-purple-200/80 border-t border-purple-500/25 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Clean Brand Logo & Social Icons */}
          <div className="space-y-4">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="inline-flex items-center gap-3.5 focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl btn-luxury-primary flex items-center justify-center text-white shadow-md shrink-0">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div className="inline-flex flex-col">
                <span className="font-serif-display text-lg sm:text-xl font-extrabold tracking-wide text-white block leading-none uppercase whitespace-nowrap">
                  AL AMIN <span className="text-royal-gradient">FOUNDATION</span>
                </span>
                <span
                  aria-label="SOCIAL DEVELOPMENT PLATFORM"
                  className="w-full flex items-center justify-between text-[9.5px] sm:text-[10.5px] font-bold uppercase text-purple-300/85 mt-1 leading-none whitespace-nowrap"
                >
                  {BRAND_SUBTITLE_CHARS.map((char, idx) => (
                    <span key={idx}>{char === ' ' ? '\u00A0' : char}</span>
                  ))}
                </span>
              </div>
            </a>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              A community-focused social development events platform empowering citizens across Mirpur and Dhaka to organize, join, and track impactful neighborhood initiatives.
            </p>
            <p className="flex items-center gap-2 text-xs text-purple-200/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
              <span>Mirpur, Dhaka · Nationwide Community Network</span>
            </p>
            <div className="flex items-center gap-3 pt-1">
              {/* Updated X Logo (replacing old Twitter bird) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Alamin Foundation on X"
                className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-200 hover:text-white hover:border-fuchsia-400/60 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Alamin Foundation on Facebook"
                className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-200 hover:text-white hover:border-fuchsia-400/60 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Alamin Foundation on LinkedIn"
                className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-200 hover:text-white hover:border-fuchsia-400/60 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Explore Platform */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400 mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="inline-flex items-center gap-2 text-purple-200/80 hover:text-white transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                  Upcoming Events
                </a>
              </li>
              <li>
                <a
                  href="/create-event"
                  onClick={(e) => handleNav(e, '/create-event')}
                  className="inline-flex items-center gap-2 text-purple-200/80 hover:text-white transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-fuchsia-400" />
                  Create an Event
                </a>
              </li>
              <li>
                <a
                  href="/manage-events"
                  onClick={(e) => handleNav(e, '/manage-events')}
                  className="text-purple-200/80 hover:text-white transition-colors"
                >
                  Manage My Events
                </a>
              </li>
              <li>
                <a
                  href="/joined-events"
                  onClick={(e) => handleNav(e, '/joined-events')}
                  className="text-purple-200/80 hover:text-white transition-colors"
                >
                  My Joined Events
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Causes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400 mb-4">
              Active Causes
            </h3>
            <ul className="space-y-2.5 text-sm text-purple-200/75">
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="hover:text-white transition-colors"
                >
                  Winter Clothes &amp; Blanket Relief
                </a>
              </li>
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="hover:text-white transition-colors"
                >
                  Waterbody &amp; Civic Clean-Up Drives
                </a>
              </li>
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="hover:text-white transition-colors"
                >
                  Urban Tree Plantation Drives
                </a>
              </li>
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="hover:text-white transition-colors"
                >
                  Community Meal &amp; Nutrition Drives
                </a>
              </li>
              <li>
                <a
                  href="/upcoming-events"
                  onClick={(e) => handleNav(e, '/upcoming-events')}
                  className="hover:text-white transition-colors"
                >
                  Free Medical &amp; Eye Care Camps
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Community Spirit (No golden light icon/badge) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400 mb-4">
              Community Spirit
            </h3>
            <p className="text-sm text-purple-200/75 leading-relaxed mb-4">
              Every verified initiative builds stronger neighborhoods in Mirpur and across Dhaka. Mobilize volunteers, track real-time attendance, and create lasting impact.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/90 border border-purple-500/35 text-xs font-semibold text-purple-200">
              <span>100% Citizen &amp; Volunteer Powered</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/60">
          <p>© {new Date().getFullYear()} Alamin Foundation — Social Development Events Platform. All rights reserved.</p>
          <p className="text-purple-200/80 font-medium">Empowering Grassroots Action in Mirpur, Dhaka &amp; Across Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
