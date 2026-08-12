'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Check, MapPin } from 'lucide-react';

import data from '@/data/content.json';

const UK_POSTCODE_REGEX =
  /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9][0-9A-HJKSTUW]?)|(?:[A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

export default function Hero() {
  const router = useRouter();
  const { hero } = data;

  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedPostcode = postcode.trim().toUpperCase().replace(/\s+/g, ' ');

    if (!formattedPostcode) {
      setPostcodeError(hero.postcode.emptyError);
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
    <section className="w-full bg-white px-3 pb-6 pt-3 sm:px-5 lg:px-8 lg:pb-8 lg:pt-5">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Hero card */}
        <div className="relative rounded-[22px] bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)] p-px lg:rounded-[30px]">
          {/* Inner hero */}
          <div className="relative overflow-hidden rounded-[21px] bg-white lg:rounded-[29px]">
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#EEFFFB_0%,rgba(238,255,251,0)_100.01%)]" />

            <div
              className="
                relative
                min-h-[690px]

                sm:min-h-[760px]

                md:min-h-[780px]

                lg:grid
                lg:min-h-[610px]
                lg:grid-cols-[53%_47%]
              "
            >
              {/* Left content */}
              <div
                className="
                  relative z-20
                  px-[11px]
                  pb-0
                  pt-[9px]

                  sm:px-7
                  sm:pt-8

                  md:px-9
                  md:pt-9

                  lg:flex
                  lg:items-center
                  lg:px-12
                  lg:py-16

                  xl:px-16
                "
              >
                <div
                  className="
                    w-full
                    max-w-[720px]

                    md:max-w-none

                    lg:max-w-[720px]
                  "
                >
                  {/* Heading */}
                  <h1
                    className="
                      w-full

                      font-red-hat-display
                      text-[38px]
                      font-[645]
                      leading-[41.88px]
                      tracking-[0]
                      text-secondary

                      md:max-w-none
                      md:text-[52px]
                      md:leading-[58px]

                      lg:text-[60px]
                      lg:font-bold
                      lg:leading-[75.69px]

                      xl:text-[68px]
                    "
                  >
                    <span
                      className="
                        block

                        md:whitespace-nowrap

                        lg:whitespace-nowrap
                      "
                    >
                      {hero.heading.firstLine}
                    </span>

                    <span
                      className="
                        block

                        md:whitespace-nowrap

                        lg:whitespace-nowrap
                      "
                    >
                      {hero.heading.secondLine}
                    </span>

                    <span
                      className="
                        flex flex-wrap
                        items-baseline
                        gap-x-[0.12em]

                        md:flex-nowrap
                        md:gap-x-[0.16em]

                        lg:flex-nowrap
                        lg:gap-x-[0.22em]
                      "
                    >
                      <span>{hero.heading.thirdLineStart}</span>

                      <span>{hero.heading.highlightedWord}</span>

                      <span>{hero.heading.thirdLineEnd}</span>
                    </span>
                  </h1>

                  {/* Description */}
                  <p
                    className="
                      mt-[13px]
                      max-w-[330px]

                      font-red-hat-display
                      text-[12px]
                      font-[467]
                      leading-[14px]
                      tracking-[0]
                      text-secondary

                      sm:mt-4
                      sm:max-w-[520px]
                      sm:text-[14px]
                      sm:leading-[1.4]

                      md:max-w-[600px]
                      md:text-[15px]
                      md:leading-[22px]

                      lg:mt-6
                      lg:max-w-[625px]
                      lg:font-inter
                      lg:text-[16px]
                      lg:leading-[1.45]
                    "
                  >
                    {hero.description}
                  </p>

                  {/* Desktop postcode form */}
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-9 hidden max-w-[610px] rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_18px_42px_rgba(8,60,92,0.08)] sm:p-5 lg:block"
                  >
                    <div
                      className={`flex h-[64px] items-center gap-3 rounded-full border bg-white p-1.5 transition-colors ${
                        postcodeError
                          ? 'border-red-400'
                          : 'border-slate-200 focus-within:border-primary'
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                        <MapPin
                          size={17}
                          strokeWidth={1.8}
                          className="shrink-0 text-secondary"
                          aria-hidden="true"
                        />

                        <label
                          htmlFor="hero-postcode-desktop"
                          className="sr-only"
                        >
                          {hero.postcode.label}
                        </label>

                        <input
                          id="hero-postcode-desktop"
                          name="postcode"
                          type="text"
                          value={postcode}
                          onChange={(event) => handlePostcodeChange(event.target.value)}
                          placeholder={hero.postcode.placeholder}
                          autoComplete="postal-code"
                          aria-invalid={Boolean(postcodeError)}
                          aria-describedby={
                            postcodeError ? 'hero-postcode-desktop-error' : undefined
                          }
                          className="h-11 min-w-0 flex-1 bg-transparent font-inter text-[14px] text-secondary outline-none placeholder:text-[#04242D]"
                        />
                      </div>

                      <div className="-mr-[7px] h-[64px] w-[187px] shrink-0 rounded-[100px] bg-[linear-gradient(77.21deg,#2E69A4_-1.53%,#01ACA7_136.17%)] p-[3px]">
                        <button
                          type="submit"
                          className="flex h-full w-full items-center justify-center rounded-[100px] bg-secondary px-6 py-[11px] font-red-hat-display text-[16px] font-semibold text-white transition-colors hover:bg-[#124A7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {hero.button.label}
                        </button>
                      </div>
                    </div>

                    {postcodeError && (
                      <p
                        id="hero-postcode-desktop-error"
                        className="mt-2 px-3 font-inter text-[13px] text-red-600"
                      >
                        {postcodeError}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-[repeat(2,minmax(0,0.4fr))] gap-x-2 gap-y-3 px-2">
                      {hero.benefits.map((benefit) => (
                        <div
                          key={benefit.id}
                          className="flex items-center gap-2 font-inter text-[14px] text-[467] text-secondary"
                        >
                          <Check
                            size={15}
                            strokeWidth={2.5}
                            className="shrink-0 text-[#1BA261]"
                            aria-hidden="true"
                          />

                          <span>{benefit.label}</span>
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>

              {/* Mobile + tablet hero image */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[175px]
                  z-10

                  h-[430px]
                  w-[405px]
                  max-w-none

                  -translate-x-1/2

                  sm:top-[205px]
                  sm:h-[480px]
                  sm:w-[460px]

                  md:top-[255px]
                  md:h-[500px]
                  md:w-[530px]

                  lg:hidden
                "
              >
                <Image
                  src={hero.mobileImage.src}
                  alt={hero.mobileImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 530px, 0px"
                  className="object-contain object-top-right"
                />
              </div>

              {/* Desktop hero image */}
              <div className="relative hidden min-h-[610px] lg:block">
                <div className="absolute inset-0 -left-[10%] -right-[7%] translate-y-10">
                  <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 54vw, 0px"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              {/* Mobile + tablet postcode form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="
                  absolute
                  bottom-[27px]
                  left-[10px]
                  right-[10px]
                  z-30

                  rounded-[22px]
                  border border-[#EAECF0]
                  bg-white

                  px-[7px]
                  pb-[14px]
                  pt-[7px]

                  shadow-[0px_10px_30px_rgba(8,60,92,0.10)]

                  sm:bottom-10
                  sm:left-4
                  sm:right-4
                  sm:p-4

                  md:left-8
                  md:right-8

                  lg:hidden
                "
              >
                <div
                  className={`flex h-[44px] items-center rounded-full border bg-white transition-colors ${
                    postcodeError
                      ? 'border-red-400'
                      : 'border-[#D0D5DD] focus-within:border-primary'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                    <MapPin
                      size={15}
                      strokeWidth={1.8}
                      className="shrink-0 text-secondary"
                      aria-hidden="true"
                    />

                    <label
                      htmlFor="hero-postcode-mobile"
                      className="sr-only"
                    >
                      {hero.postcode.label}
                    </label>

                    <input
                      id="hero-postcode-mobile"
                      name="postcode"
                      type="text"
                      value={postcode}
                      onChange={(event) => handlePostcodeChange(event.target.value)}
                      placeholder={hero.postcode.placeholder}
                      autoComplete="postal-code"
                      aria-invalid={Boolean(postcodeError)}
                      aria-describedby={postcodeError ? 'hero-postcode-mobile-error' : undefined}
                      className="h-full min-w-0 flex-1 bg-transparent font-inter text-[10px] text-secondary outline-none placeholder:text-[#475467] min-[390px]:text-[11px]"
                    />
                  </div>

                  <div className="-mr-px h-[44px] w-[128px] shrink-0 min-[390px]:w-[132px]">
                    <div className="relative h-full w-full">
                      <div className="absolute inset-y-0 right-0 w-[144px] rounded-full bg-[linear-gradient(77.21deg,#2E69A4_-1.53%,#01ACA7_136.17%)] p-[2px] min-[390px]:w-[152px]">
                        <button
                          type="submit"
                          className="flex h-full w-full items-center justify-center whitespace-nowrap rounded-full bg-secondary px-3 font-red-hat-display text-[10px] font-semibold text-white transition-colors hover:bg-[#124A7E] min-[390px]:text-[11px]"
                        >
                          {hero.button.label}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {postcodeError && (
                  <p
                    id="hero-postcode-mobile-error"
                    className="mt-1.5 px-2 font-inter text-[9px] text-red-600"
                  >
                    {postcodeError}
                  </p>
                )}

                <div className="mt-[14px] grid grid-cols-2 gap-x-3 gap-y-[10px] px-2">
                  {hero.benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="flex items-center gap-[5px] font-inter text-[8px] text-secondary min-[390px]:text-[9px]"
                    >
                      <Check
                        size={11}
                        strokeWidth={2.5}
                        className="shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>{benefit.label}</span>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Trust and providers */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-[17px] h-px bg-[#EAECF0] lg:top-[24px]" />

          <div className="relative z-10 flex justify-center lg:justify-start">
            <div
              className="
                flex h-[30px] w-full max-w-[320px]
                items-center justify-center

                rounded-[33px]
                border border-[#0C111D1A]
                bg-white

                px-2 py-1

                min-[360px]:max-w-[350px]

                min-[390px]:h-[34px]
                min-[390px]:w-[404px]
                min-[390px]:max-w-full
                min-[390px]:gap-[10px]
                min-[390px]:px-4
                min-[390px]:py-1
              "
            >
              <p
                className="
                  m-0
                  whitespace-nowrap

                  font-red-hat-display
                  text-[10px]
                  font-[467]
                  leading-[22px]
                  tracking-[0]
                  text-secondary

                  min-[360px]:text-[11px]

                  min-[390px]:text-[13px]
                  min-[390px]:leading-[26px]
                "
              >
                {hero.trust.startText}{' '}
                <span className="font-[645] text-secondary">{hero.trust.highlightedText}</span>{' '}
                <span
                  aria-hidden="true"
                  className="text-secondary"
                >
                  {hero.trust.separator}
                </span>{' '}
                {hero.trust.endText}
              </p>
            </div>
          </div>

          {/* Mobile + tablet provider carousel */}
          <div className="provider-carousel mt-[18px] overflow-hidden lg:hidden">
            <div className="provider-carousel-track flex w-max items-center">
              <div className="flex shrink-0 items-center gap-3 pr-3">
                {hero.providers.map((provider) => (
                  <div
                    key={`mobile-primary-${provider.id}`}
                    className="flex h-[38px] w-[118px] shrink-0 items-center justify-center"
                  >
                    <Image
                      src={provider.src}
                      alt={provider.alt}
                      width={provider.width}
                      height={provider.height}
                      className={`h-[24.84px] w-[110px] object-contain ${
                        provider.id === 1 ? 'translate-y-[2px]' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div
                aria-hidden="true"
                className="flex shrink-0 items-center gap-3 pr-3"
              >
                {hero.providers.map((provider) => (
                  <div
                    key={`mobile-duplicate-${provider.id}`}
                    className="flex h-[38px] w-[118px] shrink-0 items-center justify-center"
                  >
                    <Image
                      src={provider.src}
                      alt=""
                      width={provider.width}
                      height={provider.height}
                      className={`h-[24.84px] w-[110px] object-contain ${
                        provider.id === 1 ? 'translate-y-[2px]' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop provider logos */}
          <div className="mt-5 hidden grid-cols-7 items-center gap-5 lg:grid">
            {hero.providers.map((provider) => (
              <div
                key={`desktop-${provider.id}`}
                className="flex min-h-[49px] items-center justify-center"
              >
                <Image
                  src={provider.src}
                  alt={provider.alt}
                  width={provider.width}
                  height={provider.height}
                  className="h-[49px] w-[126px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
