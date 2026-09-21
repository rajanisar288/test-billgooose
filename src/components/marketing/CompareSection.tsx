'use client';

import { useState, type FormEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Info, Mail } from 'lucide-react';

import data from '@/data/content.json';

const NEWSLETTER_IMAGE = '/images/compare-mail.png';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Compare() {
  const { compare, newsletter } = data;

  const activeItems = compare.items;
  const comingSoonItems = compare.comingSoonItems;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setErrorMessage('');
  }

  function handleChange(value: string) {
    setEmail(value);

    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage('');
    }
  }

  return (
    <section
      className="
        w-full
        bg-white

        px-4
        pb-[72px]
        pt-0

        min-[390px]:px-5
        min-[390px]:pb-[100px]
        min-[390px]:pt-0

        md:px-6

        lg:px-8
        lg:pt-[100px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div className="flex justify-center">
          <div
            className="
              inline-flex
              min-h-[30px]

              items-center
              gap-2

              rounded-full

              border
              border-[#EAECF0]

              bg-white

              px-3
              py-1.5

              shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)]

              min-[390px]:min-h-[32px]
            "
          >
            <Image
              src={compare.label.icon}
              alt=""
              width={20}
              height={20}
              className="
                h-[18px]
                w-[18px]

                object-contain

                min-[390px]:h-5
                min-[390px]:w-5
              "
            />

            <span
              className="
                font-inter
                text-[12px]
                font-medium
                leading-none

                text-[#0C111D]

                min-[390px]:text-[14px]
              "
            >
              {compare.label.text}
            </span>
          </div>
        </div>

        <div
          className="
            mx-auto
            mt-4

            max-w-[340px]

            text-center

            min-[390px]:mt-5
            min-[390px]:max-w-[850px]
          "
        >
          <h2
            className="
              font-red-hat-display

              text-[28px]
              font-extrabold
              leading-[31px]
              tracking-[-0.4px]

              text-[#0C3354]

              min-[360px]:text-[30px]
              min-[360px]:leading-[33px]

              min-[390px]:text-[32px]
              min-[390px]:leading-[1.12]
              min-[390px]:tracking-[-0.7px]

              sm:text-[38px]

              lg:text-[44px]
              lg:tracking-[-1px]
            "
          >
            {compare.heading}
          </h2>

          <p
            className="
              mx-auto
              mt-3

              max-w-[320px]

              font-inter
              text-[13px]
              font-normal
              leading-[18px]

              text-[#0C3354]

              min-[390px]:max-w-none
              min-[390px]:text-[15px]
              min-[390px]:leading-[1.55]

              sm:text-[16px]

              lg:mt-4
              lg:text-[18px]
            "
          >
            {compare.description}
          </p>
        </div>

        <div
          className="
            mt-8

            grid
            grid-cols-1

            gap-3

            sm:grid-cols-2
            sm:gap-4

            md:mt-10

            lg:mt-12
            lg:grid-cols-3
            lg:gap-x-5
            lg:gap-y-5
          "
        >
          {activeItems.map((item) => {
            const isBundleBills = item.title.toLowerCase().includes('bundle');

            const itemHref = isBundleBills ? '/compare?service=energy&flow=bundle' : item.href;

            return (
              <article
                key={item.id}
                className="
                  flex
                  min-h-[154px]
                  w-full
                  min-w-0

                  flex-col

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-[#EAECF0]

                  bg-white

                  shadow-[0px_8px_24px_0px_rgba(15,30,60,0.05),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                  transition-all
                  duration-300

                  hover:border-[#00897B]
                  hover:shadow-[0px_8px_24px_0px_rgba(0,137,123,0.25),0px_1px_2px_0px_rgba(0,137,123,0.1)]

                  sm:min-h-[160px]
                  sm:rounded-[20px]

                  md:min-h-[164px]

                  lg:h-[176px]
                  lg:min-h-[176px]
                  lg:rounded-[22px]
                "
              >
                <div
                  className="
                    flex
                    min-h-0
                    flex-1

                    items-center

                    gap-3.5

                    px-4
                    py-4

                    sm:gap-4
                    sm:px-5

                    lg:gap-4
                    lg:px-[18px]
                    lg:py-[17px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[62px]
                      w-[62px]
                      shrink-0

                      items-center
                      justify-center

                      rounded-[13px]

                      border
                      border-[#00B1AA33]

                      bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]

                      sm:h-[66px]
                      sm:w-[66px]
                      sm:rounded-[14px]

                      lg:h-[72px]
                      lg:w-[72px]
                      lg:rounded-[16px]
                    "
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="
                        h-[50px]
                        w-[50px]

                        object-contain

                        sm:h-[54px]
                        sm:w-[54px]

                        lg:h-[60px]
                        lg:w-[60px]
                      "
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        font-red-hat-display

                        text-[17px]
                        font-extrabold
                        leading-[22px]
                        tracking-[0]

                        text-[#0C3354]

                        sm:text-[18px]
                        sm:leading-[23px]

                        lg:text-[20px]
                        lg:leading-[25px]
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-1

                        max-w-[210px]

                        font-red-hat-display
                        text-[12px]
                        font-[467]
                        leading-[17px]
                        tracking-[0]

                        text-[#576574]

                        sm:text-[13px]
                        sm:leading-[18px]

                        lg:mt-1.5
                        lg:text-[14px]
                        lg:leading-[19px]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    relative

                    flex
                    h-[42px]
                    shrink-0

                    items-center
                    justify-center

                    border-t
                    border-[#F2F4F7]

                    px-4

                    lg:h-[48px]
                  "
                >
                  <Link
                    href={itemHref}
                    className="
                      inline-flex
                      items-center
                      justify-center

                      gap-1.5

                      font-inter
                      text-[13px]
                      font-semibold
                      leading-5

                      text-[#00897B]

                      transition-all
                      duration-200

                      hover:gap-2.5

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#00897B]
                      focus-visible:ring-offset-2

                      sm:text-[12px]

                      lg:text-[13px]
                    "
                  >
                    <span>{item.linkText}</span>

                    <ArrowRight
                      aria-hidden="true"
                      className="
                        h-[14px]
                        w-[14px]

                        lg:h-4
                        lg:w-4
                      "
                      strokeWidth={2}
                    />
                  </Link>

                  {isBundleBills && (
                    <div className="group absolute right-3 top-1/2 z-30 -translate-y-1/2">
                      <button
                        type="button"
                        aria-label="More information about Bundle Bills"
                        className="
                          flex
                          h-[18px]
                          w-[18px]
                          items-center
                          justify-center

                          rounded-full

                          text-[#98A2B3]

                          transition-colors

                          hover:text-[#475467]

                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#00897B]
                          focus-visible:ring-offset-2

                          lg:h-5
                          lg:w-5
                        "
                      >
                        <Info
                          aria-hidden="true"
                          className="h-full w-full"
                          strokeWidth={1.6}
                        />
                      </button>

                      <div
                        role="tooltip"
                        className="
                          pointer-events-none

                          absolute
                          right-[-10px]
                          bottom-[calc(100%+10px)]

                          whitespace-nowrap

                          rounded-[8px]

                          bg-[#1D2939]

                          px-3
                          py-2

                          font-inter
                          text-[11px]
                          font-medium
                          leading-[1.3]

                          text-white

                          opacity-0

                          shadow-[0px_10px_20px_-4px_rgba(16,24,40,0.25),0px_4px_8px_-4px_rgba(16,24,40,0.15)]

                          transition-opacity
                          duration-200

                          group-hover:opacity-100
                          group-focus-within:opacity-100

                          lg:text-[12px]
                        "
                      >
                        This is a tooltip
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="
            mt-4

            grid
            grid-cols-1

            gap-4

            md:mt-5
            md:grid-cols-2
            md:gap-5

            lg:gap-6
          "
        >
          {/* COMING SOON */}
          <div
            className="
              relative

              min-h-[190px]

              rounded-[18px]

              border
              border-[#EAECF0]

              bg-white

              px-3
              pb-4
              pt-9

              shadow-[0px_8px_24px_0px_rgba(15,30,60,0.05),0px_1px_2px_0px_rgba(15,30,60,0.04)]

              sm:rounded-[20px]
              sm:px-4

              lg:h-[200px]
              lg:min-h-[200px]
              lg:rounded-[22px]
              lg:px-5
              lg:pb-5
              lg:pt-[42px]
            "
          >
            <div
              className="
                absolute
                left-4
                right-4
                top-[13px]

                flex
                items-center
                justify-center

                lg:left-5
                lg:right-5
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-px
                  flex-1

                  bg-[linear-gradient(90deg,rgba(242,244,247,0)_0%,#F2F4F7_100%)]
                "
              />

              <span
                className="
                  mx-2

                  inline-flex
                  h-[20px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#D1E9FF]

                  bg-[#EFF8FF]

                  px-2

                  font-red-hat-display
                  text-[9px]
                  font-bold
                  leading-4

                  text-[#147AD2]

                  sm:text-[10px]

                  lg:h-[22px]
                  lg:min-w-[88px]
                  lg:text-[11px]
                "
              >
                Coming Soon
              </span>

              <span
                aria-hidden="true"
                className="
                  h-px
                  flex-1

                  bg-[linear-gradient(90deg,#F2F4F7_0%,rgba(242,244,247,0)_100%)]
                "
              />
            </div>

            <div
              className="
                grid
                h-full
                grid-cols-2

                gap-2.5

                sm:gap-3

                lg:gap-4
              "
            >
              {comingSoonItems.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    min-w-0

                    flex-col
                    items-center
                    justify-center

                    rounded-[12px]

                    border
                    border-[#00B1AA33]

                    bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]

                    px-2
                    py-3

                    sm:rounded-[14px]

                    lg:h-[126px]
                    lg:rounded-[16px]
                  "
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={72}
                    height={72}
                    className="
                      h-[50px]
                      w-[50px]

                      object-contain

                      sm:h-[56px]
                      sm:w-[56px]

                      lg:h-[66px]
                      lg:w-[66px]
                    "
                  />

                  <span
                    className="
                      mt-1.5

                      text-center

                      font-red-hat-display
                      text-[11px]
                      font-[550]
                      leading-[15px]

                      text-[#101828]

                      sm:text-[12px]

                      lg:text-[13px]
                      lg:font-bold
                      lg:leading-[18px]
                    "
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              NEWSLETTER
          ===================================================== */}
          <div
            className="
              relative

              flex
              min-h-[190px]
              flex-col
              justify-between

              overflow-hidden

              rounded-[18px]

              border
              border-[#EAECF0]

              bg-white

              p-4

              shadow-[0px_8px_24px_0px_rgba(15,30,60,0.05),0px_1px_2px_0px_rgba(15,30,60,0.04)]

              sm:rounded-[20px]
              sm:p-5

              lg:h-[200px]
              lg:min-h-[200px]
              lg:rounded-[22px]
              lg:px-6
              lg:py-5
            "
          >
            {/* Decorative gradient wedge — top-right */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                right-0
                top-0
                z-0

                h-[120px]
                w-[120px]

                sm:h-[140px]
                sm:w-[140px]

                lg:h-[160px]
                lg:w-[160px]

                rounded-bl-full

                bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]
              "
            />

            {/* Mailbox icon — inside the wedge */}
            <div
              className="
                pointer-events-none

                absolute
                right-4
                top-3
                z-10

                h-[72px]
                w-[72px]

                sm:right-5
                sm:top-4
                sm:h-[82px]
                sm:w-[82px]

                lg:right-6
                lg:top-4
                lg:h-[92px]
                lg:w-[92px]
              "
            >
              <Image
                src={NEWSLETTER_IMAGE}
                alt=""
                fill
                sizes="92px"
                className="object-contain"
              />
            </div>

            {/* Copy */}
            <div
              className="
                relative
                z-20

                max-w-[70%]

                sm:max-w-[72%]

                lg:max-w-[350px]
              "
            >
              <h3
                className="
                  font-red-hat-display

                  text-[19px]
                  font-extrabold
                  leading-[25px]

                  text-[#0C3354]

                  sm:text-[21px]

                  lg:text-[24px]
                  lg:leading-[30px]
                "
              >
                Be the first to know
              </h3>

              <p
                className="
                  mt-3

                  max-w-[340px]

                  font-red-hat-display
                  text-[11px]
                  font-[467]
                  leading-[15px]

                  text-[#576574]

                  sm:text-[12px]
                  sm:leading-[16px]

                  lg:text-[16px]
                  lg:leading-[22px]
                "
              >
                {newsletter.description}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="
                relative
                z-20

                mt-4
                w-full

                sm:mt-5

                lg:mt-0
              "
            >
              {/* =============================================
                  INPUT ROW — ALWAYS rendered (never unmounted).
                  The message is an absolutely-positioned
                  overlay on top of it, so the layout CANNOT
                  shift when status changes.
              ============================================= */}
              <div className="relative w-full">
                {/* The real input row — hidden via `invisible` when
                    a message is showing, but still occupies space. */}
                <div
                  className={`
                    flex
                    h-[48px]
                    w-full

                    items-center

                    rounded-full

                    border
                    border-[#D0D5DD]

                    bg-white

                    pl-4

                    sm:h-[52px]
                    sm:pl-5

                    lg:h-[56px]
                    lg:pl-6

                    ${status !== 'idle' ? 'invisible' : ''}
                  `}
                >
                  <Mail
                    aria-hidden="true"
                    className="
                      h-[16px]
                      w-[16px]
                      shrink-0

                      text-[#355E87]

                      sm:h-[18px]
                      sm:w-[18px]

                      lg:h-[20px]
                      lg:w-[20px]
                    "
                    strokeWidth={1.7}
                  />

                  <label
                    htmlFor="compare-newsletter-email"
                    className="sr-only"
                  >
                    {newsletter.form.label}
                  </label>

                  <input
                    id="compare-newsletter-email"
                    type="email"
                    placeholder={newsletter.form.placeholder}
                    value={email}
                    onChange={(e) => handleChange(e.target.value)}
                    className="
                      flex
                      h-full
                      min-w-0
                      flex-1
                      items-center

                      bg-transparent

                      px-3

                      font-inter
                      text-[14px]

                      leading-none

                      text-[#0C3354]

                      outline-none

                      placeholder:text-[#475467]

                      sm:text-[15px]

                      lg:px-4
                      lg:text-[16px]
                    "
                  />

                  <div
                    className="
                      -mr-px

                      h-[48px]
                      w-[120px]
                      shrink-0

                      rounded-full

                      p-[3px]

                      sm:h-[52px]
                      sm:w-[132px]

                      lg:h-[56px]
                      lg:w-[148px]
                    "
                    style={{
                      background: 'linear-gradient(77.21deg, #2E69A4 -1.53%, #01ACA7 136.17%)',
                    }}
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

                        rounded-full

                        px-3

                        font-red-hat-display
                        text-[13px]
                        font-semibold

                        text-white

                        transition-opacity

                        hover:opacity-90

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#01ACA7]
                        focus-visible:ring-offset-2

                        sm:text-[14px]

                        lg:text-[16px]
                      "
                      style={{
                        background: 'var(--Secondary-500, #0D3B66)',
                      }}
                    >
                      {newsletter.form.buttonLabel}
                    </button>
                  </div>
                </div>

                {/* Success / error overlay — same size as the input
                    row, absolutely positioned so nothing moves. */}
                {status !== 'idle' && (
                  <div
                    role="status"
                    aria-live="polite"
                    onClick={() => {
                      setStatus('idle');
                      setErrorMessage('');
                    }}
                    className="
                      absolute
                      inset-0
                      z-30

                      flex
                      h-[48px]
                      w-full

                      cursor-pointer

                      items-center
                      justify-center

                      rounded-full

                      border

                      px-4

                      text-center

                      transition-opacity

                      hover:opacity-90

                      sm:h-[52px]

                      lg:h-[56px]
                    "
                    style={{
                      borderColor: status === 'success' ? '#ABEFC6' : '#FDA29B',
                      backgroundColor: status === 'success' ? '#ECFDF3' : '#FEF3F2',
                    }}
                  >
                    <p
                      className={`
                        font-inter
                        text-[13px]
                        font-medium
                        leading-none

                        sm:text-[14px]

                        lg:text-[16px]

                        ${status === 'success' ? 'text-[#067647]' : 'text-[#D92D20]'}
                      `}
                    >
                      {status === 'success' ? 'Thanks for subscribing' : errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
