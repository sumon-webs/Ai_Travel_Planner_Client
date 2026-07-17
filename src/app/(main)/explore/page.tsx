'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Button, Card } from '@heroui/react';

interface Destination {
  _id: string;
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  description: string;
  price: number;
  durationDays: number;
  category: string;
  bestSeason: string;
  rating: number;
  coverImage: string;
  galleryImages: string[];
}

export default function ExplorePage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const { data, isLoading, isError } = useQuery<{ data: Destination[] }>({
    queryKey: ['destinations'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/destinations`);
      if (!res.ok) {
        throw new Error('Failed to fetch destinations');
      }
      return res.json();
    },
  });

  const destinations = data?.data || [];

  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-25" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/15 to-blue-600/15 blur-[100px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto pt-8 pb-16">
        {/* ── Header Row ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Explore{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                Destinations
              </span>
            </h1>
            <p className="text-slate-400 text-base max-w-xl">
              Discover unique locations curated by our community and plan your next journey.
            </p>
          </div>

          <Link href="/items/add">
            <Button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 font-semibold text-white rounded-xl px-6 h-12 shadow-[0_4px_15px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Destination
            </Button>
          </Link>
        </div>

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading destinations...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {isError && (
          <div className="max-w-md mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white">Failed to load destinations</h3>
              <p className="text-sm mt-1 text-slate-400">Could not retrieve locations from the server. Make sure the backend is running.</p>
            </div>
          </div>
        )}

        {/* ── Grid List ── */}
        {!isLoading && !isError && (
          <>
            {destinations.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                <Compass className="w-12 h-12 text-violet-400/50 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-white">No destinations yet</h3>
                <p className="text-slate-500 text-sm mt-2">Be the first to feature a new exciting destination!</p>
                <Link href="/items/add" className="inline-block mt-6">
                  <Button className="bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 rounded-xl px-5 border border-violet-500/30">
                    Add First Destination
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest) => (
                  <Card
                    key={dest._id}
                    className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] flex flex-col h-full"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dest.coverImage}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a081a] via-transparent to-transparent opacity-80" />

                      {/* Category Tag */}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/80 backdrop-blur-md text-[11px] font-semibold tracking-wide text-white border border-violet-400/30">
                        <Tag className="w-3 h-3" />
                        {dest.category}
                      </span>

                      {/* Price Tag */}
                      <span className="absolute bottom-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white font-bold text-sm px-3 py-1 rounded-lg border border-emerald-400/20 flex items-center shadow-md">
                        <DollarSign className="w-3.5 h-3.5" />
                        {dest.price}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* City, Country */}
                      <div className="flex items-center gap-1 text-violet-300/80 text-xs font-semibold uppercase tracking-wider mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {dest.city}, {dest.country}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors">
                        {dest.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                        {dest.shortDescription}
                      </p>

                      {/* Meta Footer */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                        {/* Duration */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-violet-400/80" />
                          <span>{dest.durationDays} Days</span>
                        </div>

                        {/* Best Season */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-violet-400/80" />
                          <span>{dest.bestSeason}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-amber-300 font-semibold">{dest.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
