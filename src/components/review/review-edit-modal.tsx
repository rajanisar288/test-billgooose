'use client';

import { type FormEvent, useState } from 'react';

import { X } from 'lucide-react';

import data from '@/data/content.json';

import type { ReviewState } from './review-your-details';

export type EditableSection =
  | 'personalDetails'
  | 'household'
  | 'paymentMethod'
  | 'contractDates'
  | 'provider'
  | 'broadbandSpeed'
  | 'contractLength';

type ReviewEditModalProps = {
  section: EditableSection | null;
  service: 'energy' | 'broadband';
  currentData: ReviewState;
  onClose: () => void;
  onSaved: (updatedData: ReviewState) => void;
};

function getInitialFormData(
  section: EditableSection,
  currentData: ReviewState,
): Record<string, string> {
  switch (section) {
    case 'personalDetails':
      return {
        title: currentData.personalDetails.title ?? '',
        firstName: currentData.personalDetails.firstName ?? '',
        lastName: currentData.personalDetails.lastName ?? '',
        email: currentData.personalDetails.email ?? '',
        mobileNumber: currentData.personalDetails.mobileNumber ?? '',
        dateOfBirth: currentData.personalDetails.dateOfBirth ?? '',
      };

    case 'household':
      return {
        propertyType: currentData.household.propertyType ?? '',
        occupants: currentData.household.occupants ?? '',
        bedrooms: currentData.household.bedrooms ?? '',
      };

    case 'paymentMethod':
      return {
        paymentMethod: currentData.paymentMethod,
      };

    case 'contractDates':
      return {
        contractDate: currentData.contractDetails.contractDate ?? '',
      };

    case 'provider':
      return {
        provider: currentData.broadbandProvider,
      };

    case 'broadbandSpeed':
      return {
        broadbandSpeed: currentData.broadbandSpeed,
      };

    case 'contractLength':
      return {
        contractLength: currentData.broadbandContractLength,
      };
  }
}

export default function ReviewEditModal({
  section,
  service,
  currentData,
  onClose,
  onSaved,
}: ReviewEditModalProps) {
  if (!section) {
    return null;
  }

  return (
    <ReviewEditModalContent
      key={section}
      section={section}
      service={service}
      currentData={currentData}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

type ReviewEditModalContentProps = {
  section: EditableSection;
  service: 'energy' | 'broadband';
  currentData: ReviewState;
  onClose: () => void;
  onSaved: (updatedData: ReviewState) => void;
};

function ReviewEditModalContent({
  section,
  currentData,
  onClose,
  onSaved,
}: ReviewEditModalContentProps) {
  const { journey } = data;

  const [formData, setFormData] = useState<Record<string, string>>(() =>
    getInitialFormData(section, currentData),
  );

  const setValue = (name: string, value: string) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedData: ReviewState = {
      ...currentData,
    };

    switch (section) {
      case 'personalDetails':
        updatedData.personalDetails = {
          ...currentData.personalDetails,
          title: formData.title ?? '',
          firstName: formData.firstName ?? '',
          lastName: formData.lastName ?? '',
          email: formData.email ?? '',
          mobileNumber: formData.mobileNumber ?? '',
          dateOfBirth: formData.dateOfBirth ?? '',
        };
        break;

      case 'household':
        updatedData.household = {
          ...currentData.household,
          propertyType: formData.propertyType ?? '',
          occupants: formData.occupants ?? '',
          bedrooms: formData.bedrooms ?? '',
        };
        break;

      case 'paymentMethod':
        updatedData.paymentMethod = formData.paymentMethod ?? '';
        break;

      case 'contractDates':
        updatedData.contractDetails = {
          ...currentData.contractDetails,
          contractDate: formData.contractDate ?? '',
        };
        break;

      case 'provider':
        updatedData.broadbandProvider = formData.provider ?? '';
        break;

      case 'broadbandSpeed':
        updatedData.broadbandSpeed = formData.broadbandSpeed ?? '';
        break;

      case 'contractLength':
        updatedData.broadbandContractLength = formData.contractLength ?? '';
        break;
    }

    onSaved(updatedData);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]

        flex
        items-center
        justify-center

        bg-black/40

        px-4
        py-6
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="
          max-h-[calc(100dvh-32px)]
          w-full
          max-w-[560px]

          overflow-y-auto

          rounded-[16px]

          bg-white

          shadow-[0px_24px_48px_rgba(16,24,40,0.20)]
        "
      >
        <div
          className="
            flex
            h-[58px]

            items-center
            justify-between

            border-b
            border-[#EAECF0]

            px-5
          "
        >
          <h2
            className="
              font-red-hat-display
              text-[18px]
              font-extrabold
              text-[#0C3354]
            "
          >
            Edit details
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit details"
            className="
              flex
              h-8
              w-8

              items-center
              justify-center

              rounded-full

              text-[#667085]

              hover:bg-[#F2F4F7]
            "
          >
            <X
              aria-hidden="true"
              className="h-5 w-5"
            />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {section === 'personalDetails' && (
            <>
              <EditInput
                label="Title"
                value={formData.title ?? ''}
                onChange={(value) => setValue('title', value)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <EditInput
                  label="Firstname"
                  value={formData.firstName ?? ''}
                  onChange={(value) => setValue('firstName', value)}
                />

                <EditInput
                  label="Lastname"
                  value={formData.lastName ?? ''}
                  onChange={(value) => setValue('lastName', value)}
                />
              </div>

              <EditInput
                label="Email address"
                type="email"
                value={formData.email ?? ''}
                onChange={(value) => setValue('email', value)}
              />

              <EditInput
                label="Mobile number"
                value={formData.mobileNumber ?? ''}
                onChange={(value) => setValue('mobileNumber', value)}
              />

              <EditInput
                label="Date of birth"
                type="date"
                value={formData.dateOfBirth ?? ''}
                onChange={(value) => setValue('dateOfBirth', value)}
              />
            </>
          )}

          {section === 'household' && (
            <>
              <EditSelect
                label="House type"
                value={formData.propertyType ?? ''}
                options={journey.household.propertyType.options}
                onChange={(value) => setValue('propertyType', value)}
              />

              <EditCounter
                label="House size"
                value={formData.occupants ?? ''}
                onChange={(value) => setValue('occupants', value)}
              />

              <EditCounter
                label="No. of bedrooms"
                value={formData.bedrooms ?? ''}
                onChange={(value) => setValue('bedrooms', value)}
              />
            </>
          )}

          {section === 'paymentMethod' && (
            <EditSelect
              label="Payment method"
              value={formData.paymentMethod ?? ''}
              options={journey.paymentMethod.options}
              onChange={(value) => setValue('paymentMethod', value)}
            />
          )}

          {section === 'contractDates' && (
            <EditInput
              label="Contract start date"
              type="date"
              value={formData.contractDate ?? ''}
              onChange={(value) => setValue('contractDate', value)}
            />
          )}

          {section === 'provider' && (
            <EditSelect
              label="Current provider"
              value={formData.provider ?? ''}
              options={journey.broadbandProvider.providers}
              onChange={(value) => setValue('provider', value)}
            />
          )}

          {section === 'broadbandSpeed' && (
            <EditSelect
              label="Broadband speed"
              value={formData.broadbandSpeed ?? ''}
              options={journey.broadbandSpeed.options}
              onChange={(value) => setValue('broadbandSpeed', value)}
            />
          )}

          {section === 'contractLength' && (
            <EditSelect
              label="Contract length"
              value={formData.contractLength ?? ''}
              options={journey.broadbandContractLength.options}
              onChange={(value) => setValue('contractLength', value)}
            />
          )}
        </div>

        <footer
          className="
            flex
            items-center
            justify-end
            gap-3

            border-t
            border-[#EAECF0]

            p-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              h-11

              rounded-full

              border
              border-[#D0D5DD]

              bg-white

              px-5

              font-red-hat-display
              text-[14px]
              font-bold
              text-[#344054]
            "
          >
            {journey.reviewDetails.editModal.cancelButton}
          </button>

          <button
            type="submit"
            className="
              h-11

              rounded-full

              bg-[#00897B]

              px-6

              font-red-hat-display
              text-[14px]
              font-bold
              text-white

              hover:bg-[#00796D]
            "
          >
            {journey.reviewDetails.editModal.saveButton}
          </button>
        </footer>
      </form>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

type EditInputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

function EditInput({ label, value, type = 'text', onChange }: EditInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-inter text-[12px] font-medium text-[#344054]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-[48px]
          w-full

          rounded-full

          border
          border-[#D0D5DD]

          bg-white

          px-4

          font-inter
          text-[14px]
          text-[#101828]

          outline-none

          focus:border-[#00897B]
          focus:ring-4
          focus:ring-[#E6F4F2]
        "
      />
    </label>
  );
}

type EditCounterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function EditCounter({ label, value, onChange }: EditCounterProps) {
  const numericValue = Math.min(10, Math.max(1, Number(value) || 1));

  return (
    <div>
      <span className="mb-1.5 block font-inter text-[12px] font-medium text-[#344054]">
        {label}
      </span>
      <div className="flex h-[48px] w-full items-center justify-between rounded-full border border-[#D0D5DD] bg-white px-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={numericValue <= 1}
          onClick={() => onChange(String(numericValue - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D0D5DD] text-xl text-[#344054] hover:border-[#00897B] hover:text-[#00897B] disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="font-red-hat-display text-[18px] font-bold text-[#0D3B66]">
          {numericValue}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={numericValue >= 10}
          onClick={() => onChange(String(numericValue + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D0D5DD] text-xl text-[#344054] hover:border-[#00897B] hover:text-[#00897B] disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

type SelectOption = {
  value: string;
  label: string;
};

type EditSelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

function EditSelect({ label, value, options, onChange }: EditSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-inter text-[12px] font-medium text-[#344054]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-[48px]
          w-full

          rounded-full

          border
          border-[#D0D5DD]

          bg-white

          px-4

          font-inter
          text-[14px]
          text-[#101828]

          outline-none

          focus:border-[#00897B]
          focus:ring-4
          focus:ring-[#E6F4F2]
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
