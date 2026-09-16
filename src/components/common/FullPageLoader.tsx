'use client';

type FullPageLoaderProps = {
  message?: string;
};

export function InlineSpinner({ className = 'h-5 w-5 text-[#00897B]' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

export default function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00897B]/20 bg-[#EEFFFB]">
          <InlineSpinner className="h-6 w-6 text-[#00897B]" />
        </div>
        <p className="font-red-hat-display text-[14px] font-semibold text-[#0C3354]">{message}</p>
      </div>
    </div>
  );
}
