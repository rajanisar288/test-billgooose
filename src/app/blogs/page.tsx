import BlogsHero from '@/components/blogs/BlogsHero';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import Newsletter from '@/components/marketing/NewsLetter';

export default function BlogsPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <BlogsHero />
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
