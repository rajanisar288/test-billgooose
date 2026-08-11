'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Check, Copy } from 'lucide-react';

import data from '@/data/content.json';

export default function JourneyMobileAccess() {
  const { instantAccess } = data.journey.sidebar;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instantAccess.url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="
        w-full
        border-b border-[#E9EAEB]
        bg-white

        lg:hidden
      "
    >
      {/* Top text */}
      <div
        className="
          flex h-[50px]
          items-center gap-2
          px-4
        "
      >
        <Image
          src={instantAccess.icon.src}
          alt={instantAccess.icon.alt}
          width={20}
          height={20}
          aria-hidden="true"
          className="
            h-5 w-5
            shrink-0
            object-contain
          "
        />

        <p
          className="
            font-inter
            text-[13px]
            font-medium
            leading-[22px]
            tracking-[-0.02em]
            text-[#0C3354]
          "
        >
          {instantAccess.description}
        </p>
      </div>

      {/* Link field */}
      <div
        className="
          flex h-[52px]
          w-full
          border-t border-[#E9EAEB]
          bg-white
        "
      >
        <div
          className="
            flex min-w-0
            flex-1 items-center
            px-4
          "
        >
          <span
            className="
              truncate
              font-inter
              text-[14px]
              font-normal
              leading-6
              text-[#535862]
            "
          >
            {instantAccess.url}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="
            inline-flex h-[52px]
            w-[96px]
            shrink-0
            items-center justify-center
            gap-2

            border-l border-[#EAECF0]
            bg-white

            px-[18px]
            py-2

            font-inter
            text-[14px]
            font-semibold
            leading-6
            text-[#0D3B66]

            transition-colors

            hover:bg-[#F9FAFB]

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-inset
            focus-visible:ring-[#E6F4F2]
          "
        >
          {copied ? (
            <Check
              aria-hidden="true"
              className="
                h-[18px] w-[18px]
                shrink-0
              "
              strokeWidth={2}
            />
          ) : (
            <Copy
              aria-hidden="true"
              className="
                h-[18px] w-[18px]
                shrink-0
              "
              strokeWidth={1.8}
            />
          )}

          <span>{copied ? 'Copied' : instantAccess.copyButton}</span>
        </button>
      </div>
    </section>
  );
}
