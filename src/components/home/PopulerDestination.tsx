'use client';

import { Button, Card } from "@heroui/react";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Image from "next/image";

const destinations = [
  { id: 1, title: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", rating: 4.9, budget: "$1,200" },
  { id: 2, title: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", rating: 4.8, budget: "$950" },
  { id: 3, title: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800", rating: 4.9, budget: "$1,500" },
  { id: 4, title: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", rating: 4.8, budget: "$1,350" },
];

export default function PopularDestinations() {
  return (
    <section className="relative overflow-hidden bg-[#0d0b1e] py-24 px-6">
      {/* Ambient Blobs */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-violet-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-sky-900/20 rounded-full blur-[120px]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-sm font-semibold text-violet-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Top Rated Locations
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">Destinations</span>
            </h2>
          </div>
          <Button  className="text-white border-white/20 hover:bg-white/10 gap-2">
            View All <ArrowRight size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl p-3 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.06] hover:border-violet-500/50"
            >
              {/* Image Container */}
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-1.5 text-white/90 font-bold text-lg">
                    <MapPin size={18} className="text-sky-400" />
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-2 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">{item.country}</span>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-lg font-medium">
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-white">{item.budget}</span>
                  <Button
                    size="sm"
                    className="bg-white text-black font-bold hover:bg-white/90 transition-all rounded-xl"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}