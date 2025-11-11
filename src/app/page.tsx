import { Header, HeroSection, PainPointsSection, FeaturesSection, BenefitsSection, TestimonialsSection, LandingPricingSection, CTASection, Footer } from './components/LandingPage';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <LandingPricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
