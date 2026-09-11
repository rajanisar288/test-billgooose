'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronDown } from 'lucide-react';

import data from '@/data/content.json';

export default function Footer() {
  const { footer } = data;

  const [openColumnId, setOpenColumnId] = useState<string | null>(footer.columns[0]?.id ?? null);

  const toggleColumn = (columnId: string) => {
    setOpenColumnId((currentColumnId) => (currentColumnId === columnId ? null : columnId));
  };

  const getFooterHref = (columnHeading: string, linkLabel: string) => {
    const normalizedHeading = columnHeading.trim().toLowerCase();
    const normalizedLabel = linkLabel.trim().toLowerCase();

    // Company > About
    if (normalizedHeading.includes('company')) {
      if (normalizedLabel === 'about us') return '/about';
      if (normalizedLabel === 'careers') return '/careers';
    }

    if (normalizedHeading.includes('support')) {
      if (normalizedLabel == 'customer support') return '/customer-support';
    }

    if (normalizedHeading.includes('compare')) {
      return '/compare';
    }

    if (normalizedHeading.includes('guide')) {
      return '/#guides';
    }

    return '/';
  };

  return (
    <footer className="w-full bg-white">
      {/* Mobile footer */}
      <div className="flex min-h-[600px] w-full flex-col px-5 pb-8 pt-8 sm:px-8 lg:hidden">
        {/* Mobile accordion links */}
        <div>
          {footer.columns.map((column) => {
            const isOpen = openColumnId === column.id;

            const getLinkHref = (linkLabel: string) => getFooterHref(column.heading, linkLabel);

            return (
              <div key={column.id}>
                <button
                  type="button"
                  onClick={() => toggleColumn(column.id)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-column-${column.id}`}
                  className="flex w-full items-center justify-between py-2 text-left font-red-hat-display text-[14px] font-[645] leading-5 tracking-[0] text-secondary min-[360px]:py-2.5 min-[360px]:text-[15px] min-[390px]:py-3 min-[390px]:text-[16px] min-[390px]:leading-6"
                >
                  <span>{column.heading}</span>

                  <ChevronDown
                    size={22}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className={`shrink-0 text-secondary transition-transform duration-300 min-[390px]:h-6 min-[390px]:w-6 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  id={`footer-column-${column.id}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <nav
                      aria-label={`${column.heading} footer links`}
                      className="flex flex-col gap-2 pb-2 pl-0 min-[360px]:gap-2.5 min-[390px]:gap-3 min-[390px]:pb-3"
                    >
                      {column.links.map((link) => (
                        <Link
                          key={link.id}
                          href={getLinkHref(link.label)}
                          className="inline-flex w-fit items-center gap-2 font-red-hat-display text-[12px] font-[467] leading-[18px] tracking-[0] text-[#475467] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[360px]:text-[13px] min-[360px]:leading-[19px] min-[390px]:text-[14px] min-[390px]:leading-5"
                        >
                          <span>{link.label}</span>

                          {link.badge && (
                            <span className="inline-flex min-h-[18px] items-center justify-center rounded-full bg-[#ECFDF3] px-2 font-red-hat-display text-[9px] font-bold leading-none text-primary min-[390px]:min-h-5 min-[390px]:text-[11px]">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile footer bottom */}
        <div className="mt-auto border-t border-[#EAECF0] pt-6 min-[360px]:pt-7 min-[390px]:pt-[30px]">
          <Link
            href="/"
            aria-label={footer.logo.ariaLabel}
            className="relative mx-auto block h-[25px] w-[126px] min-[360px]:h-[27px] min-[360px]:w-[136px] min-[390px]:h-7 min-[390px]:w-[142px]"
          >
            <Image
              src={footer.logo.src}
              alt={footer.logo.alt}
              fill
              sizes="142px"
              className="object-contain object-center"
            />
          </Link>

          <p className="mx-auto mt-5 max-w-[300px] text-center font-red-hat-display text-[11px] font-[467] leading-[18px] tracking-[0] text-[#667085] min-[360px]:max-w-[325px] min-[360px]:text-[12px] min-[360px]:leading-5 min-[390px]:max-w-[360px] min-[390px]:text-[14px] min-[390px]:leading-6">
            {footer.copyright}
          </p>
        </div>
      </div>

      {/* Desktop footer */}
      <div className="mx-auto hidden min-h-[480px] w-full max-w-[1440px] flex-col px-20 pb-12 pt-16 lg:flex">
        {/* Footer links */}
        <div className="grid grid-cols-4 gap-16">
          {footer.columns.map((column) => {
            const getLinkHref = (linkLabel: string) => getFooterHref(column.heading, linkLabel);

            return (
              <div key={column.id}>
                <h2 className="font-red-hat-display text-[14px] font-medium leading-[1.4] text-[#667085]">
                  {column.heading}
                </h2>

                <nav
                  className="mt-5 flex flex-col gap-4"
                  aria-label={`${column.heading} footer links`}
                >
                  {column.links.map((link) => (
                    <Link
                      key={link.id}
                      href={getLinkHref(link.label)}
                      className="inline-flex w-fit items-center gap-2 font-red-hat-display text-[16px] font-semibold leading-[1.3] text-[#475467] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <span>{link.label}</span>

                      {link.badge && (
                        <span className="inline-flex min-h-[20px] items-center justify-center rounded-full bg-[#ECFDF3] px-2 font-red-hat-display text-[11px] font-bold leading-none text-primary">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Desktop footer bottom */}
        <div className="mx-auto flex min-h-[66px] w-full max-w-[1280px] items-end justify-between gap-8 border-t border-[#EAECF0] px-8 pt-5">
          {/* LOGO + DIVIDER + SOCIALS */}
          <div className="flex items-center">
            <Link
              href={footer.logo.href}
              aria-label={footer.logo.ariaLabel}
              className="relative block h-11 w-[141px] shrink-0"
            >
              <Image
                src={footer.logo.src}
                alt={footer.logo.alt}
                fill
                sizes="141px"
                className="object-contain object-left"
              />
            </Link>

            {/* Vertical divider */}
            <div
              aria-hidden="true"
              className="
                mx-5
                h-[44px]
                w-px
                shrink-0

                bg-[#D0D5DD]
              "
            />

            {/* Social icons */}
            <div className="flex items-center gap-5">
              {footer.socials.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="
                    flex
                    h-8
                    w-8

                    items-center
                    justify-center

                    transition-opacity

                    hover:opacity-70

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                  "
                >
                  <Image
                    src={social.icon}
                    alt={social.iconAlt}
                    width={20}
                    height={20}
                    className="
                      h-5
                      w-5
                      object-contain
                    "
                  />
                </Link>
              ))}
            </div>
          </div>

          <p className="text-right font-red-hat-display text-[16px] leading-[1.5] text-[#667085]">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
