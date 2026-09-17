import data from '@/data/content.json';

export default function OurValues() {
  const { ourValues } = data.careers;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[70px]
        pt-[0px]

        sm:px-5
        sm:pb-[80px]
        sm:pt-[0px]

        md:px-6
        md:pb-[90px]
        md:pt-[60px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[20px]
      "
    >
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1320px]

          rounded-t-[24px]

          bg-[linear-gradient(180deg,#F2F9F8_55%,rgba(242,249,248,0)_100%)]

          px-4
          pt-8

          sm:rounded-t-[28px]
          sm:px-6
          sm:pt-10

          md:rounded-t-[32px]
          md:px-8
          md:pt-12

          lg:rounded-t-[36px]
          lg:px-[52px]
          lg:pt-[54px]

          xl:h-[604px]
          xl:rounded-t-[40px]
          xl:px-[52px]
          xl:pt-[60px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
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
          {ourValues.heading}
        </h2>

        {/* =====================================================
            VALUES LIST
        ====================================================== */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-3

            sm:mt-8

            md:mt-9

            lg:mt-10

            xl:gap-[10px]
          "
        >
          {ourValues.items.map((item) => (
            <article
              key={item.id}
              className="
                grid
                w-full

                grid-cols-[38px_1fr]
                items-start

                gap-x-3
                gap-y-1

                rounded-[16px]

                border
                border-[#DFE6EBB2]

                bg-white

                px-4
                py-4

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:grid-cols-[42px_145px_1fr]
                sm:items-center
                sm:gap-x-4
                sm:rounded-[18px]
                sm:px-5

                md:grid-cols-[45px_175px_1fr]
                md:rounded-[20px]
                md:px-6
                md:py-5

                lg:grid-cols-[46px_220px_1fr]
                lg:rounded-[22px]
                lg:px-[26px]

                xl:h-[77.6px]
                xl:grid-cols-[42px_230px_1fr]
                xl:gap-[32px]
                xl:rounded-[24px]
                xl:px-[28px]
                xl:py-[24px]
              "
            >
              {/* =================================================
                  NUMBER
              ================================================== */}
              <span
                className="
                  font-inter
                  text-[12px]
                  font-bold
                  leading-[18px]

                  tracking-[0]

                  text-[#40A79C]

                  sm:text-[13px]

                  xl:text-[14px]
                  xl:leading-[20px]
                "
              >
                {item.number}
              </span>

              {/* =================================================
                  CARD HEADING
              ================================================== */}
              <h3
                className="
                  font-red-hat-display
                  font-[645]

                  text-[16px]
                  leading-[24px]

                  tracking-[0]

                  text-[#031527]

                  sm:text-[17px]
                  sm:leading-[26px]

                  xl:text-[18px]
                  xl:leading-[28px]
                "
              >
                {item.title}
              </h3>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <p
                className="
                  col-start-2

                  font-red-hat-display
                  font-[550]

                  text-[13px]
                  leading-[20px]

                  tracking-[0]

                  !text-[#576574]

                  sm:col-start-auto
                  sm:text-[14px]
                  sm:leading-[21px]

                  md:text-[15px]
                  md:leading-[22px]

                  xl:text-[16px]
                  xl:leading-[24px]
                "
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
