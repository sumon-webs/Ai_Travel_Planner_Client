'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';
import {
  AtSign,
  Globe,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const QUICK_LINKS: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Plan Trip', href: '/plan-trip' },
  { label: 'About', href: '/about' },
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: 'Help Center', href: '/about' },
  { label: 'Contact Us', href: '/about' },
  { label: 'Privacy Policy', href: '/about' },
  { label: 'Terms of Service', href: '/about' },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com', icon: AtSign },
  { label: 'Instagram', href: 'https://instagram.com', icon: Share2 },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Globe },
  { label: 'GitHub', href: 'https://github.com', icon: MessageCircle },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden bg-slate-950 border-t border-white/10 px-6 py-16 lg:py-20 text-white"
      aria-labelledby="footer-heading"
    >
      {/* Background blobs — matching homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 no-underline group"
              aria-label="AI Travel Planner Home"
            >
              <span className="text-[22px]">✈️</span>
              <span className="text-[18px] font-bold text-white tracking-tight">
                <span className="bg-gradient-to-br from-violet-500 to-sky-400 bg-clip-text text-transparent">
                  AI
                </span>{' '}
                Travel
              </span>
            </Link>

            <p
              id="footer-heading"
              className="text-sm text-slate-400 leading-relaxed max-w-xs"
            >
              Plan smarter trips with AI-powered itineraries, budget tools, and
              personalized recommendations — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 list-none m-0 p-0">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support links">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Support
            </h3>
            <ul className="space-y-3 list-none m-0 p-0">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Follow Us
            </h3>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              Stay updated with travel tips, AI features, and destination inspiration.
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-block"
                >
                  <Button
                    isIconOnly
                    className="
                      min-w-10 w-10 h-10
                      rounded-xl
                      bg-white/5 border border-white/10
                      text-slate-400
                      hover:bg-white/10 hover:border-violet-500/40 hover:text-violet-300
                      transition-all duration-300
                      hover:scale-105
                    "
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            © {currentYear} AI Travel Planner. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with AI for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
