import data from '@/data/content.json';

export default function WhatItsLike() {
  const { careers } = data;

  return (
    <section
      className="
        w-full
        bg-white

        px-4
        pb-[0px]

        sm:px-6
        sm:pb-[0px]

        md:px-8
        md:pb-[80px]

        lg:px-8
        lg:pb-[90px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div
          className="
            w-full

            rounded-[20px]

            border
            border-t
            border-[#DFE6EBB2]

            bg-white

            p-5

            shadow-[0px_8px_24px_0px_#0F1E3C0F,0px_1px_2px_0px_#0F1E3C0A]

            sm:rounded-[24px]
            sm:p-6

            lg:rounded-[28px]
            lg:p-[30px]
          "
        >
          {/* HEADING */}
          <h2
            className="
              font-red-hat-display
              font-[645]

              text-[20px]
              leading-[28px]
              tracking-[0]

              text-[#0C3354]

              sm:text-[22px]
              sm:leading-[32px]

              lg:text-[26px]
              lg:leading-[36.4px]
            "
          >
            {careers.whatItsLike.heading}
          </h2>

          {/* DESCRIPTION */}
          <div
            className="
              mt-3

              space-y-4

              font-red-hat-display
              font-[467]

              text-[15px]
              leading-[24px]
              tracking-[0.02em]

              text-[#576574]

              sm:mt-4
              sm:text-[16px]
              sm:leading-[26px]

              lg:mt-4
              lg:text-[18px]
              lg:leading-[28px]
            "
          >
            {careers.whatItsLike.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="!text-[#576574]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
