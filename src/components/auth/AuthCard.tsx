'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  showIllustration?: boolean;
}

export default function AuthCard({ children, title, showIllustration = true }: AuthCardProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
      {/* Left side - Illustration */}
      {showIllustration && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block lg:w-1/2"
        >
          <div className="relative">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full max-w-md mx-auto"
            >
              <div className="relative bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                {/* Travel illustration */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <Plane className="w-16 h-16 text-white" />
                    </div>
                    {/* Orbiting elements */}
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-white rounded-full shadow-lg" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-violet-300 rounded-full" />
                      <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-2 h-2 bg-indigo-300 rounded-full" />
                      <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-3 h-3 bg-purple-300 rounded-full" />
                    </motion.div>
                  </motion.div>

                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white">AI Travel Planner</h3>
                    <p className="text-white/60 text-sm">Your intelligent travel companion</p>
                  </div>

                  {/* Feature highlights */}
                  <div className="space-y-3 w-full">
                    {[
                      'AI-powered trip planning',
                      'Personalized recommendations',
                      'Real-time itinerary updates',
                      'Collaborative travel planning',
                    ].map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-white/80 text-sm"
                      >
                        <div className="w-2 h-2 bg-violet-400 rounded-full" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-10 -right-10 w-20 h-20 bg-violet-500/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>
      )}

      {/* Right side - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full lg:w-1/2 max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          {title && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              <p className="text-white/50 text-sm">
                {title === 'Welcome Back' ? 'Sign in to continue your journey' : 'Start your travel adventure today'}
              </p>
            </motion.div>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
