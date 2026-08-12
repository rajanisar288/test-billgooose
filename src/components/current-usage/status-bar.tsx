'use client';

import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import data from '@/data/content.json';

export default function StatusBar() {
  const router = useRouter();
  const { statusBar } = data.currentUsage;

  return (
    <section className="border-b border-[#EAECF0] bg-white">
      <div
        className="
          mx-auto flex min-h-[42px] w-full max-w-[1440px]
          items-center gap-3
          px-4 py-2

          sm:px-6

          lg:justify-between
          lg:px-8
        "
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="
            inline-flex shrink-0
            items-center gap-1.5

            font-red-hat-display
            text-[14px] font-bold
            leading-5
            text-[#6A7282]

            transition-colors

            hover:text-[#0C3354]

            lg:text-[14px]
            lg:leading-5
          "
        >
          <ChevronLeft
            aria-hidden="true"
            className="
              h-[17px] w-[17px]
              shrink-0
              text-[#6A7282]

              lg:h-[18px]
              lg:w-[18px]
            "
            strokeWidth={1.8}
          />

          {statusBar.backButton}
        </button>

        {/* Live meter status */}
        <div
          className="
            ml-auto mr-2
            flex min-w-0
            items-center
            gap-2

            font-red-hat-display
            text-[12px] font-medium
            leading-4
            text-[#007A55]

            min-[390px]:mr-4

            sm:mr-6

            lg:mx-0
            lg:justify-center
            lg:text-[12px]
          "
        >
          <span
            aria-hidden="true"
            className="
              h-2 w-2
              shrink-0
              rounded-full
              bg-[#00BC7D]
            "
          />

          <span className="whitespace-nowrap">
            {statusBar.liveMeterText} · {statusBar.updatedText}
          </span>
        </div>

        {/* MPRN / MPAN - desktop only */}
        <div
          className="
            hidden shrink-0
            items-center gap-2

            font-red-hat-display
            text-[10px] font-bold
            leading-4

            lg:flex
            lg:text-[12px]
          "
        >
          <span className="text-[#99A1AF]">{statusBar.mprnLabel}</span>

          <span className="text-[#4A5565]">{statusBar.mprnValue}</span>

          <span
            aria-hidden="true"
            className="
              text-[18px] font-bold
              leading-4
              text-[#99A1AF]
            "
          >
            ·
          </span>

          <span className="text-[#99A1AF]">{statusBar.mpanLabel}</span>

          <span className="text-[#4A5565]">{statusBar.mpanValue}</span>
        </div>
      </div>
    </section>
  );
}
