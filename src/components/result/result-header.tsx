'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronDown, Menu, UserRound, X } from 'lucide-react';

import data from '@/data/content.json';

export default function ResultHeader() {
  const { header } = data;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  const compareMenuRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCompareMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (compareMenuRef.current && !compareMenuRef.current.contains(event.target as Node)) {
        setIsCompareMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className="
        relative z-50 w-full
        border-b border-[#EAECF01A]
        bg-[#0B2B43]
      "
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          className="
            flex min-h-[72px]
            items-center justify-between
            px-4

            min-[390px]:px-5

            sm:min-h-[84px]
            sm:px-8

            lg:min-h-[104px]
            lg:px-10

            xl:min-h-[133px]
          "
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenus}
            className="relative block shrink-0"
            aria-label="Go to BillGoose homepage"
          >
            <Image
              src="/images/result-logo.png"
              alt={header.logo.alt}
              width={267}
              height={83}
              priority
              className="
                h-auto w-[142px]
                object-contain

                min-[390px]:w-[155px]

                sm:w-[185px]

                lg:w-[220px]

                xl:h-[83px]
                xl:w-[266.7px]
              "
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-3 lg:flex xl:gap-4">
            <nav
              aria-label="Main navigation"
              className="
                flex h-[46px] items-center
                rounded-[100px]
                bg-white/10 p-1

                xl:h-[50px]
              "
            >
              {header.navigation.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.id}
                      ref={compareMenuRef}
                      className="relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsCompareMenuOpen((previous) => !previous);
                        }}
                        className="
                          flex h-[38px] items-center
                          gap-1.5 rounded-full
                          px-3

                          font-red-hat-display
                          text-[14px] font-medium
                          leading-5 text-white

                          transition-colors

                          hover:bg-white/10

                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-white
                          focus-visible:ring-offset-2
                          focus-visible:ring-offset-[#0B2B43]

                          xl:h-10
                          xl:px-4
                          xl:text-[16px]
                          xl:leading-6
                        "
                        aria-expanded={isCompareMenuOpen}
                        aria-haspopup="menu"
                      >
                        {item.label}

                        <ChevronDown
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2}
                          className={`
                            transition-transform duration-200

                            ${isCompareMenuOpen ? 'rotate-180' : ''}
                          `}
                        />
                      </button>

                      {isCompareMenuOpen && (
                        <div
                          role="menu"
                          className="
                            absolute right-0
                            top-[calc(100%+12px)]
                            w-56 overflow-hidden
                            rounded-2xl
                            border border-[#EAECF0]
                            bg-white p-2
                            shadow-xl
                          "
                        >
                          <Link
                            href={item.href}
                            role="menuitem"
                            onClick={closeMenus}
                            className="
                              block rounded-xl
                              px-4 py-2.5

                              font-red-hat-display
                              text-sm font-medium
                              text-[#0C3354]

                              transition-colors

                              hover:bg-[#E6F4F2]
                              hover:text-[#00897B]
                            "
                          >
                            View all comparisons
                          </Link>

                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              role="menuitem"
                              onClick={closeMenus}
                              className="
                                block rounded-xl
                                px-4 py-2.5

                                font-red-hat-display
                                text-sm font-medium
                                text-[#0C3354]

                                transition-colors

                                hover:bg-[#E6F4F2]
                                hover:text-[#00897B]
                              "
                            >
                              {menuItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeMenus}
                    className="
                      flex h-[38px] items-center
                      rounded-full px-3

                      font-red-hat-display
                      text-[14px] font-medium
                      leading-5 text-white

                      transition-colors

                      hover:bg-white/10

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-white
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#0B2B43]

                      xl:h-10
                      xl:px-4
                      xl:text-[16px]
                      xl:leading-6
                    "
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop sign-in */}
            <Link
              href={header.account.href}
              aria-label="Sign In"
              onClick={closeMenus}
              className="
                inline-flex h-[46px]
                items-center gap-2
                rounded-[100px]
                border border-[#EAECF0]
                bg-transparent
                py-[6px] pl-4 pr-[6px]

                font-red-hat-display
                text-[14px] font-medium
                leading-5 text-white

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                transition-colors

                hover:bg-white/10

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0B2B43]

                xl:h-[50px]
                xl:gap-[10px]
                xl:py-[7px]
                xl:pl-5
                xl:pr-[7px]
                xl:text-[16px]
                xl:leading-6
              "
            >
              <span className="whitespace-nowrap">Sign In</span>

              <span
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-full bg-[#00897B]
                  text-white

                  xl:h-9
                  xl:w-9
                "
              >
                <UserRound
                  aria-hidden="true"
                  className="
                    h-4 w-4

                    xl:h-[19px]
                    xl:w-[19px]
                  "
                  strokeWidth={2}
                />
              </span>
            </Link>
          </div>

          {/* Mobile account/menu pill */}
          <div
            className="
              flex h-[42px] w-[76px]
              items-center gap-1
              rounded-[100px]
              border border-[#EAECF0]
              bg-white/10
              py-2 pl-3 pr-[5px]

              shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

              min-[390px]:h-[46px]
              min-[390px]:w-[82px]
              min-[390px]:gap-[5px]
              min-[390px]:pl-[13px]
              min-[390px]:pr-[6px]

              lg:hidden
            "
          >
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((previous) => !previous);
              }}
              className="
                flex h-5 w-5 shrink-0
                items-center justify-center
                text-white

                transition-colors

                hover:text-[#00BC7D]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0B2B43]
              "
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="result-mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              ) : (
                <Menu
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              )}
            </button>

            <Link
              href={header.account.href}
              aria-label="Sign In"
              onClick={closeMenus}
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full bg-[#00897B]
                text-white

                transition-colors

                hover:bg-[#00796D]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0B2B43]

                min-[390px]:h-9
                min-[390px]:w-9
              "
            >
              <UserRound
                aria-hidden="true"
                className="
                  h-[15px] w-[15px]

                  min-[390px]:h-[17px]
                  min-[390px]:w-[17px]
                "
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          id="result-mobile-navigation"
          className={`
            overflow-hidden
            transition-all duration-300
            lg:hidden

            ${isMobileMenuOpen ? 'max-h-[650px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <nav
            aria-label="Mobile navigation"
            className="
              space-y-2
              border-t border-[#EAECF01A]
              px-4 py-4

              min-[390px]:px-5

              sm:px-8
              sm:py-5
            "
          >
            {header.navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={closeMenus}
                        className="
                          flex-1 rounded-l-xl
                          px-4 py-3

                          font-red-hat-display
                          text-left text-sm
                          font-medium text-white

                          transition-colors

                          hover:bg-white/10
                        "
                      >
                        {item.label}
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCompareMenuOpen((previous) => !previous);
                        }}
                        className="
                          flex items-center justify-center
                          rounded-r-xl px-4 py-3
                          text-white

                          transition-colors

                          hover:bg-white/10
                        "
                        aria-label="Open Compare menu"
                        aria-expanded={isCompareMenuOpen}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={`
                            h-4 w-4
                            transition-transform duration-200

                            ${isCompareMenuOpen ? 'rotate-180' : ''}
                          `}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    <div
                      className={`
                        grid transition-all duration-300

                        ${isCompareMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                            ml-4 space-y-1
                            border-l-2 border-[#00897B]
                            py-2 pl-3
                          "
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenus}
                            className="
                              block rounded-lg
                              px-4 py-2.5
                              text-sm font-medium
                              text-white

                              transition-colors

                              hover:bg-white/10
                            "
                          >
                            View all comparisons
                          </Link>

                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              onClick={closeMenus}
                              className="
                                block rounded-lg
                                px-4 py-2.5
                                text-sm font-medium
                                text-white

                                transition-colors

                                hover:bg-white/10
                              "
                            >
                              {menuItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMenus}
                  className="
                    block rounded-xl
                    px-4 py-3

                    font-red-hat-display
                    text-sm font-medium
                    text-white

                    transition-colors

                    hover:bg-white/10
                  "
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href={header.account.href}
              onClick={closeMenus}
              className="
                mt-4 flex items-center
                justify-center gap-2
                rounded-full bg-[#00897B]
                px-5 py-3

                font-red-hat-display
                text-sm font-medium
                text-white

                transition-colors

                hover:bg-[#00796D]
              "
            >
              <UserRound
                aria-hidden="true"
                className="h-[17px] w-[17px]"
                strokeWidth={2}
              />
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
