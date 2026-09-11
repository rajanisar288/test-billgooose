import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import Newsletter from '@/components/marketing/NewsLetter';
import FaqSection from '@/components/support/FaqSection';
import HowWeSupportYou from '@/components/support/HowWeSupportYou';
import SupportHero from '@/components/support/SupportHero';
import ThreeWaysToGetAnswer from '@/components/support/ThreeWaysToGetAnswer';

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <SupportHero />
        <ThreeWaysToGetAnswer />
        <HowWeSupportYou />
        <FaqSection />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
