'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ChatAssistant from '@/components/trips/ChatAssistant';
import {
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Compass,
  X,
  Sparkles,
  Users,
  CloudSun,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

interface AIActivity {
  timeSlot?: string;
  title: string;
  description?: string;
  transport?: string;
  estimatedCost?: string;
  foodHighlight?: string;
}

interface AIAccommodation {
  name?: string;
  type?: string;
  estimatedCostPerNight?: string;
  area?: string;
}

interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  description?: string;
  accommodation?: AIAccommodation;
  activities: AIActivity[];
  dailyCostEstimate?: string;
  notes?: string;
}

interface EstimatedBudget {
  total?: string;
  perDay?: string;
  perPersonPerDay?: string;
  breakdown?: {
    accommodation?: string;
    food?: string;
    activities?: string;
    transport?: string;
    miscellaneous?: string;
  };
}

interface BestTime {
  recommended?: string;
  reason?: string;
  avoid?: string;
}

interface Trip {
  _id: string;
  title: string;
  destination: string | { name?: string; city?: string; country?: string };
  summary?: string;
  estimatedBudget?: EstimatedBudget;
  travelStyle?: string;
  interests?: string[];
  itinerary: ItineraryDay[];
  bestTime?: BestTime;
  packingTips?: string[];
  createdAt: string;

  // Fallback user-input fields
  durationDays?: number;
  budget?: number;
  currency?: string;
  travelers?: number;
}

export default function MyTripsPage() {
  const queryClient = useQueryClient();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // ── Fetch Trips Query ──
  const { data, isLoading, isError, error } = useQuery<{ data: Trip[] }>({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/api/trips`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch your trips. Please sign in again.');
      }
      return response.json();
    },
  });

  // ── Delete Trip Mutation ──
  const deleteMutation = useMutation({
    mutationFn: async (tripId: string) => {
      const response = await fetch(`${serverUrl}/api/trips/${tripId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the trip.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setDeletingTripId(null);
      // Close modal if deleted trip was active
      if (selectedTrip && deletingTripId === selectedTrip._id) {
        setSelectedTrip(null);
      }
    },
  });

  const getDestinationName = (dest: string | { name?: string; city?: string; country?: string } | null | undefined): string => {
    if (!dest) return 'Unknown Destination';
    if (typeof dest === 'string') return dest;
    if (typeof dest === 'object') {
      return dest.city || dest.name || 'Unknown Destination';
    }
    return 'Unknown Destination';
  };

  const getBudgetDisplay = (trip: Trip): string => {
    if (trip.estimatedBudget?.total) return trip.estimatedBudget.total;
    if (trip.budget) return `${trip.currency || 'USD'} ${trip.budget}`;
    return 'N/A';
  };

  const getDurationDisplay = (trip: Trip): string => {
    if (trip.durationDays) return `${trip.durationDays} Days`;
    if (trip.itinerary?.length) return `${trip.itinerary.length} Days`;
    return 'N/A';
  };

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          <p className="text-slate-400 text-sm">Fetching your travel logs...</p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Failed to Load Trips</h2>
            <p className="text-sm text-slate-400">
              {error instanceof Error ? error.message : 'An error occurred while fetching your data.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const trips = data?.data || [];

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-16">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              My Saved Trips
            </h1>
            <p className="text-slate-400 text-sm">
              Manage and view all your custom generated AI itineraries in one place.
            </p>
          </div>
        </div>

        {/* ── Empty State ── */}
        {trips.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">No Trips Found</h3>
              <p className="text-sm text-slate-500 px-8">
                You haven&apos;t generated any trips yet. Head to the planner page to create your first itinerary!
              </p>
            </div>
          </div>
        ) : (
          /* ── Trips Grid ── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const formattedDate = new Date(trip.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={trip._id}
                  className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Border gradient glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 opacity-40 group-hover:opacity-100 transition-opacity" />

                  {/* Card Main Body */}
                  <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 flex flex-col h-full gap-5">
                    {/* Header */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-xs font-semibold text-violet-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {getDestinationName(trip.destination)}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                        {trip.title}
                      </h3>
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-3 py-2 text-xs border-y border-white/5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{getDurationDisplay(trip)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Wallet className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">{getBudgetDisplay(trip)}</span>
                      </div>
                    </div>

                    {/* Date Created */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Created: {formattedDate}</span>
                      {trip.travelStyle && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 capitalize">
                          {trip.travelStyle}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <button
                        onClick={() => {
                          setSelectedTrip(trip);
                          setActiveDayTab(1);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                      <button
                        onClick={() => setDeletingTripId(trip._id)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center justify-center p-2 rounded-xl border border-white/10 text-slate-400 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 transition cursor-pointer disabled:opacity-40"
                      >
                        {deleteMutation.isPending && deletingTripId === trip._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────────── View Itinerary Modal ───────────────────── */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0f0c29]/95 border border-white/10 p-6 md:p-8 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-4 pr-10">
              <div className="flex items-center gap-1 text-sm font-semibold text-violet-400">
                <MapPin className="w-4 h-4" />
                {getDestinationName(selectedTrip.destination)}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                {selectedTrip.title}
              </h2>
              {selectedTrip.summary && (
                <p className="text-slate-300 text-sm leading-relaxed">{selectedTrip.summary}</p>
              )}
            </div>

            {/* Grid Meta Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Budget */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Budget Details</div>
                  <div className="text-sm font-bold text-white mt-0.5">{getBudgetDisplay(selectedTrip)}</div>
                  {selectedTrip.estimatedBudget?.perDay && (
                    <div className="text-xs text-slate-400 mt-0.5">{selectedTrip.estimatedBudget.perDay}/day</div>
                  )}
                  {selectedTrip.estimatedBudget?.perPersonPerDay && (
                    <div className="text-xs text-slate-400">{selectedTrip.estimatedBudget.perPersonPerDay}/person/day</div>
                  )}
                </div>
              </div>

              {/* Best Time */}
              {selectedTrip.bestTime && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <CloudSun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Best Time to Visit</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {selectedTrip.bestTime.recommended || '—'}
                    </div>
                    {selectedTrip.bestTime.reason && (
                      <div className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{selectedTrip.bestTime.reason}</div>
                    )}
                    {selectedTrip.bestTime.avoid && (
                      <div className="text-xs text-rose-400 mt-0.5">Avoid: {selectedTrip.bestTime.avoid}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Users className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Style</div>
                  <div className="text-sm font-bold text-white mt-0.5 capitalize">{selectedTrip.travelStyle || 'Standard'}</div>
                </div>
              </div>
            </div>

            {/* Itinerary Section */}
            {selectedTrip.itinerary && selectedTrip.itinerary.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Tabs side-list */}
                <div className="lg:col-span-3 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                  {selectedTrip.itinerary.map((d) => (
                    <button
                      key={d.day}
                      onClick={() => setActiveDayTab(d.day)}
                      className={`
                        px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 text-left
                        ${
                          activeDayTab === d.day
                            ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300 shadow-[0_4px_12px_rgba(139,92,246,0.1)]'
                            : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-300'
                        }
                      `}
                    >
                      Day {d.day}
                    </button>
                  ))}
                </div>

                {/* Day Details */}
                <div className="lg:col-span-9 p-6 rounded-2xl bg-white/5 border border-white/10 min-h-[250px]">
                  {selectedTrip.itinerary.find((d) => d.day === activeDayTab) ? (
                    <div className="space-y-5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Day {activeDayTab} Details
                        </div>
                        <h3 className="text-lg font-bold text-white mt-3">
                          {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.title}
                        </h3>
                        {(selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.description ||
                          selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.notes) && (
                          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                            {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.description ||
                              selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.notes}
                          </p>
                        )}
                      </div>

                      <hr className="border-white/5" />

                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Activities</h4>

                        {/* Accommodation for the day */}
                        {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.name && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-500/5 border border-sky-500/20 text-xs text-sky-300">
                            <span className="shrink-0">🏨</span>
                            <div>
                              <span className="font-semibold">{selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.name}</span>
                              {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.area && (
                                <span className="text-slate-400"> &mdash; {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.area}</span>
                              )}
                              {selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.estimatedCostPerNight && (
                                <span className="text-emerald-400 ml-1">({selectedTrip.itinerary.find((d) => d.day === activeDayTab)?.accommodation?.estimatedCostPerNight})</span>
                              )}
                            </div>
                          </div>
                        )}

                        <ul className="space-y-4">
                          {selectedTrip.itinerary
                            .find((d) => d.day === activeDayTab)
                            ?.activities.map((act, index) => (
                              <li key={index} className="flex gap-3 text-sm text-slate-300 items-start">
                                <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold text-violet-400">
                                  {index + 1}
                                </div>
                                <div className="flex-1 space-y-1">
                                  {act.timeSlot && (
                                    <div className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">{act.timeSlot}</div>
                                  )}
                                  <div className="font-semibold text-white leading-snug">{act.title}</div>
                                  {act.description && (
                                    <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                                  )}
                                  {act.transport && (
                                    <div className="text-xs text-sky-400">🚌 {act.transport}</div>
                                  )}
                                  {act.foodHighlight && (
                                    <div className="text-xs text-amber-400">🍽 {act.foodHighlight}</div>
                                  )}
                                  {act.estimatedCost && (
                                    <div className="text-xs text-emerald-400">💰 {act.estimatedCost}</div>
                                  )}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-12">Select a day tab.</div>
                  )}
                </div>
              </div>
            )}

            {/* Packing checklist */}
            {selectedTrip.packingTips && selectedTrip.packingTips.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  AI Packing Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTrip.packingTips.map((tip, index) => (
                    <div key={index} className="flex gap-2.5 items-start text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────── Delete Confirmation Modal ───────────────────── */}
      {deletingTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0f0c29]/95 border border-white/10 p-6 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Trip?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Are you sure you want to delete this trip? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingTripId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingTripId)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Travel Assistant */}
      <ChatAssistant trip={selectedTrip} />
    </main>
  );
}
