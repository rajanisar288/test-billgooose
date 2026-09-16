import GuideArticleContent from '@/components/guides/GuideArticleContent';
import GuideArticleHero from '@/components/guides/GuideArticleHero';
import Footer from '@/components/marketing/Footer';
import Guides from '@/components/marketing/Guides';
import Header from '@/components/marketing/Header';
import Newsletter from '@/components/marketing/NewsLetter';

export default function GuidesPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <GuideArticleHero />

        <GuideArticleContent />
        <Guides />

        {/* 100px gap before the newsletter */}
        <div
          className="h-[100px]"
          aria-hidden="true"
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
