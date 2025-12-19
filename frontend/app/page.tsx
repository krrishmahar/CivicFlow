'use client'

import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/layout/Footer';



export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}