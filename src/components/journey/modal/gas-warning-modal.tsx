'use client';

import { type MouseEvent, useEffect, useRef } from 'react';

import Image from 'next/image';

import { X } from 'lucide-react';

import data from '@/data/content.json';

type GasWarningModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGasConsumption: () => void;
  onElectricityOnly: () => void;
};

export default function GasWarningModal({
  isOpen,
  onClose,
  onUpdateGasConsumption,
  onElectricityOnly,
}: GasWarningModalProps) {
  const gasWarningModal = data.journey.gasWarningModal;

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousBodyOverflow;

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      className="
        fixed inset-0 z-[110]
        flex items-center justify-center
        overflow-y-auto
        bg-[#0000004D]
        px-4 py-6
        backdrop-blur-[2px]

        sm:px-6
      "
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gas-warning-heading"
        aria-describedby="gas-warning-description"
        className="
          relative w-full max-w-[448px]
          rounded-[16px]
          bg-white
          px-5 pb-5 pt-6
          shadow-[0px_20px_40px_rgba(16,24,40,0.18)]

          sm:px-6
          sm:pb-6
          sm:pt-7

          lg:px-6
          lg:pb-6
          lg:pt-8
        "
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close gas warning modal"
          onClick={onClose}
          className="
            absolute right-4 top-4
            flex h-8 w-8
            items-center justify-center
            rounded-full
            bg-[#F5F5F4]
            text-[#01232C]
            transition-colors

            hover:bg-[#EAECF0]

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#D5F2EE]

            sm:right-5
            sm:top-5
          "
        >
          <X
            aria-hidden="true"
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>

        {/* Warning icon */}
        <div className="flex justify-center">
          <Image
            src={gasWarningModal.warningIcon}
            alt={gasWarningModal.warningIconAlt}
            width={48}
            height={48}
            aria-hidden="true"
            className="
              h-12 w-12
              object-contain
            "
          />
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2
            id="gas-warning-heading"
            className="
              font-red-hat-display
              text-[18px] font-[645] font-extrabold
              leading-6 tracking-[0]
              text-[#101828]

              sm:text-[19px]
              sm:leading-[26px]

              lg:text-[20px]
              lg:leading-7
            "
          >
            {gasWarningModal.heading}
          </h2>

          <p
            id="gas-warning-description"
            className="
              mx-auto mt-2
              max-w-[400px]
              font-red-hat-display
              text-[13px] font-[467]
              leading-[18px] tracking-[0]
              text-[#475467]

              sm:text-[14px]
              sm:leading-5

              lg:text-[15px]
              lg:leading-5
            "
          >
            {gasWarningModal.description}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            mt-6 space-y-3

            sm:mt-7
          "
        >
          <button
            type="button"
            onClick={onUpdateGasConsumption}
            className="
              inline-flex h-12 w-full
              items-center justify-center
              gap-0.5 rounded-[100px]
              bg-[#00897B]
              px-5 py-3

              font-red-hat-display
              text-[14px] font-[645]
              leading-none tracking-[0]
              text-white

              shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
              transition-colors

              hover:bg-[#00796D]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#D5F2EE]

              sm:text-[15px]

              lg:h-[50px]
              lg:px-6
              lg:text-[16px]
            "
          >
            {gasWarningModal.updateButton}
          </button>

          <button
            type="button"
            onClick={onElectricityOnly}
            className="
              inline-flex h-12 w-full
              items-center justify-center
              gap-0.5 rounded-[100px]
              border border-[#D0D5DD]
              bg-white
              px-5 py-3

              font-red-hat-display
              text-[14px] font-[725] font-extrabold
              leading-6 tracking-[0]
              text-[#0C3354]

              transition-colors

              hover:bg-[#F9FAFB]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#EAECF0]

              sm:text-[15px]

              lg:h-[52px]
              lg:px-6
              lg:text-[16px]
              lg:leading-[26px]
            "
          >
            {gasWarningModal.electricityButton}
          </button>
        </div>
      </section>
    </div>
  );
}
