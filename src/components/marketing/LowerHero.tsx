'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { MapPin } from 'lucide-react';

import data from '@/data/content.json';

const UK_POSTCODE_REGEX =
  /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9][0-9A-HJKSTUW]?)|(?:[A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

export default function LowerHero() {
  const router = useRouter();
  const { lowerHero } = data;

  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedPostcode = postcode.trim().toUpperCase().replace(/\s+/g, ' ');

    if (!formattedPostcode) {
      setPostcodeError(lowerHero.postcode.emptyError);
      return;
    }

    if (!UK_POSTCODE_REGEX.test(formattedPostcode)) {
      setPostcodeError('Please enter a valid UK postcode.');
      return;
    }

    setPostcodeError('');

    router.push(`/compare?postcode=${encodeURIComponent(formattedPostcode)}`);
  };

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);

    if (postcodeError) {
      setPostcodeError('');
    }
  };

  return (
    <section
      className="
        w-full
        bg-white
        px-2
        pb-[72px]

        min-[360px]:px-3

        min-[390px]:px-5
        min-[390px]:pb-[100px]

        md:px-6
        md:pb-[100px]

        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div
          className="
            relative
            mx-auto

            h-[470px]
            w-full
            max-w-[336px]

            overflow-hidden

            rounded-[16px]

            bg-[linear-gradient(100deg,#002B56_0.73%,#01ACA7_108.32%)]

            min-[360px]:h-[510px]
            min-[360px]:max-w-[365px]
            min-[360px]:rounded-[18px]

            min-[390px]:h-[559px]
            min-[390px]:max-w-[400px]
            min-[390px]:rounded-[20px]

            md:h-[300px]
            md:max-w-none
            md:rounded-[24px]

            lg:h-[430px]
            lg:max-w-none
            lg:rounded-[30px]

            xl:h-[474px]
          "
        >
          {/* =====================================================
              MOBILE ARTWORK
          ====================================================== */}
          <div
            className="
              pointer-events-none

              absolute
              bottom-0
              left-1/2
              z-0

              h-[300px]
              w-[330px]

              -translate-x-1/2

              min-[360px]:h-[330px]
              min-[360px]:w-[355px]

              min-[390px]:h-[365px]
              min-[390px]:w-[390px]

              md:hidden
            "
          >
            <Image
              src={lowerHero.mobileBackgroundImage.src}
              alt={lowerHero.mobileBackgroundImage.alt}
              fill
              priority
              sizes="(max-width: 359px) 330px, (max-width: 389px) 355px, 390px"
              className="
                object-contain
                object-bottom
              "
            />
          </div>

          {/* TABLET ARTWORK ONLY */}
          <div
            className="
    pointer-events-none
    absolute
    z-0

    hidden

    md:block
    lg:hidden

    md:h-[94%]
    md:w-[54%]

    md:right-[-62px]
    md:top-[55%]
    md:-translate-y-1/2

    min-[900px]:h-[96%]
    min-[900px]:w-[56%]
    min-[900px]:right-[-34px]
    min-[900px]:top-[55%]
  "
          >
            <Image
              src={lowerHero.backgroundImage.src}
              alt={lowerHero.backgroundImage.alt}
              fill
              priority
              sizes="(min-width: 768px) and (max-width: 1023px) 56vw, 0px"
              className="
      object-contain
      object-center
    "
            />
          </div>
          {/* =====================================================
              DESKTOP ARTWORK
          ====================================================== */}
          <div
            className="
              pointer-events-none

              absolute
              z-0

              hidden

              h-full
              w-[58%]

              lg:bottom-[1px]
              lg:right-[-115px]
              lg:block

              xl:bottom-0
              xl:right-[-10px]
              xl:w-[58%]
            "
          >
            <Image
              src={lowerHero.backgroundImage.src}
              alt={lowerHero.backgroundImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 0px"
              className="
                object-contain
                object-bottom-right
              "
            />
          </div>

          {/* =====================================================
              MOBILE CONTENT
          ====================================================== */}
          <div
            className="
              relative
              z-10

              flex
              h-full
              flex-col

              px-[13px]
              pt-[15px]

              min-[360px]:px-[15px]
              min-[360px]:pt-[17px]

              min-[390px]:px-5
              min-[390px]:pt-5

              md:hidden
            "
          >
            <h2 className="max-w-[290px] font-red-hat-display text-[31px] font-extrabold leading-[34px] tracking-[0] text-white min-[360px]:max-w-[320px] min-[360px]:text-[34px] min-[360px]:leading-[37px] min-[390px]:max-w-[360px] min-[390px]:text-[38px] min-[390px]:leading-[41.88px]">
              {lowerHero.heading}
            </h2>

            <p className="mt-2 max-w-[290px] font-red-hat-display text-[10px] font-[467] leading-[15px] tracking-[0] text-white min-[360px]:max-w-[320px] min-[360px]:text-[11px] min-[360px]:leading-[16px] min-[390px]:max-w-[350px] min-[390px]:text-[12px] min-[390px]:leading-[18px]">
              {lowerHero.description}
            </p>

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

          {/* =====================================================
              TABLET CONTENT ONLY
          ====================================================== */}
          <div
            className="
              relative
              z-10

              hidden
              h-full
              w-[56%]
              flex-col
              justify-center

              pl-8

              md:flex
              lg:hidden

              min-[900px]:pl-10
            "
          >
            <h2
              className="
                max-w-[390px]

                font-red-hat-display
                text-[40px]
                font-bold
                leading-[46px]
                tracking-[0]
                text-white

                min-[900px]:max-w-[430px]
                min-[900px]:text-[44px]
                min-[900px]:leading-[50px]
              "
            >
              {lowerHero.heading}
            </h2>

            <p
              className="
                mt-3

                max-w-[360px]

                font-red-hat-display
                text-[13px]
                font-[467]
                leading-[19px]
                tracking-[0]
                text-white

                min-[900px]:max-w-[400px]
                min-[900px]:text-[14px]
                min-[900px]:leading-[21px]
              "
            >
              {lowerHero.description}
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="
                relative
                mt-5

                w-[350px]

                min-[900px]:w-[390px]
              "
            >
              <div
                className={`flex h-[52px] w-full items-center rounded-full border-[2px] bg-white transition-colors ${
                  postcodeError ? 'border-red-400' : 'border-white focus-within:border-primary'
                }`}
              >
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-2

                    px-4
                  "
                >
                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0 text-secondary"
                    aria-hidden="true"
                  />

                  <label
                    htmlFor="lower-hero-postcode-tablet"
                    className="sr-only"
                  >
                    {lowerHero.postcode.label}
                  </label>

                  <input
                    id="lower-hero-postcode-tablet"
                    name="postcode"
                    type="text"
                    value={postcode}
                    onChange={(event) => handlePostcodeChange(event.target.value)}
                    placeholder={lowerHero.postcode.placeholder}
                    autoComplete="postal-code"
                    aria-invalid={Boolean(postcodeError)}
                    aria-describedby={
                      postcodeError ? 'lower-hero-postcode-tablet-error' : undefined
                    }
                    className="
                      h-full
                      min-w-0
                      flex-1

                      bg-transparent

                      font-red-hat-display
                      text-[11px]
                      text-[#04242D]

                      outline-none

                      placeholder:text-[#04242D]

                      min-[900px]:text-[12px]
                    "
                  />
                </div>

                <div
                  className="
                    -mr-[2px]

                    h-[52px]
                    w-[145px]
                    shrink-0

                    rounded-[100px]

                    bg-[linear-gradient(77.21deg,#2E69A4_-1.53%,#01ACA7_136.17%)]

                    p-[3px]

                    min-[900px]:w-[160px]
                  "
                >
                  <button
                    type="submit"
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center

                      whitespace-nowrap

                      rounded-[100px]

                      bg-secondary

                      px-4

                      font-red-hat-display
                      text-[11px]
                      font-semibold
                      text-white

                      transition-colors

                      hover:bg-[#124A7E]
                    "
                  >
                    {lowerHero.button.label}
                  </button>
                </div>
              </div>

              {postcodeError && (
                <p
                  id="lower-hero-postcode-tablet-error"
                  className="
                    absolute
                    left-4
                    top-[59px]

                    font-inter
                    text-[10px]
                    text-white
                  "
                >
                  {postcodeError}
                </p>
              )}
            </form>
          </div>

          {/* =====================================================
              DESKTOP CONTENT
          ====================================================== */}
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
