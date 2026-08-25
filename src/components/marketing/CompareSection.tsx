import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Mail } from 'lucide-react';

import data from '@/data/content.json';

const NEWSLETTER_IMAGE = '/images/compare-mail.png';

/* =========================================================
   SIM ONLY
========================================================= */

const SIM_ONLY_ITEM = {
  id: 'sim-only',
  title: 'SIM Only',
  description: 'Latest SIM-only plans and contract offers',
  icon: '/images/sim-icon.png',
  href: '/compare?service=sim',
  linkText: 'Compare Now',
};

export default function Compare() {
  const { compare, newsletter } = data;

  /*
   * Existing active services:
   * Energy, Broadband, Mobile
   *
   * Add SIM Only as the fourth active service.
   */
  const activeItems = [...compare.items.slice(0, 3), SIM_ONLY_ITEM];

  /*
   * Existing coming-soon services stay:
   * Credit Card, Insurance, Loans
   */
  const comingSoonItems = compare.items.slice(3, 6);

  return (
    <section
      className="
        w-full
        bg-white

        px-4
        pb-[72px]
        pt-[40px]

        min-[390px]:px-5
        min-[390px]:pb-[100px]
        min-[390px]:pt-[48px]

        lg:px-8
        lg:pt-[100px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        {/* =====================================================
            LABEL
        ====================================================== */}
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

        {/* =====================================================
            HEADING
        ====================================================== */}
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
              text-secondary

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
              leading-[18px]
              text-secondary

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

        {/* =====================================================
            ACTIVE SERVICE CARDS
        ====================================================== */}
        <div
          className="
            mt-8

            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2

            md:mt-10
            md:gap-4

            lg:mt-12
            lg:grid-cols-4
            lg:gap-5
          "
        >
          {activeItems.map((item) => (
            <article
              key={item.id}
              className="
                flex
                min-h-[168px]
                w-full
                min-w-0
                flex-col

                rounded-[20px]

                border
                border-[#EAECF0]
                border-t-[#DFE6EBB2]

                bg-white

                p-4

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[174px]

                md:min-h-[182px]
                md:rounded-[24px]
                md:p-5

                lg:h-[184px]
                lg:min-h-[184px]
                lg:rounded-[24px]
                lg:p-0

                xl:h-[190px]
                xl:min-h-[190px]
              "
            >
              {/* =================================================
                  CARD CONTENT
              ================================================== */}
              <div
                className="
                  flex
                  flex-1
                  items-center
                  gap-4

                  lg:gap-3
                  lg:px-4
                  lg:py-4

                  xl:gap-4
                  xl:px-[18px]
                  xl:py-[18px]
                "
              >
                {/* ===============================================
                    IMAGE
                ================================================ */}
                <div
                  className="
                    flex
                    h-[72px]
                    w-[72px]
                    shrink-0
                    items-center
                    justify-center

                    rounded-[16px]

                    border
                    border-[#00B1AA33]

                    bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]

                    md:h-[78px]
                    md:w-[78px]
                    md:rounded-[18px]

                    lg:h-[60px]
                    lg:w-[60px]
                    lg:rounded-[14px]

                    xl:h-[68px]
                    xl:w-[68px]
                    xl:rounded-[16px]
                  "
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={64}
                    height={64}
                    className="
                      h-[58px]
                      w-[58px]
                      object-contain

                      md:h-[64px]
                      md:w-[64px]

                      lg:h-[48px]
                      lg:w-[48px]

                      xl:h-[56px]
                      xl:w-[56px]
                    "
                  />
                </div>

                {/* ===============================================
                    TEXT
                ================================================ */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      font-red-hat-display
                      text-[17px]
                      font-[645]
                      leading-[23px]
                      tracking-[0]
                      text-secondary

                      md:text-[18px]

                      lg:text-[16px]
                      lg:font-extrabold
                      lg:leading-[22px]

                      xl:text-[18px]
                      xl:leading-[24px]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-1

                      max-w-[205px]

                      font-red-hat-display
                      text-[12px]
                      font-[467]
                      leading-[17px]
                      tracking-[0]
                      text-[#576574]

                      md:text-[13px]
                      md:leading-[18px]

                      lg:mt-1
                      lg:max-w-none
                      lg:font-inter
                      lg:text-[11px]
                      lg:leading-[16px]

                      xl:text-[12px]
                      xl:leading-[17px]
                    "
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* =================================================
                  DIVIDER + CTA
              ================================================== */}
              <div
                className="
                  flex
                  items-center
                  justify-center

                  border-t
                  border-[#F2F4F7]

                  px-4
                  py-3

                  lg:px-4
                  lg:py-[11px]

                  xl:py-3
                "
              >
                <Link
                  href={item.href}
                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-[6px]

                    font-inter
                    text-[12px]
                    font-semibold
                    leading-5
                    text-[#00897B]

                    transition-[gap]
                    duration-200

                    hover:gap-[10px]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-4

                    md:text-[13px]

                    lg:text-[11px]

                    xl:text-[12px]
                  "
                >
                  <span>{item.linkText}</span>

                  <ArrowRight
                    aria-hidden="true"
                    className="
                      h-[15px]
                      w-[15px]

                      lg:h-[14px]
                      lg:w-[14px]

                      xl:h-[15px]
                      xl:w-[15px]
                    "
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* =====================================================
            SECOND ROW
        ====================================================== */}
        <div
          className="
            mt-4

            grid
            grid-cols-1
            gap-4

            md:mt-5
            md:grid-cols-2
            md:gap-5

            lg:mt-5
            lg:gap-6
          "
        >
          {/* =================================================
              COMING SOON CARD
          ================================================== */}
          <div
            className="
              relative

              min-h-[205px]

              rounded-[20px]

              border
              border-[#EAECF0]
              border-t-[#DFE6EBB2]

              bg-white

              px-3
              pb-4
              pt-9

              shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

              md:rounded-[24px]
              md:px-4

              lg:h-[219px]
              lg:w-full
              lg:rounded-[28px]
              lg:px-5
              lg:pb-5
              lg:pt-[42px]
            "
          >
            {/* ===============================================
                COMING SOON CONNECTOR / TITLE
            ================================================ */}
            <div
              className="
                absolute
                left-4
                right-4
                top-[14px]

                flex
                items-center
                justify-center

                lg:left-[20px]
                lg:right-[20px]
                lg:top-[14px]
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

                  rounded-[100px]

                  border
                  border-[#F2F4F7]

                  bg-[#EFF8FF]

                  px-2

                  font-red-hat-display
                  text-[10px]
                  font-bold
                  leading-[16px]
                  text-[#147AD2]

                  md:h-[21px]
                  md:text-[11px]

                  lg:h-[22px]
                  lg:w-[92px]
                  lg:px-0
                  lg:text-[12px]
                  lg:leading-[18px]
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

            {/* ===============================================
                COMING SOON ITEMS
            ================================================ */}
            <div
              className="
                grid
                h-full
                grid-cols-3
                gap-2

                md:gap-3

                lg:gap-3
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

                    px-1
                    py-2

                    md:rounded-[14px]

                    lg:h-[123px]
                    lg:rounded-[16px]
                    lg:px-2
                    lg:py-2
                  "
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="
                      h-[48px]
                      w-[48px]
                      object-contain

                      md:h-[58px]
                      md:w-[58px]

                      lg:h-[72px]
                      lg:w-[72px]
                    "
                  />

                  <span
                    className="
                      mt-1

                      max-w-full

                      text-center

                      font-red-hat-display
                      text-[10px]
                      font-[550]
                      leading-[14px]
                      text-black

                      md:text-[12px]
                      md:leading-[16px]

                      lg:text-[14px]
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

          {/* =================================================
              NEWSLETTER CARD
          ================================================== */}
          <div
            className="
              relative

              min-h-[205px]

              overflow-hidden

              rounded-[20px]

              border
              border-[#EAECF0]
              border-t-[#DFE6EBB2]

              bg-white

              p-4

              shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

              md:rounded-[24px]
              md:p-5

              lg:h-[219px]
              lg:w-full
              lg:rounded-[28px]
              lg:px-6
              lg:py-5
            "
          >
            {/* ===============================================
                DECORATIVE CORNER
            ================================================ */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                right-0
                top-0

                h-[105px]
                w-[130px]

                rounded-bl-[80px]

                bg-[linear-gradient(135deg,rgba(231,246,245,0.85)_0%,rgba(255,255,255,0)_100%)]

                lg:h-[140px]
                lg:w-[180px]
              "
            />

            {/* ===============================================
                MAILBOX IMAGE
            ================================================ */}
            <div
              className="
                pointer-events-none

                absolute
                right-2
                top-2
                z-10

                h-[72px]
                w-[72px]

                md:h-[88px]
                md:w-[88px]

                lg:right-5
                lg:top-3
                lg:h-[117px]
                lg:w-[117px]
              "
            >
              <Image
                src={NEWSLETTER_IMAGE}
                alt=""
                fill
                sizes="117px"
                className="object-contain"
              />
            </div>

            {/* ===============================================
                COPY
            ================================================ */}
            <div
              className="
                relative
                z-20

                max-w-[68%]

                md:max-w-[67%]

                lg:max-w-[365px]
              "
            >
              <h3
                className="
                  font-red-hat-display
                  text-[19px]
                  font-extrabold
                  leading-[26px]
                  tracking-[0]
                  text-[#0C3354]

                  md:text-[21px]
                  md:leading-[30px]

                  lg:text-[24px]
                  lg:leading-[36.4px]
                "
              >
                Be the first to know
              </h3>

              <p
                className="
                  mt-1

                  max-w-[340px]

                  font-red-hat-display
                  text-[12px]
                  font-[467]
                  leading-[16px]
                  tracking-[0]
                  text-[#576574]

                  md:text-[13px]
                  md:leading-[17px]

                  lg:text-[16px]
                  lg:leading-[19px]
                "
              >
                {newsletter.description}
              </p>
            </div>

            {/* ===============================================
                EMAIL FORM
            ================================================ */}
            <form
              className="
                absolute
                bottom-4
                left-4
                right-4
                z-20

                md:bottom-5
                md:left-5
                md:right-5

                lg:bottom-5
                lg:left-6
                lg:right-6
              "
            >
              <div
                className="
                  flex
                  h-[44px]
                  w-full
                  items-center

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  pl-3

                  md:h-[46px]
                  md:pl-4

                  lg:h-[52px]
                "
              >
                <Mail
                  aria-hidden="true"
                  className="
                    h-[14px]
                    w-[14px]
                    shrink-0
                    text-[#355E87]

                    lg:h-[16px]
                    lg:w-[16px]
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
                  className="
                    min-w-0
                    flex-1

                    bg-transparent

                    px-2

                    font-inter
                    text-[10px]
                    text-secondary

                    outline-none

                    placeholder:text-[#475467]

                    md:text-[11px]

                    lg:px-3
                    lg:text-[13px]
                  "
                />

                <div
                  className="
                    hero-animated-border

                    -mr-px

                    h-[44px]
                    w-[105px]
                    shrink-0

                    rounded-full

                    p-[2px]

                    md:h-[46px]
                    md:w-[115px]

                    lg:h-[52px]
                    lg:w-[132px]
                    lg:p-[3px]
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

                      rounded-full

                      bg-secondary

                      px-3

                      font-red-hat-display
                      text-[10px]
                      font-semibold
                      text-white

                      transition-colors

                      hover:bg-[#124A7E]

                      md:text-[11px]

                      lg:text-[13px]
                    "
                  >
                    {newsletter.form.buttonLabel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
