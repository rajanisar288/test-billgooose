import Link from 'next/link';

import data from '@/data/content.json';

export default function AboutHero() {
  const { aboutUs } = data;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[60px]
        pt-[36px]

        sm:px-5
        sm:pb-[70px]
        sm:pt-[46px]

        md:px-6
        md:pb-[80px]
        md:pt-[54px]

        lg:px-8
        lg:pb-[96px]
        lg:pt-[62px]
      "
    >
      {/* =====================================================
          WHOLE ABOUT CONTAINER
          Radius applies to heading + image section
      ====================================================== */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1360px]

          overflow-hidden

          rounded-[30px]

          border
          border-[#EAECF0]

          bg-white
        "
      >
        {/* =====================================================
            PAGE HEADING
        ====================================================== */}
        <div
          className="
            bg-white

            px-4
            pb-[34px]
            pt-[36px]

            sm:px-6
            sm:pb-[40px]
            sm:pt-[42px]

            md:px-8
            md:pb-[46px]
            md:pt-[48px]

            lg:px-10
            lg:pb-[54px]
            lg:pt-[56px]

            xl:pb-[60px]
            xl:pt-[62px]
          "
        >
          <div className="text-center">
            <h1
              className="
                font-red-hat-display
                font-[645]

                text-[36px]
                leading-[42px]

                text-[#0C3354]

                sm:text-[44px]
                sm:leading-[52px]

                md:text-[54px]
                md:leading-[62px]

                lg:text-[60px]
                lg:leading-[68px]

                xl:text-[68.12px]
                xl:leading-[75.69px]
              "
            >
              {aboutUs.heading}
            </h1>

            <div
              className="
                mt-4

                flex
                items-center
                justify-center
                gap-2

                font-red-hat-display
                text-[13px]
                font-[467]
                leading-none

                text-[#0C3354]

                sm:text-[14px]

                md:mt-5
                md:text-[16px]

                xl:text-[18px]
              "
            >
              <Link
                href={aboutUs.breadcrumb.home.href}
                className="
                  underline
                  decoration-[1px]
                  underline-offset-[3px]

                  transition-colors

                  hover:text-[#00897B]
                "
              >
                {aboutUs.breadcrumb.home.label}
              </Link>

              <span aria-hidden="true">›</span>

              <span>{aboutUs.breadcrumb.current}</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN IMAGE SECTION
        ====================================================== */}
        <div
          className="
            relative

            min-h-[650px]
            w-full

            overflow-hidden

            bg-white

            sm:min-h-[720px]

            md:min-h-[760px]

            lg:min-h-[820px]

            xl:min-h-[900px]
          "
          style={{
            backgroundImage: `url(${aboutUs.backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div
            className="
              relative
              z-10

              px-5
              pt-[62px]

              sm:px-8
              sm:pt-[72px]

              md:w-[62%]
              md:px-10
              md:pt-[84px]

              lg:w-[56%]
              lg:px-[72px]
              lg:pt-[104px]

              xl:w-[52%]
              xl:px-[80px]
              xl:pt-[112px]
            "
          >
            <h2
              className="
                max-w-[620px]

                font-red-hat-display
                font-[645]

                text-[30px]
                leading-[36px]

                text-[#0C3354]

                sm:text-[34px]
                sm:leading-[40px]

                md:text-[38px]
                md:leading-[44px]

                lg:text-[44px]
                lg:leading-[52px]

                xl:text-[48px]
                xl:leading-[56px]
              "
            >
              {aboutUs.content.heading}
            </h2>

            <div
              className="
                mt-8

                max-w-[650px]

                space-y-6

                font-red-hat-display
                text-[14px]
                font-[467]
                leading-[150%]

                text-[#101828]

                sm:mt-9
                sm:text-[15px]

                md:mt-10
                md:text-[16px]

                lg:mt-11
                lg:text-[17px]

                xl:mt-12
                xl:text-[18px]
              "
            >
              {aboutUs.content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h3
              className="
                mt-8

                font-red-hat-display
                font-[645]

                text-[20px]
                leading-[30px]

                text-[#0C3354]

                sm:text-[22px]

                md:text-[24px]
                md:leading-[36px]

                lg:mt-10
                lg:text-[26px]
                lg:leading-[46px]

                xl:text-[28px]
                xl:leading-[56px]
              "
            >
              {aboutUs.content.bottomHeading}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
