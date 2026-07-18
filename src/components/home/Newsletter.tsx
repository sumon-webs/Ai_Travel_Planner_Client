'use client';

import { useState, type FormEvent } from 'react';
import { Button, Chip, Input } from '@heroui/react';
import { Mail, Send, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section
      id="newsletter"
      className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-28 text-white"
      aria-labelledby="newsletter-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-purple-600/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
          {/* Card gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">
            <Chip className="bg-white/10 border border-white/20 px-3 h-8">
              <span className="flex items-center gap-2 text-sm text-white">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                Travel Inspiration Weekly
              </span>
            </Chip>

            <div className="space-y-4 max-w-2xl">
              <h2
                id="newsletter-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                Get{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  AI Travel Tips
                </span>{' '}
                in Your Inbox
              </h2>

              <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                Subscribe for destination guides, smart packing hacks, budget
                tips, and exclusive AI-curated trip ideas — no spam, just
                wanderlust.
              </p>
            </div>

            {submitted ? (
              <div className="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 text-center">
                <p className="text-emerald-300 font-semibold">
                  You&apos;re subscribed!
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Thanks for joining. Your next adventure starts in your inbox.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl flex flex-col sm:flex-row gap-3"
                noValidate
              >
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10"
                    aria-hidden
                  />
                  <Input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="h-12 pl-11 pr-4 bg-white/[0.08] border border-white/[0.15] hover:border-white/25 focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20 rounded-xl text-[15px] text-white/90 placeholder:text-white/50 outline-none transition-all w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 px-6 sm:px-8 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold text-[15px] text-white rounded-xl shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </Button>
              </form>
            )}

            <p className="text-xs text-slate-500">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
