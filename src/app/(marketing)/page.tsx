import Compare from '@/components/marketing/CompareSection';
import Footer from '@/components/marketing/Footer';
import Guides from '@/components/marketing/Guides';
import Hero from '@/components/marketing/Hero';
import HowItWorks from '@/components/marketing/HowItWorks';
import LowerHero from '@/components/marketing/LowerHero';
import Newsletter from '@/components/marketing/NewsLetter';
import Reviews from '@/components/marketing/Reviews';
import Trust from '@/components/marketing/Trust';
import WhyBillGoose from '@/components/marketing/WhyBillGoose';
import { generateMarketingMetadata } from '@/lib/seo/metadata';

export const metadata = generateMarketingMetadata({
  title: 'Compare Household Bills',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
  canonical: 'https://billgoose.com',
});
export default function HomePage() {
  return (
    <>
      <Hero />
      <Compare />
      <WhyBillGoose />
      <HowItWorks />
      <Guides />
      <Reviews />
      <Trust />
      <LowerHero />
      <Newsletter />
      <Footer />
    </>
  );
}
