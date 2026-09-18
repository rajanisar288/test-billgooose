'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

/* =========================================================
   APP ROUTE LOADER
   A sleek progress bar + spinner that appears at the top of
   the viewport during Next.js page transitions.
========================================================= */

export default function AppRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(`${pathname}?${searchParams.toString()}`);

  /* =========================================================
     PROGRESS CONTROL
  ========================================================= */

  const completeProgress = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

    setProgress(100);
    setLoading(false);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  }, []);

  const startProgress = useCallback(() => {
    // Clear any existing timers
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

    setProgress(0);
    setLoading(true);
    setVisible(true);

    // Safety fallback: if Next.js does not finish route transition in 3.5s, auto-complete
    fallbackTimerRef.current = setTimeout(() => {
      completeProgress();
    }, 3500);

    // Animate progress from 0 → ~85% while waiting for route change
    let current = 0;

    progressTimerRef.current = setInterval(() => {
      current += Math.random() * 8 + 2;

      if (current >= 85) {
        current = 85;
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }

      setProgress(current);
    }, 200);
  }, [completeProgress]);

  /* =========================================================
     DETECT ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    const currentPath = `${pathname}?${searchParams.toString()}`;

    if (currentPath !== prevPathRef.current) {
      // Route changed — complete the progress bar
      prevPathRef.current = currentPath;
      completeProgress();
    }
  }, [completeProgress, pathname, searchParams]);

  /* =========================================================
     INTERCEPT LINK CLICKS / PROGRAMMATIC NAVIGATION
  ========================================================= */

  useEffect(() => {
    function handleAnchorClick(event: MouseEvent) {
      // Ignore prevented clicks or non-primary mouse clicks
      if (event.defaultPrevented || event.button !== 0) return;

      // Ignore modifier keys that open new tabs or windows
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element).closest('a');
      if (!anchor) return;

      // Ignore download links or links targeting other windows/tabs
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Ignore in-page hash links, protocols, and javascript pseudo-links
      if (
        rawHref.startsWith('#') ||
        rawHref.startsWith('javascript:') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('data:')
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Only intercept same-origin navigation
        if (targetUrl.origin !== currentUrl.origin) return;

        // Ignore same URL clicks (same pathname and search params, e.g. clicking logo on homepage)
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
          return;
        }
      } catch {
        return;
      }

      startProgress();
    }

    function handleHistoryEvent() {
      // Ensure progress bar completes on browser back/forward or pageshow
      completeProgress();
    }

    document.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('popstate', handleHistoryEvent);
    window.addEventListener('pageshow', handleHistoryEvent);

    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('popstate', handleHistoryEvent);
      window.removeEventListener('pageshow', handleHistoryEvent);
    };
  }, [completeProgress, startProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div
        aria-hidden="true"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ zIndex: 99999 }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          h-[3px]
          w-full
        "
      >
        <div
          style={{
            width: `${progress}%`,
            transition:
              progress === 100
                ? 'width 0.2s ease-out, opacity 0.3s ease-out 0.1s'
                : 'width 0.2s ease-out',
            opacity: progress === 100 ? 0 : 1,
          }}
          className="
            h-full
            rounded-r-full
            bg-[linear-gradient(90deg,#00897B_0%,#00BFA5_50%,#73BEB7_100%)]
            shadow-[0_0_8px_2px_rgba(0,137,123,0.5)]
          "
        />
      </div>

      {/* Floating Badge Spinner */}
      {loading && (
        <div
          aria-hidden="true"
          style={{ zIndex: 99998 }}
          className="
            pointer-events-none
            fixed
            right-4
            top-4

            flex
            items-center
            gap-2

            rounded-full

            border
            border-[rgba(0,137,123,0.15)]

            bg-white/95
            backdrop-blur-sm

            px-3
            py-2

            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          "
        >
          {/* Spinner ring */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="animate-spin"
          >
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="#E2E8F0"
              strokeWidth="2"
            />
            <path
              d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
              stroke="#00897B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span
            className="
              font-red-hat-display
              text-[12px]
              font-semibold
              leading-none
              text-[#344054]
            "
          >
            Loading…
          </span>
        </div>
      )}
    </>
  );
}
