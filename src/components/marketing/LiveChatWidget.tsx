'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ChevronDown } from 'lucide-react';

const quickReplies = [
  'I want to compare energy',
  'I want to compare energy efficiency across devices',
  'I need an estimate of energy bill',
];

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="
        fixed
        bottom-4
        right-3
        z-[100]

        flex
        flex-col
        items-end

        sm:bottom-5
        sm:right-5

        md:bottom-6
        md:right-6

        lg:bottom-7
        lg:right-7
      "
    >
      {/* =====================================================
          OPEN CHAT
      ====================================================== */}
      {isOpen && (
        <div
          className="
            relative
            mb-3

            h-[470px]
            w-[calc(100vw-24px)]
            max-w-[334px]

            overflow-hidden

            rounded-[18px]

            bg-white

            shadow-[0px_8px_24px_rgba(15,30,60,0.12)]

            sm:h-[480px]
            sm:max-w-[334px]

            md:h-[500px]
            md:w-[344px]
            md:max-w-none

            lg:h-[500px]
            lg:w-[334px]
            lg:rounded-[20px]
          "
        >
          {/* =================================================
    GREEN HEADER
================================================== */}
          <div
            className="
    absolute
    left-0
    right-0
    top-0

    h-[225px]

    rounded-t-[18px]

    bg-[#006B5F]

    px-[22px]
    pt-[20px]

    sm:h-[228px]
    sm:px-[26px]

    md:h-[230px]

    lg:h-[229px]
    lg:rounded-t-[20px]
    lg:px-[35px]
    lg:pt-[21px]
  "
          >
            {/* Avatar - no background / no border */}
            <div
              className="
      relative

      h-[40px]
      w-[40px]

      lg:h-[40px]
      lg:w-[40px]
    "
            >
              <Image
                src="/images/open-live-chat.png"
                alt="BillGoose assistant"
                fill
                priority
                sizes="34px"
                className="
        object-contain
      "
              />
            </div>

            {/* Greeting */}
            <h3
              className="
      mt-[20px]

      font-red-hat-display
      text-[23px]
      font-[550]
      leading-[29px]
      tracking-[0]
      text-white

      sm:text-[24px]

      lg:text-[27px]
      lg:leading-[34px]
    "
            >
              Hi Hayden 👋
            </h3>

            {/* Description */}
            <p
              className="
      mt-[4px]

      max-w-[245px]

      font-red-hat-display
      text-[12px]
      font-[467]
      leading-[17px]
      tracking-[0]
      text-white/75

      sm:text-[13px]
      sm:leading-[18px]

      lg:max-w-[250px]
    "
            >
              Let us know if we can help you with anything at all.
            </p>
          </div>

          {/* =================================================
              WHITE LOWER AREA
          ================================================== */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0

              top-[225px]

              rounded-b-[18px]

              bg-white

              sm:top-[228px]

              md:top-[230px]

              lg:top-[229px]
              lg:rounded-b-[20px]
            "
          />

          {/* =================================================
              SELECT SERVICES
              THIS IS ABSOLUTELY POSITIONED SO IT REALLY
              OVERLAPS THE GREEN + WHITE SECTIONS
          ================================================== */}
          <div
            className="
              absolute

              left-[14px]
              right-[14px]

              top-[170px]

              z-20

              rounded-[2px]

              bg-white

              px-[20px]
              pb-[20px]
              pt-[20px]

              shadow-[0px_4px_15px_0px_#0000001A,0px_1px_2px_0px_#0000001A]

              sm:left-[15px]
              sm:right-[15px]
              sm:top-[172px]

              md:left-[16px]
              md:right-[16px]
              md:top-[172px]

              lg:left-[14px]
              lg:right-[14px]
              lg:top-[173px]
            "
          >
            {/* Title */}
            <p
              className="
                font-red-hat-display
                text-[14px]
                font-[550]
                leading-[20px]
                tracking-[0]
                text-[#101828]

                lg:text-[15px]
              "
            >
              Select Services
            </p>

            {/* Options */}
            <div
              className="
                mt-[13px]

                flex
                flex-col
                gap-[8px]
              "
            >
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  className="
                    flex
                    min-h-[36px]
                    w-full
                    items-center

                    rounded-[6px]

                    bg-[#F2F4F7]

                    px-[12px]
                    py-[8px]

                    text-left

                    font-red-hat-display
                    text-[11px]
                    font-[467]
                    leading-[15px]
                    tracking-[0]
                    text-[#0C3354]

                    transition-colors
                    duration-200

                    hover:bg-[#E8F4F2]

                    sm:text-[12px]
                    sm:leading-[16px]

                    lg:min-h-[36px]
                    lg:text-[12px]
                  "
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CLOSED TEXT BUBBLES
      ====================================================== */}
      {!isOpen && (
        <div
          className="
            mb-3

            flex
            flex-col
            items-end
            gap-3
          "
        >
          <div
            className="
              rounded-[6px]

              border-[0.5px]
              border-[#BFE1DE]

              bg-white

              px-3
              py-2

              font-red-hat-display
              text-[11px]
              font-[550]
              leading-[16px]
              text-[#005D50]

              shadow-[-1.6px_3px_6px_0px_#00000012]

              sm:text-[12px]

              lg:px-4
              lg:py-[10px]
              lg:text-[14px]
              lg:leading-[18px]
            "
          >
            I want to compare energy
          </div>

          <div
            className="
              rounded-[6px]

              border-[0.5px]
              border-[#BFE1DE]

              bg-white

              px-3
              py-2

              font-red-hat-display
              text-[11px]
              font-[550]
              leading-[16px]
              text-[#005D50]

              shadow-[-1.6px_3px_6px_0px_#00000012]

              sm:text-[12px]

              lg:px-4
              lg:py-[10px]
              lg:text-[14px]
              lg:leading-[18px]
            "
          >
            May I help you?
          </div>
        </div>
      )}

      {/* =====================================================
          FLOATING BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close live chat' : 'Open live chat'}
        className="
          relative

          flex
          h-[56px]
          w-[56px]
          shrink-0
          items-center
          justify-center

          rounded-full

          transition-transform
          duration-200

          hover:scale-[1.04]

          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#73BEB7]/30

          sm:h-[60px]
          sm:w-[60px]

          md:h-[64px]
          md:w-[64px]

          lg:h-[72px]
          lg:w-[72px]
        "
      >
        {isOpen ? (
          <span
            className="
              flex
              h-full
              w-full
              items-center
              justify-center

              rounded-full

              bg-[#00897B]

              shadow-[0px_6px_18px_rgba(0,137,123,0.24)]
            "
          >
            <ChevronDown
              aria-hidden="true"
              className="
                h-[19px]
                w-[19px]

                text-white

                sm:h-[20px]
                sm:w-[20px]

                md:h-[22px]
                md:w-[22px]

                lg:h-[24px]
                lg:w-[24px]
              "
              strokeWidth={2.6}
            />
          </span>
        ) : (
          <Image
            src="/images/live-chat-widget.png"
            alt="Open BillGoose live chat"
            width={144}
            height={144}
            priority
            className="
              h-full
              w-full

              rounded-full

              object-contain

              drop-shadow-[0px_6px_8px_rgba(0,0,0,0.18)]
            "
          />
        )}
      </button>
    </div>
  );
}
