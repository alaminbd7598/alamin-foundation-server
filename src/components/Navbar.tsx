import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  LogOut,
  PlusCircle,
  FolderKanban,
  BookmarkCheck,
  Sun,
  Moon,
  Menu,
  X,
  HeartHandshake,
  LogIn,
  Settings,
  User as UserIcon,
  Image as ImageIcon,
  Mail,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

interface NavbarProps {
  currentPath: string;
  navigate: (to: string) => void;
}

const BRAND_SUBTITLE_CHARS = 'SOCIAL DEVELOPMENT PLATFORM'.split('');

export function Navbar({ currentPath, navigate }: NavbarProps) {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const openSettingsModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (user) {
      setEditName(user.name);
      setEditPhotoURL(user.photoURL);
    }
    setSettingsOpen(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || editName.trim().length < 2) {
      showToast('Display name must be at least 2 characters.', 'error');
      return;
    }
    if (!editPhotoURL.trim()) {
      showToast('Please provide a valid profile photo URL.', 'error');
      return;
    }
    setSavingSettings(true);
    try {
      await updateProfile({
        name: editName.trim(),
        photoURL: editPhotoURL.trim(),
      });
      showToast('Profile settings updated successfully!', 'success');
      setSettingsOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    showToast('Logged out successfully. See you at the next community event!', 'info');
    navigate('/');
  };

  const isUpcomingActive = currentPath === '/upcoming-events' || currentPath === '/events';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-purple-200/70 dark:border-purple-500/20 bg-[#FAF7FF]/90 dark:bg-[#0D041A]/90 backdrop-blur-xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo (Rounded-xl shape + HeartHandshake icon + Flush Full-Width Subtitle) */}
          <a
            href="/"
            onClick={(e) => handleNav(e, '/')}
            className="inline-flex items-center gap-2 sm:gap-3.5 group focus:outline-none min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl btn-luxury-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="inline-flex flex-col min-w-0">
              <span className="font-serif-display text-xs sm:text-xl font-extrabold tracking-normal sm:tracking-wide text-slate-900 dark:text-white block leading-none uppercase whitespace-nowrap">
                AL AMIN <span className="text-royal-gradient">FOUNDATION</span>
              </span>
              <span
                aria-label="SOCIAL DEVELOPMENT PLATFORM"
                className="w-full flex items-center justify-between text-[7.5px] sm:text-[10.5px] font-bold uppercase text-purple-700 dark:text-purple-300/90 mt-1 leading-none whitespace-nowrap"
              >
                {BRAND_SUBTITLE_CHARS.map((char, idx) => (
                  <span key={idx}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </span>
            </div>
          </a>

          {/* Center Navigation: Upcoming Events */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            <a
              href="/upcoming-events"
              onClick={(e) => handleNav(e, '/upcoming-events')}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-all flex items-center gap-2 ${
                isUpcomingActive
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-fuchsia-300 border border-purple-300 dark:border-purple-500/40 shadow-sm'
                  : 'text-slate-700 dark:text-purple-200/90 hover:text-purple-900 dark:hover:text-white hover:bg-purple-100/60 dark:hover:bg-purple-900/30'
              }`}
            >
              <Calendar className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
              Upcoming Events
            </a>
          </nav>

          {/* Right: Circular Theme Toggle + Conditional Auth Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Original Circular Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-purple-200 dark:border-purple-500/30 bg-white/80 dark:bg-[#170930]/90 flex items-center justify-center text-purple-700 dark:text-purple-200 hover:border-fuchsia-400 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {!user ? (
              <a
                href="/login"
                onClick={(e) => handleNav(e, '/login')}
                className="px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary flex items-center gap-1 sm:gap-2"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Login</span>
              </a>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Profile Picture Dropdown with Hover Display Name Tooltip */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    title={user.name}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className="group relative flex items-center rounded-full p-0.5 border-2 border-fuchsia-500/70 hover:border-fuchsia-400 transition-all focus:outline-none cursor-pointer shadow-md"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                      }}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    {/* Hover Tooltip showing user's displayName */}
                    <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1A0933] px-2.5 py-1 text-[11px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 border border-purple-500/30">
                      {user.name}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-[#16082E] border border-purple-200 dark:border-purple-500/35 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-purple-100 dark:border-purple-500/20">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-purple-300/70 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1.5">
                        <a
                          href="/create-event"
                          onClick={(e) => handleNav(e, '/create-event')}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
                          Create Event
                        </a>
                        <a
                          href="/manage-events"
                          onClick={(e) => handleNav(e, '/manage-events')}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors"
                        >
                          <FolderKanban className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
                          Manage Events
                        </a>
                        <a
                          href="/joined-events"
                          onClick={(e) => handleNav(e, '/joined-events')}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors"
                        >
                          <BookmarkCheck className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
                          Joined Events
                        </a>
                        <button
                          type="button"
                          onClick={openSettingsModal}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />
                          Settings
                        </button>
                      </div>

                      <div className="border-t border-purple-100 dark:border-purple-500/20 pt-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Button next to Profile Avatar as required */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-500/30 bg-white/80 dark:bg-[#1A0936] text-slate-700 dark:text-purple-200 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-slate-700 dark:text-purple-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-200 dark:border-purple-500/25 bg-white dark:bg-[#130626] px-4 py-4 space-y-2">
            <a
              href="/upcoming-events"
              onClick={(e) => handleNav(e, '/upcoming-events')}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-900/40"
            >
              <Calendar className="w-4 h-4 text-fuchsia-500" />
              Upcoming Events
            </a>

            {user ? (
              <>
                <a
                  href="/create-event"
                  onClick={(e) => handleNav(e, '/create-event')}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40"
                >
                  <PlusCircle className="w-4 h-4 text-fuchsia-500" />
                  Create Event
                </a>
                <a
                  href="/manage-events"
                  onClick={(e) => handleNav(e, '/manage-events')}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40"
                >
                  <FolderKanban className="w-4 h-4 text-fuchsia-500" />
                  Manage Events
                </a>
                <a
                  href="/joined-events"
                  onClick={(e) => handleNav(e, '/joined-events')}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40"
                >
                  <BookmarkCheck className="w-4 h-4 text-fuchsia-500" />
                  Joined Events
                </a>
                <button
                  type="button"
                  onClick={openSettingsModal}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40"
                >
                  <Settings className="w-4 h-4 text-fuchsia-500" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2">
                <a
                  href="/login"
                  onClick={(e) => handleNav(e, '/login')}
                  className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-white btn-luxury-primary flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </a>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Profile & Account Settings Modal */}
      {settingsOpen && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-settings-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#16082E] border border-purple-200 dark:border-purple-500/40 p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-500/25">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl btn-luxury-primary flex items-center justify-center text-white shadow-md">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="profile-settings-title"
                    className="font-serif-display text-lg font-extrabold text-slate-900 dark:text-white uppercase"
                  >
                    PROFILE <span className="text-royal-gradient">SETTINGS</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-purple-300/75">
                    Update your account details &amp; preferences
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close Settings"
                className="w-8 h-8 rounded-lg border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-slate-500 dark:text-purple-200 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
              {/* Avatar Preview */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-purple-50/70 dark:bg-[#0E041D] border border-purple-200/70 dark:border-purple-500/25">
                <img
                  src={editPhotoURL || user.photoURL}
                  alt={editName || user.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                  }}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-fuchsia-500/60 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {editName || user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-purple-300/70 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-fuchsia-400 shrink-0" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="settings-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
                >
                  Display Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="settings-name"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="settings-photo"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
                >
                  Profile Photo URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="settings-photo"
                    type="url"
                    required
                    value={editPhotoURL}
                    onChange={(e) => setEditPhotoURL(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              {/* Theme Appearance Toggle Inside Settings */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/30">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-fuchsia-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200">
                    Appearance ({theme === 'dark' ? 'Dark Mode' : 'Light Mode'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-200/70 dark:bg-purple-900/60 text-purple-900 dark:text-purple-100 hover:bg-purple-300/70 dark:hover:bg-purple-800/70 transition-colors cursor-pointer"
                >
                  Switch Theme
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-500/30 text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
