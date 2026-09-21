import CookiesContent from '@/components/cookies/CookiesContent';
import CookiesHero from '@/components/cookies/CookiesHero';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <CookiesHero />
        <CookiesContent />
        {/* <CookiesPreferences /> */}
      </main>

      <Footer />
    </div>
  );
}
