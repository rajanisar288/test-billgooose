import CareersHero from '@/components/careers/CareersHero';
import CurrentOpportunities from '@/components/careers/CurrentOpportunities';
import OurValues from '@/components/careers/OurValues';
import PeopleWhoDoWell from '@/components/careers/PeopleWhoDoWell';
import WhatItsLike from '@/components/careers/WhatItsLike';
import WhatYouCanExpect from '@/components/careers/WhatYouCanExpect';
import WorkAtBillGoose from '@/components/careers/WorkAtBillGoose';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';
import Newsletter from '@/components/marketing/NewsLetter';

export default function CareersPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <CareersHero />
        <WhatItsLike />
        <PeopleWhoDoWell />
        <WorkAtBillGoose />
        <WhatYouCanExpect />
        <OurValues />
        <CurrentOpportunities />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
