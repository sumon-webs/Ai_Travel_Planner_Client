

import AIFeatures from '@/components/home/AIFeatures'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import Newsletter from '@/components/home/Newsletter'
import PopularDestinations from '@/components/home/PopulerDestination'
import TravelCategories from '@/components/home/TravelCategories'
import WhyChooseUs from '@/components/home/WhyChooseUs'

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularDestinations />
      <HowItWorks />
      <AIFeatures/>
      <WhyChooseUs/>
      <TravelCategories/>
      <Newsletter/>

    </div>
  )
}
