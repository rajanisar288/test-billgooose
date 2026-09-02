'use client';

import { useEffect, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

/* =========================================================
   TYPES
========================================================= */

type RedirectService = 'broadband' | 'sim-only';

type RedirectOrigin = 'sim-only' | 'mobile-details';

/* =========================================================
   CURRENT SERVICE
========================================================= */

function resolveRedirectService(value: string | null): RedirectService {
  return value === 'sim-only' ? 'sim-only' : 'broadband';
}

/* =========================================================
   PROVIDER STORAGE
========================================================= */

function getProviderForService(service: RedirectService): string {
  try {
    if (service === 'sim-only') {
      return (
        sessionStorage.getItem('externalRedirectProvider') ??
        sessionStorage.getItem('simOnlyRedirectProvider') ??
        ''
      );
    }

    return sessionStorage.getItem('broadbandRedirectProvider') ?? '';
  } catch {
    return '';
  }
}

function getUrlForService(service: RedirectService): string {
  try {
    if (service === 'sim-only') {
      return (
        sessionStorage.getItem('externalRedirectUrl') ??
        sessionStorage.getItem('simOnlyRedirectUrl') ??
        ''
      );
    }

    return sessionStorage.getItem('broadbandRedirectUrl') ?? '';
  } catch {
    return '';
  }
}

/* =========================================================
   REDIRECT ORIGIN

   Only relevant for SIM-only.

   Normal SIM page:
   externalRedirectOrigin = sim-only

   SIM deal clicked from mobile detail:
   externalRedirectOrigin = mobile-details
========================================================= */

function getRedirectOrigin(service: RedirectService): RedirectOrigin {
  if (service !== 'sim-only') {
    return 'sim-only';
  }

  try {
    const value = sessionStorage.getItem('externalRedirectOrigin');

    return value === 'mobile-details' ? 'mobile-details' : 'sim-only';
  } catch {
    return 'sim-only';
  }
}

/* =========================================================
   OPENED STATE STORAGE
========================================================= */

function getOpenedStorageKey(service: RedirectService) {
  return service === 'sim-only' ? 'simOnlyRedirectOpened' : 'broadbandRedirectOpened';
}

/* =========================================================
   REACTIVE STORAGE SNAPSHOT
========================================================= */

function createProviderSnapshot(service: RedirectService) {
  return () => {
    return getProviderForService(service);
  };
}

function createOpenedSnapshot(service: RedirectService) {
  return () => {
    try {
      return sessionStorage.getItem(getOpenedStorageKey(service)) === 'true';
    } catch {
      return false;
    }
  };
}

function createOriginSnapshot(service: RedirectService) {
  return () => {
    return getRedirectOrigin(service);
  };
}

function getProviderServerSnapshot() {
  return '';
}

function getOpenedServerSnapshot() {
  return false;
}

function getOriginServerSnapshot(): RedirectOrigin {
  return 'sim-only';
}

/* =========================================================
   SUBSCRIPTION
========================================================= */

function subscribe(callback: () => void) {
  function handleStorage() {
    callback();
  }

  function handleRedirectUpdated() {
    callback();
  }

  window.addEventListener('storage', handleStorage);

  window.addEventListener('billgoose-redirect-updated', handleRedirectUpdated);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-redirect-updated', handleRedirectUpdated);
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function RedirectingPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const service = resolveRedirectService(searchParams.get('service'));

  const provider = useSyncExternalStore(
    subscribe,
    createProviderSnapshot(service),
    getProviderServerSnapshot,
  );

  const hasOpenedProvider = useSyncExternalStore(
    subscribe,
    createOpenedSnapshot(service),
    getOpenedServerSnapshot,
  );

  const redirectOrigin = useSyncExternalStore(
    subscribe,
    createOriginSnapshot(service),
    getOriginServerSnapshot,
  );

  /* =========================================================
     MOBILE DETAILS REDIRECT?
  ========================================================= */

  const isMobileDetailsRedirect = service === 'sim-only' && redirectOrigin === 'mobile-details';

  /* =========================================================
     REDIRECT
  ========================================================= */

  useEffect(() => {
    const providerUrl = getUrlForService(service);

    const openedStorageKey = getOpenedStorageKey(service);

    /*
     * Reset opened state every
     * time redirect page loads.
     */
    try {
      sessionStorage.setItem(openedStorageKey, 'false');

      window.dispatchEvent(new Event('billgoose-redirect-updated'));
    } catch {
      // Ignore storage failure.
    }

    /* =====================================================
       NO URL
    ====================================================== */

    if (!providerUrl) {
      const fallbackTimer = window.setTimeout(() => {
        /*
         * Mobile-details SIM redirect
         * returns to MOBILE deals.
         *
         * Normal SIM-only stays exactly
         * as before.
         *
         * Broadband stays exactly
         * as before.
         */
        if (service === 'sim-only' && getRedirectOrigin(service) === 'mobile-details') {
          router.replace('/result?service=mobile');

          return;
        }

        router.replace(
          service === 'sim-only' ? '/result?service=sim-only' : '/result?service=broadband',
        );
      }, 1200);

      return () => {
        window.clearTimeout(fallbackTimer);
      };
    }

    /* =====================================================
       OPEN PROVIDER IN NEW TAB
    ====================================================== */

    const redirectTimer = window.setTimeout(() => {
      window.open(providerUrl, '_blank', 'noopener,noreferrer');

      try {
        sessionStorage.setItem(openedStorageKey, 'true');

        window.dispatchEvent(new Event('billgoose-redirect-updated'));
      } catch {
        // Ignore storage failure.
      }
    }, 1500);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [router, service]);

  /* =========================================================
     CONTENT
  ========================================================= */

  const serviceName = service === 'sim-only' ? 'SIM-only' : 'broadband';

  /* =========================================================
     BACK BUTTON

     BROADBAND:
     Back to broadband deals

     NORMAL SIM:
     Back to SIM-only deals

     MOBILE DETAILS SIM:
     Back to mobile deals
  ========================================================= */

  let backButtonLabel = 'Back to broadband deals';

  let resultRoute = '/result?service=broadband';

  if (service === 'sim-only') {
    if (isMobileDetailsRedirect) {
      backButtonLabel = 'Back to mobile deals';

      resultRoute = '/result?service=mobile';
    } else {
      backButtonLabel = 'Back to SIM-only deals';

      resultRoute = '/result?service=sim-only';
    }
  }

  return (
    <main
      className="
        flex
        min-h-screen
        w-full

        items-center
        justify-center

        bg-[#F9FAFB]

        px-5
      "
    >
      <section
        className="
          flex
          w-full
          max-w-[460px]

          flex-col
          items-center

          rounded-[24px]

          border
          border-[#EAECF0]

          bg-white

          px-6
          py-12

          text-center

          shadow-[0px_12px_32px_rgba(16,24,40,0.08)]

          sm:px-10
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <Image
          src="/images/updated-logo.png"
          alt="BillGoose"
          width={160}
          height={50}
          priority
          className="
            h-auto
            w-[150px]

            object-contain
          "
        />

        {/* =====================================================
            LOADER / COMPLETE ICON
        ====================================================== */}

        {!hasOpenedProvider ? (
          <div
            className="
              mt-9

              flex
              h-[52px]
              w-[52px]

              items-center
              justify-center
            "
          >
            <span
              className="
                block
                h-[42px]
                w-[42px]

                animate-spin

                rounded-full

                border-[4px]
                border-[#E7F6F5]
                border-t-[#00897B]
              "
            />
          </div>
        ) : (
          <div
            className="
              mt-9

              flex
              h-[52px]
              w-[52px]

              items-center
              justify-center

              rounded-full

              bg-[#ECFDF3]
            "
          >
            <span
              className="
                font-red-hat-display

                text-[22px]
                font-bold

                text-[#00897B]
              "
            >
              ✓
            </span>
          </div>
        )}

        {/* =====================================================
            HEADING
        ====================================================== */}

        <h1
          className="
            mt-6

            font-red-hat-display

            text-[24px]
            font-extrabold
            leading-[30px]

            text-[#0C3354]
          "
        >
          {hasOpenedProvider
            ? `${provider || 'Provider'} opened in a new tab`
            : `Redirecting you to ${provider || 'your provider'}`}
        </h1>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}

        <p
          className="
            mt-2

            max-w-[350px]

            font-inter

            text-[14px]
            font-normal
            leading-[21px]

            text-[#667085]
          "
        >
          {hasOpenedProvider
            ? `Continue on the ${provider || 'provider'} website in the newly opened tab to complete your ${serviceName} order.`
            : `We’re preparing the ${provider || 'provider'} website for you. It will open in a new tab.`}
        </p>

        {/* =====================================================
            WAITING TEXT
        ====================================================== */}

        {!hasOpenedProvider && (
          <p
            className="
              mt-6

              font-inter

              text-[12px]
              font-medium
              leading-[18px]

              text-[#98A2B3]
            "
          >
            Please don&apos;t close this page.
          </p>
        )}

        {/* =====================================================
            BACK TO CORRECT RESULTS
        ====================================================== */}

        {hasOpenedProvider && (
          <button
            type="button"
            onClick={() => {
              /*
               * Clear origin after it
               * has served its purpose.
               *
               * This prevents a future
               * normal SIM redirect from
               * accidentally inheriting
               * mobile-details.
               */
              if (service === 'sim-only') {
                try {
                  sessionStorage.removeItem('externalRedirectOrigin');
                } catch {
                  // Ignore storage failure.
                }
              }

              router.push(resultRoute);
            }}
            className="
              mt-7

              inline-flex
              h-[44px]

              items-center
              justify-center

              rounded-full

              border
              border-[#D0D5DD]

              bg-white

              px-6

              font-red-hat-display

              text-[13px]
              font-bold
              leading-5

              text-[#344054]

              transition-colors

              hover:bg-[#F9FAFB]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#F2F4F7]
            "
          >
            {backButtonLabel}
          </button>
        )}
      </section>
    </main>
  );
}
