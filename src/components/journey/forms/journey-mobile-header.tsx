import Image from 'next/image';
import Link from 'next/link';

import data from '@/data/content.json';

export default function JourneyMobileHeader() {
  const { mobileHeader } = data.journey;

  return (
    <header
      className="
          flex h-[82px] w-full
          items-center justify-center
          bg-[#082A49]

          lg:hidden
        "
    >
      <Link
        href="/"
        aria-label="Go to BillGoose home page"
        className="
            relative block
            h-[82px] w-[170px]
          "
      >
        <Image
          src={mobileHeader.logo.src}
          alt={mobileHeader.logo.alt}
          fill
          priority
          sizes="170px"
          className="
              object-contain
              object-center
            "
        />
      </Link>
    </header>
  );
}
