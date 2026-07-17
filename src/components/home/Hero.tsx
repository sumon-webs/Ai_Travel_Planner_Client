'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const DESTINATIONS = [
  { emoji: '🗼', city: 'Paris', country: 'France' },
  { emoji: '🗽', city: 'New York', country: 'USA' },
  { emoji: '🏯', city: 'Kyoto', country: 'Japan' },
  { emoji: '🏔️', city: 'Santorini', country: 'Greece' },
  { emoji: '🌴', city: 'Bali', country: 'Indonesia' },
  { emoji: '🕌', city: 'Dubai', country: 'UAE' },
];

const STATS = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '120+', label: 'Destinations' },
  { value: '4.9★', label: 'User Rating' },
];

export default function Hero() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const dx = (e.clientX / w - 0.5) * 20;
      const dy = (e.clientY / h - 0.5) * 20;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-32 text-white">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left: Copy */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>✨ AI-Powered Travel Planning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Plan Your Dream Trip <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              With AI
            </span> in Seconds
          </h1>

          <p className="text-lg text-slate-400 max-w-lg">
            Describe where you want to go. Our AI crafts a fully personalised itinerary — flights, hotels, day-by-day activities — all in one place.
          </p>

          <div className="flex items-center p-2 bg-white/5 border border-white/10 rounded-2xl max-w-md backdrop-blur-sm">
            <span className="px-4 text-xl">🔍</span>
            <input
              className="flex-1 bg-transparent border-none outline-none placeholder-slate-500 py-2"
              placeholder='Try "10 days in Japan..."'
            />
            <Link href="/register" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-semibold hover:bg-slate-200 transition">
              Plan Trip
            </Link>
          </div>

          <div className="flex gap-8 pt-4">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual Orb */}
        <div className="relative flex-1 flex justify-center items-center h-[500px]">
          <div ref={orbitRef} className="relative w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
             <div className="text-6xl animate-bounce">🌍</div>
             {/* Orbiting Cards Logic would go here (requires absolute positioning based on index) */}
          </div>
        </div>
      </div>
    </section>
  );
}