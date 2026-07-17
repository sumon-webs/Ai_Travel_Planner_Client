import type { Metadata } from 'next';
import TripPlannerForm from '@/components/plan-trip/TripPlannerForm';

export const metadata: Metadata = {
  title: 'Plan Your Trip — AI Travel Planner',
  description:
    'Let AI craft your perfect trip itinerary. Set your destination, budget, travel style, and interests — and get a personalised plan in seconds.',
};

export default function PlanTripPage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 lg:py-24">
        {/* ── Page Header ── */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>✨ AI-Powered Planning</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Plan Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Dream Trip
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Tell us about your ideal trip and our AI will generate a complete personalised itinerary — destination, budget, and activities all sorted.
          </p>
        </div>

        {/* ── Form Card ── */}
        <div className="relative rounded-2xl p-[1px]">
          {/* Gradient border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 via-transparent to-blue-500/30" />

          {/* Glassmorphism body */}
          <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-10">
            {/* Section icon header */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center ring-1 ring-white/10">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Trip Details</h2>
                <p className="text-sm text-slate-500">Fill in the fields below to get started</p>
              </div>
            </div>

            <TripPlannerForm />
          </div>
        </div>
      </div>
    </main>
  );
}
