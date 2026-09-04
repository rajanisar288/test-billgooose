import Image from 'next/image';

import data from '@/data/content.json';

export default function ImportantNotice() {
  const { importantNotice } = data.currentUsage;

  return (
    <section
      className="
        mt-6 min-h-[120px]
        rounded-[16px]
        border border-[#FEC84B]
        bg-[#FFFCF5]
        p-4

        lg:min-h-[100px]
      "
    >
      <div className="flex items-start gap-3">
        <Image
          src={importantNotice.icon}
          alt={importantNotice.iconAlt}
          width={20}
          height={20}
          aria-hidden={!importantNotice.iconAlt}
          className="
            mt-0.5 h-5 w-5
            shrink-0 object-contain
          "
        />

        <div className="min-w-0">
          <h2
            className="
              font-inter
              text-[14px] font-bold uppercase
              leading-5 text-[#B54708]

              lg:text-[14px]
              lg:leading-5
            "
          >
            {importantNotice.heading}
          </h2>

          <p
            className="
              mt-1 font-inter
              text-[14px] font-normal
              leading-5 text-[#B54708]

              lg:text-[14px]
              lg:leading-5
            "
          >
            {importantNotice.description}
          </p>

          {/* <button
            type="button"
            className="
              mt-3 inline-flex
              items-center gap-2

              font-inter
              text-[14px] font-bold
              leading-5 text-[#B54708]

              hover:underline

              lg:text-[14px]
              lg:leading-5
            "
          >
            {importantNotice.actionLabel}

            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={1.67}
            />
          </button> */}
        </div>
      </div>
    </section>
  );
}
