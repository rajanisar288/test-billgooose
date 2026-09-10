import AboutHero from '@/components/about/AboutHero';
import CustomersComeFirst from '@/components/about/CustomersComeFirst';
import EssentialServices from '@/components/about/EssentialServices';
import HowWeOperate from '@/components/about/HowWeOperate';
import HowWeUseYourData from '@/components/about/HowWeUseYourData';
import PermissionHelp from '@/components/about/PermissionHelp';
import RealValue from '@/components/about/RealValue';
import WhyWeCreatedBillGoose from '@/components/about/WhyWeCreatedBillGoose';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import LowerHero from '@/components/marketing/LowerHero';
import Newsletter from '@/components/marketing/NewsLetter';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <AboutHero />

        <WhyWeCreatedBillGoose />

        <PermissionHelp />

        <EssentialServices />

        <RealValue />

        <HowWeOperate />

        <HowWeUseYourData />

        <CustomersComeFirst />

        <LowerHero
          heading="Ready to start saving?"
          description="Join 2.4 million UK households who switched with BillGoose."
        />

        <Newsletter />

        <Footer />
      </main>
    </div>
  );
}
