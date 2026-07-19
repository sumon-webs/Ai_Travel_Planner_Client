'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@heroui/react';
import { ChevronDown, LayoutDashboard, MapPin, ListChecks, Settings, LogOut, Plus } from 'lucide-react';

const PUBLIC_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'About', href: '/about' },
];

const AUTH_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Plan Trip', href: '/plan-trip' },
  { label: 'My Trips', href: '/trips' },
];

const DASHBOARD_ITEMS = [
  { label: 'Add Destination', href: '/items/add', icon: Plus, description: 'Publish a new location' },
  { label: 'Manage Destinations', href: '/items/manage', icon: ListChecks, description: 'Edit or remove your listings' },
  { label: 'Profile', href: '/profile', icon: Settings, description: 'Account settings' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target as Node)) {
        setDashboardOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDashboardOpen(false);
  }, [pathname]);

  const user = session?.user;
  const initials = user ? '?' : session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSignOut = async () => {
    await signOut();
    setDashboardOpen(false);
  };

  const navLinks = user ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;

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
            {navLinks.map(({ label, href }) => {
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
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" aria-hidden />
            ) : user ? (
              /* ── Dashboard Dropdown ── */
              <div className="relative" ref={dashboardRef}>
                <button
                  id="navbar-dashboard-btn"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/40 transition-all cursor-pointer"
                  onClick={() => setDashboardOpen((v) => !v)}
                  aria-expanded={dashboardOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full border border-violet-500/60 bg-gradient-to-br from-[#4c1d95] to-[#1e1b4b] overflow-hidden flex items-center justify-center shrink-0">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name ?? 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-white">{initials}</span>
                    )}
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[14px] font-medium text-white/90">Dashboard</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${dashboardOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dashboard Dropdown Panel */}
                {dashboardOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] w-64 z-50 bg-[#0f0c29]/96 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden animate-[slide-down_0.2s_ease-out_both]"
                    role="menu"
                  >
                    {/* Profile Header */}
                    <div className="px-4 py-3.5 border-b border-white/8">
                      <p className="font-semibold text-[14px] text-white truncate">{user.name ?? 'Traveler'}</p>
                      <p className="text-[12px] text-white/50 truncate">{user.email}</p>
                    </div>

                    {/* Dashboard Menu Items */}
                    <div className="py-1.5">
                      {DASHBOARD_ITEMS.map(({ label, href, icon: Icon, description }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/6 transition-colors no-underline group"
                          onClick={() => setDashboardOpen(false)}
                        >
                          <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-500/25 transition-colors">
                            <Icon className="w-3.5 h-3.5 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-white/90">{label}</p>
                            <p className="text-[11px] text-white/40">{description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-white/8 py-1.5">
                      <button
                        role="menuitem"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
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
                    className="px-4 py-1.5 h-auto min-w-0 rounded-lg text-[14px] font-semibold text-white bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_2px_12px_rgba(139,92,246,0.4)] hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    Get Started
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
              {navLinks.map(({ label, href }) => {
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

            {user ? (
              <div className="mt-4 pt-4 border-t border-white/7 flex flex-col gap-1">
                <p className="text-xs text-white/40 px-4 uppercase tracking-wider font-semibold mb-1">Dashboard</p>
                {DASHBOARD_ITEMS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] text-white/80 hover:bg-white/7 hover:text-white no-underline transition-colors"
                  >
                    <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                    {label}
                  </Link>
                ))}
                <button
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer mt-1"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-white/7">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full py-2.5 rounded-lg text-[16px] font-medium text-white/80 border-white/15 hover:bg-white/8 hover:text-white transition-all cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full py-2.5 rounded-lg text-[16px] font-semibold text-white bg-gradient-to-br from-violet-600 to-indigo-600 hover:opacity-90 transition-all cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" aria-hidden />
    </>
  );
}
