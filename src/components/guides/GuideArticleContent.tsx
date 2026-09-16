'use client';

import { useState, type FormEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Download, FileText, Link2 } from 'lucide-react';

import data from '@/data/content.json';

export default function GuideArticleContent() {
  const { guideArticleContent, footer } = data;
  const { sidebar, article } = guideArticleContent;

  const [activeSection, setActiveSection] = useState('introduction');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // =====================================================
  // TABLE OF CONTENTS
  // =====================================================

  function handleSectionClick(sectionId: string) {
    setActiveSection(sectionId);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // =====================================================
  // DOWNLOAD ARTICLE
  // =====================================================

  function handleDownload() {
    const content = [
      article.intro,
      '',
      article.quickAnswer.heading,
      article.quickAnswer.description,
      '',
      article.legalMatters.heading,
      ...article.legalMatters.paragraphs,
      '',
      article.legalBaseline.heading,
      article.legalBaseline.description,
      '',
      article.checklist.heading,

      ...article.checklist.items.map(
        (item) => `${item.number}. ${item.title}\n${item.description}`,
      ),

      '',
      article.priceReductionTable.heading,

      ...article.priceReductionTable.rows.map(
        (row) =>
          `${row.action}\nWhy it can reduce cost: ${row.reason}\nImportant warning: ${row.warning}`,
      ),

      '',
      ...article.premiumReductionSteps.flatMap((step) => [step.heading, ...step.paragraphs, '']),

      article.riskWarnings.heading,
      ...article.riskWarnings.items.map((item) => `• ${item}`),

      '',
      article.conclusion.heading,
      article.conclusion.description,
      '',
      article.conclusion.highlight.heading,
      article.conclusion.highlight.description,
    ].join('\n\n');

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'car-insurance-guide.txt';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // NEWSLETTER
  // =====================================================

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setNewsletterMessage('Please enter your email address.');
      return;
    }

    // Connect your newsletter API here when available.
    setNewsletterMessage('Newsletter subscriptions are not available yet.');
  }

  // =====================================================
  // COPY ARTICLE LINK
  // =====================================================

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
  }

  return (
    <section className="w-full bg-white px-4 pb-[80px] sm:px-6 sm:pb-[100px] md:px-8 md:pb-[120px] lg:px-8 lg:pb-[140px]">
      <div className="mx-auto grid w-full max-w-[1216px] grid-cols-1 items-start gap-10 md:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-[60px] xl:gap-[64px]">
        {/* =====================================================
            LEFT STICKY SIDEBAR
        ====================================================== */}

        <aside className="w-full lg:sticky lg:top-6 lg:w-[280px] lg:self-start">
          {/* TABLE OF CONTENTS */}

          <div>
            <h2 className="font-inter text-[14px] font-semibold leading-5 text-[#00897B] lg:text-[16px] lg:leading-6">
              {sidebar.heading}
            </h2>

            <nav
              aria-label="Table of contents"
              className="mt-4 flex flex-col gap-3"
            >
              {sidebar.links.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleSectionClick(link.id)}
                    className={`
                      w-full text-left font-inter
                      text-[14px] leading-[22px]
                      transition-colors duration-200
                      lg:text-[16px] lg:leading-[24px]
                      ${
                        isActive
                          ? 'font-semibold text-[#00897B]'
                          : 'font-semibold text-[#475467] hover:text-[#00897B]'
                      }
                    `}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* DIVIDER */}

          <div className="my-7 h-px w-full bg-[#EAECF0]" />

          {/* CONTRIBUTORS */}

          <div>
            <h3 className="font-inter text-[14px] font-semibold leading-5 text-[#00897B] lg:text-[16px] lg:leading-6">
              {sidebar.contributorsHeading}
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#AA9C75]">
                <Image
                  src={sidebar.contributor.image}
                  alt={sidebar.contributor.imageAlt}
                  fill
                  sizes="48px"
                  className="object-contain object-center"
                />
              </div>

              <div>
                <p className="font-inter text-[14px] font-semibold leading-5 text-[#101828] lg:text-[16px] lg:leading-6">
                  {sidebar.contributor.name}
                </p>

                <p className="font-inter text-[14px] font-normal leading-5 text-[#475467] lg:text-[16px] lg:leading-6">
                  {sidebar.contributor.role}
                </p>
              </div>
            </div>
          </div>

          {/* DIVIDER */}

          <div className="my-7 h-px w-full bg-[#EAECF0]" />

          {/* DOWNLOADABLE CONTENT */}

          <div className="w-full rounded-[12px] bg-[#F9FAFB] p-4 lg:min-h-[118px] lg:w-[280px]">
            <div className="flex items-start gap-2">
              {/* FILE ICON */}

              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border-4 border-[#D8F3F0] bg-[#D8F3F0]">
                <FileText
                  aria-hidden="true"
                  className="h-4 w-4 text-[#00897B]"
                  strokeWidth={1.8}
                />
              </div>

              {/* FILE INFORMATION */}

              <div className="min-w-0 flex-1">
                <p
                  className="line-clamp-1 font-inter text-[13px] font-medium leading-[20px] text-[#344054] lg:text-[14px]"
                  title={sidebar.download.title}
                >
                  {sidebar.download.title}
                </p>

                <p className="font-inter text-[11px] leading-4 text-[#667085]">
                  {sidebar.download.fileDetails}
                </p>
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}

            <button
              type="button"
              onClick={handleDownload}
              className="mt-3 flex h-[36px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#D0D5DD] bg-white px-[14px] py-2 font-inter text-[13px] font-medium leading-5 text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors duration-200 hover:bg-[#F9FAFB]"
            >
              <span>{sidebar.download.buttonLabel}</span>

              <Download
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* NEWSLETTER */}

          <div className="mt-7">
            <h3 className="font-inter text-[14px] font-semibold leading-5 text-[#00897B] lg:text-[16px] lg:leading-6">
              {sidebar.newsletter.heading}
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="mt-3 flex flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setNewsletterMessage('');
                }}
                placeholder={sidebar.newsletter.placeholder}
                aria-label="Email address"
                required
                className="h-[48px] w-full rounded-full border border-[#D0D5DD] bg-white px-4 font-inter text-[14px] leading-5 text-[#344054] placeholder:text-[#667085] outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
              />

              <button
                type="submit"
                className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#00897B] font-inter text-[14px] font-semibold leading-5 text-white transition-colors duration-200 hover:bg-[#00766B]"
              >
                {sidebar.newsletter.buttonLabel}
              </button>

              {newsletterMessage && (
                <p
                  role="status"
                  className="font-inter text-[12px] leading-[18px] text-[#667085]"
                >
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>

          {/* DIVIDER */}

          <div className="my-7 h-px w-full bg-[#EAECF0]" />

          {/* SOCIAL ICONS */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={linkCopied ? 'Guide link copied' : 'Copy guide link'}
              title={linkCopied ? 'Link copied' : 'Copy guide link'}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white text-[#667085] hover:text-[#00897B]"
            >
              <Link2
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </button>

            {footer.socials
              .filter((social) => ['x', 'facebook', 'linkedin'].includes(social.id))
              .map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white transition-opacity hover:opacity-70"
                >
                  <Image
                    src={social.icon}
                    alt={social.iconAlt}
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                </Link>
              ))}
          </div>
        </aside>

        {/* =====================================================
            RIGHT ARTICLE CONTENT
        ====================================================== */}

        <article className="min-w-0 w-full font-inter text-[15px] font-normal leading-[24px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px] xl:text-[20px] xl:leading-[30px]">
          {/* =================================================
              1. INTRODUCTION
              Sidebar link: Introduction
          ================================================== */}

          <div
            id="introduction"
            className="scroll-mt-8"
          >
            <p className="font-inter text-[16px] font-normal leading-[26px] text-[#475467] lg:text-[18px] lg:leading-[28px] xl:text-[20px] xl:leading-[30px]">
              {article.intro}
            </p>

            {/* QUICK ANSWER */}

            <div className="mt-5 rounded-[16px] bg-[#E8F7F7] p-5 sm:p-6 lg:p-[30px]">
              <h2 className="font-inter text-[22px] font-bold leading-[30px] text-[#00897B] lg:text-[26px] lg:leading-[36px]">
                {article.quickAnswer.heading}
              </h2>

              <p className="mt-4 font-inter text-[15px] font-normal leading-[24px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                {article.quickAnswer.description}
              </p>
            </div>

            {/* WHY LEGALLY MATTERS */}

            <div className="mt-10">
              <h2 className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]">
                {article.legalMatters.heading}
              </h2>

              <div className="mt-5 space-y-5">
                {article.legalMatters.paragraphs.map((paragraph, index) => (
                  <p
                    key={`legal-paragraph-${index}`}
                    className="font-inter text-[15px] font-normal leading-[24px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* LEGAL BASELINE */}

            <div className="mt-10 rounded-[16px] bg-[#153C64] p-5 text-white sm:p-6 lg:p-[30px]">
              <h2 className="font-inter text-[22px] font-bold leading-[30px] !text-white lg:text-[26px] lg:leading-[36px]">
                {article.legalBaseline.heading}
              </h2>

              <p className="mt-4 font-inter text-[15px] font-normal leading-[24px] !text-white sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                {article.legalBaseline.description}
              </p>
            </div>
          </div>

          {/* =====================================================
              2. LEGAL PREMIUM-REDUCTION CHECKLIST
          ====================================================== */}

          <section
            aria-labelledby="checklist-heading"
            className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
          >
            <h2
              id="checklist-heading"
              className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]"
            >
              {article.checklist.heading}
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              {article.checklist.items.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-start gap-4 rounded-[16px] bg-[#F9FAFB] p-4 sm:gap-5 sm:p-5 lg:gap-6 lg:p-6"
                >
                  {/* NUMBER */}

                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[9px] bg-[#00897B] font-inter text-[20px] font-bold leading-[28px] text-white lg:h-[48px] lg:w-[48px]">
                    {item.number}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-inter text-[17px] font-semibold leading-[26px] text-[#101828] lg:text-[20px] lg:leading-[30px]">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-inter text-[14px] font-normal leading-[22px] text-[#475467] sm:text-[15px] sm:leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
              3. PRICE REDUCTION TABLE

              Sidebar link: Software and tools
          ====================================================== */}

          <section
            id="software-and-tools"
            aria-labelledby="price-reduction-heading"
            className="mt-12 w-full scroll-mt-8 sm:mt-14 lg:mt-16"
          >
            {/* TABLE HEADING */}

            <h2
              id="price-reduction-heading"
              className="max-w-[750px] font-inter text-[24px] font-bold leading-[32px] tracking-[0] text-[#101828] sm:text-[26px] sm:leading-[36px] lg:text-[30px] lg:leading-[40px]"
            >
              {article.priceReductionTable.heading}
            </h2>

            {/* TABLE CONTAINER */}

            <div className="mt-6 w-full overflow-x-auto rounded-[14px] border border-[#EAECF0] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] [scrollbar-width:thin]">
              <table className="w-full min-w-[620px] table-fixed border-collapse text-left font-inter">
                {/* TABLE HEADER */}

                <thead className="bg-white">
                  <tr>
                    {article.priceReductionTable.columns.map((column, index) => (
                      <th
                        key={column}
                        scope="col"
                        className={`
                            border-b border-[#EAECF0]
                            px-4 py-3 align-middle
                            font-inter text-[12px] font-medium
                            leading-[18px] text-[#344054]
                            sm:px-5 sm:text-[13px]
                            lg:px-6 lg:text-[14px]
                            ${index === 0 ? 'w-[26%]' : 'w-[37%]'}
                          `}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* TABLE ROWS */}

                <tbody>
                  {article.priceReductionTable.rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`
                          ${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}
                          ${
                            index !== article.priceReductionTable.rows.length - 1
                              ? 'border-b border-[#EAECF0]'
                              : ''
                          }
                        `}
                    >
                      {/* ACTION */}

                      <td className="px-4 py-3 align-middle font-inter text-[12px] font-normal leading-[19px] text-[#475467] sm:px-5 sm:py-4 sm:text-[13px] sm:leading-[20px] lg:px-6 lg:text-[14px] lg:leading-[22px]">
                        {row.action}
                      </td>

                      {/* WHY IT CAN REDUCE COST */}

                      <td className="px-4 py-3 align-middle font-inter text-[12px] font-normal leading-[19px] text-[#475467] sm:px-5 sm:py-4 sm:text-[13px] sm:leading-[20px] lg:px-6 lg:text-[14px] lg:leading-[22px]">
                        {row.reason}
                      </td>

                      {/* IMPORTANT WARNING */}

                      <td className="px-4 py-3 align-middle font-inter text-[12px] font-normal leading-[19px] text-[#475467] sm:px-5 sm:py-4 sm:text-[13px] sm:leading-[20px] lg:px-6 lg:text-[14px] lg:leading-[22px]">
                        {row.warning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* =====================================================
              4. SIX PREMIUM-REDUCTION SECTIONS
              Immediately after the table
          ====================================================== */}

          <div className="mt-12 flex w-full flex-col gap-10 sm:mt-14 sm:gap-12 lg:mt-16 lg:gap-[48px]">
            {article.premiumReductionSteps.map((step) => (
              <section
                key={step.id}
                id={step.id}
                className="w-full scroll-mt-24"
              >
                {/* STEP HEADING */}

                <h2 className="font-inter text-[22px] font-semibold leading-[30px] tracking-[0] text-[#101828] sm:text-[25px] sm:leading-[34px] md:text-[27px] md:leading-[36px] lg:text-[30px] lg:leading-[38px]">
                  {step.heading}
                </h2>

                {/* STEP PARAGRAPHS */}

                <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5">
                  {step.paragraphs.map((paragraph, index) => (
                    <p
                      key={`${step.id}-paragraph-${index}`}
                      className="font-inter text-[14px] font-normal leading-[23px] tracking-[0] !text-[#475467] sm:text-[15px] sm:leading-[25px] md:text-[16px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* =====================================================
              5. THINGS THAT ARE NOT WORTH THE RISK

              Sidebar link: Other resources

              Appears directly after the six numbered sections.
          ====================================================== */}

          <section
            id="other-resources"
            aria-labelledby="risk-warnings-heading"
            className="
              mt-12
              w-full
              scroll-mt-8

              sm:mt-14
              lg:mt-16
            "
          >
            {/* HEADING */}

            <h2
              id="risk-warnings-heading"
              className="
                font-inter
                text-[22px]
                font-semibold
                leading-[30px]
                tracking-[0]
                text-[#00897B]

                sm:text-[24px]
                sm:leading-[34px]

                lg:text-[26px]
                lg:leading-[36px]
              "
            >
              {article.riskWarnings.heading}
            </h2>

            {/* BULLET POINTS */}

            <ul
              className="
                mt-5
                list-disc
                space-y-2

                pl-5

                font-inter
                text-[14px]
                font-normal
                leading-[23px]

                text-[#344054]

                marker:text-[#344054]

                sm:text-[16px]
                sm:leading-[26px]

                lg:text-[18px]
                lg:leading-[28px]
              "
            >
              {article.riskWarnings.items.map((item, index) => (
                <li
                  key={`risk-warning-${index}`}
                  className="pl-1"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* =====================================================
              6. CONCLUSION

              Sidebar link: Conclusion

              Final section matching your second screenshot.
          ====================================================== */}

          <section
            id="conclusion"
            aria-labelledby="guide-conclusion-heading"
            className="
              mt-12
              w-full
              scroll-mt-8

              sm:mt-14
              lg:mt-16
            "
          >
            {/* CONCLUSION HEADING */}

            <h2
              id="guide-conclusion-heading"
              className="
                font-inter
                text-[22px]
                font-semibold
                leading-[30px]
                tracking-[0]

                text-[#00897B]

                sm:text-[24px]
                sm:leading-[34px]

                lg:text-[26px]
                lg:leading-[36px]
              "
            >
              {article.conclusion.heading}
            </h2>

            {/* CONCLUSION DESCRIPTION */}

            <p
              className="
                mt-4

                font-inter
                text-[14px]
                font-normal
                leading-[23px]

                !text-[#475467]

                sm:text-[16px]
                sm:leading-[26px]

                lg:text-[18px]
                lg:leading-[28px]
              "
            >
              {article.conclusion.description}
            </p>

            {/* =============================================
                COMPARE WITH BILLGOOSE HIGHLIGHT
            ============================================== */}

            <div
              className="
                mt-5
                w-full

                rounded-[2px]

                border
                border-[#00897B]

                bg-[#F0FDFB]

                p-4

                sm:p-5

                lg:p-6
              "
            >
              <h3
                className="
                  font-inter

                  text-[16px]
                  font-bold
                  leading-[24px]

                  text-[#00897B]

                  sm:text-[17px]
                  sm:leading-[26px]

                  lg:text-[18px]
                  lg:leading-[28px]
                "
              >
                {article.conclusion.highlight.heading}
              </h3>

              <p
                className="
                  mt-2

                  font-inter
                  text-[14px]
                  font-normal
                  leading-[23px]

                  !text-[#475467]

                  sm:text-[15px]
                  sm:leading-[25px]

                  lg:text-[16px]
                  lg:leading-[26px]
                "
              >
                {article.conclusion.highlight.description}
              </p>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
