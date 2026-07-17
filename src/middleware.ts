import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that do NOT require authentication
const PUBLIC_PATHS = ['/login', '/register'];

// Paths that require authentication — extend this list as you add pages
// Currently we protect everything except public paths and Next.js internals
const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/trips', '/items/add'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all Next.js internals and static files through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verify session by calling the Express backend
  try {
    const sessionUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/auth/get-session`;

    const sessionRes = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    });

    const session = await sessionRes.json();

    if (!session?.user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // If backend is unreachable, redirect to login to be safe
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
