'use client';

import {
  Sparkles,
  PiggyBank,
  Compass,
  CloudSun,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI Itinerary Generator',
    description:
      'Describe your dream trip and let our AI craft a detailed, day-by-day itinerary complete with activities, restaurants, and hidden gems.',
    gradient: 'from-purple-500 to-blue-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: PiggyBank,
    title: 'Budget Optimizer',
    description:
      'Set your budget and watch AI allocate every dollar — finding the best flights, hotels, and experiences without overspending.',
    gradient: 'from-emerald-400 to-teal-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Compass,
    title: 'Smart Destination Recommendation',
    description:
      'Not sure where to go? Our AI analyzes your preferences, travel history, and trends to suggest destinations you\'ll love.',
    gradient: 'from-amber-400 to-orange-500',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: CloudSun,
    title: 'Weather & Travel Insights',
    description:
      'Get real-time weather forecasts, best-time-to-visit data, and local event alerts so you always travel at the perfect moment.',
    gradient: 'from-sky-400 to-indigo-500',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
  },
];

export default function AIFeatures() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 lg:py-32 text-white">
      {/* Background Blobs — matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Powered by AI</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Intelligent Features for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Smarter Travel
            </span>
          </h2>

          <p className="text-slate-400 text-lg">
            Our AI suite takes the guesswork out of planning — so you can focus
            on the adventure.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, gradient, iconBg, iconColor }) => (
            <div
              key={title}
              className="group relative rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
              />

              {/* Card Body — glassmorphism */}
              <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 h-full flex flex-col gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ring-1 ring-white/10`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>

                <h3 className="text-lg font-semibold">{title}</h3>

                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {description}
                </p>

                {/* Decorative bottom line */}
                <div
                  className={`mt-auto h-0.5 w-12 rounded-full bg-gradient-to-r ${gradient} opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-500`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
