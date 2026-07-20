'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Compass, MapPin, Clock, Star, DollarSign, Search,
  ChevronLeft, ChevronRight, AlertCircle, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@heroui/react';

interface Destination {
  _id: string;
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  category: string;
  bestSeason: string;
  rating: number;
  coverImage: string;
}

const ITEMS_PER_PAGE = 8;

const CATEGORIES = [
  'All', 'Adventure', 'Cultural', 'Beach & Coast', 'Nature & Wildlife',
  'City Break', 'Luxury Escape', 'Budget Travel', 'Family Friendly',
  'Solo Travel', 'Romantic Getaway',
];

const BUDGET_RANGES = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 – $1,000', min: 500, max: 1000 },
  { label: '$1,000 – $2,500', min: 1000, max: 2500 },
  { label: 'Over $2,500', min: 2500, max: Infinity },
];

// ── Skeleton Card ──────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-48 bg-white/5 shrink-0" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-5 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/8 rounded" />
        <div className="h-3 w-2/3 bg-white/8 rounded" />
        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Destination Card ───────────────────────────────────────
function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <div className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-violet-500/40 overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.18)]">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dest.coverImage}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a081a]/90 via-[#0a081a]/20 to-transparent" />
        {/* Category pill */}
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-violet-600/85 backdrop-blur-sm text-[11px] font-semibold text-white border border-violet-400/30">
          {dest.category}
        </span>
        {/* Price badge */}
        <span className="absolute top-3 right-3 flex items-center gap-0.5 bg-emerald-500/90 backdrop-blur-sm text-white font-bold text-[12px] px-2.5 py-0.5 rounded-full border border-emerald-400/20">
          <DollarSign className="w-3 h-3" />
          {dest.price.toLocaleString()}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-violet-300/80 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          {dest.city}, {dest.country}
        </div>
        <h3 className="text-[16px] font-bold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors line-clamp-1">
          {dest.name}
        </h3>
        <p className="text-slate-400 text-[13px] leading-relaxed flex-1 line-clamp-2 mb-4">
          {dest.shortDescription}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[12px] text-slate-400 border-t border-white/5 pt-3 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-violet-400/80" />
            {dest.durationDays}d
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white/30">Best:</span>
            {dest.bestSeason}
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-semibold">{dest.rating}</span>
          </div>
        </div>

        {/* View Details */}
        <Link href={`/destination/${dest._id}`}>
          <Button
            className="w-full h-9 rounded-xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-600 hover:to-indigo-600 text-white text-[13px] font-semibold transition-all cursor-pointer"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function ExplorePage() {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('All');
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc'>('rating-desc');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<{ data: Destination[] }>({
    queryKey: ['destinations'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/destinations`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return res.json();
    },
  });

  const allDestinations = data?.data || [];

  // Derive unique countries
  const countries = useMemo(() => {
    const set = new Set(allDestinations.map((d) => d.country));
    return ['All Countries', ...Array.from(set).sort()];
  }, [allDestinations]);

  // Filter + sort
  const filtered = useMemo(() => {
    const budget = BUDGET_RANGES[budgetIdx];
    return allDestinations
      .filter((d) => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.city.toLowerCase().includes(search.toLowerCase());
        const matchCountry = !country || country === 'All Countries' || d.country === country;
        const matchCategory = category === 'All' || d.category === category;
        const matchBudget = d.price >= budget.min && d.price <= budget.max;
        return matchSearch && matchCountry && matchCategory && matchBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-asc') return a.rating - b.rating;
        return b.rating - a.rating; // rating-desc default
      });
  }, [allDestinations, search, country, category, budgetIdx, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = () => setPage(1);

  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-25" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/15 to-blue-600/15 blur-[100px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto pb-16">
        {/* ── Header ── */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Destinations
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Discover unique locations curated by our community. Filter, search, and plan your next journey.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-300 mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filter & Sort
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Search destination or city..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl h-10 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/60 transition-colors"
              />
            </div>
            {/* Country */}
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); handleFilterChange(); }}
              className="bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
            >
              {countries.map((c) => (
                <option key={c} value={c} className="bg-[#0d0a21]">{c}</option>
              ))}
            </select>
            {/* Category */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); handleFilterChange(); }}
              className="bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0d0a21]">{c}</option>
              ))}
            </select>
            {/* Budget */}
            <select
              value={budgetIdx}
              onChange={(e) => { setBudgetIdx(Number(e.target.value)); handleFilterChange(); }}
              className="bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
            >
              {BUDGET_RANGES.map((b, i) => (
                <option key={i} value={i} className="bg-[#0d0a21]">{b.label}</option>
              ))}
            </select>
          </div>
          {/* Sort row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/40 font-medium">Sort by:</span>
            {[
              { key: 'rating-desc', label: '⭐ Top Rated' },
              { key: 'price-asc', label: '💰 Price: Low' },
              { key: 'price-desc', label: '💰 Price: High' },
              { key: 'rating-asc', label: '⭐ Rating: Low' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key as typeof sortBy)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  sortBy === key
                    ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
            {(search || country || category !== 'All' || budgetIdx !== 0) && (
              <button
                onClick={() => { setSearch(''); setCountry(''); setCategory('All'); setBudgetIdx(0); setPage(1); }}
                className="ml-auto px-3 py-1 rounded-full text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {!isLoading && !isError && (
          <p className="text-sm text-white/40 mb-6">
            {filtered.length === 0 ? 'No destinations found' : `Showing ${paginated.length} of ${filtered.length} destinations`}
          </p>
        )}

        {/* ── Loading Skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="max-w-md mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white">Failed to load destinations</h3>
              <p className="text-sm mt-1 text-slate-400">Make sure the backend server is running.</p>
            </div>
          </div>
        )}

        {/* ── Grid ── */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-2xl max-w-md mx-auto">
            <Compass className="w-12 h-12 text-violet-400/50 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-white">No destinations found</h3>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {!isLoading && !isError && paginated.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginated.map((dest) => (
              <DestinationCard key={dest._id} dest={dest} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  page === p
                    ? 'bg-violet-600 text-white shadow-[0_2px_12px_rgba(139,92,246,0.4)]'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
