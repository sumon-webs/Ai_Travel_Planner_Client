'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, getOAuthCallbackURL } from '@/lib/auth-client';
import { Card, Button, Input } from '@heroui/react';
import { Zap } from 'lucide-react';

const DEMO_EMAIL = 'demo@aitravel.com';
const DEMO_PASSWORD = 'Demo@123456';

// ── Inner form — uses useSearchParams, must be inside <Suspense> ──
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const doEmailSignIn = async (e: string, p: string) => {
    const { error: authError } = await signIn.email({
      email: e,
      password: p,
      callbackURL: redirectTo,
    });
    return authError?.message ?? null;
  };

  const handleEmailLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setLoading(true);
    const err = await doEmailSignIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    const err = await doEmailSignIn(DEMO_EMAIL, DEMO_PASSWORD);
    setDemoLoading(false);
    if (err) {
      setError('Demo account not found. Please create it first via Register.');
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn.social({
      provider: 'google',
      callbackURL: getOAuthCallbackURL(redirectTo),
    });
    setGoogleLoading(false);
  };

  const anyLoading = loading || googleLoading || demoLoading;

  return (
    <Card className="relative z-10 w-full max-w-[420px] sm:max-w-[420px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-[1.25rem] px-6 sm:px-8 py-8 sm:py-10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] animate-[slideUp_0.4s_ease-out_both]">
      {/* Logo / Heading */}
      <div className="text-center mb-7">
        <div className="text-4xl mb-3 animate-[pulse-icon_2s_ease-in-out_infinite]">✈️</div>
        <h1 className="text-[26px] font-bold text-white leading-none tracking-tight mb-1.5">Welcome back</h1>
        <p className="text-[14px] text-white/50 m-0">Sign in to AI Travel Planner</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-lg p-3 text-[14px] mb-5 animate-[shake_0.3s_ease-out]" role="alert">
          {error}
        </div>
      )}

      {/* Demo Login Button */}
      <Button
        id="demo-login-btn"
        type="button"
        onPress={handleDemoLogin}
        isDisabled={anyLoading}
        className="w-full h-11 flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-[15px] rounded-xl shadow-[0_2px_12px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(245,158,11,0.45)] transition-all cursor-pointer mb-3"
      >
        {demoLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
        ) : (
          <Zap className="w-4 h-4 shrink-0" />
        )}
        {demoLoading ? 'Signing in…' : '⚡ Demo Login'}
      </Button>

      {/* Google Sign-In */}
      <Button
        id="google-signin-btn"
        type="button"
        onPress={handleGoogleLogin}
        isDisabled={anyLoading}
        className="w-full h-11 flex items-center justify-center gap-2.5 bg-white/90 hover:bg-white text-gray-800 font-semibold text-[15px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-gray-400/40 border-t-gray-700 rounded-full animate-spin shrink-0" aria-hidden="true" />
        ) : (
          <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5 text-[13px] text-white/50">
        <div className="flex-1 h-[1px] bg-white/[0.12]" />
        <span>or sign in with email</span>
        <div className="flex-1 h-[1px] bg-white/[0.12]" />
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-[14px] font-medium text-white/90">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 px-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-[0.625rem] text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-[14px] font-medium text-white/90">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 px-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-[0.625rem] text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
          />
        </div>

        <Button
          id="login-submit-btn"
          type="submit"
          isDisabled={anyLoading}
          className="w-full h-12 mt-1.5 flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold text-[15px] text-white rounded-xl shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
          )}
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-center">
        <p className="text-[12px] text-amber-300/80">
          <span className="font-semibold">Demo:</span> demo@aitravel.com · Demo@123456
        </p>
      </div>

      {/* Footer Link */}
      <p className="text-center text-[14px] text-white/50 mt-5 mb-0">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-300 font-medium hover:text-violet-200 hover:underline transition-colors">
          Create one
        </Link>
      </p>
    </Card>
  );
}

// ── Page shell with Suspense ──
export default function LoginPage() {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] blur-[80px] opacity-25 animate-[float_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] blur-[80px] opacity-25 animate-[float_8s_ease-in-out_infinite_alternate] [animation-delay:-4s]" />
      </div>
      <Suspense
        fallback={
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
