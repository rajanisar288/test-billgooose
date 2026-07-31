import Image from 'next/image';

import data from '@/data/content.json';

export default function Trust() {
  const { trust } = data;

  return (
    <section className="w-full bg-white px-3 pb-[72px] min-[360px]:px-4 min-[390px]:px-5 min-[390px]:pb-[100px] lg:px-8">
      <div className="mx-auto w-full max-w-[1216px]">
        {/* Trust badge */}
        <div className="flex justify-center">
          <div className="inline-flex h-[28px] items-center gap-1.5 rounded-full border border-[#EAECF0] bg-white px-2.5 shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[390px]:h-[30px] min-[390px]:gap-2 min-[390px]:px-3">
            <Image
              src={trust.badge.icon}
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 object-contain min-[390px]:h-5 min-[390px]:w-5"
            />

            <span className="font-red-hat-display text-[11px] font-medium leading-none text-[#0C111D] min-[360px]:text-[12px] min-[390px]:text-[14px]">
              {trust.badge.text}
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-4 max-w-[300px] text-center font-red-hat-display text-[26px] font-extrabold leading-[32px] tracking-[0] text-secondary min-[360px]:max-w-[330px] min-[360px]:text-[28px] min-[360px]:leading-[34px] min-[390px]:mt-5 min-[390px]:max-w-[370px] min-[390px]:text-[30px] min-[390px]:leading-[36px] sm:max-w-[720px] sm:text-[38px] lg:text-[44px] lg:font-extrabold lg:leading-[52px] lg:tracking-normal">
          {trust.heading}
        </h2>

        {/* Trust cards */}
        <div className="mt-[36px] grid grid-cols-2 justify-items-center gap-3 min-[360px]:gap-3.5 min-[390px]:mt-[40px] min-[390px]:gap-4 md:grid-cols-2 lg:mt-[60px] lg:grid-cols-3 lg:gap-5">
          {trust.items.map((item) => (
            <article
              key={item.id}
              className="flex h-[165px] w-full max-w-[168px] flex-col rounded-[16px] border border-[#EAECF0] border-t-[#DFE6EBB2] bg-white p-3 shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[360px]:h-[174px] min-[360px]:max-w-[178px] min-[360px]:rounded-[18px] min-[360px]:p-[14px] min-[390px]:h-[183px] min-[390px]:max-w-[192px] min-[390px]:rounded-[20px] min-[390px]:p-4 lg:min-h-[178px] lg:max-w-[394px] lg:rounded-[24px] lg:border-t lg:p-6"
            >
              {/* Icon container */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] bg-[#0128540D] min-[390px]:h-11 min-[390px]:w-11 min-[390px]:rounded-[20px]">
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-[18px] w-[18px] object-contain min-[390px]:h-5 min-[390px]:w-5"
                />
              </div>

              {/* Card content */}
              <h3 className="mt-3 font-red-hat-display text-[14px] font-[645] leading-[18px] tracking-[0] text-secondary min-[360px]:text-[15px] min-[360px]:leading-[19px] min-[390px]:mt-4 min-[390px]:text-[16px] min-[390px]:leading-[20px] lg:mt-5 lg:font-bold lg:leading-[1.3]">
                {item.title}
              </h3>

              <p className="mt-1.5 font-inter text-[10px] font-normal leading-[12px] tracking-[0] text-[#576574] min-[360px]:text-[11px] min-[360px]:leading-[13px] min-[390px]:mt-2 min-[390px]:text-[12px] min-[390px]:leading-[12px] lg:text-[14px] lg:leading-[1.5]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
