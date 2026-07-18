

import AIFeatures from '@/components/home/AIFeatures'
import FeedbackSection from '@/components/home/FeedbackSection'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import LatestTrips from '@/components/home/LatestTrips'
import Newsletter from '@/components/home/Newsletter'
import PopularDestinations from '@/components/home/PopulerDestination'
import Testimonials from '@/components/home/Testimonials'
import TrendingDestinations from '@/components/home/TrendingDestinations'
import TravelCategories from '@/components/home/TravelCategories'
import WhyChooseUs from '@/components/home/WhyChooseUs'

export default function Home() {
  return (
    <div>
      <Hero />
      {/* <TrendingDestinations /> */}
      <PopularDestinations />
      <HowItWorks />
      <AIFeatures/>
      <LatestTrips />
      <WhyChooseUs/>
      <Testimonials/>
      <FeedbackSection/>
      <TravelCategories/>
      <Newsletter/>
    </div>
  )
}
