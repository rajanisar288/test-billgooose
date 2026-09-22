import AffiliateContent from '@/components/affiliate/AffiliateContent';
import AffiliateHero from '@/components/affiliate/AffiliateHero';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import LiveChatWidget from '@/components/marketing/LiveChatWidget';

export default function AffiliateDisclaimerPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <AffiliateHero />

        <LiveChatWidget />

        {/* Extra breathing room between hero and content */}
        <div
          className="h-6 sm:h-8 lg:h-10"
          aria-hidden="true"
        />

        <AffiliateContent />

        {/* Smaller gap before the footer */}
        <div
          className="h-4 sm:h-5 lg:h-6"
          aria-hidden="true"
        />
      </main>

      <Footer />
    </div>
  );
}
