import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ModelSection from '@/components/ModelSection'
import UseCases from '@/components/UseCases'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ModelSection />
      <UseCases />
      <Footer />
    </main>
  )
}
