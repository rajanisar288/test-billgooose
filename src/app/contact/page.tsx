import ContactHero from '@/components/contact/ContactHero';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/marketing/Footer';
import Header from '@/components/marketing/Header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get in touch | BillGoose',
  description:
    'Get in touch with BillGoose. We are here to help with any questions about comparing household bills, energy, broadband, mobile and more.',
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white">
      <Header variant="default" />

      <ContactHero />

      <ContactSection />

      <Footer />
    </main>
  );
}
