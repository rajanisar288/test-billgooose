'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Menu, X } from 'lucide-react';

export default function CurrentUsageMobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="
    relative z-50
    w-full
    border-b-[0.71px]
    border-[#EAECF0]
    bg-white

    md:hidden
  "
    >
      {/* Main mobile header */}
      <div
        className="
          flex h-[98px]
          w-full
          items-center
          justify-between

          px-5
        "
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Go to BillGoose homepage"
          className="
            relative
            block
            h-[53px]
            w-[167px]
            shrink-0
          "
        >
          <Image
            src="/images/billgoose-logo.png"
            alt="BillGoose"
            width={167}
            height={53}
            priority
            className="
              h-[53px]
              w-[167px]
              object-contain
              object-left
            "
          />
        </Link>

        {/* Hamburger only */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((previous) => !previous);
          }}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          className="
            flex h-10
            w-10
            shrink-0
            items-center
            justify-center

            rounded-[10px]

            bg-[#EAECF0]

            text-[#0D3B66]

            transition-colors

            hover:bg-[#E1E4E8]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#0D3B66]
            focus-visible:ring-offset-2
          "
        >
          {isMenuOpen ? (
            <X
              aria-hidden="true"
              className="
                h-6
                w-6
                text-[#0D3B66]
              "
              strokeWidth={2}
            />
          ) : (
            <Menu
              aria-hidden="true"
              className="
                h-6
                w-6
                text-[#0D3B66]
              "
              strokeWidth={2}
            />
          )}
        </button>
      </div>

      {/* Optional mobile dropdown */}
      <div
        className={`
          overflow-hidden
          border-t border-[#EAECF0]
          bg-white

          transition-all
          duration-300

          ${isMenuOpen ? 'max-h-[280px] opacity-100' : 'max-h-0 border-transparent opacity-0'}
        `}
      >
        <nav
          className="
            flex flex-col
            gap-1
            px-5
            py-4
          "
          aria-label="Current usage mobile navigation"
        >
          <Link
            href="/compare"
            onClick={() => setIsMenuOpen(false)}
            className="
              rounded-xl
              px-4
              py-3

              font-inter
              text-[14px]
              font-semibold
              text-[#0D3B66]

              hover:bg-[#F9FAFB]
            "
          >
            Compare
          </Link>

          <Link
            href="/#guides"
            onClick={() => setIsMenuOpen(false)}
            className="
              rounded-xl
              px-4
              py-3

              font-inter
              text-[14px]
              font-semibold
              text-[#0D3B66]

              hover:bg-[#F9FAFB]
            "
          >
            Guides
          </Link>

          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="
              rounded-xl
              px-4
              py-3

              font-inter
              text-[14px]
              font-semibold
              text-[#0D3B66]

              hover:bg-[#F9FAFB]
            "
          >
            Help
          </Link>
        </nav>
      </div>
    </header>
  );
}
