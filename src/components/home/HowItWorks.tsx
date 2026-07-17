'use client';

import { Card } from '@heroui/react';
import {
  MessageSquare,
  Sparkles,
  Map,
  ArrowRight,
} from 'lucide-react';

/* ─── Step data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe Your Trip',
    description:
      'Tell our AI where you want to go, your budget, travel style, and preferences — all in plain, conversational English.',
    gradient: 'from-violet-500/20 to-purple-600/10',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border-violet-500/30',
    glowColor: 'rgba(139,92,246,0.25)',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Crafts Your Plan',
    description:
      'Our intelligent AI analyses thousands of options and builds a fully personalised itinerary — flights, hotels, and day-by-day activities.',
    gradient: 'from-sky-500/20 to-cyan-600/10',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15 border-sky-500/30',
    glowColor: 'rgba(56,189,248,0.25)',
  },
  {
    number: '03',
    icon: Map,
    title: 'Travel with Confidence',
    description:
      'Download your complete plan with local tips, maps, and booking links — everything you need for a seamless, stress-free adventure.',
    gradient: 'from-pink-500/20 to-rose-600/10',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/15 border-pink-500/30',
    glowColor: 'rgba(244,114,182,0.25)',
  },
] as const;

/* ─── Component ─────────────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-[#0d0b1e] via-[#0f0c29] to-[#150d30] py-24 md:py-32 px-6"
      aria-labelledby="how-it-works-heading"
    >
      {/* ── Ambient background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-700/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-600/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[90px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section header ── */}
        <div className="text-center mb-16 md:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/35 text-[13px] font-semibold text-violet-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa] animate-pulse" />
            Simple 3-Step Process
          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5"
          >
            How AI Plans{' '}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-pink-400 bg-clip-text text-transparent">
              Your Trip
            </span>
          </h2>

          <p className="text-[17px] text-white/55 max-w-[560px] mx-auto leading-relaxed">
            From a simple prompt to a complete travel plan — in seconds, not hours.
          </p>
        </div>

        {/* ── Cards row ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;

            return (
              <div
                key={step.number}
                className="flex flex-col md:flex-row items-center flex-1"
              >
                {/* ── Step card ── */}
                <div className="group flex-1 w-full md:w-auto">
                  <Card
                    className={`
                      relative h-full overflow-hidden
                      bg-white/[0.04] backdrop-blur-xl
                      border border-white/[0.10]
                      rounded-2xl p-7
                      transition-all duration-500 ease-out
                      hover:-translate-y-2
                      hover:bg-white/[0.07]
                      hover:border-white/[0.18]
                      cursor-default
                      w-full
                    `}
                    style={{
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        `0 12px 40px ${step.glowColor}, 0 4px 24px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        '0 4px 24px rgba(0,0,0,0.3)';
                    }}
                  >
                    {/* Gradient background layer */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    />

                    {/* Step number — top-right badge */}
                    <div className="absolute top-5 right-5 font-black text-[40px] leading-none text-white/[0.05] select-none pointer-events-none tabular-nums">
                      {step.number}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-5">
                      {/* Icon container */}
                      <div
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          border ${step.iconBg}
                          transition-transform duration-300 group-hover:scale-110
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 ${step.iconColor}`}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Step label */}
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">
                        Step {step.number}
                      </span>

                      {/* Title */}
                      <h3 className="text-[19px] font-bold text-white leading-snug -mt-2">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[14.5px] text-white/55 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* ── Connecting arrow (desktop only, between cards) ── */}
                {!isLast && (
                  <div
                    className="hidden md:flex shrink-0 flex-col items-center justify-center px-4 self-center"
                    aria-hidden="true"
                  >
                    {/* Arrow track */}
                    <div className="relative flex items-center">
                      <div className="w-10 h-[1px] bg-gradient-to-r from-white/10 to-white/25" />
                      <ArrowRight
                        className="w-5 h-5 text-white/30 -ml-1"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                )}

                {/* ── Connecting arrow (mobile only, between cards) ── */}
                {!isLast && (
                  <div
                    className="flex md:hidden flex-col items-center py-2"
                    aria-hidden="true"
                  >
                    <div className="h-8 w-[1px] bg-gradient-to-b from-white/10 to-white/25" />
                    <ArrowRight
                      className="w-4 h-4 text-white/30 rotate-90 -mt-1"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.10] backdrop-blur-sm text-[14px] text-white/60">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" aria-hidden />
            Ready in under 30 seconds — no credit card required
          </div>
        </div>
      </div>
    </section>
  );
}
