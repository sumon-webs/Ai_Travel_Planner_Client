'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import {
  MapPin, Trash2, Eye, Plus, AlertCircle,
  Star, DollarSign, Clock, Compass, X, TriangleAlert,
} from 'lucide-react';
import { Button } from '@heroui/react';

interface Destination {
  _id: string;
  name: string;
  country: string;
  city: string;
  price: number;
  durationDays: number;
  rating: number;
  coverImage: string;
  category: string;
  createdAt: string;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse">
      <div className="w-16 h-12 rounded-lg bg-white/8 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-2/5" />
        <div className="h-3 bg-white/6 rounded w-1/4" />
      </div>
      <div className="h-3 w-16 bg-white/8 rounded hidden sm:block" />
      <div className="h-3 w-12 bg-white/8 rounded hidden md:block" />
      <div className="h-3 w-12 bg-white/8 rounded hidden lg:block" />
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/8" />
        <div className="w-8 h-8 rounded-lg bg-white/8" />
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────
function DeleteModal({
  destination,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  destination: Destination;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
    >
      <div className="w-full max-w-md bg-[#0f0c2e] border border-white/10 rounded-2xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-[slide-down_0.2s_ease-out_both]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <TriangleAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-white">Delete Destination</h3>
              <p className="text-[12px] text-white/40">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destination preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/8 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={destination.coverImage} alt={destination.name} className="w-14 h-10 rounded-lg object-cover shrink-0" />
          <div>
            <p className="text-[14px] font-semibold text-white">{destination.name}</p>
            <p className="text-[12px] text-white/40">{destination.city}, {destination.country}</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Are you sure you want to permanently delete <span className="text-white font-semibold">{destination.name}</span>? This will remove it from the explore page immediately.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function ManageDestinationsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const { data, isLoading, isError } = useQuery<{ data: Destination[] }>({
    queryKey: ['myDestinations'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/destinations/my`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch your destinations');
      return res.json();
    },
    enabled: !!session, // Only fetch when authenticated
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${serverUrl}/api/destinations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete destination');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDestinations'] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      setDeleteTarget(null);
    },
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const destinations = data?.data || [];

  return (
    <>
      <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden py-10 px-4 sm:px-6">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-20" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/10 to-blue-600/10 blur-[100px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto pb-16">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Manage{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  Destinations
                </span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {destinations.length} destination{destinations.length !== 1 ? 's' : ''} published by you
              </p>
            </div>
            <Link href="/items/add">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl px-5 h-10 flex items-center gap-2 shadow-[0_4px_15px_rgba(139,92,246,0.35)] hover:opacity-90 hover:-translate-y-0.5 transition-all cursor-pointer text-sm">
                <Plus className="w-4 h-4" />
                Add Destination
              </Button>
            </Link>
          </div>

          {/* ── Error ── */}
          {isError && (
            <div className="max-w-md p-6 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-4 mb-8">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white text-sm">Failed to load your destinations</p>
                <p className="text-xs text-slate-400 mt-1">Make sure the backend server is running.</p>
              </div>
            </div>
          )}

          {/* ── Loading Skeleton ── */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* ── Empty State ── */}
          {!isLoading && !isError && destinations.length === 0 && (
            <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-2xl">
              <Compass className="w-12 h-12 text-violet-400/50 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-white mb-2">No destinations yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                You haven't published any destinations. Add your first one now!
              </p>
              <Link href="/items/add">
                <Button className="bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-xl px-6 hover:bg-violet-600/30 transition-all cursor-pointer">
                  Add Your First Destination
                </Button>
              </Link>
            </div>
          )}

          {/* ── Table ── */}
          {!isLoading && !isError && destinations.length > 0 && (
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_80px_100px] gap-4 px-5 py-3 border-b border-white/8 text-xs font-semibold uppercase tracking-wider text-white/35">
                <span>Image</span>
                <span>Destination</span>
                <span className="text-right">Price</span>
                <span className="text-right hidden md:block">Days</span>
                <span className="text-right hidden lg:block">Rating</span>
                <span className="hidden lg:block">Added</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {destinations.map((dest) => (
                  <div
                    key={dest._id}
                    className="sm:grid grid-cols-[60px_1fr_100px_80px_80px_80px_100px] gap-4 px-5 py-4 items-center hover:bg-white/[0.025] transition-colors flex flex-col sm:flex-row"
                  >
                    {/* Cover Image */}
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dest.coverImage} alt={dest.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Name / Location */}
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-white truncate">{dest.name}</p>
                      <p className="text-[12px] text-white/40 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-violet-400/80 shrink-0" />
                        <span className="truncate">{dest.city}, {dest.country}</span>
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right text-[13px] font-medium text-emerald-400 flex items-center justify-end gap-0.5">
                      <DollarSign className="w-3 h-3" />
                      {dest.price.toLocaleString()}
                    </div>

                    {/* Duration */}
                    <div className="text-right text-[13px] text-white/60 hidden md:flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-violet-400/60" />
                      {dest.durationDays}d
                    </div>

                    {/* Rating */}
                    <div className="text-right text-[13px] text-amber-400 hidden lg:flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {dest.rating}
                    </div>

                    {/* Created date */}
                    <div className="text-[11px] text-white/30 hidden lg:block">
                      {new Date(dest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => router.push(`/destination/${dest._id}`)}
                        title="View destination"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-violet-500/20 hover:border-violet-500/40 text-white/50 hover:text-violet-300 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(dest)}
                        title="Delete destination"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-white/50 hover:text-red-400 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          destination={deleteTarget}
          onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}
