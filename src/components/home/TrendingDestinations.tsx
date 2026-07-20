'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Chip, Button, Skeleton } from '@heroui/react';
import { MapPin, Star, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';

interface Destination {
  _id: string;
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  rating: number;
  coverImage?: string;
}

export default function TrendingDestinations() {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const { data, isLoading, error } = useQuery<{ data: Destination[] }>({
    queryKey: ['trending-destinations'],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/api/destinations/trending?limit=6`);
      if (!response.ok) throw new Error('Failed to fetch destinations');
      return response.json();
    },
  });

  const destinations = data?.data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <span className="text-red-400">Failed to load trending destinations</span>
          </div>
        </div>
      </section>
    );
  }

  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <div className="mb-12">
            <Chip className="bg-white/10 border border-white/20 px-3 h-8 mb-4">
              <span className="flex items-center gap-2 text-sm text-white">
                <TrendingUp className="w-3.5 h-3.5 text-purple-300" />
                Trending Now
              </span>
            </Chip>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Popular{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Destinations
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl">
              Discover the most loved destinations by travelers worldwide. From exotic beaches to
              vibrant cities, find your next adventure.
            </p>
          </div>

          {/* Destination Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {destinations.map((destination) => (
              <motion.div
                key={destination._id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
                  {destination.coverImage ? (
                    <img
                      src={destination.coverImage}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-purple-400/50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{destination.name}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {destination.city}, {destination.country}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {destination.shortDescription}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-purple-400 font-semibold">
                      ${destination.price.toLocaleString()}
                    </div>
                    <div className="text-slate-500">{destination.durationDays} days</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Button
              className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition-all"
            >
              Explore All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
