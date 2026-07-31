'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { MapPin } from 'lucide-react';

import data from '@/data/content.json';

export default function LowerHero() {
  const router = useRouter();
  const { lowerHero } = data;

  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedPostcode = postcode.trim();

    if (!formattedPostcode) {
      setPostcodeError(lowerHero.postcode.emptyError);
      return;
    }

    setPostcodeError('');

    router.push(`${lowerHero.button.href}?postcode=${encodeURIComponent(formattedPostcode)}`);
  };

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);

    if (postcodeError) {
      setPostcodeError('');
    }
  };

  return (
    <section className="w-full bg-white px-2 pb-[72px] min-[360px]:px-3 min-[390px]:px-5 min-[390px]:pb-[100px] lg:px-8">
      <div className="mx-auto w-full max-w-[1216px]">
        <div className="relative mx-auto h-[470px] w-full max-w-[336px] overflow-hidden rounded-[16px] min-[360px]:h-[510px] min-[360px]:max-w-[365px] min-[360px]:rounded-[18px] min-[390px]:h-[559px] min-[390px]:max-w-[400px] min-[390px]:rounded-[20px] lg:h-[474px] lg:max-w-none lg:rounded-[30px]">
          {/* Mobile background artwork */}
          <Image
            src={lowerHero.mobileBackgroundImage.src}
            alt={lowerHero.mobileBackgroundImage.alt}
            fill
            sizes="(max-width: 359px) 336px, (max-width: 389px) 365px, (max-width: 1023px) 400px, 0px"
            className="object-cover object-center lg:hidden"
          />

          {/* Desktop background artwork */}
          <Image
            src={lowerHero.backgroundImage.src}
            alt={lowerHero.backgroundImage.alt}
            fill
            sizes="(min-width: 1024px) 1216px, 0px"
            className="hidden object-cover object-center lg:block"
          />

          {/* Mobile content */}
          <div className="relative z-10 flex h-full flex-col px-[13px] pt-[15px] min-[360px]:px-[15px] min-[360px]:pt-[17px] min-[390px]:px-5 min-[390px]:pt-5 lg:hidden">
            {/* Mobile heading */}
            <h2 className="max-w-[290px] font-red-hat-display text-[31px] font-extrabold leading-[34px] tracking-[0] text-white min-[360px]:max-w-[320px] min-[360px]:text-[34px] min-[360px]:leading-[37px] min-[390px]:max-w-[360px] min-[390px]:text-[38px] min-[390px]:leading-[41.88px]">
              {lowerHero.heading}
            </h2>

            {/* Mobile paragraph */}
            <p className="mt-2 max-w-[290px] font-red-hat-display text-[10px] font-[467] leading-[15px] tracking-[0] text-white min-[360px]:max-w-[320px] min-[360px]:text-[11px] min-[360px]:leading-[16px] min-[390px]:max-w-[350px] min-[390px]:text-[12px] min-[390px]:leading-[18px]">
              {lowerHero.description}
            </p>

            {/* Mobile postcode form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative mt-4 w-full max-w-[300px] min-[360px]:max-w-[326px] min-[390px]:max-w-[348px]"
            >
              <div
                className={`flex h-[44px] w-full items-center rounded-[100px] border bg-white pl-[11px] transition-colors min-[360px]:h-[47px] min-[360px]:pl-3 min-[390px]:h-[50px] min-[390px]:pl-[14px] ${
                  postcodeError ? 'border-red-400' : 'border-[#E4E4E4] focus-within:border-primary'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-1.5 min-[360px]:gap-2">
                  <MapPin
                    size={13}
                    strokeWidth={1.8}
                    className="shrink-0 text-secondary min-[360px]:h-[14px] min-[360px]:w-[14px] min-[390px]:h-4 min-[390px]:w-4"
                    aria-hidden="true"
                  />

                  <label
                    htmlFor="lower-hero-postcode-mobile"
                    className="sr-only"
                  >
                    {lowerHero.postcode.label}
                  </label>

                  <input
                    id="lower-hero-postcode-mobile"
                    name="postcode"
                    type="text"
                    value={postcode}
                    onChange={(event) => handlePostcodeChange(event.target.value)}
                    placeholder={lowerHero.postcode.placeholder}
                    autoComplete="postal-code"
                    aria-invalid={Boolean(postcodeError)}
                    aria-describedby={
                      postcodeError ? 'lower-hero-postcode-mobile-error' : undefined
                    }
                    className="h-full min-w-0 flex-1 bg-transparent font-red-hat-display text-[8px] text-[#04242D] outline-none placeholder:text-[#475467] min-[360px]:text-[9px] min-[390px]:text-[10px]"
                  />
                </div>

                <div className="-mr-px h-[44px] w-[108px] shrink-0 rounded-[100px] bg-[linear-gradient(77.21deg,#2E69A4_-1.53%,#01ACA7_136.17%)] p-[2px] min-[360px]:h-[47px] min-[360px]:w-[118px] min-[390px]:h-[50px] min-[390px]:w-[132px]">
                  <button
                    type="submit"
                    className="flex h-full w-full items-center justify-center whitespace-nowrap rounded-[100px] bg-secondary px-2 font-red-hat-display text-[8px] font-semibold text-white transition-colors hover:bg-[#124A7E] min-[360px]:text-[9px] min-[390px]:px-3 min-[390px]:text-[10px]"
                  >
                    {lowerHero.button.label}
                  </button>
                </div>
              </div>

              {postcodeError && (
                <p
                  id="lower-hero-postcode-mobile-error"
                  className="absolute left-3 top-[48px] font-inter text-[8px] text-white min-[360px]:top-[51px] min-[390px]:top-[54px] min-[390px]:text-[9px]"
                >
                  {postcodeError}
                </p>
              )}
            </form>
          </div>

          {/* Desktop content */}
          <div className="relative z-10 hidden h-full w-[53%] flex-col justify-center pl-16 lg:flex">
            <h2 className="max-w-[520px] font-red-hat-display text-[60px] font-bold leading-[68px] tracking-[0] text-white">
              {lowerHero.heading}
            </h2>

            <p className="mt-5 max-w-[505px] font-red-hat-display text-[18px] leading-[1.5] text-white">
              {lowerHero.description}
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative mt-8 w-[453px]"
            >
              <div
                className={`flex h-16 w-full items-center rounded-full border-[3px] bg-white transition-colors ${
                  postcodeError ? 'border-red-400' : 'border-white focus-within:border-primary'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-5">
                  <MapPin
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0 text-secondary"
                    aria-hidden="true"
                  />

                  <label
                    htmlFor="lower-hero-postcode-desktop"
                    className="sr-only"
                  >
                    {lowerHero.postcode.label}
                  </label>

                  <input
                    id="lower-hero-postcode-desktop"
                    name="postcode"
                    type="text"
                    value={postcode}
                    onChange={(event) => handlePostcodeChange(event.target.value)}
                    placeholder={lowerHero.postcode.placeholder}
                    autoComplete="postal-code"
                    aria-invalid={Boolean(postcodeError)}
                    aria-describedby={
                      postcodeError ? 'lower-hero-postcode-desktop-error' : undefined
                    }
                    className="h-full min-w-0 flex-1 bg-transparent font-red-hat-display text-[14px] text-[#04242D] outline-none placeholder:text-[#04242D]"
                  />
                </div>

                <div className="-mr-[3px] h-16 w-[187px] shrink-0 rounded-[100px] bg-[linear-gradient(77.21deg,#2E69A4_-1.53%,#01ACA7_136.17%)] p-[3px]">
                  <button
                    type="submit"
                    className="flex h-full w-full items-center justify-center rounded-[100px] bg-secondary px-6 py-[11px] font-red-hat-display text-[16px] font-semibold text-white transition-colors hover:bg-[#124A7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  >
                    {lowerHero.button.label}
                  </button>
                </div>
              </div>

              {postcodeError && (
                <p
                  id="lower-hero-postcode-desktop-error"
                  className="absolute left-5 top-[72px] font-inter text-[13px] text-white"
                >
                  {postcodeError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
