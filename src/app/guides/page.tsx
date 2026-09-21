'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import GuideArticleContent, { type Block } from '@/components/guides/GuideArticleContent';
import GuideArticleHero from '@/components/guides/GuideArticleHero';
import Footer from '@/components/marketing/Footer';
import Guides from '@/components/marketing/Guides';
import Header from '@/components/marketing/Header';
import Newsletter from '@/components/marketing/NewsLetter';
import data from '@/data/content.json';

/* =========================================================
   TYPES
========================================================= */

type GuideHero = {
  badge: { category: string; readTime: string };
  heading: string;
  breadcrumb: {
    home: { label: string; href: string };
    guides: { label: string; href: string };
    current: string;
  };
  image: { src: string; alt: string };
};

type GuideSidebar = {
  heading: string;
  links: { id: string; label: string }[];
};

type GuidePage = {
  hero: GuideHero;
  sidebar: GuideSidebar;
  blocks: Block[];
};

/* =========================================================
   PAGE
========================================================= */

function GuidesPageInner() {
  const searchParams = useSearchParams();

  const post = searchParams.get('post') ?? '1';

  const guidePages = (data as { guidePages: Record<string, GuidePage> }).guidePages;
  const pageData: GuidePage = guidePages[post] ?? guidePages['1'];

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="w-full">
        <GuideArticleHero heroData={pageData.hero} />

        <GuideArticleContent
          sidebar={pageData.sidebar}
          blocks={pageData.blocks}
        />

        <Guides />

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

export default function GuidesPage() {
  return (
    <Suspense fallback={null}>
      <GuidesPageInner />
    </Suspense>
  );
}
