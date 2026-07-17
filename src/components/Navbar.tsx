'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@heroui/react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Plan Trip', href: '/plan-trip' },
  { label: 'My Trips', href: '/trips' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect scroll to add backdrop blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a14]/72 border-b border-transparent transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.35)]' : ''
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center gap-8">
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
                      <span className="w-1.25 h-1.25 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa] animate-[dot-pop_0.3s_ease-out_both]" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3 ml-auto">
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" aria-hidden />
            ) : user ? (
              /* ── Avatar + Custom Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  id="navbar-avatar-btn"
                  className="relative w-[38px] h-[38px] rounded-full border-2 border-violet-500/60 bg-gradient-to-br from-[#4c1d95] to-[#1e1b4b] cursor-pointer overflow-hidden flex items-center justify-center transition-all hover:border-violet-500 hover:scale-105 hover:shadow-[0_0_0_3px_rgba(139,92,246,0.3)] focus:outline-none"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                  title={user.name ?? user.email}
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name ?? 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[13px] font-bold text-white tracking-wide pointer-events-none">{initials}</span>
                  )}
                  <span className="absolute bottom-0.5 right-0.5 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-[#0a0a14]" aria-hidden />
                </button>

                {/* Custom dropdown panel */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] w-56 z-50 bg-[#0f0c29]/96 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden animate-[slide-down_0.2s_ease-out_both]"
                    role="menu"
                    aria-label="User actions"
                  >
                    {/* Profile header */}
                    <div className="px-4 py-3.5 border-b border-white/8">
                      <p className="font-semibold text-[14px] text-white truncate">{user.name ?? 'Traveler'}</p>
                      <p className="text-[12px] text-white/50 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <Link
                        href="/trips"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-white/80 hover:text-white hover:bg-white/6 transition-colors no-underline"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>🗺️</span> My Trips
                      </Link>
                      <Link
                        href="/favorites"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-white/80 hover:text-white hover:bg-white/6 transition-colors no-underline"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>❤️</span> Favorites
                      </Link>
                      <Link
                        href="/profile"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-white/80 hover:text-white hover:bg-white/6 transition-colors no-underline border-b border-white/8"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>⚙️</span> Settings
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div className="py-1.5">
                      <button
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="px-4 py-1.5 h-auto min-w-0 rounded-lg text-[14px] font-medium text-white/80 border-white/15 hover:bg-white/8 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="px-4 py-1.5 h-auto min-w-0 rounded-lg text-[14px] font-semibold text-white bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_2px_12px_rgba(139,92,246,0.4)] hover:opacity-90 hover:scale-[1.01] hover:shadow-[0_4px_18px_rgba(139,92,246,0.55)] transition-all cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* ── Mobile Hamburger ── */}
            <button
              id="navbar-menu-toggle"
              className="flex md:hidden flex-col justify-center gap-1.25 w-9 h-9 p-1.5 bg-white/6 border border-white/10 rounded-lg cursor-pointer transition-colors hover:bg-white/12"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-transform duration-300 origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-all duration-300 origin-center ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-sm transition-transform duration-300 origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-40 bg-[#0a081e]/97 backdrop-blur-xl border-t border-white/7 p-4 md:hidden animate-[slide-down_0.25s_ease-out_both]" role="navigation" aria-label="Mobile navigation">
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
            {!user && !isPending && (
              <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-white/7">
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-2.5 rounded-lg text-[16px] font-medium text-white/80 border-white/15 hover:bg-white/8 hover:text-white transition-all cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button
                    className="w-full py-2.5 rounded-lg text-[16px] font-semibold text-white bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_2px_12px_rgba(139,92,246,0.4)] hover:opacity-90 transition-all cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16" aria-hidden />
    </>
  );
}
