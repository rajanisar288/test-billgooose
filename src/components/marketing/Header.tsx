'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronDown, Menu, UserRound, X } from 'lucide-react';

import data from '../../data/content.json';

export default function Header() {
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
    <header className="relative z-50 w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex min-h-[72px] items-center justify-between px-5 sm:px-8 lg:min-h-[103px] lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenus}
            className="relative block shrink-0"
            aria-label="Go to BillGoose homepage"
          >
            <Image
              src={header.logo.src}
              alt={header.logo.alt}
              width={266}
              height={82}
              priority
              className="h-auto w-[145px] object-contain sm:w-[180px] lg:h-[83px] lg:w-[266.7px]"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-3 lg:flex">
            <nav
              aria-label="Main navigation"
              className="flex items-center rounded-full border border-[#EAECF0] bg-[#F9FAFB] p-1 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
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
                        onClick={() => setIsCompareMenuOpen((previous) => !previous)}
                        className="flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-secondary transition-colors hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-expanded={isCompareMenuOpen}
                        aria-haspopup="menu"
                      >
                        {item.label}

                        <ChevronDown
                          size={15}
                          strokeWidth={2}
                          className={`transition-transform duration-200 ${
                            isCompareMenuOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isCompareMenuOpen && (
                        <div
                          role="menu"
                          className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
                        >
                          <Link
                            href={item.href}
                            role="menuitem"
                            onClick={closeMenus}
                            className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            View all comparisons
                          </Link>

                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              role="menuitem"
                              onClick={closeMenus}
                              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
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
                    className="flex h-10 items-center rounded-full px-4 text-sm font-medium text-secondary transition-colors hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop menu and account pill */}
            <div className="flex h-[50px] w-[87px] items-center gap-[6px] rounded-[100px] border border-[#EAECF0] bg-[#F9FAFB] py-3 pl-[14px] pr-[7px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((previousState) => !previousState)}
                className="flex h-6 w-6 shrink-0 items-center justify-center text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>

              <Link
                href={header.account.href}
                aria-label={header.account.label}
                onClick={closeMenus}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00796D] text-white transition-colors hover:bg- focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <UserRound
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Mobile menu and account pill */}
          <div className="flex h-[44px] w-[78px] items-center gap-[5px] rounded-[100px] border border-[#EAECF0] bg-[#F9FAFB] py-[9px] pl-3 pr-[6px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] min-[390px]:h-[50px] min-[390px]:w-[87px] min-[390px]:gap-[6px] min-[390px]:py-3 min-[390px]:pl-[14px] min-[390px]:pr-[7px] lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((previousState) => !previousState)}
              className="flex h-5 w-5 shrink-0 items-center justify-center text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[390px]:h-6 min-[390px]:w-6"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X
                  size={16}
                  strokeWidth={2}
                  className="min-[390px]:h-[18px] min-[390px]:w-[18px]"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  size={16}
                  strokeWidth={2}
                  className="min-[390px]:h-[18px] min-[390px]:w-[18px]"
                  aria-hidden="true"
                />
              )}
            </button>

            <Link
              href={header.account.href}
              aria-label={header.account.label}
              onClick={closeMenus}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00796D] text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[390px]:h-9 min-[390px]:w-9"
            >
              <UserRound
                size={15}
                strokeWidth={2}
                className="min-[390px]:h-[17px] min-[390px]:w-[17px]"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            isMobileMenuOpen ? 'max-h-[650px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav
            aria-label="Mobile navigation"
            className="space-y-2 px-5 py-5 sm:px-8"
          >
            {header.navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={closeMenus}
                        className="flex-1 rounded-l-xl px-4 py-3 text-left text-sm font-semibold text-secondary transition-colors hover:bg-slate-50 hover:text-primary"
                      >
                        {item.label}
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsCompareMenuOpen((previous) => !previous)}
                        className="flex items-center justify-center rounded-r-xl px-4 py-3 text-secondary transition-colors hover:bg-slate-50 hover:text-primary"
                        aria-label="Open Compare menu"
                        aria-expanded={isCompareMenuOpen}
                      >
                        <span className="flex size-[18px] items-center justify-center rounded-full bg-secondary text-white">
                          <ChevronDown
                            size={12}
                            strokeWidth={2.5}
                            className={`transition-transform duration-200 ${
                              isCompareMenuOpen ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </div>

                    <div
                      className={`grid transition-all duration-300 ${
                        isCompareMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-4 space-y-1 border-l-2 border-primary/20 py-2 pl-3">
                          <Link
                            href={item.href}
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            View all comparisons
                          </Link>

                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              onClick={closeMenus}
                              className="block rounded-lg px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
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
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-slate-50 hover:text-primary"
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href={header.account.href}
              onClick={closeMenus}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00796D]"
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
