'use client';

import { type MouseEvent, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Check, X } from 'lucide-react';

import data from '../../../data/content.json';

type ServicesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (service: string) => void;
};

export default function ServicesModal({ isOpen, onClose, onSelect }: ServicesModalProps) {
  const servicesModal = data.journey.servicesModal;

  const [selectedService, setSelectedService] = useState(servicesModal.defaultValue);

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

  function handleSelect() {
    if (!selectedService) {
      return;
    }

    onSelect(selectedService);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      className="
        fixed inset-0 z-[100]
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
        aria-labelledby="services-modal-heading"
        aria-describedby="services-modal-description"
        className="
          w-full max-w-[448px]
          rounded-[14px]
          bg-white
          p-4
          shadow-[0px_20px_40px_rgba(16,24,40,0.18)]

          sm:rounded-[16px]
          sm:p-5

          lg:p-6
        "
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2
              id="services-modal-heading"
              className="
                font-inter
                text-[17px] font-bold font-[600]
                leading-6 tracking-[0]
                text-[#0C3354]

                sm:text-[18px]
                sm:leading-[26px]

                lg:text-[20px]

              "
            >
              {servicesModal.heading}
            </h2>

            <p
              id="services-modal-description"
              className="
                mt-1.5 max-w-[340px]
                font-inter
                text-[11px] font-normal
                leading-4 tracking-[0]
                text-[#535862]

                sm:text-[12px]
                sm:leading-[18px]

                lg:mt-2
                lg:text-[15px]
                lg:leading-5
              "
            >
              {servicesModal.description}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close services modal"
            onClick={onClose}
            className="
              flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full
              bg-[#F2F4F7]
              text-[#667085]
              transition-colors duration-150

              hover:bg-[#EAECF0]
              hover:text-[#344054]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#D5F2EE]

              lg:h-8
              lg:w-8
            "
          >
            <X
              aria-hidden="true"
              className="
                h-3.5 w-3.5

                lg:h-4
                lg:w-4
              "
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Service options */}
        <div
          role="radiogroup"
          aria-label={servicesModal.heading}
          className="
            mt-4 space-y-2.5

            sm:mt-5
            sm:space-y-3
          "
        >
          {servicesModal.options.map((option) => {
            const isSelected = selectedService === option.value;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setSelectedService(option.value);
                }}
                className={`
                  flex min-h-[60px] w-full
                  items-center justify-between
                  gap-3 rounded-[14px]
                  bg-white p-3
                  text-left
                  transition-colors duration-150

                  sm:min-h-[66px]
                  sm:gap-4
                  sm:rounded-[16px]
                  sm:p-[14px]

                  lg:h-[72px]
                  lg:min-h-[72px]
                  lg:p-4

                  ${isSelected ? 'border border-[#00897B]' : 'border border-[#D0D5DD]'}
                `}
              >
                <span
                  className="
                    flex min-w-0
                    items-center gap-3

                    lg:gap-4
                  "
                >
                  <span
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      overflow-hidden
                      rounded-lg
                      bg-[#F2F4F7]

                      sm:h-10
                      sm:w-10
                    "
                  >
                    <Image
                      src={option.icon}
                      alt={option.iconAlt}
                      width={40}
                      height={40}
                      className="
                        h-full w-full
                        object-contain
                      "
                    />
                  </span>

                  <span
                    className="
                      min-w-0
                      font-red-hat-display
                      text-[13px] font-[550]
                      leading-none tracking-[0]
                      text-[#0D3B66]

                      sm:text-[14px]

                      lg:text-[16px]
                    "
                  >
                    {option.label}
                  </span>
                </span>

                <SelectionCircle selected={isSelected} />
              </button>
            );
          })}
        </div>

        {/* Modal actions */}
        <div
          className="
            mt-5 flex items-center
            justify-end gap-2.5

            sm:mt-6
            sm:gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex h-9 min-w-[78px]
              items-center justify-center
              rounded-[100px]
              border border-[#E0DFE5]
              bg-white
              px-[18px] py-1.5

              font-inter text-[13px]
              font-semibold leading-5
              tracking-[0]
              text-[#01232C]

              shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
              transition-colors duration-150

              hover:bg-[#F9FAFB]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#EAECF0]

              sm:h-10
              sm:min-w-[91px]
              sm:px-[22px]
              sm:text-[14px]

              lg:text-[16px]
              lg:leading-[26px]
            "
          >
            {servicesModal.closeButton}
          </button>

          <button
            type="button"
            onClick={handleSelect}
            disabled={!selectedService}
            className="
              inline-flex h-9 min-w-[68px]
              items-center justify-center
              gap-2 rounded-[100px]
              bg-[#00897B]
              px-[14px] py-2

              font-inter text-[13px]
              font-semibold leading-5
              tracking-[0]
              text-white

              shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
              transition-colors duration-150

              hover:bg-[#00796D]

              disabled:cursor-not-allowed
              disabled:opacity-50

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#D5F2EE]

              sm:h-10
              sm:min-w-[75px]
              sm:px-4
              sm:py-2.5

              lg:text-[14px]
            "
          >
            {servicesModal.selectButton}
          </button>
        </div>
      </section>
    </div>
  );
}

type SelectionCircleProps = {
  selected: boolean;
};

function SelectionCircle({ selected }: SelectionCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex h-[18px] w-[18px]
        shrink-0 items-center justify-center
        rounded-full border
        transition-colors duration-150

        sm:h-5
        sm:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className={`
          h-3 w-3 shrink-0
          text-white
          transition-opacity duration-150

          sm:h-[13px]
          sm:w-[13px]

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
