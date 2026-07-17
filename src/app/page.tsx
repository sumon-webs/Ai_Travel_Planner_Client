

import AIFeatures from '@/components/home/AIFeatures'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import PopularDestinations from '@/components/home/PopulerDestination'

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularDestinations />
      <HowItWorks />
      <AIFeatures/>
    </div>
  )
}
