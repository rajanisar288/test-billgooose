import Image from 'next/image';

import data from '@/data/content.json';
import { useJourneyStore } from '@/store/journeyStore';

export default function EstimatedPayment() {
  const { journey } = useJourneyStore();
  const { estimatedPayment } = data.currentUsage;

  if (!journey?.customer?.preferredStartDate) return;

  return (
    <section
      className="
        mt-6 flex min-h-[74px]
        items-center gap-3
        rounded-[16px]
        border border-[#EAECF0]
        bg-white p-4

        sm:min-h-[82px]
        sm:gap-4
        sm:p-5
      "
    >
      <Image
        src={estimatedPayment.icon}
        alt={estimatedPayment.iconAlt}
        width={40}
        height={40}
        aria-hidden={!estimatedPayment.iconAlt}
        className="
          h-9 w-9 shrink-0
          object-contain

          sm:h-10
          sm:w-10
        "
      />

      <div className="min-w-0">
        <p
          className="
            font-red-hat-display
            text-[14px] font-extrabold
            leading-none text-[#101828]

            sm:text-[15px]

            lg:text-[16px]
          "
        >
          {journey?.customer?.preferredStartDate}
        </p>

        <p
          className="
            mt-1.5
            font-red-hat-display
            text-[12px] font-medium
            leading-none text-[#667085]

            sm:text-[13px]

            lg:text-[14px]
          "
        >
          {estimatedPayment.description}
        </p>
      </div>
    </section>
  );
}
