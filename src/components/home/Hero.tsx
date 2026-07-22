'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Chip } from '@heroui/react';
import {
  Sparkles,
  ArrowRight,
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
                    AI-Powered Travel Planner
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
              Describe your destination, travel style, duration and budget.
              Our AI generates a personalized travel itinerary in seconds.
            </motion.p>


            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Button
                onPress={() => router.push('/plan-trip')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning with AI
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-all text-lg"
              >
                View Sample Itinerary
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}