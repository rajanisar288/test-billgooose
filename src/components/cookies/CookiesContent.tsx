'use client';

import { useState } from 'react';

import Image from 'next/image';

import data from '@/data/content.json';

/* =========================================================
   TYPES
========================================================= */

type CookiesSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

type CookieCategory = {
  id: string;
  label: string;
  description: string;
  locked?: boolean;
};

/* =========================================================
   PREFERENCES DATA
========================================================= */

const CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    label: 'Necessary',
    description:
      'These cookies are essential for the website to function correctly. They enable basic features such as page navigation, form submission, and access to secure areas of the website. Without these cookies, the site cannot function property.',
    locked: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously.',
  },
  {
    id: 'advertising',
    label: 'Advertising',
    description:
      'These cookies are used to deliver advertisements that are more relevant to you and your interests.',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CookiesContent() {
  const { cookiesContent } = data as {
    cookiesContent: {
      sections: CookiesSection[];
    };
  };

  const { sections } = cookiesContent;

  /* ---------- Preferences state ---------- */
  const [openId, setOpenId] = useState<string | null>('necessary');
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    necessary: true,
    analytics: true,
    advertising: false,
  });

  function toggleOpen(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  function togglePref(id: string, locked?: boolean) {
    if (locked) return;
    setPrefs((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-6

        sm:px-5
        sm:pb-8

        lg:px-8
        lg:pb-10
      "
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div
          className="
            grid
            grid-cols-1

            gap-4

            sm:gap-5

            lg:grid-cols-[minmax(0,1fr)_536px]
            lg:items-stretch
            lg:gap-6
          "
        >
          {/* ============================================================
              LEFT — CONTENT CARD
              - flexes to fill remaining space next to the 536px panel
              - min-w-0 so it never pushes the grid wider than the container
          ============================================================ */}
          <div
            className="
              relative
              flex
              w-full
              min-w-0
              flex-col

              rounded-[18px]

              border-t
              border-[#DFE6EBB2]

              bg-white

              p-5

              shadow-[0px_8px_24px_0px_#0F1E3C0F,0px_1px_2px_0px_#0F1E3C0A]

              sm:rounded-[22px]
              sm:p-6

              md:rounded-[24px]
              md:p-7

              lg:h-[617px]
              lg:rounded-[28px]
              lg:p-[30px]
            "
          >
            {sections.map((section) => (
              <div
                key={section.id}
                className="
                  flex
                  flex-col

                  gap-3

                  sm:gap-3.5

                  lg:gap-4
                "
              >
                {/* Heading */}
                <h2
                  className="
                    font-red-hat-display

                    text-[20px]
                    font-[645]
                    leading-[28px]
                    tracking-[0]

                    text-[#0C3354]

                    sm:text-[22px]
                    sm:leading-[30px]

                    lg:text-[26px]
                    lg:leading-[36.4px]
                  "
                >
                  {section.heading}
                </h2>

                {/* Paragraphs */}
                <div className="flex flex-col gap-3 sm:gap-3.5 lg:gap-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="
                        font-red-hat-display

                        text-[14px]
                        font-[467]
                        leading-[22px]
                        tracking-[0.02em]

                        text-[#576574]

                        sm:text-[15px]
                        sm:leading-[24px]

                        lg:text-[18px]
                        lg:leading-[28px]
                      "
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================
              RIGHT — PREFERENCES PANEL (fixed 536px on lg)
          ============================================================ */}
          <div
            className="
              flex
              w-full
              flex-col

              rounded-[18px]

              border
              border-[#EAECF0]
              border-t-[#DFE6EBB2]

              bg-white

              p-5

              shadow-[0px_8px_24px_0px_#0F1E3C0F,0px_1px_2px_0px_#0F1E3C0A]

              sm:rounded-[22px]
              sm:p-6

              lg:h-[617px]
              lg:w-[536px]
              lg:rounded-[28px]
              lg:p-6
            "
          >
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-[6px]">
              <Image
                src="/images/cookies-logo.png"
                alt="BillGoose"
                width={122}
                height={48}
                className="h-[48px] w-[142px] object-contain"
              />
            </div>

            {/* Heading */}
            <h2
              className="
                mt-4
                shrink-0

                font-inter
                text-[18px]
                font-semibold
                leading-[26px]
                tracking-[0]

                text-[#0C3354]

                sm:text-[19px]
                sm:leading-[27px]

                lg:text-[20px]
                lg:leading-[28px]
              "
            >
              Customize your cookie preferences
            </h2>

            {/* Intro */}
            <p
              className="
                mt-2
                shrink-0

                font-inter
                text-[13px]
                font-normal
                leading-[20px]
                tracking-[0]

                text-[#344054]

                sm:text-[13.5px]
                sm:leading-[21px]

                lg:text-[14px]
                lg:leading-[22px]
              "
            >
              You can enable or disable different categories of cookies below. Necessary cookies are
              always on, as they are essential for the website to function. Your preferences will be
              saved and can be changed anytime.
            </p>

            {/* Categories */}
            <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {CATEGORIES.map((category) => {
                const isOpen = openId === category.id;
                const isOn = prefs[category.id];

                return (
                  <div
                    key={category.id}
                    className="
                      overflow-hidden

                      rounded-[14px]

                      border
                      border-[#EAECF0]

                      bg-white
                    "
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleOpen(category.id)}
                        aria-expanded={isOpen}
                        aria-controls={`cookie-panel-${category.id}`}
                        className="
                          flex
                          min-w-0
                          flex-1
                          items-center
                          gap-2.5

                          text-left

                          focus-visible:outline-none
                        "
                      >
                        {/* Chevron */}
                        <span
                          aria-hidden="true"
                          className={`
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center

                            rounded-full

                            bg-[#F2F4F7]

                            transition-transform
                            duration-200

                            sm:h-7
                            sm:w-7

                            ${isOpen ? 'rotate-180' : ''}
                          `}
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className="h-[10px] w-[10px] fill-none stroke-[#344054] stroke-[1.8] sm:h-[11px] sm:w-[11px]"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 4.5L6 7.5L9 4.5" />
                          </svg>
                        </span>

                        <span
                          className="
                            truncate

                            font-inter
                            text-[14px]
                            font-semibold
                            leading-5

                            text-[#0C3354]

                            sm:text-[15px]
                          "
                        >
                          {category.label}
                        </span>
                      </button>

                      {category.locked ? (
                        <span
                          className="
                            shrink-0
                            whitespace-nowrap

                            font-inter
                            text-[10px]
                            font-semibold
                            leading-4

                            text-[#0C3354]

                            sm:text-[11px]
                          "
                        >
                          Always active
                        </span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isOn}
                          aria-label={`Toggle ${category.label}`}
                          onClick={() => togglePref(category.id, category.locked)}
                          className={`
                            relative
                            inline-flex
                            h-[22px]
                            w-[40px]
                            shrink-0
                            items-center
                            rounded-full
                            transition-colors
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#00897B]
                            focus-visible:ring-offset-2
                            sm:h-[24px]
                            sm:w-[44px]
                            ${isOn ? 'bg-[#00897B]' : 'bg-[#D0D5DD]'}
                          `}
                        >
                          <span
                            className={`
                              inline-block
                              h-[16px]
                              w-[16px]
                              transform
                              rounded-full
                              bg-white
                              shadow-[0px_1px_2px_rgba(16,24,40,0.2)]
                              transition-transform
                              sm:h-[18px]
                              sm:w-[18px]
                              ${
                                isOn
                                  ? 'translate-x-[20px] sm:translate-x-[22px]'
                                  : 'translate-x-[3px]'
                              }
                            `}
                          />
                        </button>
                      )}
                    </div>

                    {/* Body */}
                    {isOpen && (
                      <div
                        id={`cookie-panel-${category.id}`}
                        className="
                          pl-11
                          pr-4
                          pb-3.5

                          sm:pl-[50px]
                          sm:pb-4
                        "
                      >
                        <p
                          className="
                            font-inter
                            text-[12px]
                            font-normal
                            leading-[19px]
                            tracking-[0]

                            text-[#576574]

                            sm:text-[13px]
                            sm:leading-[20px]
                          "
                        >
                          {category.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions — pinned to bottom on lg */}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 lg:mt-auto">
              <button
                type="button"
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-3.5

                  font-inter
                  text-[11px]
                  font-semibold

                  text-[#0C3354]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#00897B]
                  focus-visible:ring-offset-2

                  sm:h-10
                  sm:px-4
                  sm:text-[12px]
                "
              >
                Save my choices
              </button>

              <button
                type="button"
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-3.5

                  font-inter
                  text-[11px]
                  font-semibold

                  text-[#0C3354]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#00897B]
                  focus-visible:ring-offset-2

                  sm:h-10
                  sm:px-4
                  sm:text-[12px]
                "
              >
                Reject optional
              </button>

              <button
                type="button"
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center

                  rounded-full

                  bg-[#00897B]

                  px-3.5

                  font-inter
                  text-[11px]
                  font-semibold

                  text-white

                  transition-colors

                  hover:bg-[#00796D]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#00897B]
                  focus-visible:ring-offset-2

                  sm:h-10
                  sm:px-4
                  sm:text-[12px]
                "
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
