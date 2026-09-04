'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ChevronDown, LogOut, Menu, Settings, UserRound, X } from 'lucide-react';

import data from '@/data/content.json';

type SignedInUser = {
  email?: string;
  signedIn?: boolean;
};

/* =========================================================
    AUTH SNAPSHOT
  ========================================================= */

function getAuthSnapshot(): string {
  try {
    return sessionStorage.getItem('billgooseSignedInUser') ?? '';
  } catch {
    return '';
  }
}

function getAuthServerSnapshot(): string {
  return '';
}

function subscribeToAuth(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'billgooseSignedInUser') {
      callback();
    }
  };

  const handleAuthChanged = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);

  window.addEventListener('billgoose-auth-changed', handleAuthChanged);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-auth-changed', handleAuthChanged);
  };
}

/* =========================================================
    COMPARE FLOW SNAPSHOT
  ========================================================= */

function getCompareFlowSnapshot(): string {
  try {
    return JSON.stringify({
      service: sessionStorage.getItem('billgooseJourneyService') ?? '',
      flow: sessionStorage.getItem('billgooseJourneyFlow') ?? '',
      details: sessionStorage.getItem('compareFlowDetails') ?? '',
    });
  } catch {
    return '';
  }
}

function getCompareFlowServerSnapshot(): string {
  return '';
}

function subscribeToCompareFlow(callback: () => void) {
  const handleStorage = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('billgoose-compare-flow-changed', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('billgoose-compare-flow-changed', handleStorage);
  };
}

/* =========================================================
    URL SEARCH SNAPSHOT

    Avoids useSearchParams so the shared Header does not force
    /compare to require a Suspense boundary during static build.
  ========================================================= */

function getLocationSearchSnapshot(): string {
  try {
    return window.location.search;
  } catch {
    return '';
  }
}

function getLocationSearchServerSnapshot(): string {
  return '';
}

function subscribeToLocationSearch(callback: () => void) {
  const handleLocationChange = () => {
    callback();
  };

  window.addEventListener('popstate', handleLocationChange);
  window.addEventListener('billgoose-location-changed', handleLocationChange);

  return () => {
    window.removeEventListener('popstate', handleLocationChange);
    window.removeEventListener('billgoose-location-changed', handleLocationChange);
  };
}

/* =========================================================
    HEADER
  ========================================================= */

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { header } = data;

  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [isMobileCompareOpen, setIsMobileCompareOpen] = useState(false);

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const compareRef = useRef<HTMLDivElement>(null);

  const desktopAccountRef = useRef<HTMLDivElement>(null);

  const mobileAccountRef = useRef<HTMLDivElement>(null);

  const authSnapshot = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  const compareFlowSnapshot = useSyncExternalStore(
    subscribeToCompareFlow,
    getCompareFlowSnapshot,
    getCompareFlowServerSnapshot,
  );

  const locationSearch = useSyncExternalStore(
    subscribeToLocationSearch,
    getLocationSearchSnapshot,
    getLocationSearchServerSnapshot,
  );

  let signedInUser: SignedInUser | null = null;

  if (authSnapshot) {
    try {
      signedInUser = JSON.parse(authSnapshot) as SignedInUser;
    } catch {
      signedInUser = null;
    }
  }

  const isSignedIn = signedInUser?.signedIn === true;

  const userEmail = signedInUser?.email ?? '';

  /*
   * Only My Info uses the dark navbar.
   */
  const isMyInfoPage = pathname === '/my-info' || pathname.startsWith('/my-info/');

  /*
   * Compare-flow journey icon.
   *
   * URL params are preferred. Session storage is used as a
   * fallback so the icon still appears when the compare-flow
   * screen itself does not keep service/flow in the URL.
   */
  let storedCompareService = '';
  let storedCompareFlow = '';

  if (compareFlowSnapshot) {
    try {
      const snapshot = JSON.parse(compareFlowSnapshot) as {
        service?: string;
        flow?: string;
        details?: string;
      };

      storedCompareService = snapshot.service ?? '';
      storedCompareFlow = snapshot.flow ?? '';

      if (snapshot.details) {
        const details = JSON.parse(snapshot.details) as {
          service?: string;
          flow?: string;
        };

        storedCompareService = storedCompareService || details.service || '';
        storedCompareFlow = storedCompareFlow || details.flow || '';
      }
    } catch {
      // Ignore malformed session data.
    }
  }

  const locationParams = new URLSearchParams(locationSearch);

  const compareService = locationParams.get('service') || storedCompareService;
  const compareFlow = locationParams.get('flow') || storedCompareFlow;

  /*
   * Show the journey icon on the compare flow screen.
   *
   * Your compare screen can be reached with URL params or
   * with flow/service already stored in sessionStorage.
   */
  const shouldShowCompareJourneyIcon = pathname === '/compare' || pathname.startsWith('/compare/');

  let compareJourneyIcon: string | null = null;
  let compareJourneyIconAlt = '';

  if (shouldShowCompareJourneyIcon) {
    if (compareService === 'broadband') {
      compareJourneyIcon = '/images/compare-broadband.png';
      compareJourneyIconAlt = 'Broadband';
    } else if (compareService === 'insurance') {
      compareJourneyIcon = '/images/compare-insurance.png';
      compareJourneyIconAlt = 'Insurance';
    } else if (
      (compareService === 'energy' && compareFlow === 'bundle') ||
      compareFlow === 'bundle'
    ) {
      compareJourneyIcon = '/images/compare-bundlebills.png';
      compareJourneyIconAlt = 'Bundle Bills';
    } else if (compareService === 'energy') {
      compareJourneyIcon = '/images/compare-energy.png';
      compareJourneyIconAlt = 'Energy';
    }
  }

  /* =========================================================
      CLOSE MENUS
    ========================================================= */

  function closeMenus() {
    setIsMobileNavigationOpen(false);
    setIsCompareOpen(false);
    setIsMobileCompareOpen(false);
    setIsAccountOpen(false);
  }

  /* =========================================================
      SIGN IN
    ========================================================= */

  function handleSignInClick() {
    try {
      const currentPath = `${window.location.pathname}${window.location.search}`;

      if (window.location.pathname !== '/sign-in') {
        sessionStorage.setItem('billgooseSignInReturnTo', currentPath);
      }
    } catch {
      // Ignore storage failure.
    }

    closeMenus();
  }

  /* =========================================================
      ACCOUNT
    ========================================================= */

  function toggleAccountMenu() {
    setIsAccountOpen((current) => !current);

    setIsCompareOpen(false);
    setIsMobileNavigationOpen(false);
  }

  /* =========================================================
      LOGOUT
    ========================================================= */

  function handleLogout() {
    try {
      sessionStorage.removeItem('billgooseSignedInUser');
    } catch {
      // Ignore storage failure.
    }

    window.dispatchEvent(new Event('billgoose-auth-changed'));

    closeMenus();

    router.push('/');
  }

  /* =========================================================
      OUTSIDE CLICK
    ========================================================= */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (compareRef.current && !compareRef.current.contains(target)) {
        setIsCompareOpen(false);
      }

      const clickedDesktopAccount = desktopAccountRef.current?.contains(target);

      const clickedMobileAccount = mobileAccountRef.current?.contains(target);

      if (!clickedDesktopAccount && !clickedMobileAccount) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  /* =========================================================
      MOBILE BODY SCROLL
    ========================================================= */

  useEffect(() => {
    if (!isMobileNavigationOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavigationOpen]);

  return (
    <header
      className={`
          relative
          z-50
          w-full

          ${isMyInfoPage ? 'bg-[#0B2B43]' : 'bg-white'}
        `}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          className="
              flex
              min-h-[72px]

              items-center
              justify-between

              px-5

              sm:px-8

              lg:min-h-[103px]
              lg:px-10
            "
        >
          {/* =================================================
                LOGO
            ================================================== */}
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              onClick={closeMenus}
              aria-label="Go to BillGoose homepage"
              className="
                inline-flex
                shrink-0
              "
            >
              <Image
                src={isMyInfoPage ? '/images/logo-white.png' : header.logo.src}
                alt={header.logo.alt}
                width={266}
                height={82}
                priority
                className="
                  h-auto
                  w-[145px]

                  object-contain

                  sm:w-[180px]

                  lg:w-[266px]
                "
              />
            </Link>

            {compareJourneyIcon && (
              <>
                <span
                  aria-hidden="true"
                  className="
                    mx-3
                    h-[34px]
                    w-px
                    shrink-0
                    bg-[#D0D5DD]

                    sm:mx-4
                    sm:h-[38px]

                    lg:mx-5
                    lg:h-[50px]
                  "
                />

                <div
                  className="
                    flex
                    h-[40px]
                    w-[40px]
                    shrink-0
                    items-center
                    justify-center

                    sm:h-[44px]
                    sm:w-[44px]

                    lg:h-[50px]
                    lg:w-[50px]
                  "
                >
                  <Image
                    src={compareJourneyIcon}
                    alt={compareJourneyIconAlt}
                    width={50}
                    height={50}
                    priority
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />
                </div>
              </>
            )}
          </div>

          {/* =================================================
                DESKTOP
            ================================================== */}
          <div
            className="
                hidden
                items-center
                gap-3

                lg:flex
              "
          >
            {/* ===============================================
                  MAIN NAVIGATION
              ================================================ */}
            <nav
              aria-label="Main navigation"
              className={`
                  flex
                  items-center

                  rounded-full

                  border

                  p-1

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                  ${
                    isMyInfoPage
                      ? `
                        border-white/10
                        bg-white/10
                      `
                      : `
                        border-[#EAECF0]
                        bg-[#F9FAFB]
                      `
                  }
                `}
            >
              {header.navigation.map((item) => {
                const navigationText = isMyInfoPage ? 'text-white' : 'text-[#355E87]';

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.id}
                      ref={compareRef}
                      className="relative"
                    >
                      <button
                        type="button"
                        aria-expanded={isCompareOpen}
                        aria-haspopup="menu"
                        onClick={() => {
                          setIsCompareOpen((current) => !current);

                          setIsAccountOpen(false);
                        }}
                        className={`
                              flex
                              h-10

                              items-center
                              gap-1

                              rounded-full

                              px-4

                              font-inter
                              text-[14px]
                              font-medium

                              transition-colors

                              ${navigationText}

                              ${
                                isMyInfoPage
                                  ? 'hover:bg-white/10'
                                  : 'hover:bg-white hover:text-[#00897B]'
                              }
                            `}
                      >
                        <span>{item.label}</span>

                        <ChevronDown
                          aria-hidden="true"
                          className={`
                                h-4
                                w-4

                                transition-transform
                                duration-200

                                ${isCompareOpen ? 'rotate-180' : ''}
                              `}
                          strokeWidth={2}
                        />
                      </button>

                      {isCompareOpen && (
                        <div
                          role="menu"
                          className="
                                absolute
                                right-0
                                top-[calc(100%+10px)]
                                z-[100]

                                w-[220px]

                                overflow-hidden

                                rounded-[12px]

                                border
                                border-[#EAECF0]

                                bg-white

                                p-2

                                shadow-[0px_12px_30px_rgba(16,24,40,0.16)]
                              "
                        >
                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              role="menuitem"
                              onClick={closeMenus}
                              className="
                                      block

                                      rounded-[8px]

                                      px-3
                                      py-2.5

                                      font-inter
                                      text-[13px]
                                      font-medium

                                      text-[#344054]

                                      transition-colors

                                      hover:bg-[#F9FAFB]
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
                    className={`
                          flex
                          h-10

                          items-center

                          rounded-full

                          px-4

                          font-inter
                          text-[14px]
                          font-medium

                          transition-colors

                          ${navigationText}

                          ${
                            isMyInfoPage
                              ? 'hover:bg-white/10'
                              : 'hover:bg-white hover:text-[#00897B]'
                          }
                        `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ===============================================
                  LOGGED IN
              ================================================ */}
            {isSignedIn ? (
              <div
                ref={desktopAccountRef}
                className="relative"
              >
                {/* Control shown in your screenshot */}
                <div
                  className={`
                      flex
                      h-[50px]

                      items-center
                      gap-[7px]

                      rounded-full

                      border

                      py-[6px]
                      pl-[13px]
                      pr-[6px]

                      shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                      ${
                        isMyInfoPage
                          ? `
                            border-white/30
                            bg-transparent
                          `
                          : `
                            border-[#D0D5DD]
                            bg-white
                          `
                      }
                    `}
                >
                  {/* Three lines */}
                  <button
                    type="button"
                    onClick={toggleAccountMenu}
                    aria-label="Open account menu"
                    aria-expanded={isAccountOpen}
                    className={`
                        flex
                        h-[27px]
                        w-[27px]

                        items-center
                        justify-center

                        transition-colors

                        ${
                          isMyInfoPage
                            ? 'text-white hover:text-[#8CCAC3]'
                            : 'text-[#0D3B66] hover:text-[#00897B]'
                        }
                      `}
                  >
                    <Menu
                      aria-hidden="true"
                      className="
                          h-[24px]
                          w-[24px]
                        "
                      strokeWidth={2}
                    />
                  </button>

                  {/* User */}
                  <button
                    type="button"
                    onClick={toggleAccountMenu}
                    aria-label="Open account menu"
                    aria-expanded={isAccountOpen}
                    className="
                        flex
                        h-9
                        w-9

                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        bg-[#00897B]

                        text-white

                        transition-colors

                        hover:bg-[#00796D]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#8CCAC3]
                      "
                  >
                    <UserRound
                      aria-hidden="true"
                      className="
                          h-[19px]
                          w-[19px]
                        "
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {isAccountOpen && (
                  <AccountMenu
                    email={userEmail}
                    onClose={closeMenus}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            ) : (
              /* =============================================
                    LOGGED OUT
                ============================================== */
              <Link
                href="/sign-in"
                aria-label="Sign In"
                onClick={handleSignInClick}
                className="
                    inline-flex
                    h-[50px]

                    items-center
                    gap-2.5

                    rounded-full

                    border
                    border-[#EAECF0]

                    bg-[#F9FAFB]

                    py-[6px]
                    pl-5
                    pr-[6px]

                    font-red-hat-display
                    text-[15px]
                    font-bold
                    leading-6

                    text-[#355E87]

                    shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                    transition-colors

                    hover:bg-white
                    hover:text-[#00897B]
                  "
              >
                <span>Sign In</span>

                <span
                  className="
                      flex
                      h-9
                      w-9

                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#00897B]

                      text-white
                    "
                >
                  <UserRound
                    aria-hidden="true"
                    className="
                        h-[18px]
                        w-[18px]
                      "
                    strokeWidth={2}
                  />
                </span>
              </Link>
            )}
          </div>

          {/* =================================================
                MOBILE + TABLET
            ================================================== */}
          <div
            ref={mobileAccountRef}
            className="
                relative

                lg:hidden
              "
          >
            <div
              className={`
                  flex
                  h-[44px]

                  items-center
                  gap-[5px]

                  rounded-full

                  border

                  py-[6px]
                  pl-[11px]
                  pr-[5px]

                  shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                  min-[390px]:h-[50px]
                  min-[390px]:gap-[7px]
                  min-[390px]:pl-[13px]
                  min-[390px]:pr-[6px]

                  ${
                    isMyInfoPage
                      ? `
                        border-white/30
                        bg-transparent
                      `
                      : `
                        border-[#EAECF0]
                        bg-[#F9FAFB]
                      `
                  }
                `}
            >
              {/* Menu button */}
              <button
                type="button"
                onClick={() => {
                  if (isSignedIn) {
                    toggleAccountMenu();
                    return;
                  }

                  setIsMobileNavigationOpen((current) => !current);
                }}
                aria-label={isSignedIn ? 'Open account menu' : 'Open navigation menu'}
                aria-expanded={isSignedIn ? isAccountOpen : isMobileNavigationOpen}
                className={`
                    flex
                    h-6
                    w-6

                    items-center
                    justify-center

                    ${isMyInfoPage ? 'text-white' : 'text-[#0D3B66]'}
                  `}
              >
                {!isSignedIn && isMobileNavigationOpen ? (
                  <X
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                ) : (
                  <Menu
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                )}
              </button>

              {/* User button */}
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={toggleAccountMenu}
                  aria-label="Open account menu"
                  className="
                      flex
                      h-8
                      w-8

                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#00897B]

                      text-white

                      min-[390px]:h-9
                      min-[390px]:w-9
                    "
                >
                  <UserRound
                    aria-hidden="true"
                    className="
                        h-4
                        w-4

                        min-[390px]:h-[17px]
                        min-[390px]:w-[17px]
                      "
                    strokeWidth={2}
                  />
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={handleSignInClick}
                  aria-label="Sign in"
                  className="
                      flex
                      h-8
                      w-8

                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#00897B]

                      text-white

                      min-[390px]:h-9
                      min-[390px]:w-9
                    "
                >
                  <UserRound
                    aria-hidden="true"
                    className="
                        h-4
                        w-4

                        min-[390px]:h-[17px]
                        min-[390px]:w-[17px]
                      "
                    strokeWidth={2}
                  />
                </Link>
              )}
            </div>

            {isSignedIn && isAccountOpen && (
              <AccountMenu
                email={userEmail}
                onClose={closeMenus}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>

        {/* =================================================
              MOBILE NAVIGATION — SIGNED OUT
          ================================================== */}
        {!isSignedIn && (
          <div
            className={`
                overflow-hidden

                transition-all
                duration-300

                lg:hidden

                ${isMobileNavigationOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
              `}
          >
            <nav
              aria-label="Mobile navigation"
              className="
                  space-y-1

                  px-5
                  pb-5

                  sm:px-8
                "
            >
              {header.navigation.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.id}
                      className="
                        overflow-hidden
                        rounded-[10px]
                      "
                    >
                      <button
                        type="button"
                        aria-expanded={isMobileCompareOpen}
                        aria-controls="mobile-compare-menu"
                        onClick={() => {
                          setIsMobileCompareOpen((current) => !current);
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between

                          rounded-[10px]

                          px-4
                          py-3

                          font-inter
                          text-[14px]
                          font-medium

                          transition-colors

                          ${
                            isMyInfoPage
                              ? 'text-white hover:bg-white/10'
                              : 'text-[#344054] hover:bg-[#F9FAFB]'
                          }
                        `}
                      >
                        <span>{item.label}</span>

                        <ChevronDown
                          aria-hidden="true"
                          className={`
                            h-4
                            w-4
                            shrink-0

                            transition-transform
                            duration-200

                            ${isMobileCompareOpen ? 'rotate-180' : ''}
                          `}
                          strokeWidth={2}
                        />
                      </button>

                      <div
                        id="mobile-compare-menu"
                        className={`
                          overflow-hidden

                          transition-all
                          duration-300

                          ${isMobileCompareOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                      >
                        <div
                          className="
                            mx-2
                            mb-2

                            space-y-1

                            rounded-[12px]

                            border
                            border-[#EAECF0]

                            bg-white

                            p-2
                          "
                        >
                          {header.compareMenu.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              onClick={closeMenus}
                              className="
                                flex
                                min-h-[44px]
                                w-full
                                items-center
                                gap-3

                                rounded-[9px]

                                px-3
                                py-2

                                font-inter
                                text-[13px]
                                font-medium

                                text-[#344054]

                                transition-colors

                                hover:bg-[#F9FAFB]
                                hover:text-[#00897B]
                              "
                            >
                              <Image
                                src={menuItem.icon}
                                alt={menuItem.iconAlt}
                                width={24}
                                height={24}
                                className="
                                  h-6
                                  w-6
                                  shrink-0
                                  object-contain
                                "
                              />

                              <span>{menuItem.label}</span>
                            </Link>
                          ))}
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
                    className={`
                      block

                      rounded-[10px]

                      px-4
                      py-3

                      font-inter
                      text-[14px]
                      font-medium

                      ${
                        isMyInfoPage
                          ? 'text-white hover:bg-white/10'
                          : 'text-[#344054] hover:bg-[#F9FAFB]'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================================
    ACCOUNT MENU
  ========================================================= */

type AccountMenuProps = {
  email: string;
  onClose: () => void;
  onLogout: () => void;
};

function AccountMenu({ email, onClose, onLogout }: AccountMenuProps) {
  return (
    <div
      className="
          absolute
          right-0
          top-[calc(100%+8px)]
          z-[100]

          w-[235px]

          overflow-hidden

          rounded-[10px]

          border
          border-[#EAECF0]

          bg-white

          shadow-[0px_12px_30px_rgba(16,24,40,0.16)]

          min-[390px]:w-[250px]
        "
    >
      {/* =====================================================
            USER
        ====================================================== */}
      <div
        className="
            flex
            items-center
            gap-3

            border-b
            border-[#EAECF0]

            px-3
            py-3
          "
      >
        <div
          className="
              flex
              h-10
              w-10

              shrink-0
              items-center
              justify-center

              rounded-full

              bg-[#00897B]

              text-white
            "
        >
          <UserRound
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <p
            className="
                font-red-hat-display
                text-[14px]
                font-bold
                leading-5

                text-[#101828]
              "
          >
            SIGNED IN
          </p>

          <p
            className="
                truncate

                font-inter
                text-[11px]
                font-normal
                leading-4

                text-[#667085]
              "
          >
            {email || 'Signed in'}
          </p>
        </div>
      </div>

      {/* =====================================================
            MY DEALS
        ====================================================== */}
      <Link
        href="/my-info"
        onClick={onClose}
        className="
            flex
            min-h-[44px]

            items-center
            gap-2.5

            border-b
            border-[#EAECF0]

            px-4

            font-inter
            text-[13px]
            font-medium

            text-[#101828]

            transition-colors

            hover:bg-[#F9FAFB]
          "
      >
        <UserRound
          aria-hidden="true"
          className="
              h-4
              w-4
            "
          strokeWidth={1.8}
        />

        <span>My Deals</span>
      </Link>

      {/* =====================================================
            SETTINGS
        ====================================================== */}
      <Link
        href="/my-info"
        onClick={onClose}
        className="
            flex
            min-h-[44px]

            items-center
            gap-2.5

            border-b
            border-[#EAECF0]

            px-4

            font-inter
            text-[13px]
            font-medium

            text-[#101828]

            transition-colors

            hover:bg-[#F9FAFB]
          "
      >
        <Settings
          aria-hidden="true"
          className="
              h-4
              w-4
            "
          strokeWidth={1.8}
        />

        <span>Settings</span>
      </Link>

      {/* =====================================================
            LOGOUT
        ====================================================== */}
      <button
        type="button"
        onClick={onLogout}
        className="
            flex
            min-h-[44px]
            w-full

            items-center
            gap-2.5

            px-4

            font-inter
            text-[13px]
            font-medium

            text-[#F04438]

            transition-colors

            hover:bg-[#FEF3F2]
          "
      >
        <LogOut
          aria-hidden="true"
          className="
              h-4
              w-4
            "
          strokeWidth={1.8}
        />

        <span>Log out</span>
      </button>
    </div>
  );
}
