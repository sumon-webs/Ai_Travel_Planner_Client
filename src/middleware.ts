import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public-only paths (redirect to home if already authenticated)
const AUTH_ONLY_PATHS = ['/login', '/register'];

// Paths that require authentication — extend as you add protected pages
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/trips',
  '/items/add',
  '/items/manage',
];

async function getSession(request: NextRequest) {
  try {
    const sessionUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/auth/get-session`;
    const sessionRes = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      credentials: 'include',
    });
    return await sessionRes.json();
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all Next.js internals and static files through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth-callback') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthOnlyRoute = AUTH_ONLY_PATHS.includes(pathname);

  // Fast-path: neither protected nor auth-only — let through
  if (!isProtectedRoute && !isAuthOnlyRoute) {
    return NextResponse.next();
  }

  const session = await getSession(request);
  const isLoggedIn = !!session?.user;

  // ── Protected route — redirect to login if not authenticated ──
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth-only route — redirect to home if already authenticated ──
  if (isAuthOnlyRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
