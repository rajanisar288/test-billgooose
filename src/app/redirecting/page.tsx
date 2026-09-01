'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* =========================================================
   STORAGE
========================================================= */

function getProviderSnapshot() {
  try {
    return sessionStorage.getItem('broadbandRedirectProvider') ?? '';
  } catch {
    return '';
  }
}

function getProviderServerSnapshot() {
  return '';
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'broadbandRedirectProvider') {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function RedirectingPage() {
  const router = useRouter();

  const provider = useSyncExternalStore(subscribe, getProviderSnapshot, getProviderServerSnapshot);

  const [hasOpenedProvider, setHasOpenedProvider] = useState(false);

  useEffect(() => {
    let providerUrl = '';

    try {
      providerUrl = sessionStorage.getItem('broadbandRedirectUrl') ?? '';
    } catch {
      providerUrl = '';
    }

    /* =====================================================
       NO REDIRECT URL
    ====================================================== */

    if (!providerUrl) {
      const fallbackTimer = window.setTimeout(() => {
        router.replace('/result?service=broadband');
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

      setHasOpenedProvider(true);
    }, 1500);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [router]);

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
            LOADER
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
            {/* Replace this with your uploaded icon */}
            <span
              className="
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

            max-w-[340px]

            font-inter

            text-[14px]
            font-normal
            leading-[21px]

            text-[#667085]
          "
        >
          {hasOpenedProvider
            ? 'Continue on the provider website in the newly opened tab to complete your broadband order.'
            : 'We’re preparing the provider website for you. It will open in a new tab.'}
        </p>

        {!hasOpenedProvider && (
          <p
            className="
              mt-6

              font-inter

              text-[12px]
              font-medium

              text-[#98A2B3]
            "
          >
            Please don&apos;t close this page.
          </p>
        )}

        {/* =====================================================
            BACK TO RESULTS
        ====================================================== */}
        {hasOpenedProvider && (
          <button
            type="button"
            onClick={() => {
              router.push('/result?service=broadband');
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

              font-inter

              text-[13px]
              font-semibold

              text-[#344054]

              transition-colors

              hover:bg-[#F9FAFB]
            "
          >
            Back to broadband deals
          </button>
        )}
      </section>
    </main>
  );
}
