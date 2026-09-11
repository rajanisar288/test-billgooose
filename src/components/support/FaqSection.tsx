'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import data from '@/data/content.json';

export default function FaqSection() {
  const { faqs } = data.customerSupport;

  const [openId, setOpenId] = useState<string | null>(faqs.items[1]?.id ?? null);

  function toggleFaq(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section
      id="faqs"
      className="
        w-full
        bg-white

        px-4
        pb-[70px]
        pt-[50px]

        sm:px-6
        sm:pb-[80px]
        sm:pt-[60px]

        md:px-8
        md:pb-[90px]
        md:pt-[70px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[80px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1320px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
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
          {faqs.heading}
        </h2>

        {/* =====================================================
            FAQ LIST
        ====================================================== */}
        <div
          className="
            mx-auto
            mt-8

            flex
            w-full
            max-w-[900px]
            flex-col

            gap-3

            sm:mt-9
            sm:gap-4

            md:mt-10

            lg:gap-5
          "
        >
          {faqs.items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <article
                key={item.id}
                className={`
                  w-full

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-[#DFE6EBB2]

                  bg-white

                  shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                  transition-all
                  duration-300
                  ease-in-out

                  sm:rounded-[20px]

                  md:rounded-[22px]

                  xl:rounded-[24px]

                  ${
                    isOpen
                      ? `
                        min-h-[110px]

                        sm:min-h-[114px]

                        md:min-h-[120px]

                        xl:min-h-[124px]
                      `
                      : `
                        min-h-[72px]

                        sm:min-h-[78px]

                        md:min-h-[82px]

                        xl:h-[87px]
                        xl:min-h-[87px]
                      `
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="
                    flex
                    w-full

                    items-center
                    justify-between

                    gap-4

                    px-5
                    py-4

                    text-left

                    sm:px-6
                    sm:py-5

                    xl:px-6
                    xl:py-6
                  "
                >
                  <span
                    className="
                      font-red-hat-display
                      font-[645]

                      text-[19px]
                      leading-[26px]

                      tracking-[0]

                      text-[#0C3354]

                      sm:text-[20px]

                      md:text-[21px]

                      xl:text-[22px]
                      xl:leading-[30px]
                    "
                  >
                    {item.question}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`
                      h-5
                      w-5
                      shrink-0

                      text-[#667085]

                      transition-transform
                      duration-300

                      ${isOpen ? 'rotate-180' : ''}
                    `}
                    strokeWidth={1.8}
                  />
                </button>

                <div
                  className={`
                    grid

                    transition-[grid-template-rows,opacity]
                    duration-300
                    ease-in-out

                    ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                  `}
                >
                  <div className="overflow-hidden">
                    <p
                      className="
                        px-5
                        pb-5

                        font-red-hat-display
                        font-[467]

                        text-[13px]
                        leading-[20px]

                        tracking-[0]

                        !text-[#576574]

                        sm:px-6
                        sm:text-[14px]
                        sm:leading-[21px]

                        md:text-[15px]
                        md:leading-[22px]

                        xl:text-[16px]
                        xl:leading-[24px]
                      "
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
