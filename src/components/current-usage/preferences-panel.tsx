'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { ChevronDown } from 'lucide-react';

import data from '@/data/content.json';
import { useJourneyStore } from '@/store/journeyStore';

export default function PreferencesPanel() {
  const { preferences } = data.currentUsage;
  const { journey } = useJourneyStore();

  const [isOpen, setIsOpen] = useState(false);

  const preferenceItems = useMemo(() => {
    if (!journey) return [];

    const customer = journey.customer;
    const address = journey.address;

    const serviceLabel =
      journey.serviceType === 'energy'
        ? customer?.energySupplyType === 'dualFuel'
          ? 'Gas & Electricity (Dual Fuel)'
          : customer?.energySupplyType === 'electricityOnly'
            ? 'Electricity'
            : customer?.energySupplyType === 'gasOnly'
              ? 'Gas'
              : 'Energy'
        : journey.serviceType;

    const houseType = customer?.propertyType
      ? `${capitalize(customer.propertyType)}${
          customer?.bedrooms != null ? ` · Bedrooms: ${customer.bedrooms}` : ''
        }`
      : '';

    const contractDate = customer?.preferredStartDate
      ? formatDate(customer.preferredStartDate)
      : '';

    return preferences.items
      .map((item) => {
        switch (item.id) {
          case 'address':
            return {
              ...item,
              description: address?.fullAddress ?? '',
            };

          case 'service':
            return {
              ...item,
              description: serviceLabel,
            };

          case 'house-type':
            return {
              ...item,
              description: houseType,
            };

          case 'contract-date':
            return {
              ...item,
              title: contractDate,
              description: 'Estimated Contract Starting',
            };

          default:
            return item;
        }
      })
      .filter((item) => {
        // Don't display house type if there is no house type
        if (item.id === 'house-type' && !houseType) {
          return false;
        }

        // Don't display contract date if there is no contract start date
        if (item.id === 'contract-date' && !contractDate) {
          return false;
        }

        return true;
      });
  }, [journey, preferences.items]);

  return (
    <aside
      className="
        overflow-hidden
        rounded-[16px]
        border border-[#EAECF0]
        bg-white

        lg:min-h-[420px]
        xl:min-h-[696px]
      "
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        aria-expanded={isOpen}
        className="
          flex min-h-[62px]
          w-full
          items-center
          gap-2
          border-b border-[#EAECF0]
          px-4
          text-left

          sm:px-5

          lg:pointer-events-none
        "
      >
        <Image
          src={preferences.icon}
          alt={preferences.iconAlt}
          width={24}
          height={24}
          aria-hidden={!preferences.iconAlt}
          className="
            h-6 w-6
            shrink-0
            object-contain
          "
        />

        <h2
          className="
            min-w-0 flex-1

            font-red-hat-display
            text-[17px]
            font-extrabold
            leading-6
            text-[#101828]

            lg:text-[20px]
          "
        >
          {preferences.heading}
        </h2>

        <ChevronDown
          aria-hidden="true"
          strokeWidth={2}
          className={`
            h-5 w-5
            shrink-0
            text-[#667085]

            transition-transform
            duration-200

            lg:hidden

            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      <div
        className={`
          grid
          transition-all
          duration-300

          lg:grid-rows-[1fr]

          ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
        `}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 p-3 sm:p-4">
            {preferenceItems.map((preference) => (
              <PreferenceItem
                key={preference.id}
                title={preference.title}
                description={preference.description}
                icon={preference.icon}
                iconAlt={preference.iconAlt}
                editIcon={preferences.editIcon}
                editIconAlt={preferences.editIconAlt}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

type PreferenceItemProps = {
  title: string;
  description: string;
  icon: string;
  iconAlt: string;
  editIcon: string;
  editIconAlt: string;
};

function PreferenceItem({
  title,
  description,
  icon,
  iconAlt,
  editIcon,
  editIconAlt,
}: PreferenceItemProps) {
  return (
    <div
      className="
        flex min-h-[60px]
        items-center
        gap-3
        rounded-[12px]
        bg-[#F2F4F7]

        py-2.5
        pl-2.5
        pr-3

        sm:gap-4
        sm:pr-3.5
      "
    >
      <Image
        src={icon}
        alt={iconAlt}
        width={40}
        height={40}
        aria-hidden={!iconAlt}
        className="
          h-9 w-9
          shrink-0
          object-contain

          sm:h-10
          sm:w-10
        "
      />

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate

            font-red-hat-display
            text-[15px]
            font-extrabold
            leading-[19px]
            text-[#101828]

            lg:text-[16px]
            lg:leading-none
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1

            truncate

            font-red-hat-display
            text-[13px]
            font-medium
            leading-[18px]
            text-[#667085]

            lg:mt-1.5
            lg:text-[14px]
            lg:leading-none
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Edit ${title}`}
        className="
          flex h-8 w-8
          shrink-0
          items-center
          justify-center

          rounded-full

          transition-colors

          hover:bg-white

          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#D5F2EE]
        "
      >
        {/* <Image
          src={editIcon}
          alt={editIconAlt}
          width={15}
          height={15}
          aria-hidden={!editIconAlt}
          className="
            block
            h-[15px]
            w-[15px]
            shrink-0
            object-contain
          "
        /> */}
      </button>
    </div>
  );
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
