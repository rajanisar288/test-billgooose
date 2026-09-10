import Image from 'next/image';

import data from '@/data/content.json';

export default function SuppliersSection() {
  const { suppliersSection } = data;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        py-[60px]

        sm:px-5
        sm:py-[70px]

        md:px-6
        md:py-[80px]

        lg:px-8
        lg:py-[90px]
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1290px]

          flex-col
          items-center

          gap-[36px]

          sm:gap-[42px]

          md:gap-[48px]

          lg:gap-[54px]

          xl:min-h-[391.46px]
          xl:gap-[60px]
        "
      >
        {/* =====================================================
            TOP CONTENT
        ====================================================== */}
        <div className="flex flex-col items-center">
          {/* ===================================================
              BADGE
          ==================================================== */}
          <div
            className="
              inline-flex
              min-h-[26px]

              items-center
              justify-center
              gap-1.5

              rounded-[12px]

              bg-white

              px-2
              py-1

              shadow-[0px_0px_0px_1px_rgba(44,64,94,0.06),0px_1px_1px_0px_rgba(44,64,94,0.04),0px_2px_4px_0px_rgba(44,64,94,0.08)]

              sm:min-h-[28px]
              sm:rounded-[13px]
              sm:px-[9px]

              xl:h-[30px]
              xl:w-[105px]
              xl:rounded-[14px]
              xl:gap-[6px]
              xl:px-[10px]
              xl:py-[5px]
            "
          >
            <Image
              src={suppliersSection.badge.icon}
              alt={suppliersSection.badge.iconAlt}
              width={20}
              height={20}
              className="
                h-[16px]
                w-[16px]
                object-contain

                sm:h-[18px]
                sm:w-[18px]

                xl:h-[20px]
                xl:w-[20px]
              "
            />

            <span
              className="
                font-red-hat-display
                font-[467]

                text-[12px]
                leading-[18px]

                tracking-[0]

                text-[#0C111D]

                sm:text-[13px]

                xl:text-[14px]
                xl:leading-[26px]
              "
            >
              {suppliersSection.badge.text}
            </span>
          </div>

          {/* ===================================================
              HEADING
          ==================================================== */}
          <h2
            className="
              mt-4

              text-center

              font-red-hat-display
              font-[645]

              text-[30px]
              leading-[36px]

              tracking-[0]

              text-[#082A49]

              sm:text-[34px]
              sm:leading-[40px]

              md:text-[38px]
              md:leading-[46px]

              lg:text-[42px]
              lg:leading-[50px]

              xl:text-[44px]
              xl:leading-[52px]
            "
          >
            {suppliersSection.heading}
          </h2>
        </div>

        {/* =====================================================
            LOGOS
        ====================================================== */}
        <div
          className="
            flex
            w-full
            flex-wrap
            items-center
            justify-center

            gap-x-[18px]
            gap-y-[20px]

            sm:gap-x-[24px]
            sm:gap-y-[22px]

            md:gap-x-[30px]
            md:gap-y-[24px]

            lg:gap-x-[34px]
            lg:gap-y-[24px]

            xl:gap-x-[28px]
            xl:gap-y-[22px]
          "
        >
          {suppliersSection.logos.map((logo) => (
            <div
              key={logo.id}
              className="
                flex
                h-[44px]
                items-center
                justify-center

                sm:h-[48px]

                md:h-[52px]

                lg:h-[56px]

                xl:h-[61px]
              "
              style={{
                width: `clamp(
                  ${Math.max(42, logo.width * 0.62)}px,
                  ${(logo.width / 1290) * 100}vw,
                  ${logo.width}px
                )`,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="
                  h-full
                  w-full
                  object-contain
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
