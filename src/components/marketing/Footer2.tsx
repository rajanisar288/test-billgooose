import Link from 'next/link';

import data from '@/data/content.json';

export default function Footer2() {
  const { footer2 } = data;

  return (
    <footer
      className="
    w-full
    border-t
    border-[#EAECF0]
    bg-[#F9F9F9]

    lg:border-t-0
  "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]

          px-5
          pb-7
          pt-6

          min-[390px]:px-6

          md:px-8
          md:pb-8
          md:pt-6

          lg:px-10
          lg:pb-[18px]
          lg:pt-0

          xl:px-[60px]
        "
      >
        {/* =====================================================
            MOBILE ONLY
        ====================================================== */}
        <div
          className="
            flex
            flex-col
            items-center

            md:hidden
          "
        >
          {/* Copyright */}
          <p
            className="
              text-center

              font-red-hat-display
              text-[16px]
              font-[467]
              leading-[24px]
              tracking-[0]
              text-black
            "
          >
            {footer2.copyright}
          </p>

          {/* Legal links */}
          <nav
            aria-label={footer2.navigationAriaLabel}
            className="
              mt-8

              flex
              w-full
              flex-wrap
              items-center
              justify-center

              gap-x-[18px]
              gap-y-2
            "
          >
            {footer2.links.map((link, index) => (
              <div
                key={link.id}
                className="
                  flex
                  items-center
                  gap-[18px]
                "
              >
                <Link
                  href={link.href}
                  className="
                    whitespace-nowrap

                    font-red-hat-display
                    text-[16px]
                    font-[550]
                    leading-[24px]
                    tracking-[0]
                    text-black

                    underline
                    decoration-[0.8px]
                    underline-offset-[3px]

                    transition-opacity

                    hover:opacity-70
                  "
                >
                  {link.label}
                </Link>

                {index < footer2.links.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="
                      text-[15px]
                      font-[550]
                      leading-[24px]
                      text-black
                    "
                  >
                    •
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* =====================================================
            TABLET ONLY
        ====================================================== */}
        <div
          className="
            hidden

            md:flex
            md:flex-row
            md:items-center
            md:justify-between
            md:gap-4

            lg:hidden
          "
        >
          {/* Copyright */}
          <p
            className="
              shrink-0

              font-red-hat-display
              text-[16px]
              font-[467]
              leading-[20px]
              tracking-[0]
              text-black
            "
          >
            {footer2.copyright}
          </p>

          {/* Legal links */}
          <nav
            aria-label={footer2.navigationAriaLabel}
            className="
              flex
              flex-wrap
              items-center
              justify-end
              gap-x-3
              gap-y-2
            "
          >
            {footer2.links.map((link, index) => (
              <div
                key={link.id}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Link
                  href={link.href}
                  className="
                    whitespace-nowrap

                    font-red-hat-display
                    text-[16px]
                    font-[550]
                    leading-[24px]
                    tracking-[0]
                    text-black

                    underline
                    decoration-[0.8px]
                    underline-offset-[2px]

                    transition-opacity

                    hover:opacity-70
                  "
                >
                  {link.label}
                </Link>

                {index < footer2.links.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="
                      text-[16px]
                      font-[550]
                      leading-[24px]
                      text-black
                    "
                  >
                    •
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* =====================================================
            DESKTOP ONLY
        ====================================================== */}
        <div className="hidden lg:block">
          {/* Top divider */}
          <div
            aria-hidden="true"
            className="
              h-px
              w-full
              bg-[#E9EAEB]
            "
          />

          <div
            className="
              flex
              min-h-[61px]
              w-full
              items-center
              justify-between
              gap-8
            "
          >
            {/* Copyright - LEFT */}
            <p
              className="
                shrink-0

                font-red-hat-display
                text-[16px]
                font-[467]
                leading-[10px]
                tracking-[0]
                text-black
              "
            >
              {footer2.copyright}
            </p>

            {/* Links - RIGHT */}
            <nav
              aria-label={footer2.navigationAriaLabel}
              className="
                ml-auto
                flex
                shrink-0
                items-center
                justify-end
                gap-[14px]
              "
            >
              {footer2.links.map((link, index) => (
                <div
                  key={link.id}
                  className="
                    flex
                    items-center
                    gap-[14px]
                  "
                >
                  <Link
                    href={link.href}
                    className="
                      whitespace-nowrap

                      font-red-hat-display
                      text-[16px]
                      font-[550]
                      leading-[24px]
                      tracking-[0]
                      text-black

                      underline
                      decoration-[0.8px]
                      underline-offset-[2px]

                      transition-opacity

                      hover:opacity-70
                    "
                  >
                    {link.label}
                  </Link>

                  {index < footer2.links.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="
                        text-[16px]
                        font-[550]
                        leading-[24px]
                        text-black
                      "
                    >
                      •
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
