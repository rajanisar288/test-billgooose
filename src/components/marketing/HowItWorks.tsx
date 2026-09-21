import Image from 'next/image';

import data from '@/data/content.json';

export default function HowItWorks() {
  const { howItWorks } = data;

  return (
    <section className="w-full bg-white px-3 pb-[72px] min-[360px]:px-4 min-[390px]:px-5 min-[390px]:pb-[100px] lg:px-8">
      <div className="mx-auto w-full max-w-[1216px]">
        {/* Section label */}
        <div className="flex justify-center">
          <div className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-[#EAECF0] bg-white px-2.5 py-1 shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[390px]:min-h-[32px] min-[390px]:gap-2 min-[390px]:px-3 min-[390px]:py-1.5">
            <Image
              src={howItWorks.badge.icon}
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 object-contain min-[390px]:h-5 min-[390px]:w-5"
            />

            <span className="font-red-hat-display text-[11px] font-medium leading-none text-[#0C111D] min-[390px]:text-[14px]">
              {howItWorks.badge.text}
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h2 className="mx-auto mt-4 max-w-[280px] text-center font-red-hat-display text-[28px] font-[645] leading-[32px] tracking-[0] text-secondary min-[360px]:max-w-[310px] min-[360px]:text-[30px] min-[360px]:leading-[34px] min-[390px]:mt-5 min-[390px]:max-w-[340px] min-[390px]:text-[32px] min-[390px]:leading-[36px] sm:max-w-[850px] sm:text-[38px] font-extrabold lg:text-[44px] lg:font-extrabold lg:leading-[1.12] lg:tracking-[-1px]">
          {howItWorks.heading}
        </h2>

        {/* Steps */}
        <div className="relative mt-[42px] min-[390px]:mt-[60px]">
          {/* Mobile vertical connector */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[55px] left-[40px] top-[8px] border-l border-dashed border-[#C7DCE3] min-[360px]:left-[44px] min-[390px]:left-[54px] sm:hidden"
          />

          {/* =================================================
              TABLET + DESKTOP HORIZONTAL DASHED CONNECTOR

              - Sits behind the icon containers (z-0)
              - Aligned with vertical center of the icon boxes
              - Only spans the visible width between outer icons
          ================================================= */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              z-0

              hidden

              /* align line with vertical center of icon boxes */
              sm:top-[75px]
              lg:top-[99.5px]

              /* start/end aligned to the icon column centers */
              sm:left-[125px]
              sm:right-[125px]

              lg:left-[100px]
              lg:right-[100px]

              border-t
              border-dashed
              border-[#C7DCE3]

              sm:block
            "
          />

          <div className="relative z-10 flex flex-col gap-6 min-[360px]:gap-7 min-[390px]:gap-8 sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-12 lg:grid-cols-4 lg:gap-6">
            {howItWorks.steps.map((step) => (
              <article
                key={step.id}
                className="flex w-full items-center gap-4 text-left min-[360px]:gap-5 min-[390px]:gap-6 sm:max-w-[250px] sm:flex-col sm:items-center sm:text-center"
              >
                {/* Image and step number */}
                <div className="relative shrink-0">
                  {/* Main image container — solid gradient bg so it masks the dashed line */}
                  <div className="relative z-10 flex h-[88px] w-[88px] items-center justify-center rounded-[9px] border-[0.54px] border-transparent border-t-[#00B1AA33] bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)] min-[360px]:h-[96px] min-[360px]:w-[96px] min-[360px]:rounded-[10px] min-[390px]:h-[108px] min-[390px]:w-[108px] min-[390px]:rounded-[10.84px] sm:h-[150px] sm:w-[150px] sm:rounded-[16px] lg:h-[199px] lg:w-[199px] lg:rounded-[20px] lg:border-t">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      width={111}
                      height={111}
                      className="h-[50px] w-[50px] object-contain min-[360px]:h-[56px] min-[360px]:w-[56px] min-[390px]:h-[64px] min-[390px]:w-[64px] sm:h-[82px] sm:w-[82px] lg:h-[111px] lg:w-[111px]"
                    />
                  </div>

                  {/* Step-number image */}
                  <Image
                    src={step.stepImage}
                    alt={`Step ${step.number}`}
                    width={48}
                    height={48}
                    className="absolute -left-[11px] -top-[11px] z-20 h-[23px] w-[23px] object-contain min-[360px]:-left-[12px] min-[360px]:-top-[12px] min-[360px]:h-[25px] min-[360px]:w-[25px] min-[390px]:-left-[13.66px] min-[390px]:-top-[13.57px] min-[390px]:h-[27.02px] min-[390px]:w-[27.2px] sm:-left-[14px] sm:-top-[14px] sm:h-9 sm:w-9 lg:-left-[16px] lg:-top-[16px] lg:h-12 lg:w-12"
                  />
                </div>

                {/* Step content */}
                <div className="min-w-0 flex-1 sm:flex-none">
                  <h3 className="font-red-hat-display text-[16px] font-[645] leading-[22px] tracking-[0] text-secondary min-[360px]:text-[18px] min-[360px]:leading-[25px] min-[390px]:text-[20px] min-[390px]:leading-[28px] sm:mt-5 lg:mt-6 lg:font-bold lg:leading-[1.3]">
                    {step.title}
                  </h3>

                  <p className="mt-1 max-w-[205px] font-red-hat-display text-[11px] font-[467] leading-[16px] tracking-[0] text-[#576574] min-[360px]:max-w-[220px] min-[360px]:text-[12px] min-[360px]:leading-[18px] min-[390px]:mt-1.5 min-[390px]:max-w-[235px] min-[390px]:text-[14px] min-[390px]:leading-[20px] sm:mx-auto sm:mt-2 sm:max-w-[220px] lg:leading-[1.5]">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
