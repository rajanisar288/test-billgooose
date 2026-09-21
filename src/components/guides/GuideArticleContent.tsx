'use client';

import { useEffect, useState, type FormEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Download, FileText, Link2 } from 'lucide-react';

import data from '@/data/content.json';

/* =========================================================
   TYPES
========================================================= */

export type Block =
  | { type: 'paragraph'; id?: string; text: string }
  | { type: 'section'; id?: string; heading: string; paragraphs: string[] }
  | { type: 'callout'; variant?: 'teal' | 'navy' | 'warning'; heading: string; text: string }
  | {
      type: 'numberedList';
      id?: string;
      heading: string;
      items: { number: string; title: string; description: string }[];
    }
  | {
      type: 'table';
      id?: string;
      heading: string;
      columns: string[];
      rows: { id: string; cells: string[] }[];
      note?: string;
    }
  | { type: 'bulletList'; id?: string; heading: string; items: string[] }
  | {
      type: 'conclusion';
      id?: string;
      heading: string;
      text: string;
      highlightHeading: string;
      highlightText: string;
    };

type Sidebar = {
  heading: string;
  links: { id: string; label: string }[];
};

type GuideArticleContentProps = {
  sidebar: Sidebar;
  blocks: Block[];
};

/* =========================================================
   COMPONENT
========================================================= */

export default function GuideArticleContent({ sidebar, blocks }: GuideArticleContentProps) {
  const { footer } = data;

  const [activeSection, setActiveSection] = useState(sidebar.links[0]?.id ?? '');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  /* Active section tracking on scroll */
  useEffect(() => {
    const sectionIds = sidebar.links.map((link) => link.id);

    let frame: number | null = null;

    const update = () => {
      const offset = 180;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }

      const articleEl = document.getElementById('guide-article-content');
      if (articleEl && articleEl.getBoundingClientRect().bottom <= window.innerHeight + 10) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActiveSection((prev) => (prev === current ? prev : current));
      frame = null;
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sidebar.links]);

  function handleSectionClick(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleDownload() {
    const text = blocks
      .map((b) => {
        switch (b.type) {
          case 'paragraph':
            return b.text;
          case 'section':
            return [b.heading, ...b.paragraphs].join('\n\n');
          case 'callout':
            return [b.heading, b.text].join('\n\n');
          case 'numberedList':
            return [
              b.heading,
              ...b.items.map((i) => `${i.number}. ${i.title}\n${i.description}`),
            ].join('\n\n');
          case 'table':
            return [
              b.heading,
              b.columns.join(' | '),
              ...b.rows.map((r) => r.cells.join(' | ')),
              b.note ?? '',
            ]
              .filter(Boolean)
              .join('\n');
          case 'bulletList':
            return [b.heading, ...b.items.map((i) => `• ${i}`)].join('\n\n');
          case 'conclusion':
            return [b.heading, b.text, b.highlightHeading, b.highlightText].join('\n\n');
          default:
            return '';
        }
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'billgoose-guide.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setNewsletterMessage('Please enter your email address.');
      return;
    }
    setNewsletterMessage('Newsletter subscriptions are not available yet.');
  }

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
        {/* SIDEBAR */}
        <aside className="w-full lg:sticky lg:top-6 lg:w-[280px] lg:self-start">
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
                    aria-current={isActive ? 'location' : undefined}
                    className={`
                      w-full text-left font-inter
                      text-[14px] leading-[22px]
                      transition-colors duration-200
                      lg:text-[16px] lg:leading-[24px]
                      ${isActive ? 'font-semibold !text-[#00897B]' : 'font-semibold !text-[#475467] hover:!text-[#00897B]'}
                    `}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="my-7 h-px w-full bg-[#EAECF0]" />

          <div className="w-full rounded-[12px] bg-[#F9FAFB] p-4 lg:min-h-[118px] lg:w-[280px]">
            <div className="flex items-start gap-2">
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border-4 border-[#D8F3F0] bg-[#D8F3F0]">
                <FileText
                  aria-hidden="true"
                  className="h-4 w-4 text-[#00897B]"
                  strokeWidth={1.8}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-inter text-[13px] font-medium leading-[20px] text-[#344054] lg:text-[14px]">
                  Downloadable guide
                </p>
                <p className="font-inter text-[11px] leading-4 text-[#667085]">Full PDF summary</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="mt-3 flex h-[36px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#D0D5DD] bg-white px-[14px] py-2 font-inter text-[13px] font-medium leading-5 text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors duration-200 hover:bg-[#F9FAFB]"
            >
              <span>Download</span>
              <Download
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </button>
          </div>

          <div className="mt-7">
            <h3 className="font-inter text-[14px] font-semibold leading-5 text-[#00897B] lg:text-[16px] lg:leading-6">
              Subscribe to our newsletter
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
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="h-[48px] w-full rounded-full border border-[#D0D5DD] bg-white px-4 font-inter text-[14px] leading-5 text-[#344054] placeholder:text-[#667085] outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
              />
              <button
                type="submit"
                className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#00897B] font-inter text-[14px] font-semibold leading-5 text-white transition-colors duration-200 hover:bg-[#00766B]"
              >
                Subscribe
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

          <div className="my-7 h-px w-full bg-[#EAECF0]" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={linkCopied ? 'Guide link copied' : 'Copy guide link'}
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

        {/* ARTICLE BODY — RENDERED FROM BLOCKS */}
        <article
          id="guide-article-content"
          className="min-w-0 w-full font-inter text-[15px] font-normal leading-[24px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px] xl:text-[20px] xl:leading-[30px]"
        >
          {blocks.map((block, index) => (
            <BlockRenderer
              key={index}
              block={block}
            />
          ))}
        </article>
      </div>
    </section>
  );
}

/* =========================================================
   BLOCK RENDERER
========================================================= */

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p
          id={block.id}
          className="scroll-mt-8 font-inter text-[16px] font-normal leading-[26px] text-[#475467] lg:text-[18px] lg:leading-[28px] xl:text-[20px] xl:leading-[30px]"
        >
          {block.text}
        </p>
      );

    case 'section':
      return (
        <div
          id={block.id}
          className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
        >
          <h2 className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]">
            {block.heading}
          </h2>
          <div className="mt-5 space-y-5">
            {block.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-inter text-[15px] font-normal leading-[24px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    case 'callout': {
      const variants = {
        teal: {
          wrapper: 'bg-[#E8F7F7]',
          heading: 'text-[#00897B]',
          text: 'text-[#475467]',
        },
        navy: {
          wrapper: 'bg-[#153C64]',
          heading: '!text-white',
          text: '!text-white',
        },
        warning: {
          wrapper: 'bg-[#FEF3F2]',
          heading: 'text-[#B42318]',
          text: 'text-[#B42318]',
        },
      } as const;

      const v = variants[block.variant ?? 'teal'];

      return (
        <div className={`mt-8 rounded-[16px] p-5 sm:p-6 lg:p-[30px] ${v.wrapper}`}>
          <h2
            className={`font-inter text-[22px] font-bold leading-[30px] lg:text-[26px] lg:leading-[36px] ${v.heading}`}
          >
            {block.heading}
          </h2>
          <p className="mt-4 font-inter text-[15px] leading-[24px] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px] ${v.text}">
            {block.text}
          </p>
        </div>
      );
    }

    case 'numberedList':
      return (
        <section
          id={block.id}
          className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
        >
          <h2 className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]">
            {block.heading}
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="flex w-full items-start gap-4 rounded-[16px] bg-[#F9FAFB] p-4 sm:gap-5 sm:p-5 lg:gap-6 lg:p-6"
              >
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[9px] bg-[#00897B] font-inter text-[20px] font-bold leading-[28px] text-white lg:h-[48px] lg:w-[48px]">
                  {item.number}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-inter text-[17px] font-semibold leading-[26px] text-[#101828] lg:text-[20px] lg:leading-[30px]">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-inter text-[14px] leading-[22px] text-[#475467] sm:text-[15px] sm:leading-[24px] lg:text-[18px] lg:leading-[28px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'table':
      return (
        <section
          id={block.id}
          className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
        >
          <h2 className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]">
            {block.heading}
          </h2>
          <div className="mt-6 w-full overflow-x-auto rounded-[14px] border border-[#EAECF0] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
            <table className="w-full min-w-[620px] table-fixed border-collapse text-left font-inter">
              <thead className="bg-white">
                <tr>
                  {block.columns.map((col, i) => (
                    <th
                      key={i}
                      className="border-b border-[#EAECF0] px-4 py-3 align-middle font-inter text-[12px] font-medium leading-[18px] text-[#344054] sm:px-5 sm:text-[13px] lg:px-6 lg:text-[14px]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} ${
                      index !== block.rows.length - 1 ? 'border-b border-[#EAECF0]' : ''
                    }`}
                  >
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-3 align-middle font-inter text-[12px] font-normal leading-[19px] text-[#475467] sm:px-5 sm:py-4 sm:text-[13px] lg:px-6 lg:text-[14px]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && (
            <p className="mt-4 font-inter text-[14px] leading-[22px] text-[#475467] lg:text-[16px] lg:leading-[26px]">
              {block.note}
            </p>
          )}
        </section>
      );

    case 'bulletList':
      return (
        <section
          id={block.id}
          className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
        >
          <h2 className="font-inter text-[24px] font-bold leading-[32px] text-[#101828] lg:text-[28px] lg:leading-[38px]">
            {block.heading}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 font-inter text-[15px] leading-[24px] text-[#475467] marker:text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      );

    case 'conclusion':
      return (
        <section
          id={block.id}
          className="mt-12 scroll-mt-8 sm:mt-14 lg:mt-16"
        >
          <h2 className="font-inter text-[22px] font-semibold leading-[30px] text-[#00897B] sm:text-[24px] lg:text-[26px] lg:leading-[36px]">
            {block.heading}
          </h2>
          <p className="mt-4 font-inter text-[14px] leading-[23px] text-[#475467] sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            {block.text}
          </p>
          <div className="mt-5 w-full rounded-[2px] border border-[#00897B] bg-[#F0FDFB] p-4 sm:p-5 lg:p-6">
            <h3 className="font-inter text-[16px] font-bold leading-[24px] text-[#00897B] lg:text-[18px] lg:leading-[28px]">
              {block.highlightHeading}
            </h3>
            <p className="mt-2 font-inter text-[14px] leading-[23px] text-[#475467] sm:text-[15px] sm:leading-[25px] lg:text-[16px] lg:leading-[26px]">
              {block.highlightText}
            </p>
          </div>
        </section>
      );

    default:
      return null;
  }
}
