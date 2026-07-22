'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { LogOut } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Plan Trip', href: '/plan-trip' },
  { label: 'My Trips', href: '/trips' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
  };

  const user = session?.user;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a14]/80 border-b border-transparent transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.35)]' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center gap-8">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 no-underline shrink-0 group" aria-label="AI Travel Planner Home">
            <span className="text-[22px] animate-[logo-float_3s_ease-in-out_infinite]">✈️</span>
            <span className="text-[18px] font-bold text-white tracking-tight">
              <span className="bg-gradient-to-br from-violet-500 to-[#38bdf8] bg-clip-text text-transparent">AI</span> Travel
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0 flex-1" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[15px] font-medium transition-colors hover:text-white hover:bg-white/6 no-underline ${
                      isActive ? 'text-violet-400' : 'text-white/82'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              /* ── Authenticated User ── */
              <>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full border border-violet-500/60 bg-gradient-to-br from-[#4c1d95] to-[#1e1b4b] overflow-hidden flex items-center justify-center shrink-0">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[12px] font-bold text-white">{initials}</span>
                  )}
                </div>
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </>
            ) : (
              /* ── Auth Buttons (Desktop) ── */
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="px-4 py-1.5 text-white/80 border-white/15 hover:bg-white/8 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all text-sm font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* ── Mobile Hamburger ── */}
            <button
              id="navbar-menu-toggle"
              className="flex md:hidden flex-col justify-center gap-1.5 w-9 h-9 p-1.5 bg-white/6 border border-white/10 rounded-lg cursor-pointer transition-colors hover:bg-white/12"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-transform duration-300 origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-transform duration-300 origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-40 bg-[#0a081e]/97 backdrop-blur-xl border-t border-white/7 p-4 md:hidden" role="navigation" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block py-3 px-4 rounded-lg text-[16px] font-medium no-underline transition-colors ${
                        isActive ? 'text-[#a78bfa] bg-[#8b5cf6]/10' : 'text-white/80 hover:bg-white/7 hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 pt-4 border-t border-white/7 flex flex-col gap-1">
              {user ? (
                <>
                  {/* Authenticated User Info */}
                  <div className="px-4 py-2 mb-2">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-white/50 text-xs">{user.email}</p>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] text-red-400 hover:bg-white/7 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </>
              ) : (
                /* Auth Buttons (Mobile) */
                <div className="flex flex-col gap-2 mb-4">
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full py-2.5 text-white/80 border-white/15 hover:bg-white/8 hover:text-white transition-all text-sm font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all text-sm font-medium"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" aria-hidden />
    </>
  );
}
