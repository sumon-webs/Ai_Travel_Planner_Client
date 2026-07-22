'use client';

import { Card, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Wallet,
  Backpack,
  CloudSun,
  Gem,
  Bot,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI Personalized Itinerary',
    description:
      'Get a day-by-day plan tailored to your style, pace, and interests — crafted by AI in seconds.',
    gradient: 'from-purple-500/25 to-violet-600/10',
    iconBg: 'bg-gradient-to-br from-purple-500/30 to-violet-600/20 border-purple-400/30',
    iconColor: 'text-purple-300',
    glowColor: 'rgba(168,85,247,0.25)',
  },
  {
    icon: Wallet,
    title: 'Budget Optimization',
    description:
      'Stay on budget without sacrificing experiences. AI balances flights, stays, and activities smartly.',
    gradient: 'from-emerald-500/25 to-teal-600/10',
    iconBg: 'bg-gradient-to-br from-emerald-500/30 to-teal-600/20 border-emerald-400/30',
    iconColor: 'text-emerald-300',
    glowColor: 'rgba(52,211,153,0.25)',
  },
  {
    icon: Backpack,
    title: 'Smart Packing List',
    description:
      'Receive an AI-generated packing checklist tailored to your destination and activities so you never overpack.',
    gradient: 'from-amber-500/25 to-orange-600/10',
    iconBg: 'bg-gradient-to-br from-amber-500/30 to-orange-600/20 border-amber-400/30',
    iconColor: 'text-amber-300',
    glowColor: 'rgba(251,191,36,0.25)',
  },
  {
    icon: CloudSun,
    title: 'Weather Insights',
    description:
      'Plan around climate and seasons with clear weather guidance for every stop on your journey.',
    gradient: 'from-sky-500/25 to-blue-600/10',
    iconBg: 'bg-gradient-to-br from-sky-500/30 to-blue-600/20 border-sky-400/30',
    iconColor: 'text-sky-300',
    glowColor: 'rgba(56,189,248,0.25)',
  },
  {
    icon: Gem,
    title: 'Hidden Gems Discovery',
    description:
      'Go beyond tourist traps. Discover local favorites, scenic spots, and under-the-radar experiences.',
    gradient: 'from-pink-500/25 to-rose-600/10',
    iconBg: 'bg-gradient-to-br from-pink-500/30 to-rose-600/20 border-pink-400/30',
    iconColor: 'text-pink-300',
    glowColor: 'rgba(244,114,182,0.25)',
  },
  {
    icon: Bot,
    title: '24/7 AI Assistant',
    description:
      'Refine your plan anytime. Chat with your AI travel assistant whenever you need a quick tweak.',
    gradient: 'from-blue-500/25 to-indigo-600/10',
    iconBg: 'bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border-blue-400/30',
    iconColor: 'text-blue-300',
    glowColor: 'rgba(96,165,250,0.25)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-32 text-white"
      aria-labelledby="why-choose-us-heading"
    >
      {/* Background blobs — matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 md:mb-16 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Chip
            className="bg-white/10 border border-white/20 px-3 h-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by Travelers
          </Chip>

          <h2
            id="why-choose-us-heading"
            className="text-3xl md:text-5xl font-bold leading-tight"
          >
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              AI Travel Planner
            </span>
          </h2>

          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Discover why thousands of travelers trust our AI to create smarter,
            faster, and more personalized trips.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card
                  className={`
                    group relative h-full overflow-hidden
                    bg-white/[0.04] backdrop-blur-xl
                    border border-white/[0.10]
                    rounded-2xl p-7
                    shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                    transition-all duration-500 ease-out
                    hover:-translate-y-2
                    hover:bg-white/[0.07]
                    hover:border-white/[0.18]
                    hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]
                    cursor-default
                  `}
                  style={
                    {
                      '--glow': feature.glowColor,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 16px_48px ${feature.glowColor}, 0 4px 24px rgba(0,0,0,0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 4px 24px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Soft gradient wash on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="relative z-10 flex flex-col gap-5">
                    {/* Gradient icon background */}
                    <div
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        border ${feature.iconBg}
                        shadow-[0_0_20px_rgba(168,85,247,0.08)]
                        transition-transform duration-300 group-hover:scale-110
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 ${feature.iconColor}`}
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </div>

                    <h3 className="text-[19px] font-bold text-white leading-snug">
                      {feature.title}
                    </h3>

                    <p className="text-[14.5px] text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
