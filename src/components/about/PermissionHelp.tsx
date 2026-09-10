import Image from 'next/image';

import data from '@/data/content.json';

export default function PermissionHelp() {
  const { permissionHelp } = data.aboutUs;

  const topItems = permissionHelp.items.slice(0, 3);
  const bottomItems = permissionHelp.items.slice(3);

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[70px]
        pt-[30px]

        sm:px-5
        sm:pb-[80px]
        sm:pt-[36px]

        md:px-6
        md:pb-[90px]
        md:pt-[44px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[52px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1216px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
            mx-auto
            max-w-[700px]

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
          {permissionHelp.heading}
        </h2>

        {/* =====================================================
            TOP 3 CARDS
        ====================================================== */}
        <div
          className="
            mt-8

            grid
            grid-cols-1
            gap-4

            sm:mt-9
            sm:gap-5

            md:grid-cols-3
            md:gap-4

            lg:mt-10
            lg:gap-5

            xl:gap-5
          "
        >
          {topItems.map((item) => (
            <article
              key={item.id}
              className="
                flex
                min-h-[220px]
                w-full
                flex-col

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[235px]
                sm:rounded-[22px]
                sm:p-6

                md:min-h-[245px]
                md:rounded-[24px]
                md:p-5

                lg:min-h-[265px]
                lg:rounded-[26px]
                lg:p-6

                xl:h-[282px]
                xl:min-h-[282px]
                xl:w-[392px]
                xl:rounded-[28px]
                xl:p-[30px]
              "
            >
              {/* ICON */}
              <div
                className="
                  flex
                  h-[60px]
                  w-[60px]
                  shrink-0

                  items-center
                  justify-center

                  rounded-[12px]

                  bg-[#EEF9F9]

                  sm:h-[64px]
                  sm:w-[64px]
                  sm:rounded-[13px]

                  md:h-[68px]
                  md:w-[68px]
                  md:rounded-[14px]

                  lg:h-[74px]
                  lg:w-[74px]
                  lg:rounded-[15px]

                  xl:h-[80px]
                  xl:w-[80px]
                  xl:rounded-[16px]
                "
              >
                <Image
                  src={item.icon}
                  alt={item.iconAlt}
                  width={40}
                  height={40}
                  className="
                    h-[30px]
                    w-[30px]
                    object-contain

                    sm:h-[32px]
                    sm:w-[32px]

                    md:h-[34px]
                    md:w-[34px]

                    lg:h-[36px]
                    lg:w-[36px]

                    xl:h-[40px]
                    xl:w-[40px]
                  "
                />
              </div>

              {/* TITLE */}
              <h3
                className="
                  mt-5

                  font-red-hat-display
                  font-[645]

                  text-[21px]
                  leading-[28px]

                  tracking-[0]

                  text-[#0C3354]

                  sm:text-[22px]
                  sm:leading-[30px]

                  md:text-[22px]
                  md:leading-[30px]

                  lg:text-[24px]
                  lg:leading-[34px]

                  xl:text-[26px]
                  xl:leading-[36.4px]
                "
              >
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className="
                  mt-2

                  font-red-hat-display
                  font-[467]

                  text-[14px]
                  leading-[20px]

                  tracking-[0]

                  text-[#576574]

                  sm:text-[15px]
                  sm:leading-[21px]

                  md:text-[14px]
                  md:leading-[20px]

                  lg:text-[16px]
                  lg:leading-[22px]

                  xl:text-[18px]
                  xl:leading-[24px]
                "
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>

        {/* =====================================================
            BOTTOM 2 CARDS
        ====================================================== */}
        <div
          className="
            mt-4

            grid
            grid-cols-1
            gap-4

            sm:mt-5
            sm:gap-5

            md:grid-cols-2

            lg:gap-5
          "
        >
          {bottomItems.map((item) => (
            <article
              key={item.id}
              className="
                flex
                min-h-[160px]
                w-full

                items-start
                gap-4

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:rounded-[22px]
                sm:p-6

                md:min-h-[170px]
                md:rounded-[24px]

                lg:rounded-[26px]
                lg:p-7

                xl:h-[182px]
                xl:min-h-[182px]
                xl:w-[598px]
                xl:rounded-[28px]
                xl:gap-5
                xl:p-[30px]
              "
            >
              {/* ICON */}
              <div
                className="
                  flex
                  h-[60px]
                  w-[60px]
                  shrink-0

                  items-center
                  justify-center

                  rounded-[12px]

                  bg-[#EEF9F9]

                  sm:h-[64px]
                  sm:w-[64px]
                  sm:rounded-[13px]

                  md:h-[68px]
                  md:w-[68px]
                  md:rounded-[14px]

                  lg:h-[74px]
                  lg:w-[74px]
                  lg:rounded-[15px]

                  xl:h-[80px]
                  xl:w-[80px]
                  xl:rounded-[16px]
                "
              >
                <Image
                  src={item.icon}
                  alt={item.iconAlt}
                  width={40}
                  height={40}
                  className="
                    h-[30px]
                    w-[30px]
                    object-contain

                    sm:h-[32px]
                    sm:w-[32px]

                    md:h-[34px]
                    md:w-[34px]

                    lg:h-[36px]
                    lg:w-[36px]

                    xl:h-[40px]
                    xl:w-[40px]
                  "
                />
              </div>

              {/* CONTENT */}
              <div className="min-w-0 flex-1">
                <h3
                  className="
                    font-red-hat-display
                    font-[645]

                    text-[21px]
                    leading-[28px]

                    tracking-[0]

                    text-[#0C3354]

                    sm:text-[22px]
                    sm:leading-[30px]

                    lg:text-[24px]
                    lg:leading-[34px]

                    xl:text-[26px]
                    xl:leading-[36.4px]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2

                    font-red-hat-display
                    font-[467]

                    text-[14px]
                    leading-[20px]

                    tracking-[0]

                    text-[#576574]

                    sm:text-[15px]
                    sm:leading-[21px]

                    lg:text-[16px]
                    lg:leading-[22px]

                    xl:text-[18px]
                    xl:leading-[24px]
                  "
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
