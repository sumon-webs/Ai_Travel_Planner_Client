'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@heroui/react';
import {
  User, Mail, Calendar, MapPin, LogOut,
  Plane, Bookmark, Shield, Globe,
} from 'lucide-react';

interface TripStats {
  total: number;
  saved: number;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const user = session?.user;

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isPending && !user) {
      router.push('/login');
    }
  }, [isPending, user, router]);

  // Fetch user's trip count
  const { data: tripsData } = useQuery<{ data: TripStats }>({
    queryKey: ['profileTrips', user?.id],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/api/trips`, { credentials: 'include' });
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
    enabled: !!user,
  });

  const stats = tripsData?.data ?? { total: 0, saved: 0 };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  // Determine provider
  const getProvider = () => {
    if (!session) return 'Credentials';
    // Better Auth stores accounts info; we infer from email patterns or image source
    const image = user?.image || '';
    if (image.includes('googleusercontent') || image.includes('google')) return 'Google';
    return 'Email & Password';
  };

  const provider = getProvider();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (isPending) {
    return (
      <main className="relative min-h-screen bg-[#0a081a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500/40 border-t-violet-400 rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    return null;
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
                {provider === 'Google' ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ) : (
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <h2 className="text-[20px] font-bold text-white">{user.name}</h2>
              <p className="text-sm text-white/50 mt-0.5">Traveler</p>
            </div>

            {/* Provider badge */}
            <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs font-medium text-violet-300 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {provider}
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="mt-2 w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
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
                  { label: 'Explore', href: '/explore', emoji: '🌍' },
                  { label: 'Add Destination', href: '/items/add', emoji: '📍' },
                  { label: 'My Destinations', href: '/items/manage', emoji: '📋' },
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
    </main>
  );
}
