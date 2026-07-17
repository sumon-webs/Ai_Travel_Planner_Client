'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, signIn } from '@/lib/auth-client';
import { Card, Button, Input } from '@heroui/react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      name,
      email,
      password,
      callbackURL: '/',
    });

    setLoading(false);

    if (authError) {
      setError(authError.message ?? 'Registration failed. Please try again.');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
    setGoogleLoading(false);
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] blur-[80px] opacity-25 animate-[float_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] blur-[80px] opacity-25 animate-[float_8s_ease-in-out_infinite_alternate] [animation-delay:-4s]" />
      </div>

      <Card className="relative z-10 w-full max-w-[420px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-[1.25rem] px-8 py-10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] animate-[slideUp_0.4s_ease-out_both]">
        {/* Logo / Heading */}
        <div className="text-center mb-7">
          <div className="text-4xl mb-3 animate-[pulse-icon_2s_ease-in-out_infinite]">✈️</div>
          <h1 className="text-[26px] font-bold text-white leading-none tracking-tight mb-1.5">Create your account</h1>
          <p className="text-[14px] text-white/50 m-0">Start planning smarter trips today</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-lg p-3 text-[14px] mb-5 animate-[shake_0.3s_ease-out]" role="alert">
            {error}
          </div>
        )}

        {/* Google Sign-Up */}
        <Button
          id="google-signup-btn"
          type="button"
          onPress={handleGoogleSignUp}
          isDisabled={googleLoading || loading}
          className="w-full h-11 flex items-center justify-center gap-2.5 bg-white/90 hover:bg-white text-gray-800 font-semibold text-[15px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-gray-400/40 border-t-gray-700 rounded-full animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-[13px] text-white/50">
          <div className="flex-1 h-[1px] bg-white/[0.12]" />
          <span>or create an account with email</span>
          <div className="flex-1 h-[1px] bg-white/[0.12]" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="text-[14px] font-medium text-white/90">
              Full name
            </label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-11 px-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-[0.625rem] text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-[14px] font-medium text-white/90">
              Email address
            </label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 px-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-[0.625rem] text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="register-password" className="text-[14px] font-medium text-white/90">
                Password
              </label>
              <span className="text-[12px] text-white/50">Min. 8 characters</span>
            </div>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 px-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-[0.625rem] text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
            />
          </div>

          <Button
            id="register-submit-btn"
            type="submit"
            isDisabled={loading || googleLoading}
            className="w-full h-12 mt-1.5 flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold text-[15px] text-white rounded-xl shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
            )}
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-[14px] text-white/50 mt-6 mb-0">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-300 font-medium hover:text-violet-200 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
