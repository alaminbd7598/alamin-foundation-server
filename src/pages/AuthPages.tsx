import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Image as ImageIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validatePassword } from '../utils/validation';

interface AuthPageProps {
  navigate: (to: string) => void;
  redirectTo?: string;
}

export function LoginPage({ navigate, redirectTo = '/upcoming-events' }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome back! You are now logged in.', 'success');
      navigate(redirectTo);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Invalid login credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await googleLogin({
        name: 'Tanvir Ahmed',
        email: 'tanvir.volunteer@alaminfoundation.org',
        photoURL:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      });
      showToast('Signed in with Google successfully!', 'success');
      navigate(redirectTo);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Google sign-in failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md bg-white dark:bg-[#16082E]/95 rounded-3xl border border-purple-200 dark:border-purple-500/40 p-8 shadow-2xl relative z-10">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="font-serif-display text-3xl font-extrabold text-slate-900 dark:text-white uppercase">
            WELCOME <span className="text-royal-gradient">BACK</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-purple-200/75">
            Sign in to organize or join verified social development events
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-purple-200 dark:bg-purple-500/25" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/60">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-purple-200 dark:bg-purple-500/25" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl border border-purple-200 dark:border-purple-500/35 bg-purple-50/40 dark:bg-[#0E041D] hover:bg-purple-100/50 dark:hover:bg-purple-950/60 text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.6 6.4C.6 8.4 0 10.6 0 12s.6 3.6 1.6 5.6l3.7-2.8z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16c1.9 3.9 5.8 7 10.4 7z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-purple-200/75">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/register?redirect=${encodeURIComponent(redirectTo)}`);
            }}
            className="font-bold text-fuchsia-600 dark:text-amber-300 hover:underline"
          >
            Create an Account
          </a>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage({ navigate, redirectTo = '/upcoming-events' }: AuthPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();

  const pwCheck = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide your full name and email address.', 'error');
      return;
    }

    if (!pwCheck.valid) {
      showToast(pwCheck.errors[0], 'error');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        photoURL:
          photoURL.trim() ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        password,
      });
      showToast('Account created successfully! Welcome to Alamin Foundation.', 'success');
      navigate(redirectTo);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await googleLogin({
        name: 'Tanvir Ahmed',
        email: 'tanvir.volunteer@alaminfoundation.org',
        photoURL:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      });
      showToast('Signed in with Google successfully!', 'success');
      navigate(redirectTo);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Google sign-in failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md bg-white dark:bg-[#16082E]/95 rounded-3xl border border-purple-200 dark:border-purple-500/40 p-8 shadow-2xl relative z-10">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl btn-luxury-primary flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="font-serif-display text-3xl font-extrabold text-slate-900 dark:text-white uppercase">
            CREATE <span className="text-royal-gradient">ACCOUNT</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-purple-200/75">
            Join the community and start driving social change
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-photo"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Profile Photo URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-photo"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-purple-300/60">
              Optional. Leave empty for default avatar.
            </p>
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-fuchsia-500 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-purple-50/50 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/35 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/45 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Validation Checklist */}
            <div className="mt-3 p-3.5 rounded-xl bg-purple-50/60 dark:bg-[#0E041D] border border-purple-200 dark:border-purple-500/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {pwCheck.hasUppercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span
                  className={
                    pwCheck.hasUppercase
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-500 dark:text-purple-300/70'
                  }
                >
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {pwCheck.hasLowercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span
                  className={
                    pwCheck.hasLowercase
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-500 dark:text-purple-300/70'
                  }
                >
                  At least one lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {pwCheck.hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span
                  className={
                    pwCheck.hasMinLength
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-500 dark:text-purple-300/70'
                  }
                >
                  Minimum 6 characters length
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white btn-luxury-primary cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-purple-200 dark:bg-purple-500/25" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/60">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-purple-200 dark:bg-purple-500/25" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl border border-purple-200 dark:border-purple-500/35 bg-purple-50/40 dark:bg-[#0E041D] hover:bg-purple-100/50 dark:hover:bg-purple-950/60 text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.6 6.4C.6 8.4 0 10.6 0 12s.6 3.6 1.6 5.6l3.7-2.8z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16c1.9 3.9 5.8 7 10.4 7z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-purple-200/75">
          Already have an account?{' '}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
            }}
            className="font-bold text-fuchsia-600 dark:text-amber-300 hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
