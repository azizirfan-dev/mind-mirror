import Navbar from '@/shared/layout/Navbar';
import HeroSection from '@/features/landing/components/HeroSection';
import FeaturesSection from '@/features/landing/components/FeaturesSection';
import PhilosophySection from '@/features/landing/components/PhilosophySection';
import ProtocolSection from '@/features/landing/components/ProtocolSection';
import Footer from '@/shared/layout/Footer';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PhilosophySection />
      <ProtocolSection />
      <Footer />
    </main>
  );
}
