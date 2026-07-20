'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Loader2, AlertCircle, CloudCog } from 'lucide-react';
import { Chip } from '@heroui/react';

interface Feedback {
  _id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

export default function Testimonials() {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const { data, isLoading, isError, error } = useQuery<{ data: Feedback[]; count: number }>({
    queryKey: ['feedback'],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/api/feedback`);
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      return response.json();
    },
  });
  const testimonials = data?.data || [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-28 text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[380px] h-[380px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Chip className="bg-white/10 border border-white/20 px-3 h-8 mb-6">
            <span className="flex items-center gap-2 text-sm text-white">
              <MessageSquare className="w-3.5 h-3.5 text-violet-300" />
              Testimonials
            </span>
          </Chip>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Travelers Say
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Real experiences from real adventurers who used AI Travel Planner to create their perfect
            journeys.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading testimonials...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <p className="text-slate-400 text-sm">
              {error instanceof Error ? error.message : 'Failed to load testimonials'}
            </p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Testimonials Yet</h3>
            <p className="text-slate-400 max-w-md">
              Be the first to share your experience! Submit your feedback and help others discover
              amazing travel adventures.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial._id}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">{renderStars(testimonial.rating)}</div>

                {/* Message */}
                <p className="text-slate-300 leading-relaxed mb-6 line-clamp-4">
                  {testimonial.message}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(testimonial.createdAt)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
