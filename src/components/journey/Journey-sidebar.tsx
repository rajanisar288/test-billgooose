import Image from 'next/image';
import Link from 'next/link';

import { Check, Copy, Mail } from 'lucide-react';

import data from '@/data/content.json';

type JourneyStep = {
  number: number;
  title: string;
  description: string;
};

type JourneySidebarProps = {
  currentStep: number;
  steps: JourneyStep[];
};

export default function JourneySidebar({ currentStep, steps }: JourneySidebarProps) {
  const { sidebar } = data.journey;
  const { logo, instantAccess, footer } = sidebar;

  return (
    <aside
      className="
        sticky top-0 hidden h-dvh shrink-0
        overflow-hidden bg-[#082F4F] text-white

        lg:flex lg:w-[280px] lg:flex-col
        lg:pb-4 lg:pl-7 lg:pr-5 lg:pt-5

        xl:w-[320px]
        xl:pb-5 xl:pl-8 xl:pr-6 xl:pt-6
      "
    >
      <Link
        href={logo.href}
        aria-label={logo.ariaLabel}
        className="inline-flex shrink-0"
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          priority
          className="
            h-auto object-contain
            lg:w-[180px]
            xl:w-[200px]
          "
        />
      </Link>

      <nav
        aria-label={sidebar.navigationAriaLabel}
        className="mt-8 w-full shrink-0 xl:mt-9"
      >
        <ol className="flex flex-col gap-[18px] xl:gap-5">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isLastStep = index === steps.length - 1;

            return (
              <li
                key={step.number}
                className="relative flex min-h-[48px] items-start gap-3"
              >
                <div className="relative flex w-6 shrink-0 justify-center">
                  <span
                    className={`
                      relative z-10 flex h-6 w-6
                      shrink-0 items-center justify-center
                      rounded-full border-2
                      transition-colors duration-200

                      ${
                        isActive || isCompleted
                          ? 'border-[#FEF2EA] bg-[#00897B]'
                          : 'border-[#98A2B3] bg-transparent'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check
                        size={13}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        className="text-white"
                      />
                    ) : (
                      <span
                        className={`
                          rounded-full
                          ${isActive ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-[#98A2B3]'}
                        `}
                      />
                    )}
                  </span>

                  {!isLastStep && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute left-1/2 top-6
                        h-[42px] w-0.5
                        -translate-x-1/2
                        rounded-[2px]
                        bg-[#98A2B3]
                      "
                    />
                  )}
                </div>

                <div className="-mt-0.5 min-w-0">
                  <p
                    className="
                      font-inter text-[12px] font-semibold
                      leading-[18px] tracking-[0] text-white

                      xl:text-[13px]
                      xl:leading-5
                    "
                  >
                    {step.title}
                  </p>

                  <p
                    className="
                      mt-0.5 font-inter text-[10px]
                      font-normal leading-[14px]
                      tracking-[0] text-[#98A2B3]

                      xl:text-[11px]
                      xl:leading-4
                    "
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="min-h-5 flex-1" />

      <div className="w-full shrink-0">
        <div
          className="
            flex min-h-[112px] w-full flex-col
            overflow-hidden
            rounded-b-[18px]
            rounded-t-[12px]
            bg-white/10

            xl:min-h-[120px]
            xl:rounded-b-[20px]
            xl:rounded-t-[14px]
          "
        >
          <div
            className="
              flex items-start gap-2.5
              px-3 pb-2.5 pt-3

              xl:gap-3
              xl:px-4
              xl:pb-3
              xl:pt-3.5
            "
          >
            <Image
              src={instantAccess.icon.src}
              alt={instantAccess.icon.alt}
              width={instantAccess.icon.width}
              height={instantAccess.icon.height}
              aria-hidden="true"
              className="
                h-6 w-6 shrink-0 object-contain
                xl:h-7 xl:w-7
              "
            />

            <div className="min-w-0">
              <p
                className="
                  font-inter text-[11px] font-semibold
                  leading-4 tracking-[0] text-white

                  xl:text-[12px]
                  xl:leading-[18px]
                "
              >
                {instantAccess.heading}
              </p>

              <p
                className="
                  mt-0.5 font-inter text-[9px]
                  font-normal leading-[12px]
                  tracking-[0] text-[#D5D7DA]

                  xl:text-[10px]
                  xl:leading-[14px]
                "
              >
                {instantAccess.description}
              </p>
            </div>
          </div>

          <div
            className="
              mt-auto flex h-10 w-full
              overflow-hidden rounded-[18px]
              bg-white

              xl:h-11
              xl:rounded-[20px]
            "
          >
            <div className="flex min-w-0 flex-1 items-center px-3">
              <span
                className="
                  truncate font-inter text-[9px]
                  font-normal text-[#667085]

                  xl:text-[10px]
                "
              >
                {instantAccess.url}
              </span>
            </div>

            <button
              type="button"
              className="
                inline-flex h-10 w-[72px]
                shrink-0 items-center justify-center
                gap-1.5 border-l border-[#D0D5DD]
                bg-white px-2
                font-inter text-[10px] font-semibold
                transition-colors

                hover:bg-[#F9FAFB]

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-inset
                focus-visible:ring-[#E6F4F2]

                xl:h-11
                xl:w-[80px]
                xl:text-[11px]
              "
            >
              <Copy
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-[#0D3B66]"
                strokeWidth={1.8}
              />

              <span className="text-[#0D3B66]">{instantAccess.copyButton}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="
          mt-4 flex w-full shrink-0
          items-center justify-between gap-3

          xl:mt-5
        "
      >
        <span className="font-inter text-[8px] font-normal text-[#98A2B3] xl:text-[9px]">
          {footer.copyright}
        </span>

        <a
          href={`mailto:${footer.email}`}
          className="
            inline-flex min-w-0 items-center gap-1.5
            font-inter text-[8px] font-normal
            text-[#98A2B3] transition-colors

            hover:text-white

            xl:text-[9px]
          "
        >
          <Mail
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0"
            strokeWidth={1.6}
          />

          <span className="truncate">{footer.email}</span>
        </a>
      </div>
    </aside>
  );
}
