'use client';

import { type FormEvent, type MouseEvent, useEffect, useRef, useState } from 'react';

import { Check, Info, X } from 'lucide-react';

import data from '@/data/content.json';

type UpdateConsumptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ConsumptionFormValues) => void;
};

export type ConsumptionFormValues =
  | {
      knowsMprn: true;
      mprn: string;
    }
  | {
      knowsMprn: false;
      knowsUsage: true;
      gasUsage: string;
      usagePeriod: 'monthly' | 'yearly';
    }
  | {
      knowsMprn: false;
      knowsUsage: false;
      usageEstimate: string;
    };

export default function UpdateConsumptionModal({
  isOpen,
  onClose,
  onSubmit,
}: UpdateConsumptionModalProps) {
  const modal = data.journey.updateConsumptionModal;

  const [knowsMprn, setKnowsMprn] = useState(modal.defaultKnowsMprn);

  const [mprn, setMprn] = useState('');

  const [knowsUsage, setKnowsUsage] = useState(modal.defaultKnowsUsage);

  const [gasUsage, setGasUsage] = useState('');

  const [usagePeriod, setUsagePeriod] = useState<'monthly' | 'yearly'>(
    modal.defaultUsagePeriod as 'monthly' | 'yearly',
  );

  const [usageEstimate, setUsageEstimate] = useState(modal.usageEstimate.defaultValue);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

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

      document.body.style.overflow = previousOverflow;

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (knowsMprn) {
      if (!mprn.trim()) {
        return;
      }

      onSubmit({
        knowsMprn: true,
        mprn: mprn.trim(),
      });

      return;
    }

    if (knowsUsage) {
      if (!gasUsage.trim()) {
        return;
      }

      onSubmit({
        knowsMprn: false,
        knowsUsage: true,
        gasUsage: gasUsage.trim(),
        usagePeriod,
      });

      return;
    }

    if (!usageEstimate) {
      return;
    }

    onSubmit({
      knowsMprn: false,
      knowsUsage: false,
      usageEstimate,
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      className="
        fixed inset-0 z-[120]
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
        aria-labelledby="update-consumption-heading"
        className="
          relative w-full max-w-[448px]
          rounded-[14px]
          bg-white
          p-4
          shadow-[0px_20px_40px_rgba(16,24,40,0.18)]

          sm:rounded-[16px]
          sm:p-5

          lg:p-6
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h2
            id="update-consumption-heading"
            className="
              font-inter
              text-[17px] font-semibold
              leading-6 tracking-[0]
              text-[#0C3354]

              sm:text-[18px]
              sm:leading-[26px]

              lg:text-[20px]
              lg:leading-7
            "
          >
            {modal.heading}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close update consumption modal"
            onClick={onClose}
            className="
              flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full
              bg-[#F2F4F7]
              text-[#01232C]
              transition-colors

              hover:bg-[#EAECF0]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#D5F2EE]

              lg:h-8
              lg:w-8
            "
          >
            <X
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5"
        >
          {/* MPRN question */}
          <div
            className="
              flex min-h-[48px] w-full
              items-center justify-between
              gap-3 rounded-[12px]
              bg-[#F2F4F7]
              px-3 py-2

              sm:min-h-[52px]
              sm:gap-[18px]
              sm:px-4

              lg:h-[52px]
              lg:px-3
              lg:pl-5
            "
          >
            <p
              className="
                min-w-0 flex-1
                font-inter text-[12px]
                font-medium leading-[18px]
                tracking-[0] text-[#344054]

                sm:text-[13px]
                sm:leading-5

                lg:text-[14px]
              "
            >
              {modal.mprnQuestion}
            </p>

            <YesNoToggle
              value={knowsMprn}
              yesLabel={modal.yesButton}
              noLabel={modal.noButton}
              onChange={setKnowsMprn}
            />
          </div>

          {knowsMprn ? (
            <div className="mt-4">
              <label
                htmlFor="mprn-number"
                className="
                  mb-2 block
                  font-inter text-[12px]
                  font-medium leading-[18px]
                  text-[#344054]

                  sm:text-[13px]

                  lg:text-[14px]
                  lg:leading-5
                "
              >
                {modal.mprnLabel}
              </label>

              <input
                id="mprn-number"
                type="text"
                inputMode="numeric"
                value={mprn}
                onChange={(event) => {
                  setMprn(event.target.value);
                }}
                placeholder={modal.mprnPlaceholder}
                className="
                  h-12 w-full
                  rounded-[100px]
                  border border-[#D0D5DD]
                  bg-white
                  px-4 py-3

                  font-inter text-[14px]
                  font-normal leading-5
                  text-[#101828]

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                  outline-none
                  transition

                  placeholder:text-[#667085]

                  focus:border-[#00897B]
                  focus:ring-4
                  focus:ring-[#D5F2EE]

                  sm:h-[50px]
                  sm:px-[18px]
                  sm:text-[15px]

                  lg:h-[52px]
                  lg:py-[14px]
                  lg:text-[16px]
                  lg:leading-6
                "
              />
            </div>
          ) : (
            <div className="mt-5">
              {/* Usage question */}
              <div>
                <h3
                  className="
                    max-w-[330px]
                    font-inter text-[14px]
                    font-medium leading-5
                    text-[#344054]

                    sm:text-[15px]

                    lg:text-[16px]
                  "
                >
                  {modal.usageQuestion}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <ChoiceCard
                    label={modal.yesButton}
                    selected={knowsUsage}
                    onClick={() => {
                      setKnowsUsage(true);
                    }}
                  />

                  <ChoiceCard
                    label={modal.noButton}
                    selected={!knowsUsage}
                    onClick={() => {
                      setKnowsUsage(false);
                    }}
                  />
                </div>
              </div>

              <div className="my-4 h-px w-full bg-[#EAECF0]" />

              {knowsUsage ? (
                <>
                  <div>
                    <h3
                      className="
                        font-inter text-[14px]
                        font-medium leading-5
                        text-[#344054]

                        sm:text-[15px]

                        lg:text-[16px]
                      "
                    >
                      {modal.estimateHeading}
                    </h3>

                    <p
                      className="
                        mt-1
                        font-inter text-[12px]
                        font-normal leading-[18px]
                        text-[#667085]

                        sm:text-[13px]

                        lg:text-[14px]
                        lg:leading-5
                      "
                    >
                      {modal.estimateDescription}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="gas-usage"
                      className="
                        mb-2 block
                        font-inter text-[12px]
                        font-medium leading-[18px]
                        text-[#344054]

                        sm:text-[13px]

                        lg:text-[14px]
                        lg:leading-5
                      "
                    >
                      {modal.gasUsageLabel}{' '}
                      <span className="font-normal text-[#98A2B3]">{modal.gasUsageUnit}</span>
                    </label>

                    <div className="relative">
                      <input
                        id="gas-usage"
                        type="text"
                        inputMode="decimal"
                        value={gasUsage}
                        onChange={(event) => {
                          setGasUsage(event.target.value);
                        }}
                        placeholder={modal.gasUsagePlaceholder}
                        className="
                          h-12 w-full
                          rounded-[100px]
                          border border-[#D0D5DD]
                          bg-white
                          py-3 pl-4 pr-[132px]

                          font-inter text-[14px]
                          font-normal leading-5
                          text-[#101828]

                          shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                          outline-none
                          transition

                          placeholder:text-[#98A2B3]

                          focus:border-[#00897B]
                          focus:ring-4
                          focus:ring-[#D5F2EE]

                          sm:h-[50px]
                          sm:px-[18px]
                          sm:pr-[140px]
                          sm:text-[15px]

                          lg:h-[52px]
                          lg:text-[16px]
                          lg:leading-6
                        "
                      />

                      <div
                        className="
                          absolute right-2 top-1/2
                          flex h-[34px] -translate-y-1/2
                          items-center rounded-[100px]
                          bg-[#F2F4F7] p-px
                        "
                      >
                        <PeriodButton
                          label={modal.monthlyButton}
                          selected={usagePeriod === 'monthly'}
                          onClick={() => {
                            setUsagePeriod('monthly');
                          }}
                        />

                        <PeriodButton
                          label={modal.yearlyButton}
                          selected={usagePeriod === 'yearly'}
                          onClick={() => {
                            setUsagePeriod('yearly');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3
                        className="
                          font-inter text-[16px]
                          font-medium leading-5
                          tracking-[0] text-[#344054]

                          sm:text-[17px]

                          lg:text-[18px]
                        "
                      >
                        {modal.usageEstimate.heading}
                      </h3>

                      <button
                        type="button"
                        aria-label={modal.usageEstimate.informationLabel}
                        className="
                          inline-flex h-5 w-5
                          shrink-0 items-center
                          justify-center rounded-full
                          text-[#98A2B3]

                          hover:text-[#667085]

                          focus-visible:outline-none
                          focus-visible:ring-4
                          focus-visible:ring-[#EAECF0]
                        "
                      >
                        <Info
                          aria-hidden="true"
                          className="
                            h-4 w-4

                            lg:h-5
                            lg:w-5
                          "
                          strokeWidth={1.7}
                        />
                      </button>
                    </div>

                    <p
                      className="
                        mt-1
                        font-inter text-[12px]
                        font-normal leading-4
                        tracking-[0] text-[#667085]

                        sm:text-[13px]

                        lg:text-[14px]
                        lg:leading-none
                      "
                    >
                      {modal.usageEstimate.description}
                    </p>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={modal.usageEstimate.heading}
                    className="mt-4 space-y-3"
                  >
                    {modal.usageEstimate.options.map((option) => {
                      const isSelected = usageEstimate === option.value;

                      return (
                        <UsageEstimateCard
                          key={option.id}
                          label={option.label}
                          description={option.description}
                          selected={isSelected}
                          onClick={() => {
                            setUsageEstimate(option.value);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
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
                text-[#01232C]

                transition-colors

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
              {modal.cancelButton}
            </button>

            <button
              type="submit"
              className="
                inline-flex h-9 min-w-[72px]
                items-center justify-center
                gap-2 rounded-[100px]
                bg-[#00897B]
                px-4 py-2

                font-inter text-[13px]
                font-semibold leading-5
                text-white

                shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
                transition-colors

                hover:bg-[#00796D]

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#D5F2EE]

                sm:h-10
                sm:min-w-[80px]

                lg:text-[14px]
              "
            >
              {modal.submitButton}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

type YesNoToggleProps = {
  value: boolean;
  yesLabel: string;
  noLabel: string;
  onChange: (value: boolean) => void;
};

function YesNoToggle({ value, yesLabel, noLabel, onChange }: YesNoToggleProps) {
  return (
    <div
      className="
        flex h-[32px] shrink-0
        items-center rounded-[100px]
        bg-white p-px

        sm:h-[34px]
      "
    >
      <ToggleButton
        label={yesLabel}
        selected={value}
        onClick={() => {
          onChange(true);
        }}
      />

      <ToggleButton
        label={noLabel}
        selected={!value}
        onClick={() => {
          onChange(false);
        }}
      />
    </div>
  );
}

type ToggleButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function ToggleButton({ label, selected, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        inline-flex h-[30px]
        items-center justify-center
        rounded-[100px]
        px-2.5

        font-inter text-[12px]
        leading-5
        transition-colors

        sm:h-[34px]
        sm:px-3
        sm:text-[14px]
        sm:leading-6

        ${
          selected
            ? 'border border-[#00897B] bg-[#E6F4F2] font-semibold text-[#00897B]'
            : 'border border-transparent bg-transparent font-normal text-[#667085]'
        }
      `}
    >
      {label}
    </button>
  );
}

type ChoiceCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function ChoiceCard({ label, selected, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        flex h-[48px] w-full
        items-center justify-between
        rounded-[12px]
        bg-white px-4
        text-left

        font-red-hat-display
        text-[14px] font-[550]
        leading-none text-[#0D3B66]

        transition-colors

        sm:h-[52px]
        sm:text-[15px]

        lg:text-[16px]

        ${selected ? 'border border-[#00897B]' : 'border border-[#D0D5DD]'}
      `}
    >
      <span>{label}</span>

      <SelectionCircle selected={selected} />
    </button>
  );
}

type PeriodButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function PeriodButton({ label, selected, onClick }: PeriodButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        inline-flex h-8
        items-center justify-center
        rounded-[100px]
        px-2.5

        font-inter
        text-[11px]
        leading-5
        transition-colors duration-150

        sm:px-3
        sm:text-[12px]

        lg:text-[14px]
        lg:leading-6

        ${
          selected
            ? 'border border-[#00897B] bg-[#E6F4F2] font-semibold text-[#00897B]'
            : 'border border-transparent bg-transparent font-normal text-[#667085]'
        }
      `}
    >
      {label}
    </button>
  );
}

type UsageEstimateCardProps = {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
};

function UsageEstimateCard({ label, description, selected, onClick }: UsageEstimateCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`
        flex min-h-[64px] w-full
        items-start justify-between
        gap-3 rounded-[12px]
        bg-white px-4 py-3
        text-left
        transition-colors duration-150

        sm:min-h-[68px]
        sm:px-[18px]

        lg:h-[70px]
        lg:min-h-[70px]
        lg:gap-[10px]
        lg:px-5
        lg:pb-4
        lg:pt-3

        ${selected ? 'border border-[#00897B]' : 'border border-[#D0D5DD]'}
      `}
    >
      <span className="min-w-0 flex-1">
        <span
          className="
            block
            font-red-hat-display
            text-[14px] font-[550]
            leading-none tracking-[0]
            text-[#0D3B66]

            sm:text-[15px]

            lg:text-[16px]
          "
        >
          {label}
        </span>

        <span
          className="
            mt-2 block
            font-inter text-[12px]
            font-normal leading-none
            tracking-[0] text-[#667085]

            sm:text-[13px]

            lg:text-[15px]
          "
        >
          {description}
        </span>
      </span>

      <RadioCircle selected={selected} />
    </button>
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

        sm:h-5
        sm:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        aria-hidden="true"
        className={`
          h-3 w-3 text-white

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
        strokeWidth={3}
      />
    </span>
  );
}

type RadioCircleProps = {
  selected: boolean;
};

function RadioCircle({ selected }: RadioCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        mt-0.5 flex h-[18px] w-[18px]
        shrink-0 items-center justify-center
        rounded-full border bg-white

        sm:h-5
        sm:w-5

        ${selected ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
      `}
    >
      <span
        className={`
          h-2 w-2 rounded-full
          bg-[#00897B]
          transition-opacity duration-150

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
