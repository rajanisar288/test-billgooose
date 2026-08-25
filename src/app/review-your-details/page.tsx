'use client';

import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import ReviewYourDetails from '@/components/review/review-your-details';
import data from '@/data/content.json';

import Header from '../../components/marketing/Header';

export default function ReviewYourDetailsPage() {
  const router = useRouter();

  const { statusBar } = data.currentUsage;

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      {/* Existing main navbar */}
      <Header />

      {/* Same Back row style as Current Usage */}
      <section className="border-y border-[#EAECF0] bg-white">
        <div
          className="
            mx-auto
            flex
            min-h-[42px]
            w-full
            max-w-[1440px]
            items-center

            px-4
            py-2

            sm:px-6

            lg:px-8
          "
        >
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5

              font-red-hat-display
              text-[12px]
              font-bold
              leading-5
              text-[#6A7282]

              transition-colors

              hover:text-[#0C3354]

              sm:text-[13px]

              lg:text-[14px]
            "
          >
            <ChevronLeft
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
                text-[#6A7282]

                lg:h-[18px]
                lg:w-[18px]
              "
              strokeWidth={1.8}
            />

            {statusBar.backButton}
          </button>
        </div>
      </section>

      <ReviewYourDetails />
    </main>
  );
}
