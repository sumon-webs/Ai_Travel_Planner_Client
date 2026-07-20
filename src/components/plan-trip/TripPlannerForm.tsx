'use client';

import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Wallet,
  Users,
  Sparkles,
  RotateCcw,
  Loader2,
  Plane,
  CheckCircle,
  Compass,
  AlertCircle,
  TrendingUp,
  Bookmark,
  Calendar,
  CloudSun,
} from 'lucide-react';

import FormField from './FormField';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import MultiSelectChips from './MultiSelectChips';
import RadioCardGroup from './RadioCardGroup';
import {
  tripFormSchema,
  type TripFormValues,
  CURRENCY_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
  INTEREST_OPTIONS,
  ACCOMMODATION_OPTIONS,
  TRANSPORTATION_OPTIONS,
} from './tripFormSchema';

// ── AI Response Types — must mirror the Gemini JSON schema ──

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

interface AIItineraryDay {
  day: number;
  date?: string;
  title: string;
  description?: string;
  accommodation?: AIAccommodation;
  activities: AIActivity[];
  dailyCostEstimate?: string;
  notes?: string;
}

interface AIEstimatedBudget {
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

interface AIBestTime {
  recommended?: string;
  reason?: string;
  avoid?: string;
}

interface AILocalFood {
  name: string;
  description?: string;
  where?: string;
  estimatedCostPerPerson?: string;
}

interface AITransportation {
  arrival?: string;
  localTransit?: string;
  departure?: string;
  tips?: string;
}

interface AITripResponse {
  title: string;
  summary: string;
  durationDays?: number;
  estimatedBudget: AIEstimatedBudget;
  bestTime: AIBestTime;
  transportation?: AITransportation;
  localFoods?: AILocalFood[];
  packingTips: string[];
  itinerary: AIItineraryDay[];
}

export default function TripPlannerForm() {
  const router = useRouter();
  const [generatedItinerary, setGeneratedItinerary] = useState<AITripResponse | null>(null);
  const [formData, setFormData] = useState<TripFormValues | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Initializing Gemini AI engine...',
    'Analyzing destination highlights and geography...',
    'Allocating budget smart-rules...',
    'Assembling days and optimizing routes...',
    'Injecting interests and travel preferences...',
    'Polishing final itinerary and packing checklists...',
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema) as unknown as Resolver<TripFormValues>,
    defaultValues: {
      destination: '',
      startDate: '',
      endDate: '',
      budget: undefined,
      currency: 'USD',
      travelers: 1,
      travelStyle: undefined,
      interests: [],
      accommodation: '',
      transportation: '',
      notes: '',
    },
  });

  // Cycle loading messages during API request
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loadingMessageIndex < loadingMessages.length - 1) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => prev + 1);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loadingMessageIndex, loadingMessages.length]);

  // ── TanStack Query Mutation for AI Generation ──
  const generateMutation = useMutation({
    mutationFn: async (values: TripFormValues) => {
      setLoadingMessageIndex(0);
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${serverUrl}/api/ai/generate-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 'Failed to generate itinerary. Please try again.'
        );
      }

      const data = await response.json();
      return data.data as AITripResponse;
    },
    onSuccess: (data, variables) => {
      setGeneratedItinerary(data);
      setFormData(variables);
      setActiveDayTab(1);
    },
  });

  // ── TanStack Query Mutation for Saving Trip ──
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!generatedItinerary || !formData) return;

      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Calculate duration
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Transform AI response to backend Trip schema
      const payload = {
        title: generatedItinerary.title,
        description: generatedItinerary.summary,
        destination: {
          name: formData.destination,
          country: 'Unknown', // To be updated/resolved on server or explore page
          city: formData.destination,
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        durationDays,
        budget: formData.budget,
        currency: formData.currency,
        travelers: formData.travelers,
        aiGenerated: true,
        itinerary: generatedItinerary.itinerary.map((day) => ({
          day: day.day,
          title: day.title,
          activities: day.activities,
          notes: day.description,
        })),
        tags: formData.interests,
        status: 'planned',
      };

      const response = await fetch(`${serverUrl}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save trip.');
      }

      return response.json();
    },
    onSuccess: () => {
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/trips');
      }, 1500);
    },
  });

  const onSubmit = (data: TripFormValues) => {
    generateMutation.mutate(data);
  };

  const handleResetAll = () => {
    setGeneratedItinerary(null);
    setFormData(null);
    setSaveSuccess(false);
    reset();
  };

  const today = new Date().toISOString().split('T')[0];

  // ── Render Loading Screen ──
  if (generateMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 space-y-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border-4 border-violet-500/10 animate-ping" />
          <div className="w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Compass className="w-10 h-10 animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Generating Your AI Itinerary</h3>
          <p className="text-sm text-slate-400 max-w-sm transition-all duration-300">
            {loadingMessages[loadingMessageIndex]}
          </p>
        </div>

        <div className="w-full max-w-xs bg-white/5 border border-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((loadingMessageIndex + 1) / loadingMessages.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ── Render Error Screen ──
  if (generateMutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Generation Failed</h3>
          <p className="text-sm text-slate-400 max-w-md">
            {generateMutation.error?.message || 'Something went wrong while designing your plan.'}
          </p>
        </div>
        <button
          onClick={() => generateMutation.reset()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Render Generated Itinerary Dashboard ──
  if (generatedItinerary) {
    const activeDayData = generatedItinerary.itinerary.find((d) => d.day === activeDayTab);

    return (
      <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
        {/* Header Summary */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              {generatedItinerary.title}
            </h2>
            <div className="inline-flex gap-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New Trip
              </button>
              <button
                type="button"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || saveSuccess}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_2px_10px_rgba(139,92,246,0.3)] hover:scale-[1.01] text-white transition disabled:opacity-60 cursor-pointer"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    Save Trip
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{generatedItinerary.summary}</p>
        </div>

        {/* Success toast notification */}
        {saveSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 animate-[slide-down_0.2s_ease-out]">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm font-medium">Trip saved successfully! Redirecting to My Trips...</div>
          </div>
        )}

        {/* Grid Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Budget Details</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {generatedItinerary.estimatedBudget?.total || `${formData?.currency} ${formData?.budget}`}
              </div>
              {generatedItinerary.estimatedBudget?.perDay && (
                <div className="text-xs text-slate-400 mt-0.5">{generatedItinerary.estimatedBudget.perDay}/day</div>
              )}
              {generatedItinerary.estimatedBudget?.perPersonPerDay && (
                <div className="text-xs text-slate-400">{generatedItinerary.estimatedBudget.perPersonPerDay}/person/day</div>
              )}
            </div>
          </div>

          {/* Best Time */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <CloudSun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Best Time to Visit</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {generatedItinerary.bestTime?.recommended || '—'}
              </div>
              {generatedItinerary.bestTime?.reason && (
                <div className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{generatedItinerary.bestTime.reason}</div>
              )}
            </div>
          </div>

          {/* Travelers */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <Users className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Travelers &amp; Style</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {formData?.travelers} {formData?.travelers === 1 ? 'Traveler' : 'Travelers'}
              </div>
              <div className="text-xs text-slate-400 mt-1 capitalize">{formData?.travelStyle} style</div>
            </div>
          </div>
        </div>

        {/* Day-by-Day Itinerary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Day Selector Side-Menu */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {generatedItinerary.itinerary.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDayTab(d.day)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 text-left
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

          {/* Active Day Content */}
          <div className="lg:col-span-9 p-6 rounded-2xl bg-white/5 border border-white/10 min-h-[300px]">
            {activeDayData ? (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Day {activeDayData.day} Plan
                  </div>
                  <h3 className="text-xl font-bold text-white mt-3">{activeDayData.title}</h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{activeDayData.description}</p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Activities</h4>
                  <ul className="space-y-4">
                    {activeDayData.activities.map((act, index) => (
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
              <div className="text-center text-slate-400 py-12">Select a day tab to view activity plans.</div>
            )}
          </div>
        </div>

        {/* Packing Checklist */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            AI Packing Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {generatedItinerary.packingTips.map((tip, index) => (
              <div key={index} className="flex gap-2.5 items-start text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render standard planner form ──
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      {/* ───────────────────── Section 1 — Where & When ───────────────────── */}
      <fieldset className="space-y-6">
        <legend className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <MapPin className="w-5 h-5 text-violet-400" />
          Destination & Dates
        </legend>

        <FormField label="Destination" htmlFor="destination" error={errors.destination?.message} required>
          <GlassInput
            id="destination"
            placeholder="e.g. Paris, Tokyo, Bali..."
            hasError={!!errors.destination}
            {...register('destination')}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Start Date" htmlFor="startDate" error={errors.startDate?.message} required>
            <GlassInput
              id="startDate"
              type="date"
              min={today}
              hasError={!!errors.startDate}
              className="[color-scheme:dark]"
              {...register('startDate')}
            />
          </FormField>

          <FormField label="End Date" htmlFor="endDate" error={errors.endDate?.message} required>
            <GlassInput
              id="endDate"
              type="date"
              min={today}
              hasError={!!errors.endDate}
              className="[color-scheme:dark]"
              {...register('endDate')}
            />
          </FormField>
        </div>
      </fieldset>

      <hr className="border-white/5" />

      {/* ───────────────────── Section 2 — Budget & Travelers ───────────────────── */}
      <fieldset className="space-y-6">
        <legend className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          Budget & Travelers
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Budget" htmlFor="budget" error={errors.budget?.message} required>
            <GlassInput
              id="budget"
              type="number"
              placeholder="5000"
              min={1}
              hasError={!!errors.budget}
              {...register('budget')}
            />
          </FormField>

          <FormField label="Currency" htmlFor="currency" error={errors.currency?.message} required>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <GlassSelect
                  id="currency"
                  options={CURRENCY_OPTIONS}
                  hasError={!!errors.currency}
                  {...field}
                />
              )}
            />
          </FormField>

          <FormField label="Travelers" htmlFor="travelers" error={errors.travelers?.message} required>
            <GlassInput
              id="travelers"
              type="number"
              placeholder="2"
              min={1}
              max={50}
              hasError={!!errors.travelers}
              {...register('travelers')}
            />
          </FormField>
        </div>
      </fieldset>

      <hr className="border-white/5" />

      {/* ───────────────────── Section 3 — Travel Style ───────────────────── */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <Users className="w-5 h-5 text-amber-400" />
          Travel Style
        </legend>

        <FormField label="Choose your travel style" htmlFor="travelStyle" error={errors.travelStyle?.message} required>
          <Controller
            name="travelStyle"
            control={control}
            render={({ field }) => (
              <RadioCardGroup
                name="travelStyle"
                options={TRAVEL_STYLE_OPTIONS}
                value={field.value ?? ''}
                onChange={field.onChange}
                hasError={!!errors.travelStyle}
              />
            )}
          />
        </FormField>
      </fieldset>

      <hr className="border-white/5" />

      {/* ───────────────────── Section 4 — Interests ───────────────────── */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          Interests
        </legend>

        <FormField label="What are you interested in?" htmlFor="interests" error={errors.interests?.message} required>
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <MultiSelectChips
                options={INTEREST_OPTIONS}
                selected={field.value}
                onChange={field.onChange}
                hasError={!!errors.interests}
              />
            )}
          />
        </FormField>
      </fieldset>

      <hr className="border-white/5" />

      {/* ───────────────────── Section 5 — Preferences ───────────────────── */}
      <fieldset className="space-y-6">
        <legend className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <Plane className="w-5 h-5 text-sky-400" />
          Preferences
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Accommodation" htmlFor="accommodation" error={errors.accommodation?.message} required>
            <Controller
              name="accommodation"
              control={control}
              render={({ field }) => (
                <GlassSelect
                  id="accommodation"
                  placeholder="Select accommodation"
                  options={ACCOMMODATION_OPTIONS}
                  hasError={!!errors.accommodation}
                  {...field}
                />
              )}
            />
          </FormField>

          <FormField label="Transportation" htmlFor="transportation" error={errors.transportation?.message} required>
            <Controller
              name="transportation"
              control={control}
              render={({ field }) => (
                <GlassSelect
                  id="transportation"
                  placeholder="Select transportation"
                  options={TRANSPORTATION_OPTIONS}
                  hasError={!!errors.transportation}
                  {...field}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Additional Notes" htmlFor="notes" error={errors.notes?.message}>
          <GlassTextarea
            id="notes"
            placeholder="Any special requests, dietary restrictions, accessibility needs..."
            hasError={!!errors.notes}
            {...register('notes')}
          />
        </FormField>
      </fieldset>

      <hr className="border-white/5" />

      {/* ───────────────────── Buttons ───────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="submit"
          className="
            flex-1 inline-flex items-center justify-center gap-2
            px-8 py-3.5 rounded-xl text-base font-semibold text-white
            bg-gradient-to-br from-violet-600 to-indigo-600
            shadow-[0_4px_20px_rgba(139,92,246,0.35)]
            hover:shadow-[0_6px_28px_rgba(139,92,246,0.5)] hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <Sparkles className="w-5 h-5" />
          Generate AI Trip
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="
            inline-flex items-center justify-center gap-2
            px-8 py-3.5 rounded-xl text-base font-medium text-slate-400
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:text-white hover:border-white/20
            active:scale-[0.98]
            transition-all duration-200
            cursor-pointer
          "
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </form>
  );
}
