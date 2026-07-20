'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AuthFooterProps {
  type: 'login' | 'signup';
}

export default function AuthFooter({ type }: AuthFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="mt-6 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/40">OR</span>
        </div>
      </div>

      <p className="text-white/50 text-sm">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
