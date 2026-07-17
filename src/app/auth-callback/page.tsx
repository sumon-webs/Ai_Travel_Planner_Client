'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const next = searchParams.get('next') || '/';

    if (session?.user) {
      router.replace(next);
      return;
    }

    // No session — redirect to login after brief grace period
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [session, isPending, router, searchParams]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#0a081a] flex flex-col items-center justify-center gap-4 text-white">
      <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      <p className="text-white/60 text-sm">Completing sign-in…</p>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
