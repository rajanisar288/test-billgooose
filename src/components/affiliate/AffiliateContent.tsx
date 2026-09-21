import data from '@/data/content.json';

export default function AffiliateContent() {
  const { affiliateContent } = data as {
    affiliateContent: {
      heading: string;
      paragraphs: string[];
    };
  };

  const { heading, paragraphs } = affiliateContent;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-4

        sm:px-5
        sm:pb-5

        lg:px-8
        lg:pb-6
      "
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div
          className="
            rounded-[18px]

            border
            border-[#EAECF0]

            bg-white

            px-4
            py-6

            shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

            sm:rounded-[20px]
            sm:px-7
            sm:py-8

            lg:rounded-[24px]
            lg:px-10
            lg:py-10
          "
        >
          {/* Heading */}
          <h2
            className="
              font-red-hat-display

              text-[18px]
              font-bold
              leading-[24px]
              tracking-[-0.2px]

              text-[#082A49]

              sm:text-[20px]
              sm:leading-[26px]

              lg:text-[22px]
              lg:leading-[28px]
            "
          >
            {heading}
          </h2>

          {/* Paragraphs */}
          <div
            className="
              mt-3
              space-y-4

              sm:mt-4
              sm:space-y-5

              lg:mt-4
              lg:space-y-5
            "
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="
                  font-inter

                  text-[13px]
                  font-normal
                  leading-[20px]

                  text-[#475467]

                  sm:text-[14px]
                  sm:leading-[22px]

                  lg:text-[15px]
                  lg:leading-[24px]
                "
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
