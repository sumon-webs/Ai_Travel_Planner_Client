'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Chip, Skeleton } from '@heroui/react';
import {
  Sparkles,
  Plane,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Globe,
  Compass,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const FLOATING_ELEMENTS = [
  { icon: '✈️', top: '15%', left: '10%', delay: 0, showOnMobile: false },
  { icon: '🗺️', top: '25%', right: '15%', delay: 0.5, showOnMobile: false },
  { icon: '🧳', bottom: '30%', left: '15%', delay: 1, showOnMobile: false },
  { icon: '📸', top: '40%', right: '10%', delay: 1.5, showOnMobile: false },
  { icon: '🏔️', bottom: '20%', right: '20%', delay: 2, showOnMobile: false },
];

export default function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [promptError, setPromptError] = useState('');

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/api/destinations/stats`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });

  const handlePlanTrip = () => {
    if (!prompt.trim()) {
      setPromptError('Please enter a destination or trip description');
      return;
    }
    setPromptError('');
    router.push(`/plan-trip?prompt=${encodeURIComponent(prompt)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = statsData?.data || {
    tripsPlanned: 0,
    destinations: 0,
    happyTravelers: 0,
    countries: 0,
  };

  const STAT_ITEMS = [
    { value: stats.tripsPlanned, label: 'Trips Planned', icon: Plane },
    { value: stats.destinations, label: 'Destinations', icon: Globe },
    { value: stats.happyTravelers, label: 'Happy Travelers', icon: Users },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-32 text-white min-h-screen flex items-center">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating Travel Elements */}
      {FLOATING_ELEMENTS.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute text-4xl opacity-20 pointer-events-none ${element.showOnMobile ? '' : 'hidden md:block'}`}
          style={{ top: element.top, left: element.left, right: element.right, bottom: element.bottom }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: element.delay,
            ease: 'easeInOut',
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Left: Content */}
          <div className="flex-1 space-y-8 max-w-2xl">
            {/* AI Badge */}
            <motion.div variants={itemVariants}>
              <Chip className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-4 py-2">
                <span className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
                    AI-Powered Travel Planning
                  </span>
                </span>
              </Chip>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Plan Your Dream Trip{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                With AI in Seconds
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-lg text-slate-400 leading-relaxed">
              Describe where you want to go. Our AI crafts a fully personalized itinerary — flights,
              hotels, day-by-day activities — all tailored to your budget and preferences.
            </motion.p>

            {/* AI Prompt Input */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="relative flex items-center">
                <Compass className="absolute left-4 w-5 h-5 text-slate-500 pointer-events-none" />
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Where do you want to go? e.g. 5 days in Japan under $1000"
                  className="w-full h-14 pl-12 pr-28 sm:pr-32 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <Button
                  onPress={handlePlanTrip}
                  className="absolute right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 sm:px-6 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                >
                  <span className="hidden sm:inline">Plan Trip</span>
                  <ArrowRight className="w-4 h-4 sm:ml-2" />
                </Button>
              </div>
              {promptError && (
                <p className="text-sm text-red-400">{promptError}</p>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Button
                onPress={handlePlanTrip}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all"
              >
                Start Planning Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition-all"
              >
                View Sample Itinerary
              </Button>
            </motion.div>
          </div>

          {/* Right: Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {statsLoading ? (
              // Loading Skeletons
              STAT_ITEMS.map((_, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                  <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            ) : statsError ? (
              // Error State
              <div className="col-span-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span className="text-red-400">Failed to load statistics</span>
              </div>
            ) : (
              // Stats Cards
              STAT_ITEMS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}