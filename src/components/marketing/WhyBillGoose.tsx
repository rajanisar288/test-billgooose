import Image from 'next/image';

import data from '@/data/content.json';

export default function WhyBillGoose() {
  const { whyBillGoose } = data;

  return (
    <section className="w-full bg-white px-2 pb-[72px] min-[360px]:px-3 min-[390px]:px-5 min-[390px]:pb-[100px] lg:px-8">
      <div className="mx-auto w-full max-w-[1216px]">
        <div className="relative mx-auto min-h-[548px] w-full max-w-[400px] overflow-hidden rounded-[18px] bg-[#082A49] px-3 py-5 min-[360px]:min-h-[580px] min-[360px]:rounded-[19px] min-[360px]:px-[14px] min-[360px]:py-6 min-[390px]:min-h-[612px] min-[390px]:rounded-[20px] min-[390px]:px-4 min-[390px]:py-6 lg:min-h-[800px] lg:max-w-none lg:rounded-[30px] lg:px-14 lg:py-14">
          {/* Desktop background image */}
          <Image
            src={whyBillGoose.backgroundImage}
            alt=""
            fill
            sizes="(max-width: 1023px) 0px, (max-width: 1279px) 100vw, 1216px"
            className="hidden object-cover object-center lg:block"
          />

          {/* Desktop overlay */}
          <div className="pointer-events-none absolute inset-0 hidden bg-secondary/10 lg:block" />

          <div className="relative z-10">
            {/* Top badge */}
            <div className="flex justify-center">
              <div className="inline-flex min-h-[26px] items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm min-[390px]:min-h-[28px] min-[390px]:gap-2 min-[390px]:px-3 min-[390px]:py-1.5 lg:min-h-[32px]">
                <Image
                  src={whyBillGoose.badge.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-4 w-4 object-contain min-[390px]:h-[18px] min-[390px]:w-[18px] lg:h-5 lg:w-5"
                />

                <span className="font-red-hat-display text-[10px] font-[467] leading-none text-white min-[360px]:text-[11px] min-[390px]:text-[12px] lg:text-[14px] lg:font-medium">
                  {whyBillGoose.badge.text}
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mx-auto mt-4 max-w-[320px] text-center min-[360px]:max-w-[340px] min-[390px]:mt-5 min-[390px]:max-w-[360px] lg:max-w-[720px]">
              <h2
                className="
    font-red-hat-display text-[26px] font-[645] leading-[31px] tracking-[0] text-white
    min-[360px]:text-[28px] min-[360px]:leading-[33px]
    min-[390px]:text-[30px] min-[390px]:leading-[36px]
    lg:text-[44px] lg:font-extrabold lg:leading-[52px] lg:tracking-[0]
  "
              >
                {whyBillGoose.heading}
              </h2>

              <p className="mx-auto mt-2.5 max-w-[285px] font-red-hat-display text-[11px] font-[467] leading-[15px] text-white min-[360px]:max-w-[305px] min-[360px]:text-[12px] min-[390px]:mt-3 min-[390px]:max-w-[325px] min-[390px]:text-[13px] min-[390px]:leading-[17px] lg:mt-4 lg:max-w-none lg:text-[18px] lg:leading-[1.5]">
                {whyBillGoose.description}
              </p>
            </div>

            {/* Cards */}
            <div className="mt-6 grid grid-cols-1 justify-items-center gap-3 min-[360px]:mt-7 min-[390px]:mt-7 min-[390px]:gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-6">
              {whyBillGoose.items.map((item) => (
                <article
                  key={item.id}
                  className="flex h-[100px] w-full max-w-[344px] items-center gap-2.5 rounded-[14px] border border-[#EAECF0] border-t-[#DFE6EBB2] bg-white p-3 shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[360px]:h-[106px] min-[360px]:max-w-[352px] min-[360px]:gap-3 min-[360px]:rounded-[15px] min-[360px]:p-[14px] min-[390px]:h-[114px] min-[390px]:max-w-[368px] min-[390px]:rounded-[16px] min-[390px]:p-4 lg:min-h-[434px] lg:max-w-[349px] lg:flex-col lg:gap-0 lg:rounded-[28px] lg:border-0 lg:p-[13px]"
                >
                  {/* Mobile image */}
                  <div className="relative h-[70px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[#EEFFFB] min-[360px]:h-[74px] min-[360px]:w-[60px] min-[390px]:h-[80px] min-[390px]:w-[64px] lg:hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 389px) 60px, 64px"
                      className="object-contain object-center"
                    />
                  </div>

                  {/* Desktop image */}
                  <div className="relative hidden h-[259px] w-full overflow-hidden rounded-[20px] bg-[#EEFFFB] lg:block">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={214}
                      height={264}
                      className="absolute bottom-0 left-1/2 h-[264px] w-[214px] -translate-x-1/2 object-contain"
                    />
                  </div>

                  {/* Card content */}
                  <div className="min-w-0 flex-1 text-left lg:flex lg:flex-1 lg:flex-col lg:px-4 lg:pb-5 lg:pt-5 lg:text-center">
                    <h3 className="font-red-hat-display text-[15px] font-[645] leading-[22px] tracking-[0] text-secondary min-[360px]:text-[16px] min-[360px]:leading-[24px] min-[390px]:text-[18px] min-[390px]:leading-[28px] lg:text-[20px] lg:font-bold lg:leading-[1.3]">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 font-red-hat-display text-[10px] font-[467] leading-[14px] tracking-[0] text-[#576574] min-[360px]:text-[11px] min-[360px]:leading-[15px] min-[390px]:text-[12px] min-[390px]:leading-[16px] lg:mt-3 lg:font-inter lg:text-[16px] lg:leading-[1.5]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
