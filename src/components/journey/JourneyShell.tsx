'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import data from '@/data/content.json';

import JourneyNavigation from './Journey-navigation';
import JourneyProgress from './Journey-progress';
import JourneySidebar from './Journey-sidebar';

type JourneyShellProps = {
  children: ReactNode;
};

export default function JourneyShell({ children }: JourneyShellProps) {
  const { journey } = data;
  const { steps } = journey.sidebar;

  const searchParams = useSearchParams();

  const requestedStep = Number(searchParams.get('step') ?? '1');

  const currentStep = Math.min(Math.max(requestedStep, 1), steps.length);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#F8F9FA]">
      <div className="flex h-full w-full overflow-hidden">
        <JourneySidebar
          currentStep={currentStep}
          steps={steps}
        />

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="shrink-0 border-b border-[#EAECF0] bg-white px-5 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Image
                src={journey.mobileHeader.logo.src}
                alt={journey.mobileHeader.logo.alt}
                width={journey.mobileHeader.logo.width}
                height={journey.mobileHeader.logo.height}
                className="h-auto w-[126px] object-contain"
              />

              <span className="font-inter text-[13px] font-medium text-[#667085]">
                {journey.mobileHeader.stepPrefix} {currentStep} {journey.mobileHeader.stepSeparator}{' '}
                {steps.length}
              </span>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col">
              <JourneyProgress
                currentStep={currentStep}
                totalSteps={steps.length}
              />

              <div
                className="
                  flex flex-1 justify-center
                  px-5 pb-8 pt-7

                  sm:px-8
                  sm:pb-10
                  sm:pt-9

                  lg:px-12
                  lg:pb-10
                  lg:pt-8
                "
              >
                <div className="w-full max-w-[500px]">{children}</div>
              </div>
            </div>
          </div>

          <JourneyNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        </section>
      </div>
    </main>
  );
}
