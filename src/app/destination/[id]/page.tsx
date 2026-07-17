'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Clock, DollarSign, Star, Calendar,
  Layers, ArrowLeft, Sparkles, AlertCircle,
} from 'lucide-react';
import { Button } from '@heroui/react';

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

function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-[420px] bg-white/5 rounded-2xl mb-8" />
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/2" />
        <div className="h-4 bg-white/8 rounded w-3/4" />
        <div className="h-4 bg-white/8 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const { data, isLoading, isError } = useQuery<{ data: Destination }>({
    queryKey: ['destination', id],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/destinations/${id}`);
      if (!res.ok) throw new Error('Destination not found');
      return res.json();
    },
    enabled: !!id,
  });

  // Related destinations
  const { data: allData } = useQuery<{ data: Destination[] }>({
    queryKey: ['destinations'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/destinations`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const dest = data?.data;

  const related = (allData?.data || [])
    .filter((d) => d._id !== id && d.category === dest?.category)
    .slice(0, 3);

  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/10 to-blue-600/10 blur-[100px] opacity-15" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-10 pb-20">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>

        {isLoading && <SkeletonDetail />}

        {isError && (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-semibold text-white text-lg">Destination not found</h3>
            <p className="text-sm text-slate-400 mt-1">This destination may have been removed.</p>
            <Link href="/explore" className="inline-block mt-4">
              <Button className="bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-xl px-5 cursor-pointer">
                Browse All Destinations
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !isError && dest && (
          <>
            {/* ── Hero Image ── */}
            <div className="relative h-[380px] md:h-[480px] rounded-2xl overflow-hidden mb-8 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.coverImage}
                alt={dest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a081a] via-[#0a081a]/30 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-violet-600/80 backdrop-blur-sm text-[12px] font-semibold text-white border border-violet-400/30">
                    {dest.category}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[12px] font-bold px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    {dest.rating}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">{dest.name}</h1>
                <div className="flex items-center gap-1 text-violet-300 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  {dest.city}, {dest.country}
                </div>
              </div>
            </div>

            {/* ── Metadata Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: DollarSign, label: 'Price', value: `$${dest.price.toLocaleString()}`, color: 'text-emerald-400' },
                { icon: Clock, label: 'Duration', value: `${dest.durationDays} Days`, color: 'text-violet-400' },
                { icon: Calendar, label: 'Best Season', value: dest.bestSeason, color: 'text-sky-400' },
                { icon: Layers, label: 'Category', value: dest.category, color: 'text-indigo-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">{label}</span>
                  </div>
                  <p className="text-[15px] font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* ── CTA ── */}
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-violet-600/15 to-indigo-600/15 border border-violet-500/25 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Ready to plan this trip?</h3>
                <p className="text-sm text-slate-400">Let our AI build a complete personalised itinerary for {dest.name}.</p>
              </div>
              <Link href={`/plan-trip?destination=${encodeURIComponent(dest.name + ', ' + dest.country)}`}>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl px-6 h-11 flex items-center gap-2 shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer shrink-0">
                  <Sparkles className="w-4 h-4" />
                  Plan this Trip with AI
                </Button>
              </Link>
            </div>

            {/* ── Description ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
                  <p className="text-slate-300 leading-relaxed text-[15px]">{dest.shortDescription}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">About {dest.name}</h2>
                  <p className="text-slate-400 leading-relaxed text-[15px] whitespace-pre-line">{dest.description}</p>
                </div>
              </div>

              {/* ── Quick Facts Sidebar ── */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Quick Facts</h3>
                <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 space-y-4 text-sm">
                  {[
                    { label: 'Country', value: dest.country },
                    { label: 'City', value: dest.city },
                    { label: 'Price', value: `$${dest.price.toLocaleString()}` },
                    { label: 'Duration', value: `${dest.durationDays} days` },
                    { label: 'Best Season', value: dest.bestSeason },
                    { label: 'Category', value: dest.category },
                    { label: 'Rating', value: `${dest.rating} / 5` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-white/40 shrink-0">{label}</span>
                      <span className="text-white font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Gallery ── */}
            {dest.galleryImages && dest.galleryImages.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dest.galleryImages.slice(0, 6).map((img, i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${dest.name} gallery ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Related ── */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-5">Related Destinations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {related.map((r) => (
                    <Link key={r._id} href={`/destination/${r._id}`} className="group block no-underline">
                      <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-violet-500/40 transition-all hover:-translate-y-1">
                        <div className="relative h-40 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.coverImage}
                            alt={r.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a081a]/80 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <p className="text-white font-bold text-sm">{r.name}</p>
                            <p className="text-violet-300 text-[11px]">{r.city}, {r.country}</p>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-emerald-400" />{r.price.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
