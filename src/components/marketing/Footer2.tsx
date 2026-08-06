import Link from 'next/link';

import data from '@/data/content.json';

export default function Footer2() {
  const { footer2 } = data;

  return (
    <footer className="w-full bg-[#F9F9F9]">
      <div
        className="
          mx-auto flex w-full max-w-[1440px]
          flex-col gap-4
          border-t border-[#E5E5E5]
          px-5 py-6

          min-[390px]:px-6

          md:flex-row
          md:items-center
          md:justify-between
          md:gap-8
          md:px-8

          lg:h-[96px]
          lg:px-[60px]
          lg:pb-[40px]
          lg:pt-[32px]
        "
      >
        {/* Copyright */}
        <p
          className="
            font-red-hat-display
            text-[12px] font-[467]
            leading-[18px] tracking-[0]
            text-black

            min-[390px]:text-[13px]

            md:whitespace-nowrap

            lg:text-[16px]
            lg:leading-[10px]
          "
        >
          {footer2.copyright}
        </p>

        {/* Legal links */}
        <nav
          aria-label={footer2.navigationAriaLabel}
          className="
            flex flex-wrap items-center
            gap-x-3 gap-y-2

            md:justify-end

            lg:gap-x-4
          "
        >
          {footer2.links.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center gap-3 lg:gap-4"
            >
              <Link
                href={link.href}
                className="
                  font-red-hat-display
                  text-[12px] font-[550]
                  leading-5 tracking-[0]
                  text-black underline
                  decoration-[0.8px]
                  underline-offset-[2px]

                  transition-opacity
                  duration-200
                  hover:opacity-70

                  focus-visible:rounded-sm
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#00897B]
                  focus-visible:ring-offset-2

                  min-[390px]:text-[13px]

                  lg:text-[16px]
                  lg:leading-6
                  lg:decoration-[0.8px]
                  lg:underline-offset-[3px]
                "
              >
                {link.label}
              </Link>

              {index < footer2.links.length - 1 && (
                <span
                  aria-hidden="true"
                  className="
                    font-red-hat-display
                    text-[11px] font-[467]
                    leading-none text-black

                    lg:text-[12px]
                  "
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
