import data from '@/data/content.json';

export default function WhyWeCreatedBillGoose() {
  const { whyWeCreated } = data.aboutUs;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[60px]
        pt-[0px]

        sm:px-5
        sm:pb-[70px]
        sm:pt-[30px]

        md:px-6
        md:pb-[80px]
        md:pt-[36px]

        lg:px-8
        lg:pb-[96px]
        lg:pt-[40px]
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1216px]

          flex-col
          justify-center

          rounded-[20px]

          bg-[linear-gradient(99.84deg,#002B56_0.73%,#01ACA7_108.32%)]

          px-5
          py-8

          sm:rounded-[22px]
          sm:px-7
          sm:py-9

          md:min-h-[280px]
          md:rounded-[24px]
          md:px-10
          md:py-10

          lg:min-h-[320px]
          lg:rounded-[28px]
          lg:px-[50px]
          lg:py-[45px]

          xl:h-[355px]
          xl:min-h-[355px]
          xl:rounded-[30px]
          xl:px-[60px]
          xl:py-[50px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
            font-red-hat-display
            font-[645]

            text-[28px]
            leading-[34px]

            tracking-[0]

            text-white

            sm:text-[32px]
            sm:leading-[40px]

            md:text-[38px]
            md:leading-[46px]

            lg:text-[44px]
            lg:leading-[52px]

            xl:text-[48px]
            xl:leading-[56px]
          "
        >
          {whyWeCreated.heading}
        </h2>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
        <div
          className="
            mt-5
            max-w-[1096px]

            space-y-0

            font-red-hat-display
            font-[467]

            text-[14px]
            leading-[160%]

            tracking-[0.01em]

            sm:text-[15px]

            md:mt-6
            md:text-[16px]
            md:leading-[165%]

            lg:text-[18px]
            lg:leading-[170%]

            xl:text-[20px]
            xl:leading-[174%]
          "
        >
          {whyWeCreated.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-white"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
