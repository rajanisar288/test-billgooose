'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import data from '@/data/content.json';

export default function Newsletter() {
  const { newsletter } = data;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedEmail = email.trim();

    if (!formattedEmail) {
      setEmailError(newsletter.form.emptyError);
      setSubmitted(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formattedEmail)) {
      setEmailError(newsletter.form.invalidError);
      setSubmitted(false);
      return;
    }

    setEmailError('');
    setSubmitted(true);

    // Add the newsletter API request here later.
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setSubmitted(false);

    if (emailError) {
      setEmailError('');
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="w-full border-b border-[#E0E0E0] bg-[#EFF7FF]">
        <div className="mx-auto flex min-h-[214px] w-full max-w-[1440px] items-center px-3 py-[22px] min-[360px]:min-h-[224px] min-[360px]:px-4 min-[360px]:py-6 min-[390px]:min-h-[236px] min-[390px]:px-5 min-[390px]:py-[26px] lg:min-h-[286px] lg:px-20 lg:py-24">
          <div className="flex w-full flex-col lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            {/* Left content */}
            <div>
              <h2 className="font-red-hat-display text-[23px] font-bold leading-[34px] tracking-[0] text-secondary min-[360px]:text-[25px] min-[360px]:leading-[38px] min-[390px]:text-[28px] min-[390px]:leading-[44px] lg:text-[44px] lg:font-bold lg:leading-[52px] lg:tracking-[-1px]">
                {newsletter.heading}
              </h2>

              <p className="mt-1.5 max-w-[310px] font-red-hat-display text-[11px] font-[467] leading-[15px] tracking-[0] text-[#576574] min-[360px]:max-w-[345px] min-[360px]:text-[12px] min-[360px]:leading-[16px] min-[390px]:mt-1 min-[390px]:max-w-[400px] min-[390px]:text-[14px] min-[390px]:leading-[100%] lg:mt-4 lg:max-w-none lg:text-[18px] lg:leading-[1.5]">
                {newsletter.description}
              </p>
            </div>

            {/* Subscription form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-5 w-full lg:mt-0 lg:w-[494px]"
            >
              <div className="flex w-full items-center gap-2 min-[360px]:gap-2.5 min-[390px]:gap-3 lg:gap-5">
                <div className="min-w-0 flex-1 lg:w-[360px] lg:flex-none">
                  <label
                    htmlFor="newsletter-email"
                    className="sr-only"
                  >
                    {newsletter.form.label}
                  </label>

                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    placeholder={newsletter.form.placeholder}
                    autoComplete="email"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={
                      emailError ? 'newsletter-email-error' : 'newsletter-helper-text'
                    }
                    className={`h-11 w-full rounded-[100px] border bg-white px-[14px] py-3 font-red-hat-display text-[11px] text-secondary shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[#667085] min-[360px]:h-[46px] min-[360px]:px-4 min-[360px]:text-[12px] min-[390px]:h-12 min-[390px]:px-[18px] min-[390px]:text-[14px] lg:h-12 ${
                      emailError ? 'border-red-400' : 'border-[#D0D5DD] focus:border-primary'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-11 w-[96px] shrink-0 items-center justify-center rounded-[100px] border border-[#00897B] bg-[#00897B] px-3 py-3 font-red-hat-display text-[11px] font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#00796D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[360px]:h-[46px] min-[360px]:w-[104px] min-[360px]:text-[12px] min-[390px]:h-12 min-[390px]:w-[114px] min-[390px]:px-5 min-[390px]:text-[14px]"
                >
                  {newsletter.form.buttonLabel}
                </button>
              </div>

              {emailError ? (
                <p
                  id="newsletter-email-error"
                  className="mt-2 font-red-hat-display text-[10px] leading-[14px] text-red-600 min-[360px]:text-[11px] min-[390px]:text-[14px] min-[390px]:leading-[1.4]"
                >
                  {emailError}
                </p>
              ) : submitted ? (
                <p className="mt-2 font-red-hat-display text-[10px] leading-[14px] text-primary min-[360px]:text-[11px] min-[390px]:text-[14px] min-[390px]:leading-[1.4]">
                  {newsletter.form.successMessage}
                </p>
              ) : (
                <p
                  id="newsletter-helper-text"
                  className="mt-2 font-red-hat-display text-[10px] leading-[14px] text-[#475467] min-[360px]:text-[11px] min-[390px]:text-[14px] min-[390px]:leading-[1.4]"
                >
                  {newsletter.form.helperText}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
