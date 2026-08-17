'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronDown, ChevronRight, Menu, UserRound, X } from 'lucide-react';

import data from '../../data/content.json';

export default function Header() {
  const { header } = data;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  const compareMenuRef = useRef<HTMLDivElement>(null);

  const availableServices = header.compareMenu.filter((service) => service.status === 'available');

  const comingSoonServices = header.compareMenu.filter(
    (service) => service.status === 'coming-soon',
  );

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCompareMenuOpen(false);
  };

  const getNavigationHref = (label: string, href: string, hasDropdown?: boolean) => {
    const normalizedLabel = label.trim().toLowerCase();

    if (hasDropdown || normalizedLabel === 'compare') {
      return '/compare';
    }

    if (normalizedLabel.includes('guide')) {
      return '/#guides';
    }

    return href || '/';
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
    <header className="relative z-50 w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          className="
            flex min-h-[72px]
            items-center justify-between
            px-5

            sm:px-8

            md:min-h-[84px]
            md:justify-start
            md:px-[30px]

            lg:min-h-[103px]
            lg:justify-between
            lg:px-10
          "
        >
          {/* =====================================================
              LOGO
          ====================================================== */}
          <Link
            href="/"
            onClick={closeMenus}
            className="relative block shrink-0"
            aria-label="Go to BillGoose homepage"
          >
            <Image
              src={header.logo.src}
              alt={header.logo.alt}
              width={header.logo.width}
              height={header.logo.height}
              priority
              className="
                h-auto
                w-[145px]
                object-contain

                sm:w-[180px]

                md:w-[165px]

                lg:h-[83px]
                lg:w-[266.7px]
              "
            />
          </Link>

          {/* =====================================================
              TABLET + DESKTOP NAVIGATION
          ====================================================== */}
          <div
            className="
              hidden
              items-center

              md:ml-auto
              md:flex
              md:gap-[14px]

              lg:ml-0
              lg:gap-3
            "
          >
            <nav
              aria-label="Main navigation"
              className="
                flex
                items-center

                rounded-full

                border
                border-[#EAECF0]

                bg-[#F9FAFB]

                p-1

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
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
                      {/* Compare trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCompareMenuOpen((previous) => !previous);
                        }}
                        aria-expanded={isCompareMenuOpen}
                        aria-haspopup="menu"
                        className={`
                          flex
                          h-9
                          items-center
                          gap-1.5

                          rounded-full

                          border

                          px-3.5

                          font-red-hat-display
                          text-[13px]
                          font-medium
                          text-secondary

                          transition-all
                          duration-200

                          hover:bg-white

                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#00897B]
                          focus-visible:ring-offset-2

                          lg:h-10
                          lg:px-4
                          lg:text-[14px]

                          ${
                            isCompareMenuOpen
                              ? `
                                border-[#73BEB7]
                                bg-white
                              `
                              : `
                                border-transparent
                                bg-transparent
                              `
                          }
                        `}
                      >
                        <span>{item.label}</span>

                        <ChevronDown
                          aria-hidden="true"
                          className={`
                            h-[15px]
                            w-[15px]
                            shrink-0

                            transition-transform
                            duration-200

                            ${isCompareMenuOpen ? 'rotate-180' : ''}
                          `}
                          strokeWidth={2}
                        />
                      </button>

                      {/* =================================================
                          TABLET + DESKTOP COMPARE DROPDOWN
                      ================================================== */}
                      {isCompareMenuOpen && (
                        <div
                          role="menu"
                          className="
                            absolute
                            right-0
                            top-[calc(100%+12px)]
                            z-[80]

                            w-[310px]

                            overflow-hidden

                            rounded-[18px]

                            border
                            border-[#EAECF0]

                            bg-white

                            p-[10px]

                            shadow-[0px_16px_40px_rgba(15,30,60,0.14),0px_2px_6px_rgba(15,30,60,0.06)]

                            lg:w-[338px]
                            lg:rounded-[20px]
                            lg:p-3
                          "
                        >
                          {/* Available services */}
                          <div className="space-y-1">
                            {availableServices.map((service) => (
                              <Link
                                key={service.id}
                                href={service.href}
                                role="menuitem"
                                onClick={closeMenus}
                                className="
                                  group

                                  flex
                                  min-h-[74px]
                                  w-full
                                  items-center

                                  gap-3

                                  rounded-[12px]

                                  px-2
                                  py-[5px]

                                  transition-all
                                  duration-200

                                  hover:bg-[linear-gradient(0deg,rgba(0,137,123,0.08),rgba(0,137,123,0.08)),linear-gradient(0deg,rgba(255,255,255,0.92),rgba(255,255,255,0.92))]

                                  lg:min-h-[84px]
                                  lg:gap-[14px]
                                  lg:px-[6px]
                                  lg:py-[7px]
                                "
                              >
                                {/* Service artwork */}
                                <span
                                  className="
                                    flex
                                    h-[58px]
                                    w-[58px]
                                    shrink-0
                                    items-center
                                    justify-center

                                    overflow-hidden

                                    rounded-[10px]

                                    bg-white

                                    shadow-[0px_1px_4px_rgba(16,24,40,0.08)]

                                    lg:h-[70px]
                                    lg:w-[70px]
                                    lg:rounded-[11px]
                                  "
                                >
                                  <Image
                                    src={service.icon}
                                    alt={service.iconAlt}
                                    width={70}
                                    height={70}
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                    "
                                  />
                                </span>

                                {/* Text */}
                                <span className="min-w-0 flex-1">
                                  <span
                                    className="
                                      block

                                      font-red-hat-display
                                      text-[15px]
                                      font-bold
                                      leading-5
                                      text-[#101828]

                                      lg:text-[16px]
                                      lg:leading-6
                                    "
                                  >
                                    {service.label}
                                  </span>

                                  {service.description && (
                                    <span
                                      className="
                                        mt-[1px]
                                        block

                                        max-w-[185px]

                                        font-red-hat-display
                                        text-[12px]
                                        font-[467]
                                        leading-[16px]
                                        text-[#667085]

                                        lg:max-w-[205px]
                                        lg:text-[13px]
                                        lg:leading-[17px]
                                      "
                                    >
                                      {service.description}
                                    </span>
                                  )}
                                </span>

                                {/* Right arrow */}
                                <ChevronRight
                                  aria-hidden="true"
                                  className="
                                    h-4
                                    w-4
                                    shrink-0

                                    text-[#D0D5DD]

                                    transition-colors
                                    duration-200

                                    group-hover:text-[#101828]

                                    lg:h-[18px]
                                    lg:w-[18px]
                                  "
                                  strokeWidth={2.3}
                                />
                              </Link>
                            ))}
                          </div>

                          {/* Coming Soon */}
                          {comingSoonServices.length > 0 && (
                            <>
                              <div
                                className="
                                  relative

                                  my-3

                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <div
                                  aria-hidden="true"
                                  className="
                                    absolute
                                    left-2
                                    right-2
                                    top-1/2

                                    h-px

                                    -translate-y-1/2

                                    bg-[#EAECF0]
                                  "
                                />

                                <span
                                  className="
                                    relative
                                    z-10

                                    rounded-full

                                    border
                                    border-[#D1E9FF]

                                    bg-[#EFF8FF]

                                    px-2.5
                                    py-[2px]

                                    font-inter
                                    text-[10px]
                                    font-medium
                                    leading-[14px]
                                    text-[#1570EF]
                                  "
                                >
                                  Coming Soon
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                {comingSoonServices.map((service) => (
                                  <div
                                    key={service.id}
                                    className="
                                      flex
                                      min-w-0
                                      flex-col
                                      items-center
                                      justify-center

                                      rounded-[8px]

                                      border
                                      border-[#EAECF0]

                                      bg-white

                                      px-1
                                      pb-2
                                      pt-1.5

                                      shadow-[0px_1px_2px_rgba(16,24,40,0.04)]
                                    "
                                  >
                                    <Image
                                      src={service.icon}
                                      alt={service.iconAlt}
                                      width={42}
                                      height={42}
                                      className="
                                        h-[42px]
                                        w-[42px]
                                        object-contain
                                      "
                                    />

                                    <span
                                      className="
                                        mt-1

                                        max-w-full

                                        truncate

                                        text-center

                                        font-red-hat-display
                                        text-[10px]
                                        font-medium
                                        leading-[14px]
                                        text-[#101828]

                                        lg:text-[11px]
                                      "
                                    >
                                      {service.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={getNavigationHref(item.label, item.href, item.hasDropdown)}
                    onClick={closeMenus}
                    className="
                      flex
                      h-9
                      items-center

                      rounded-full

                      px-3.5

                      font-red-hat-display
                      text-[13px]
                      font-medium
                      text-secondary

                      transition-colors

                      hover:bg-white
                      hover:text-primary

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      focus-visible:ring-offset-2

                      lg:h-10
                      lg:px-4
                      lg:text-[14px]
                    "
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* =====================================================
                SIGN IN
            ====================================================== */}
            <Link
              href={header.account.href}
              aria-label={header.account.label}
              onClick={closeMenus}
              className="
                inline-flex
                h-[40px]
                shrink-0
                items-center
                gap-[7px]

                rounded-[100px]

                border
                border-[#EAECF0]

                bg-[#F9FAFB]

                py-[5px]
                pl-[14px]
                pr-[5px]

                font-red-hat-display
                text-[13px]
                font-bold
                leading-5
                text-[#355E87]

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                transition-colors

                hover:bg-white
                hover:text-[#00897B]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#00897B]
                focus-visible:ring-offset-2

                lg:h-[50px]
                lg:gap-[10px]
                lg:py-[7px]
                lg:pl-5
                lg:pr-[7px]
                lg:text-[16px]
                lg:leading-6
              "
            >
              <span className="whitespace-nowrap">Sign In</span>

              <span
                className="
                  flex
                  h-[30px]
                  w-[30px]
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-[#00897B]

                  text-white

                  lg:h-9
                  lg:w-9
                "
              >
                <UserRound
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="
                    lg:h-[19px]
                    lg:w-[19px]
                  "
                />
              </span>
            </Link>
          </div>

          {/* =====================================================
              MOBILE MENU + ACCOUNT
          ====================================================== */}
          <div
            className="
              flex
              h-[44px]
              w-[78px]
              items-center
              gap-[5px]

              rounded-[100px]

              border
              border-[#EAECF0]

              bg-[#F9FAFB]

              py-[9px]
              pl-3
              pr-[6px]

              shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

              min-[390px]:h-[50px]
              min-[390px]:w-[87px]
              min-[390px]:gap-[6px]
              min-[390px]:py-3
              min-[390px]:pl-[14px]
              min-[390px]:pr-[7px]

              md:hidden
            "
          >
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((previous) => !previous);
              }}
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center

                text-secondary

                transition-colors

                hover:text-primary

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2

                min-[390px]:h-6
                min-[390px]:w-6
              "
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X
                  size={16}
                  strokeWidth={2}
                  className="
                    min-[390px]:h-[18px]
                    min-[390px]:w-[18px]
                  "
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  size={16}
                  strokeWidth={2}
                  className="
                    min-[390px]:h-[18px]
                    min-[390px]:w-[18px]
                  "
                  aria-hidden="true"
                />
              )}
            </button>

            <Link
              href="/"
              aria-label={header.account.label}
              onClick={closeMenus}
              className="
    flex h-8 w-8 shrink-0
    items-center justify-center
    rounded-full
    bg-[#00796D]
    text-white

    transition-colors

    hover:bg-primary

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2

    min-[390px]:h-9
    min-[390px]:w-9
  "
            >
              <UserRound
                size={15}
                strokeWidth={2}
                className="
      min-[390px]:h-[17px]
      min-[390px]:w-[17px]
    "
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}
        <div
          id="mobile-navigation"
          className={`
            overflow-hidden

            transition-all
            duration-300

            md:hidden

            ${isMobileMenuOpen ? 'max-h-[950px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <nav
            aria-label="Mobile navigation"
            className="
              space-y-2

              px-5
              pb-5
              pt-2

              sm:px-8
            "
          >
            {header.navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    {/* Mobile Compare trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompareMenuOpen((previous) => !previous);
                      }}
                      aria-expanded={isCompareMenuOpen}
                      aria-haspopup="menu"
                      className={`
                        flex
                        h-10
                        w-fit
                        items-center
                        gap-1.5

                        rounded-full

                        border

                        bg-white

                        px-3.5

                        font-red-hat-display
                        text-[14px]
                        font-medium
                        text-secondary

                        transition-colors

                        ${isCompareMenuOpen ? 'border-[#73BEB7]' : 'border-[#EAECF0]'}
                      `}
                    >
                      <span>{item.label}</span>

                      <ChevronDown
                        aria-hidden="true"
                        className={`
                          h-[15px]
                          w-[15px]
                          shrink-0

                          transition-transform
                          duration-200

                          ${isCompareMenuOpen ? 'rotate-180' : ''}
                        `}
                        strokeWidth={2}
                      />
                    </button>

                    {/* Mobile dropdown */}
                    <div
                      className={`
                        grid

                        transition-all
                        duration-300

                        ${
                          isCompareMenuOpen
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                            mt-3

                            rounded-[18px]

                            border
                            border-[#EAECF0]

                            bg-white

                            p-[10px]

                            shadow-[0px_12px_30px_rgba(15,30,60,0.10)]
                          "
                        >
                          {/* Available mobile services */}
                          <div className="space-y-1">
                            {availableServices.map((service) => (
                              <Link
                                key={service.id}
                                href={service.href}
                                onClick={closeMenus}
                                className="
                                  group

                                  flex
                                  min-h-[72px]
                                  items-center

                                  gap-3

                                  rounded-[12px]

                                  px-1.5
                                  py-1.5

                                  transition-colors

                                  hover:bg-[linear-gradient(0deg,rgba(0,137,123,0.08),rgba(0,137,123,0.08)),linear-gradient(0deg,rgba(255,255,255,0.92),rgba(255,255,255,0.92))]
                                "
                              >
                                <span
                                  className="
                                    flex
                                    h-[58px]
                                    w-[58px]
                                    shrink-0
                                    items-center
                                    justify-center

                                    overflow-hidden

                                    rounded-[10px]

                                    bg-white

                                    shadow-[0px_1px_4px_rgba(16,24,40,0.08)]
                                  "
                                >
                                  <Image
                                    src={service.icon}
                                    alt={service.iconAlt}
                                    width={58}
                                    height={58}
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                    "
                                  />
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span
                                    className="
                                      block

                                      font-red-hat-display
                                      text-[15px]
                                      font-bold
                                      leading-5
                                      text-[#101828]
                                    "
                                  >
                                    {service.label}
                                  </span>

                                  {service.description && (
                                    <span
                                      className="
                                        mt-[1px]
                                        block

                                        max-w-[200px]

                                        font-red-hat-display
                                        text-[12px]
                                        font-[467]
                                        leading-4
                                        text-[#667085]
                                      "
                                    >
                                      {service.description}
                                    </span>
                                  )}
                                </span>

                                <ChevronRight
                                  aria-hidden="true"
                                  className="
                                    h-4
                                    w-4
                                    shrink-0

                                    text-[#D0D5DD]

                                    transition-colors

                                    group-hover:text-[#101828]
                                  "
                                  strokeWidth={2.3}
                                />
                              </Link>
                            ))}
                          </div>

                          {/* Coming soon mobile */}
                          {comingSoonServices.length > 0 && (
                            <>
                              <div
                                className="
                                  relative

                                  my-3

                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <div
                                  aria-hidden="true"
                                  className="
                                    absolute
                                    left-2
                                    right-2
                                    top-1/2

                                    h-px

                                    -translate-y-1/2

                                    bg-[#EAECF0]
                                  "
                                />

                                <span
                                  className="
                                    relative
                                    z-10

                                    rounded-full

                                    border
                                    border-[#D1E9FF]

                                    bg-[#EFF8FF]

                                    px-2.5
                                    py-[2px]

                                    font-inter
                                    text-[10px]
                                    font-medium
                                    leading-[14px]
                                    text-[#1570EF]
                                  "
                                >
                                  Coming Soon
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                {comingSoonServices.map((service) => (
                                  <div
                                    key={service.id}
                                    className="
                                      flex
                                      min-w-0
                                      flex-col
                                      items-center

                                      rounded-[8px]

                                      border
                                      border-[#EAECF0]

                                      bg-white

                                      px-1
                                      pb-2
                                      pt-1.5

                                      shadow-[0px_1px_2px_rgba(16,24,40,0.04)]
                                    "
                                  >
                                    <Image
                                      src={service.icon}
                                      alt={service.iconAlt}
                                      width={40}
                                      height={40}
                                      className="
                                        h-10
                                        w-10
                                        object-contain
                                      "
                                    />

                                    <span
                                      className="
                                        mt-1

                                        max-w-full

                                        truncate

                                        text-center

                                        font-red-hat-display
                                        text-[10px]
                                        font-medium
                                        text-[#101828]
                                      "
                                    >
                                      {service.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={getNavigationHref(item.label, item.href, item.hasDropdown)}
                  onClick={closeMenus}
                  className="
                    block

                    rounded-xl

                    px-4
                    py-3

                    text-sm
                    font-semibold
                    text-secondary

                    transition-colors

                    hover:bg-slate-50
                    hover:text-primary
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
                mt-4

                flex
                items-center
                justify-center
                gap-2

                rounded-full

                bg-primary

                px-5
                py-3

                text-sm
                font-semibold
                text-white

                transition-colors

                hover:bg-[#00796D]
              "
            >
              <UserRound
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />

              {header.account.label}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
