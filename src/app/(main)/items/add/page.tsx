'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Input,
  TextArea,
  Select,
  Label,
  ListBox,
  ListBoxItem,
  Button,
  TextField,
  FieldError,
} from '@heroui/react';
import {
  Compass,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  Clock,
} from 'lucide-react';

// Form validation schema using Zod
const destinationSchema = z.object({
  name: z.string().min(1, 'Destination Name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  shortDescription: z
    .string()
    .min(1, 'Short Description is required')
    .max(300, 'Short Description must be 300 characters or less'),
  description: z.string().min(1, 'Full Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  durationDays: z.coerce
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day'),
  category: z.string().min(1, 'Category is required'),
  bestSeason: z.string().min(1, 'Best Season is required'),
  rating: z.coerce
    .number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  coverImage: z.string().url('Please enter a valid cover image URL'),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

const CATEGORIES = [
  'Adventure',
  'Cultural',
  'Beach & Coast',
  'Nature & Wildlife',
  'City Break',
  'Luxury Escape',
  'Budget Travel',
  'Family Friendly',
  'Solo Travel',
  'Romantic Getaway',
];

const SEASONS = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'Monsoon',
  'Dry Season',
  'Wet Season',
  'Year-round',
];

const RATINGS = ['1', '2', '3', '4', '5'];

export default function AddDestinationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(['']);

  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema) as unknown as Resolver<DestinationFormValues>,
    defaultValues: {
      name: '',
      country: '',
      city: '',
      shortDescription: '',
      description: '',
      price: undefined,
      durationDays: undefined,
      category: '',
      bestSeason: '',
      rating: undefined,
      coverImage: '',
    },
  });

  const addGalleryField = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const removeGalleryField = (index: number) => {
    const updated = galleryImages.filter((_, idx) => idx !== index);
    setGalleryImages(updated.length > 0 ? updated : ['']);
  };

  const handleGalleryChange = (index: number, value: string) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  const onSubmit = async (data: DestinationFormValues) => {
    setLoading(true);
    setError('');

    // Filter out empty gallery image fields
    const filteredGallery = galleryImages
      .map((url) => url.trim())
      .filter((url) => url !== '');

    try {
      const response = await fetch(`${serverUrl}/api/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          galleryImages: filteredGallery,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add destination');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/explore');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 blur-[120px] opacity-35 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/20 to-blue-600/20 blur-[100px] opacity-30 animate-[pulse_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-800/15 to-pink-600/15 blur-[140px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl pt-8 pb-16">
        {/* ── Header ── */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm backdrop-blur-md text-violet-300">
            <Compass className="w-4 h-4 animate-spin-slow text-violet-400" />
            <span>Admin Portal</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Add New{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Travel Destination
            </span>
          </h1>

          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Feature an exciting new location for travelers around the world. Fill out the details below to publish.
          </p>
        </div>

        {/* ── Toast Notifications ── */}
        <div className="max-w-2xl mx-auto mb-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 animate-[shake_0.3s_ease-out]" role="alert">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-[slide-down_0.2s_ease-out]">
              <CheckCircle className="w-5 h-5 shrink-0 animate-bounce" />
              <div className="text-sm font-medium">Destination saved successfully! Redirecting to Explore...</div>
            </div>
          )}
        </div>

        {/* ── Glassmorphism Form Card ── */}
        <div className="relative rounded-2xl p-[1px] max-w-3xl mx-auto shadow-2xl">
          {/* Gradient border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/20" />

          {/* Glassmorphism body */}
          <div className="relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 sm:p-10">
            {/* Header info */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-white/10">
                <MapPin className="text-violet-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Location Details</h2>
                <p className="text-sm text-slate-500">Provide the core geographic and descriptive information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Grid 1: Name, Country, City */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <TextField isInvalid={!!errors.name} className="flex flex-col w-full">
                    <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Destination Name</Label>
                    <Input
                      {...register('name')}
                      placeholder="e.g. Kyoto Temples"
                      className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white px-3 placeholder:text-white/30 text-sm outline-none"
                    />
                    <FieldError className="text-[12px] text-red-400 mt-1" />
                  </TextField>
                </div>
                <div>
                  <TextField isInvalid={!!errors.city} className="flex flex-col w-full">
                    <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">City</Label>
                    <Input
                      {...register('city')}
                      placeholder="e.g. Kyoto"
                      className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white px-3 placeholder:text-white/30 text-sm outline-none"
                    />
                    <FieldError className="text-[12px] text-red-400 mt-1" />
                  </TextField>
                </div>
                <div>
                  <TextField isInvalid={!!errors.country} className="flex flex-col w-full">
                    <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Country</Label>
                    <Input
                      {...register('country')}
                      placeholder="e.g. Japan"
                      className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white px-3 placeholder:text-white/30 text-sm outline-none"
                    />
                    <FieldError className="text-[12px] text-red-400 mt-1" />
                  </TextField>
                </div>
              </div>

              {/* Grid 2: Category, Best Season, Rating */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col w-full">
                        <Select
                          selectedKey={field.value || null}
                          onSelectionChange={(key) => {
                            field.onChange(key || '');
                          }}
                          placeholder="Select category"
                          className="w-full"
                        >
                          <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Category</Label>
                          <Select.Trigger
                            className={`bg-white/5 border hover:border-white/20 rounded-xl h-11 transition-all text-white flex items-center justify-between px-3 w-full ${
                              error ? 'border-red-500/50 focus-within:border-red-500' : 'border-white/10 focus-within:border-violet-500/60'
                            }`}
                          >
                            <Select.Value className="text-white text-sm" />
                            <Select.Indicator className="text-white/60" />
                          </Select.Trigger>
                          <Select.Popover className="bg-[#0d0a21] border border-white/10 text-white rounded-xl shadow-xl min-w-[200px]">
                            <ListBox className="p-1">
                              {CATEGORIES.map((cat) => (
                                <ListBoxItem
                                  key={cat}
                                  id={cat}
                                  textValue={cat}
                                  className="text-white hover:bg-violet-600/30 focus:bg-violet-600/30 rounded-lg p-2 cursor-pointer transition-colors text-sm"
                                >
                                  {cat}
                                </ListBoxItem>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                        {error && (
                          <span className="text-[12px] text-red-400 mt-1">{error.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="bestSeason"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col w-full">
                        <Select
                          selectedKey={field.value || null}
                          onSelectionChange={(key) => {
                            field.onChange(key || '');
                          }}
                          placeholder="Select season"
                          className="w-full"
                        >
                          <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Best Season</Label>
                          <Select.Trigger
                            className={`bg-white/5 border hover:border-white/20 rounded-xl h-11 transition-all text-white flex items-center justify-between px-3 w-full ${
                              error ? 'border-red-500/50 focus-within:border-red-500' : 'border-white/10 focus-within:border-violet-500/60'
                            }`}
                          >
                            <Select.Value className="text-white text-sm" />
                            <Select.Indicator className="text-white/60" />
                          </Select.Trigger>
                          <Select.Popover className="bg-[#0d0a21] border border-white/10 text-white rounded-xl shadow-xl min-w-[200px]">
                            <ListBox className="p-1">
                              {SEASONS.map((season) => (
                                <ListBoxItem
                                  key={season}
                                  id={season}
                                  textValue={season}
                                  className="text-white hover:bg-violet-600/30 focus:bg-violet-600/30 rounded-lg p-2 cursor-pointer transition-colors text-sm"
                                >
                                  {season}
                                </ListBoxItem>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                        {error && (
                          <span className="text-[12px] text-red-400 mt-1">{error.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col w-full">
                        <Select
                          selectedKey={field.value ? field.value.toString() : null}
                          onSelectionChange={(key) => {
                            field.onChange(key ? Number(key) : undefined);
                          }}
                          placeholder="Select rating"
                          className="w-full"
                        >
                          <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Rating</Label>
                          <Select.Trigger
                            className={`bg-white/5 border hover:border-white/20 rounded-xl h-11 transition-all text-white flex items-center justify-between px-3 w-full ${
                              error ? 'border-red-500/50 focus-within:border-red-500' : 'border-white/10 focus-within:border-violet-500/60'
                            }`}
                          >
                            <Select.Value className="text-white text-sm" />
                            <Select.Indicator className="text-white/60" />
                          </Select.Trigger>
                          <Select.Popover className="bg-[#0d0a21] border border-white/10 text-white rounded-xl shadow-xl min-w-[200px]">
                            <ListBox className="p-1">
                              {RATINGS.map((ratingVal) => (
                                <ListBoxItem
                                  key={ratingVal}
                                  id={ratingVal}
                                  textValue={`${ratingVal} Stars`}
                                  className="text-white hover:bg-violet-600/30 focus:bg-violet-600/30 rounded-lg p-2 cursor-pointer transition-colors text-sm"
                                >
                                  {ratingVal} Stars
                                </ListBoxItem>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                        {error && (
                          <span className="text-[12px] text-red-400 mt-1">{error.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Grid 3: Price, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <TextField isInvalid={!!errors.price} className="flex flex-col w-full">
                    <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Price ($)</Label>
                    <div className="relative flex items-center">
                      <DollarSign className="absolute left-3 w-4 h-4 text-violet-400 pointer-events-none" />
                      <Input
                        {...register('price')}
                        type="number"
                        placeholder="e.g. 1500"
                        className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white pl-10 pr-3 w-full placeholder:text-white/30 text-sm outline-none"
                      />
                    </div>
                    <FieldError className="text-[12px] text-red-400 mt-1" />
                  </TextField>
                </div>
                <div>
                  <TextField isInvalid={!!errors.durationDays} className="flex flex-col w-full">
                    <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Duration (Days)</Label>
                    <div className="relative flex items-center">
                      <Clock className="absolute left-3 w-4 h-4 text-violet-400 pointer-events-none" />
                      <Input
                        {...register('durationDays')}
                        type="number"
                        placeholder="e.g. 7"
                        className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white pl-10 pr-3 w-full placeholder:text-white/30 text-sm outline-none"
                      />
                    </div>
                    <FieldError className="text-[12px] text-red-400 mt-1" />
                  </TextField>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <TextField isInvalid={!!errors.shortDescription} className="flex flex-col w-full">
                  <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Short Description</Label>
                  <TextArea
                    {...register('shortDescription')}
                    placeholder="Summarise the destination in a sentence or two (max 300 characters)..."
                    className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl transition-all text-white px-3 py-2 placeholder:text-white/30 text-sm outline-none resize-y min-h-[70px]"
                  />
                  <FieldError className="text-[12px] text-red-400 mt-1" />
                </TextField>
              </div>

              {/* Full Description */}
              <div>
                <TextField isInvalid={!!errors.description} className="flex flex-col w-full">
                  <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Full Description</Label>
                  <TextArea
                    {...register('description')}
                    placeholder="Provide a comprehensive guide, highlights, and history of the destination..."
                    className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl transition-all text-white px-3 py-2 placeholder:text-white/30 text-sm outline-none resize-y min-h-[140px]"
                  />
                  <FieldError className="text-[12px] text-red-400 mt-1" />
                </TextField>
              </div>

              {/* Cover Image URL */}
              <div>
                <TextField isInvalid={!!errors.coverImage} className="flex flex-col w-full">
                  <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">Cover Image URL</Label>
                  <div className="relative flex items-center">
                    <ImageIcon className="absolute left-3 w-4 h-4 text-violet-400 pointer-events-none" />
                    <Input
                      {...register('coverImage')}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white pl-10 pr-3 w-full placeholder:text-white/30 text-sm outline-none"
                    />
                  </div>
                  <FieldError className="text-[12px] text-red-400 mt-1" />
                </TextField>
              </div>

              {/* Dynamic Gallery Images */}
              <div className="space-y-3">
                <Label className="text-white/80 font-medium text-[13px] mb-1.5 block">
                  Gallery Image URLs (Optional)
                </Label>
                <div className="space-y-3">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="relative flex items-center flex-1">
                        <ImageIcon className="absolute left-3 w-4 h-4 text-violet-400 pointer-events-none" />
                        <Input
                          placeholder="https://images.unsplash.com/photo-..."
                          value={url}
                          onChange={(e) => handleGalleryChange(index, e.target.value)}
                          className="bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-violet-500/60 rounded-xl h-11 transition-all text-white pl-10 pr-3 w-full placeholder:text-white/30 text-sm outline-none"
                        />
                      </div>
                      <Button
                        isIconOnly
                        type="button"
                        variant="danger-soft"
                        onPress={() => removeGalleryField(index)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl h-11 w-11 min-w-0 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onPress={addGalleryField}
                  className="mt-2 text-violet-300 border-violet-500/30 hover:bg-violet-500/10 hover:text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Gallery Image URL
                </Button>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-white/5 flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onPress={() => router.push('/')}
                  className="bg-white/5 text-white/70 hover:bg-white/10 rounded-xl px-6 h-12"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 font-semibold text-white rounded-xl px-8 h-12 shadow-[0_4px_15px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
                  )}
                  {loading ? 'Creating...' : 'Create Destination'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
