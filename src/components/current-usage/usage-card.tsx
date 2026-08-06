import Image from 'next/image';

type UsageCardProps = {
  title: string;
  address: string;
  usage: string;
  unit: string;
  price: string;
  buttonLabel: string;
  icon: string;
  iconAlt: string;
  borderColor: string;
};

export default function UsageCard({
  title,
  address,
  usage,
  unit,
  price,
  buttonLabel,
  icon,
  iconAlt,
  borderColor,
}: UsageCardProps) {
  return (
    <section
      style={{ borderColor }}
      className="
        flex min-h-[194px]
        w-full flex-col
        rounded-[16px]
        border bg-white p-4

        sm:min-h-[204px]
        sm:p-5

        lg:h-[212px]
        lg:min-h-[212px]
        lg:w-[424px]
        lg:max-w-full
        lg:p-5
      "
    >
      <div className="flex items-start gap-3">
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
          <h2
            className="
              font-red-hat-display
              text-[14px] font-extrabold
              leading-none text-[#101828]

              sm:text-[15px]

              lg:text-[16px]
            "
          >
            {title}
          </h2>

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
            {address}
          </p>
        </div>
      </div>

      <div
        className="
          mt-4 flex items-end
          justify-between gap-3

          lg:mt-[14px]
        "
      >
        <div className="flex items-baseline gap-1">
          <span
            className="
              font-red-hat-display
              text-[27px] font-[800]
              leading-9 text-[#0C3354]

              lg:text-[32px]
              lg:leading-[38px]
            "
          >
            {usage}
          </span>

          <span
            className="
              font-red-hat-display
              text-[12px] font-medium
              leading-5 text-[#667085]

              lg:text-[16px]
              lg:leading-6
            "
          >
            {unit}
          </span>
        </div>

        <span
          className="
            shrink-0
            font-red-hat-display
            text-[14px] font-medium
            leading-5 text-[#667085]

            lg:text-[20px]
            lg:leading-[30px]
          "
        >
          {price}
        </span>
      </div>

      <button
        type="button"
        className="
          mt-auto inline-flex h-11
          w-full shrink-0
          items-center justify-center
          whitespace-nowrap
          rounded-[100px]
          border border-[#D0D5DD]
          bg-white px-4

          font-red-hat-display
          text-[13px] font-extrabold
          leading-6 text-[#0C3354]

          transition-colors

          hover:bg-[#F9FAFB]

          lg:h-[52px]
          lg:w-[382px]
          lg:max-w-full
          lg:px-6
          lg:text-[16px]
          lg:leading-[26px]
        "
      >
        {buttonLabel}
      </button>
    </section>
  );
}
