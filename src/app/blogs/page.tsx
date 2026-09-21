import BlogsHero from '@/components/blogs/BlogsHero';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import LiveChatWidget from '@/components/marketing/LiveChatWidget';
import Newsletter from '@/components/marketing/NewsLetter';

export default function BlogsPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <BlogsHero />
        <LiveChatWidget />
      </main>

      <Newsletter description="Monthly savings tips, price alerts, and UK bill guides straight to your inbox." />
      <Footer />
    </div>
  );
}
