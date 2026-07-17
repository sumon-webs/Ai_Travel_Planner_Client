'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { MapPin, Star, ArrowRight, DollarSign, Clock, AlertCircle } from 'lucide-react';

interface Destination {
  _id: string;
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  rating: number;
  coverImage: string;
  category: string;
}

function SkeletonCard() {
  return (
    <Card className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden flex flex-col h-full animate-pulse p-3">
      <div className="aspect-[4/3] bg-white/5 rounded-xl mb-4 shrink-0" />
      <div className="px-2 flex flex-col gap-3 flex-1">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-5 w-3/4 bg-white/10 rounded" />
        <div className="h-4 w-full bg-white/8 rounded" />
        <div className="h-4 w-2/3 bg-white/8 rounded" />
        <div className="mt-auto pt-2 h-9 bg-white/10 rounded-xl" />
      </div>
    </Card>
  );
}

export default function PopularDestinations() {
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
  // Show only the latest 8 destinations
  const latestDestinations = destinations.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-[#0d0b1e] py-24 px-6">
      {/* Ambient Blobs */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-violet-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-sky-900/20 rounded-full blur-[120px]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-sm font-semibold text-violet-300 mb-5">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Top Rated Locations
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Popular{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
                Destinations
              </span>
            </h2>
          </div>
          <Link href="/explore">
            <Button className="border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-violet-500/40 transition-all gap-2 rounded-xl px-5 h-10 text-sm font-semibold cursor-pointer">
              View All <ArrowRight size={15} />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white">Failed to load destinations</h3>
              <p className="text-sm mt-1 text-slate-400">Could not retrieve locations from the server.</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && latestDestinations.length === 0 && (
          <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white">No destinations yet</h3>
            <p className="text-slate-500 text-sm mt-2">Check back later or add a new destination yourself!</p>
            <Link href="/items/add" className="inline-block mt-6">
              <Button className="bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 rounded-xl px-5 border border-violet-500/30">
                Add Destination
              </Button>
            </Link>
          </div>
        )}

        {/* Grid List */}
        {!isLoading && !isError && latestDestinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestDestinations.map((item) => (
              <Card
                key={item._id}
                className="group relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl p-3 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.06] hover:border-violet-500/50 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] flex flex-col h-full"
              >
                {/* Image Container — fixed aspect ratio */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Location overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white font-bold text-[15px]">
                    <MapPin size={15} className="text-sky-400 shrink-0" />
                    {item.name}
                  </div>

                  {/* Rating pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/20">
                    <Star size={11} fill="currentColor" className="text-amber-400" />
                    {item.rating}
                  </div>
                </div>

                {/* Card Body — flex-1 ensures equal height */}
                <div className="px-2 flex flex-col flex-1 gap-2.5">
                  {/* City / Country */}
                  <p className="text-xs text-white/40 font-medium">{item.city}, {item.country}</p>

                  {/* Short Description */}
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
                    {item.shortDescription}
                  </p>

                  {/* Price + Duration row */}
                  <div className="flex items-center gap-3 text-sm pt-1">
                    <span className="flex items-center gap-0.5 text-emerald-400 font-bold text-base">
                      <DollarSign size={14} />
                      {item.price.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-xs">
                      <Clock size={12} className="text-violet-400/80" />
                      {item.durationDays} days
                    </span>
                  </div>

                  {/* View Details CTA */}
                  <div className="pt-2">
                    <Link href={`/destination/${item._id}`}>
                      <Button
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_2px_12px_rgba(139,92,246,0.3)] cursor-pointer h-9"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}