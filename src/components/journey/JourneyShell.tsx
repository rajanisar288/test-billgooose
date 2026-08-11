'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { Check, Copy } from 'lucide-react';

import data from '@/data/content.json';

import JourneyNavigation from './Journey-navigation';
import JourneyProgress from './Journey-progress';
import JourneySidebar from './Journey-sidebar';

type JourneyShellProps = {
  children: ReactNode;
};

export default function JourneyShell({ children }: JourneyShellProps) {
  const { journey } = data;
  const { steps, instantAccess } = journey.sidebar;

  const searchParams = useSearchParams();

  const requestedStep = Number(searchParams.get('step') ?? '1');

  const currentStep = Math.min(Math.max(requestedStep, 1), steps.length);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instantAccess.url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main
      className="
        fixed inset-0
        flex min-h-0 w-full
        overflow-hidden
        bg-white
      "
    >
      {/* Desktop sidebar */}
      <JourneySidebar
        currentStep={currentStep}
        steps={steps}
      />

      <section
        className="
          flex h-full min-w-0
          flex-1 flex-col
          overflow-hidden
        "
      >
        {/* Mobile header */}
        <div
          className="
            flex h-[82px]
            w-full shrink-0
            items-center justify-start
            bg-[#082A49]

            lg:hidden
          "
        >
          <Image
            src="/images/logo-white.png"
            alt={journey.mobileHeader.logo.alt}
            width={170}
            height={82}
            priority
            className="
              h-[82px] w-[170px]
              object-contain
              object-center
            "
          />
        </div>

        {/* Mobile magic link */}
        <section
          className="
            w-full shrink-0
            border-b border-[#E9EAEB]
            bg-white

            lg:hidden
          "
        >
          {/* Description row */}
          <div
            className="
              flex h-[50px]
              items-center gap-2
              px-4

              min-[390px]:px-5
            "
          >
            <Image
              src={instantAccess.icon.src}
              alt={instantAccess.icon.alt}
              width={20}
              height={20}
              aria-hidden="true"
              className="
                h-5 w-5 shrink-0
                object-contain
              "
            />

            <p
              className="
    font-inter
    text-[13px]
    font-medium
    leading-[22px]
    tracking-[-0.02em]
    text-[#0C3354]

    md:text-[16px]
    md:font-medium
    md:leading-[22px]
    md:tracking-[-0.02em]
    md:text-[#0C3354]
  "
            >
              {instantAccess.description}
            </p>
          </div>

          {/* Link row */}
          <div
            className="
              flex h-[52px]
              w-full
              border-t border-[#E9EAEB]
              bg-white
            "
          >
            <div
              className="
                flex min-w-0 flex-1
                items-center
                px-4

                min-[390px]:px-5
              "
            >
              <span
                className="
                  truncate
                  font-inter
                  text-[14px]
                  font-normal
                  leading-6
                  tracking-[0]
                  text-[#535862]
                "
              >
                {instantAccess.url}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="
                inline-flex h-[52px]
                w-[96px] shrink-0
                items-center justify-center
                gap-2

                border-l border-[#EAECF0]
                bg-white

                px-[18px]
                py-2

                font-inter
                text-[14px]
                font-semibold
                leading-6
                tracking-[0]
                text-[#0D3B66]

                transition-colors

                hover:bg-[#F9FAFB]

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-inset
                focus-visible:ring-[#E6F4F2]
              "
            >
              {copied ? (
                <Check
                  aria-hidden="true"
                  className="
                    h-[18px] w-[18px]
                    shrink-0
                  "
                  strokeWidth={2}
                />
              ) : (
                <Copy
                  aria-hidden="true"
                  className="
                    h-[18px] w-[18px]
                    shrink-0
                  "
                  strokeWidth={1.8}
                />
              )}

              <span>{copied ? 'Copied' : instantAccess.copyButton}</span>
            </button>
          </div>
        </section>

        {/* Scrollable content */}
        <div
          className="
    min-h-0 flex-1
    overflow-x-hidden
    overflow-y-auto
    bg-[#F9F9F9]
  "
        >
          <div
            className="
              mx-auto flex min-h-full
              w-full max-w-[1120px]
              flex-col
            "
          >
            {/* Desktop progress only */}
            <div className="hidden lg:block">
              <JourneyProgress
                currentStep={currentStep}
                totalSteps={steps.length}
              />
            </div>

            <div
              className="
                flex flex-1 justify-center
                px-4 pb-8 pt-0

                min-[390px]:px-5

                sm:px-8
                sm:pb-10

                lg:px-12
                lg:pb-10
                lg:pt-8
              "
            >
              <div
                className="
                  w-full max-w-[500px]
                "
              >
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <JourneyNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </section>
    </main>
  );
}
