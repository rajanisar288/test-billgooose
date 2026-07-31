import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

export default function Compare() {
  const { compare } = data;

  return (
    <section className="w-full bg-white px-4 pb-[72px] pt-[40px] min-[390px]:px-5 min-[390px]:pb-[100px] min-[390px]:pt-[48px] lg:px-8 lg:pt-[100px]">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Compare label */}
        <div className="flex justify-center">
          <div className="inline-flex min-h-[30px] items-center gap-2 rounded-full border border-[#EAECF0] bg-white px-3 py-1.5 shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[390px]:min-h-[32px]">
            <Image
              src={compare.label.icon}
              alt=""
              width={20}
              height={20}
              className="h-[18px] w-[18px] object-contain min-[390px]:h-5 min-[390px]:w-5"
            />

            <span className="font-inter text-[12px] font-medium leading-none text-[#0C111D] min-[390px]:text-[14px]">
              {compare.label.text}
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-4 max-w-[340px] text-center min-[390px]:mt-5 min-[390px]:max-w-[850px]">
          <h2 className="font-red-hat-display text-[28px] font-extrabold leading-[31px] tracking-[-0.4px] text-secondary min-[360px]:text-[30px] min-[360px]:leading-[33px] min-[390px]:text-[32px] min-[390px]:leading-[1.12] min-[390px]:tracking-[-0.7px] sm:text-[38px] lg:text-[44px] lg:tracking-[-1px]">
            {compare.heading}
          </h2>

          <p className="mx-auto mt-3 max-w-[320px] font-inter text-[18px] leading-[17px] text-secondary min-[990px]:mt-4 min-[390px]:max-w-none min-[390px]:text-[15px] min-[390px]:leading-[1.55] sm:text-[16px] lg:text-[18px]">
            {compare.description}
          </p>
        </div>

        {/* Comparison cards */}
        <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 min-[390px]:mt-12 min-[420px]:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {compare.items.map((item) => (
            <article
              key={item.id}
              className="
        flex h-[202px] w-full max-w-[192px] flex-col
        rounded-[20px]
        border border-[#EAECF0] border-t-[#DFE6EBB2]
        bg-white p-4
        shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]
        lg:min-h-[219px] lg:max-w-[392px] lg:rounded-[28px] lg:p-6
      "
            >
              {/* Icon */}
              <div
                className="
    flex h-14 w-14 shrink-0 items-center justify-center
    rounded-[100px]
    border border-transparent border-t-[#00B1AA33]
    bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]
    lg:h-[56px] lg:w-[56px] lg:rounded-[100px] lg:border
  "
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain lg:h-[40px] lg:w-[40px]"
                />
              </div>

              {/* Card content */}
              <div className="mt-3">
                <h3 className="font-red-hat-display text-[18px] font-[645] leading-7 tracking-[0] text-secondary lg:text-[20px] lg:font-extrabold lg:leading-[1.25]">
                  {item.title}
                </h3>

                <p className="mt-1 font-red-hat-display text-medium text-[14px] font-[467] leading-[18px] tracking-[0] text-[#576574] lg:mt-2 lg:font-inter lg:text-[14px] lg:leading-[1.5]">
                  {item.description}
                </p>
              </div>

              {/* Compare link */}
              <Link
                href={item.href}
                className="mt-auto inline-flex w-fit items-center gap-1.5 font-inter text-[14px] font-extrabold text-primary transition-[gap] duration-200 hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 min-[390px]:text-[12px] lg:gap-2 lg:pt-5 lg:text-[14px] lg:hover:gap-3"
              >
                <span>{item.linkText}</span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="lg:h-[17px] lg:w-[17px]"
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
