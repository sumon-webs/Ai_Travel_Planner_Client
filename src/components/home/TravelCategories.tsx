'use client';

import { Card, Chip } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';
import {
  Waves,
  Mountain,
  Compass,
  Building2,
  Trees,
  Crown,
  Backpack,
  Users,
} from 'lucide-react';

interface Category {
  icon: LucideIcon;
  name: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const CATEGORIES: Category[] = [
  {
    icon: Waves,
    name: 'Beach',
    description: 'Sun, sand, and coastal escapes for your perfect seaside getaway.',
    gradient: 'from-cyan-400 to-blue-500',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Mountain,
    name: 'Mountain',
    description: 'Peaks, trails, and alpine views for elevated adventures.',
    gradient: 'from-slate-400 to-indigo-500',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Compass,
    name: 'Adventure',
    description: 'Thrilling experiences for bold explorers seeking the extraordinary.',
    gradient: 'from-orange-400 to-red-500',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
  },
  {
    icon: Building2,
    name: 'City',
    description: 'Urban culture, nightlife, and iconic landmarks in vibrant metros.',
    gradient: 'from-violet-400 to-purple-500',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
  {
    icon: Trees,
    name: 'Nature',
    description: 'Forests, wildlife, and serene landscapes off the beaten path.',
    gradient: 'from-emerald-400 to-green-600',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Crown,
    name: 'Luxury',
    description: 'Five-star stays, fine dining, and premium experiences curated for you.',
    gradient: 'from-amber-400 to-yellow-500',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
  },
  {
    icon: Backpack,
    name: 'Backpacking',
    description: 'Budget-friendly routes and hostels for the independent traveler.',
    gradient: 'from-teal-400 to-cyan-500',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
  },
  {
    icon: Users,
    name: 'Family',
    description: 'Kid-friendly activities and stress-free plans for the whole crew.',
    gradient: 'from-pink-400 to-rose-500',
    iconBg: 'bg-pink-500/15',
    iconColor: 'text-pink-400',
  },
];

 function TravelCategories() {
  return (
    <section
      id="travel-categories"
      className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-32 text-white"
      aria-labelledby="travel-categories-heading"
    >
      {/* Background blobs — matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16 space-y-5">
          <Chip
            className="bg-white/10 border border-white/20 px-3 h-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Explore by Style
          </Chip>

          <h2
            id="travel-categories-heading"
            className="text-3xl md:text-5xl font-bold leading-tight"
          >
            Travel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Categories
            </span>
          </h2>

          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Find your perfect trip vibe — from sun-soaked beaches to rugged mountain trails.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(({ icon: Icon, name, description, gradient, iconBg, iconColor }) => (
            <div
              key={name}
              className="group relative rounded-2xl p-px transition-transform duration-300 ease-out hover:scale-105"
            >
              {/* Gradient border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-70 transition-opacity duration-300`}
              />

              <Card
                className="
                  relative h-full overflow-hidden
                  rounded-2xl bg-white/5 backdrop-blur-xl
                  border border-white/10
                  p-5 md:p-6
                  shadow-[0_4px_24px_rgba(0,0,0,0.25)]
                  transition-all duration-300 ease-out
                  group-hover:bg-white/[0.08]
                  group-hover:border-white/20
                  group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                  cursor-default
                "
              >
                {/* Soft gradient wash on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col items-center text-center gap-3 md:gap-4">
                  {/* Large icon with gradient background */}
                  <div
                    className={`
                      w-14 h-14 md:w-16 md:h-16 rounded-2xl
                      flex items-center justify-center
                      ring-1 ring-white/10
                      bg-gradient-to-br ${gradient} ${iconBg}
                      transition-transform duration-300 group-hover:scale-110
                    `}
                  >
                    <Icon
                      className={`w-7 h-7 md:w-8 md:h-8 ${iconColor}`}
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {description}
                  </p>

                  {/* Decorative accent line */}
                  <div
                    className={`mt-auto h-0.5 w-8 rounded-full bg-gradient-to-r ${gradient} opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-500`}
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default TravelCategories;
