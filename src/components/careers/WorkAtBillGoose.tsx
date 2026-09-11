'use client';

import data from '@/data/content.json';

export default function WorkAtBillGoose() {
  const { workAtBillGoose } = data.careers;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[100px]
        pt-[60px]

        sm:px-5
        sm:pb-[120px]
        sm:pt-[70px]

        md:px-6
        md:pb-[140px]
        md:pt-[80px]

        lg:px-8
        lg:pb-[160px]
        lg:pt-[90px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        {/* =====================================================
            HEADING
        ====================================================== */}
        <div className="text-center">
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
            {workAtBillGoose.heading}
          </h2>

          <p
            className="
              mt-3

              font-red-hat-display
              font-[467]

              text-[14px]
              leading-[20px]

              !text-[#576574]

              sm:text-[15px]

              md:text-[16px]

              lg:text-[17px]

              xl:text-[18px]
            "
          >
            {workAtBillGoose.subheading}
          </p>
        </div>

        {/* =====================================================
            STACKING TESTIMONIALS
        ====================================================== */}
        <div
          className="
            mt-10

            sm:mt-12

            md:mt-14

            lg:mt-16
          "
        >
          {workAtBillGoose.testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="
                sticky

                overflow-hidden

                rounded-[20px]

                px-5
                py-7

                text-white

                sm:rounded-[22px]
                sm:px-7
                sm:py-8

                md:rounded-[24px]
                md:px-8
                md:py-9

                lg:rounded-[28px]
                lg:px-[54px]
                lg:py-[52px]

                xl:min-h-[460px]
                xl:rounded-[30px]
                xl:px-[64px]
                xl:py-[58px]
              "
              style={{
                top: `${90 + index * 24}px`,
                zIndex: index + 1,
                background: testimonial.background,
                marginTop: index === 0 ? '0px' : '28px',
              }}
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-8

                  md:grid-cols-[1fr_1fr]
                  md:gap-10

                  lg:gap-[70px]

                  xl:grid-cols-[1fr_1fr]
                  xl:gap-[90px]
                "
              >
                {/* =================================================
                    LEFT QUOTE
                ================================================== */}
                <div
                  className="
                    flex
                    flex-col
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        max-w-[520px]

                        font-red-hat-display
                        font-[645]

                        text-[24px]
                        leading-[32px]

                        tracking-[0]

                        !text-white

                        sm:text-[28px]
                        sm:leading-[36px]

                        md:text-[30px]
                        md:leading-[39px]

                        lg:text-[34px]
                        lg:leading-[43px]

                        xl:text-[36px]
                        xl:leading-[46px]
                      "
                    >
                      {testimonial.quote}
                    </p>

                    <div className="mt-8">
                      <p
                        className="
                          font-red-hat-display
                          font-[645]

                          text-[15px]
                          leading-[22px]

                          !text-white

                          sm:text-[16px]

                          lg:text-[17px]
                        "
                      >
                        — {testimonial.name}
                      </p>

                      <p
                        className="
                          mt-1

                          font-red-hat-display
                          font-[467]

                          text-[13px]
                          leading-[19px]

                          !text-white/80

                          sm:text-[14px]
                        "
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* DOTS */}
                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      gap-2
                    "
                    aria-hidden="true"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
                  </div>
                </div>

                {/* =================================================
                    RIGHT DESCRIPTION
                ================================================== */}
                <div
                  className="
                    space-y-5

                    font-red-hat-display
                    font-[467]

                    text-[14px]
                    leading-[22px]

                    text-white

                    sm:text-[15px]
                    sm:leading-[23px]

                    md:text-[15px]
                    md:leading-[24px]

                    lg:text-[16px]
                    lg:leading-[25px]

                    xl:text-[17px]
                    xl:leading-[27px]
                  "
                >
                  {testimonial.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="!text-white"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
