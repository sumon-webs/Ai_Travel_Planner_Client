'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, User } from 'lucide-react';
import { Button } from '@heroui/react';

interface DemoLoginCardProps {
  onDemoLogin?: () => void;
  isLoading?: boolean;
}

export default function DemoLoginCard({ onDemoLogin, isLoading = false }: DemoLoginCardProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const demoCredentials = {
    email: 'demo@aitravel.com',
    password: 'Demo123@',
  };

  const copyToClipboard = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mt-6 p-4 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">Demo Account</h4>
          <p className="text-white/50 text-xs mt-0.5">Try the app without signing up</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div>
            <p className="text-white/40 text-xs">Email</p>
            <p className="text-white text-sm font-mono">{demoCredentials.email}</p>
          </div>
          <motion.button
            type="button"
            onClick={() => copyToClipboard(demoCredentials.email, 'email')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {copiedEmail ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/40 hover:text-white" />
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div>
            <p className="text-white/40 text-xs">Password</p>
            <p className="text-white text-sm font-mono">••••••••</p>
          </div>
          <motion.button
            type="button"
            onClick={() => copyToClipboard(demoCredentials.password, 'password')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {copiedPassword ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/40 hover:text-white" />
            )}
          </motion.button>
        </div>
      </div>

      <Button
        type="button"
        onClick={onDemoLogin}
        isDisabled={isLoading}
        className="w-full py-2 bg-violet-500/20 text-violet-300 font-medium rounded-lg hover:bg-violet-500/30 transition-all text-sm"
      >
        {isLoading ? 'Logging in...' : 'Login as Demo User'}
      </Button>
    </motion.div>
  );
}
