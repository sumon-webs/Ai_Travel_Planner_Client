"use client";

import { Button, Card } from "@heroui/react";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

const destinations = [
  {
    id: 1,
    title: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    rating: 4.9,
    budget: "$1,200",
  },
  {
    id: 2,
    title: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    rating: 4.8,
    budget: "$950",
  },
  {
    id: 3,
    title: "Kyoto",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800",
    rating: 4.9,
    budget: "$1,500",
  },

  {
    id: 4,
    title: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    rating: 4.8,
    budget: "$1,350",
  },
];

export default function PopularDestinations() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0b1e] via-[#0f0c29] to-[#1a0e3a] py-24">
      {/* Background Blur */}
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />

      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            🌍 Popular Destinations
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            Explore{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-pink-400 bg-clip-text text-transparent">
              Amazing Places
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            AI-picked destinations loved by thousands of travelers around the
            world.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((item) => (
            <Card
              key={item.id}
              variant="secondary"
              className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 hover:scale-110"
                />

                <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                  Featured
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>

                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                    <MapPin size={14} />
                    {item.country}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </span>

                  <span className="font-semibold text-violet-300">
                    {item.budget}
                  </span>
                </div>

                <Button
                  fullWidth
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}