import Image from 'next/image';

import data from '@/data/content.json';

export default function PreferencesPanel() {
  const { preferences } = data.currentUsage;

  return (
    <aside
      className="
        min-h-[420px]
        overflow-hidden rounded-[16px]
        border border-[#EAECF0]
        bg-white

        xl:min-h-[696px]
      "
    >
      <div
        className="
          flex min-h-[62px] items-center
          gap-2 border-b border-[#EAECF0]
          px-4

          sm:px-5
        "
      >
        <Image
          src={preferences.icon}
          alt={preferences.iconAlt}
          width={24}
          height={24}
          aria-hidden={!preferences.iconAlt}
          className="
            h-6 w-6 shrink-0
            object-contain
          "
        />

        <h2
          className="
            font-red-hat-display
            text-[17px] font-extrabold
            leading-6 text-[#101828]

            lg:text-[20px]
          "
        >
          {preferences.heading}
        </h2>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {preferences.items.map((preference) => (
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
        flex min-h-[56px] items-center
        gap-3 rounded-[12px]
        bg-[#F2F4F7]
        py-2 pl-2 pr-3

        sm:min-h-[60px]
        sm:gap-4
        sm:py-2.5
        sm:pl-2.5
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
          h-9 w-9 shrink-0
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
            text-[14px] font-extrabold
            leading-none text-[#101828]

            lg:text-[16px]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1.5 truncate
            font-red-hat-display
            text-[11px] font-medium
            leading-none text-[#667085]

            sm:text-[12px]

            lg:text-[14px]
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Edit ${title}`}
        className="
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-full
          transition-colors

          hover:bg-white

          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#D5F2EE]
        "
      >
        <Image
          src={editIcon}
          alt={editIconAlt}
          width={15}
          height={15}
          aria-hidden={!editIconAlt}
          className="
            block h-[15px] w-[15px]
            shrink-0 object-contain
          "
        />
      </button>
    </div>
  );
}
