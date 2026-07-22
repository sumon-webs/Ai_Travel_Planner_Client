'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input } from '@heroui/react';
import {
  User, Mail, Calendar, MapPin,
  Plane, Bookmark, Shield, Globe,
  Edit2, X, Loader2, CheckCircle,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface TripStats {
  total: number;
  saved: number;
}

// Zod schema for profile update validation
const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect to login if not authenticated
  if (!isPending && !session) {
    router.push('/login');
    return null;
  }

  const user = session?.user;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';
  const provider = 'Email';
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateForm) => {
      const response = await fetch(`${serverUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      // Refresh session data
      queryClient.invalidateQueries({ queryKey: ['session'] });
      setIsEditModalOpen(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: Error) => {
      console.error('Profile update error:', error);
      alert(error.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileUpdateForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleEditClick = () => {
    reset({
      name: user?.name || '',
      image: user?.image || '',
    });
    setIsEditModalOpen(true);
  };

  // Fetch user's trip count
  const { data: tripsData } = useQuery<{ data: TripStats }>({
    queryKey: ['userTrips', user?.id],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/trips?userId=${user?.id}`, {
        credentials: 'include',
      });
      if (!res.ok) return { data: { total: 0, saved: 0 } };
      const json = await res.json();
      const trips = Array.isArray(json?.data) ? json.data : [];
      return {
        data: {
          total: trips.length,
          saved: trips.filter((t: any) => t.saved || t.isSaved).length,
        },
      };
    },
    enabled: !!user?.id,
  });

  const stats = tripsData?.data ?? { total: 0, saved: 0 };

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-[#0a081a] flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden py-12 px-4 sm:px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/10 to-blue-600/10 blur-[100px] opacity-15" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto pb-16">
        {/* Page title */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          My{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Profile</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Avatar + identity card ── */}
          <Card className="lg:col-span-1 bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-violet-500/30 transition-colors">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? 'Profile'}
                  className="w-24 h-24 rounded-full border-2 border-violet-500/50 object-cover shadow-[0_0_24px_rgba(139,92,246,0.3)]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-violet-500/50 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.3)]">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
              {/* Provider badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0a081a] border border-violet-500/50 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>

            {/* Name */}
            <div>
              <h2 className="text-[20px] font-bold text-white">{user.name}</h2>
              <p className="text-sm text-white/50 mt-0.5">Traveler</p>
            </div>

            {/* Edit Profile Button */}
            <Button
              onPress={handleEditClick}
              className="bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all text-sm font-medium"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>

            {/* Provider badge */}
            <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs font-medium text-violet-300 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {provider}
            </div>
          </Card>

          {/* ── Right: Info + Stats ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Account Info Card */}
            <Card className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <h3 className="text-[15px] font-bold text-white mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-400" />
                Account Information
              </h3>
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Full Name</p>
                    <p className="text-[14px] font-medium text-white truncate">{user.name || '—'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Email</p>
                    <p className="text-[14px] font-medium text-white truncate">{user.email || '—'}</p>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Account Provider</p>
                    <p className="text-[14px] font-medium text-white">{provider}</p>
                  </div>
                </div>

                {/* Joined date */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Member Since</p>
                    <p className="text-[14px] font-medium text-white">{joinedDate}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Travel Stats Card */}
            <Card className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <h3 className="text-[15px] font-bold text-white mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-400" />
                Travel Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Total Trips */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mb-1">{stats.total}</p>
                  <p className="text-[12px] text-white/50 font-medium">Total Trips</p>
                </div>

                {/* Saved Trips */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-sky-600/10 to-blue-600/10 border border-sky-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-5 h-5 text-sky-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mb-1">{stats.saved}</p>
                  <p className="text-[12px] text-white/50 font-medium">Saved Trips</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
                ⚡ Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Plan a Trip', href: '/plan-trip', emoji: '🗺️' },
                  { label: 'My Trips', href: '/trips', emoji: '✈️' },
                ].map(({ label, href, emoji }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all text-center no-underline group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                    <span className="text-[12px] font-medium text-white/70 group-hover:text-white transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f0c29]/95 border border-white/10 p-6 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Full Name
                </label>
                <Input
                  {...register('name')}
                  placeholder="Enter your name"
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Profile Picture URL
                </label>
                <Input
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.image && (
                  <p className="text-xs text-red-400 mt-1">{errors.image.message}</p>
                )}
                <p className="text-xs text-white/40 mt-1">
                  Leave empty to remove profile picture
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onPress={() => setIsEditModalOpen(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-right">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}
    </main>
  );
}
