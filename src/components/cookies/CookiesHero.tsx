import Link from 'next/link';

import data from '@/data/content.json';

export default function CookiesHero() {
  const { cookiesHero } = data as {
    cookiesHero: {
      heading: string;
      breadcrumb: {
        homeLabel: string;
        homeHref: string;
        currentLabel: string;
      };
    };
  };

  const { heading, breadcrumb } = cookiesHero;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pt-3
        pb-6

        sm:px-5

        lg:px-8
        lg:pt-5
        lg:pb-8
      "
    >
      <div className="mx-auto w-full max-w-[1320px]">
        {/* OUTER GRADIENT BORDER WRAPPER */}
        <div
          className="
            relative

            h-auto
            min-h-[220px]

            rounded-[24px]

            p-px

            sm:min-h-[240px]
            sm:rounded-[28px]

            lg:h-[272px]
            lg:min-h-[272px]
            lg:rounded-[30px]
          "
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 168, 149, 0.35) 0%, rgba(0, 168, 149, 0) 100%)',
          }}
        >
          {/* INNER CARD — light mint fading to white */}
          <div
            className="
              relative

              flex
              h-full
              w-full
              flex-col
              items-center
              justify-center

              overflow-hidden

              rounded-[23px]

              px-4
              py-10

              text-center

              sm:rounded-[27px]
              sm:px-6

              lg:rounded-[29px]
              lg:px-8
            "
            style={{
              background: 'linear-gradient(180deg, #EEFFFB 0%, #FFFFFF 100%)',
            }}
          >
            <h1
              className="
                font-red-hat-display

                text-[34px]
                font-extrabold
                leading-[42px]
                tracking-[-0.6px]

                text-[#082A49]

                sm:text-[44px]
                sm:leading-[52px]
                sm:tracking-[-0.9px]

                lg:text-[56px]
                lg:leading-[64px]
                lg:tracking-[-1.2px]
              "
            >
              {heading}
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="
                mt-4

                flex
                items-center
                justify-center
                gap-2

                font-inter
                text-[13px]
                font-medium
                leading-5

                text-[#475467]

                sm:mt-5
                sm:text-[14px]

                lg:mt-5
                lg:text-[15px]
              "
            >
              <Link
                href={breadcrumb.homeHref}
                className="
                  underline
                  underline-offset-[3px]

                  transition-colors

                  hover:text-[#00897B]
                "
              >
                {breadcrumb.homeLabel}
              </Link>

              <span
                aria-hidden="true"
                className="text-[#98A2B3]"
              >
                ›
              </span>

              <span className="text-[#475467]">{breadcrumb.currentLabel}</span>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
