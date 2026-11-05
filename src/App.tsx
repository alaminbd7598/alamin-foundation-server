import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { UpcomingEventsPage } from './pages/UpcomingEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { CreateEventPage } from './pages/CreateEventPage';
import { JoinedEventsPage } from './pages/JoinedEventsPage';
import { ManageEventsPage } from './pages/ManageEventsPage';
import { EventSkeletonGrid } from './components/EventCard';
import { AmbientActivityBackground } from './components/AmbientActivityBackground';

function ProtectedRoute({
  children,
  currentPath,
  navigate,
}: {
  children: React.ReactNode;
  currentPath: string;
  navigate: (to: string) => void;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [loading, user, currentPath, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventSkeletonGrid count={3} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

function RouterView() {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
  }));

  useEffect(() => {
    const onPopState = () => {
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setLocationState({
      pathname: url.pathname,
      search: url.search,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { pathname, search } = locationState;
  const searchParams = new URLSearchParams(search);
  const redirectParam = searchParams.get('redirect') || '/upcoming-events';

  let pageContent: React.ReactNode;

  if (pathname === '/' || pathname === '') {
    pageContent = <HomePage navigate={navigate} />;
  } else if (pathname === '/upcoming-events' || pathname === '/events') {
    pageContent = <UpcomingEventsPage navigate={navigate} />;
  } else if (pathname === '/create-event' || pathname === '/events/create') {
    pageContent = (
      <ProtectedRoute currentPath={pathname} navigate={navigate}>
        <CreateEventPage navigate={navigate} />
      </ProtectedRoute>
    );
  } else if (pathname === '/joined-events' || pathname === '/events/joined') {
    pageContent = (
      <ProtectedRoute currentPath={pathname} navigate={navigate}>
        <JoinedEventsPage navigate={navigate} />
      </ProtectedRoute>
    );
  } else if (pathname === '/manage-events' || pathname === '/events/manage') {
    pageContent = (
      <ProtectedRoute currentPath={pathname} navigate={navigate}>
        <ManageEventsPage navigate={navigate} />
      </ProtectedRoute>
    );
  } else if (pathname.startsWith('/events/')) {
    const eventId = pathname.replace('/events/', '').split('/')[0];
    pageContent = <EventDetailsPage eventId={eventId} navigate={navigate} />;
  } else if (pathname === '/login') {
    pageContent = <LoginPage navigate={navigate} redirectTo={redirectParam} />;
  } else if (pathname === '/register') {
    pageContent = <RegisterPage navigate={navigate} redirectTo={redirectParam} />;
  } else {
    pageContent = <HomePage navigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FF] dark:bg-[#0D041A] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      <AmbientActivityBackground />
      <Navbar currentPath={pathname} navigate={navigate} />
      <main className="flex-1 relative z-10">{pageContent}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterView />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
