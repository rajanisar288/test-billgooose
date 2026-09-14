/* =========================================================
   ROOT LOADING SCREEN
   Next.js App Router streaming suspense fallback.
   Shown by the framework automatically during server-side
   route segment loading (RSC data fetching / streaming).
========================================================= */

export default function Loading() {
  return (
    <div
      aria-label="Loading page"
      role="status"
      className="
        flex
        min-h-screen
        w-full

        flex-col
        items-center
        justify-center
        gap-6

        bg-white
      "
    >
      {/* Brand Logo-mark */}
      <div
        aria-hidden="true"
        className="
          relative

          flex
          h-[56px]
          w-[56px]

          items-center
          justify-center

          rounded-[16px]

          bg-[linear-gradient(135deg,#00897B_0%,#00BFA5_100%)]

          shadow-[0_8px_24px_rgba(0,137,123,0.25)]
        "
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="14" cy="14" r="10" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" />
          <path
            d="M14 4A10 10 0 0 1 24 14"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-spin origin-center"
            style={{ animationDuration: '0.9s' }}
          />
        </svg>
      </div>

      {/* Progress Bar */}
      <div
        aria-hidden="true"
        className="
          h-[3px]
          w-[180px]

          overflow-hidden

          rounded-full

          bg-[#F2F4F7]
        "
      >
        <div
          className="
            h-full
            w-1/3

            animate-[loading-slide_1.2s_ease-in-out_infinite]

            rounded-full

            bg-[linear-gradient(90deg,#00897B_0%,#00BFA5_50%,#73BEB7_100%)]
          "
        />
      </div>

      <p
        className="
          font-red-hat-display
          text-[14px]
          font-medium
          leading-5
          text-[#98A2B3]
        "
      >
        Loading…
      </p>

      <style>{`
        @keyframes loading-slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(133%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
