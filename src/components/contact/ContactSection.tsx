'use client';

import { useState } from 'react';

import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

import data from '@/data/content.json';

type InfoItem = {
  id: string;
  type: 'phone' | 'email' | 'address';
  label: string;
  href?: string;
};

export default function ContactSection() {
  const { contact } = data;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Wire up your API / email service here.
    // eslint-disable-next-line no-console
    console.log('Contact form submitted:', form);
  }

  function renderIcon(type: InfoItem['type']) {
    const commonProps = {
      'aria-hidden': true,
      className: 'h-5 w-5',
      strokeWidth: 2,
    } as const;

    if (type === 'phone') return <Phone {...commonProps} />;
    if (type === 'email') return <Mail {...commonProps} />;
    return <MapPin {...commonProps} />;
  }

  return (
    <section className="w-full bg-white px-3 pb-12 pt-6 sm:px-5 sm:pb-14 sm:pt-8 lg:px-8 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <div
          className="
            grid
            grid-cols-1
            gap-10

            lg:grid-cols-[1fr_1.15fr]
            lg:gap-16

            xl:gap-20
          "
        >
          {/* =============================================
              LEFT — CONTACT INFO
          ============================================== */}
          <div className="flex flex-col">
            <h2
              className="
                font-red-hat-display
                font-extrabold
                tracking-[0]

                text-secondary

                text-[32px]
                leading-[1.15]

                sm:text-[40px]
                sm:leading-[1.15]

                lg:text-[48px]
                lg:leading-[1.15]
              "
            >
              {contact.info.heading}
            </h2>

            <p
              className="
                mt-3
                max-w-[420px]

                font-red-hat-display
                text-[14px]
                font-[467]
                leading-[1.5]

                text-[#475467]

                sm:mt-4
                sm:text-[15px]

                lg:text-[16px]
              "
            >
              {contact.info.description}
            </p>

            <ul className="mt-8 flex flex-col gap-5 sm:mt-10 sm:gap-6">
              {(contact.info.items as InfoItem[]).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4"
                >
                  <span
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-[#105089]

                      text-white

                      sm:h-12
                      sm:w-12
                    "
                  >
                    {renderIcon(item.type)}
                  </span>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="
                        font-red-hat-display
                        text-[16px]
                        font-extrabold
                        leading-[100%]
                        tracking-[0]

                        text-[#0C3354]

                        align-middle

                        transition-colors

                        hover:text-primary

                        sm:text-[17px]

                        lg:text-[18px]
                      "
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className="
                        max-w-[240px]

                        font-red-hat-display
                        text-[16px]
                        font-extrabold
                        leading-[100%]
                        tracking-[0]

                        text-[#0C3354]

                        align-middle

                        sm:text-[17px]

                        lg:text-[18px]
                      "
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* =============================================
              RIGHT — FORM
          ============================================== */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 sm:gap-6"
            noValidate
          >
            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="
                    font-red-hat-display
                    text-[12px]
                    font-[645]
                    leading-[1.4]
                    tracking-[0]

                    text-[#344054]

                    sm:text-[13px]
                  "
                >
                  {contact.form.fields.firstName.label}
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder={contact.form.fields.firstName.placeholder}
                  className="
                    mt-2
                    h-[52px]
                    w-full

                    rounded-[26px]

                    border
                    border-[#EAECF0]

                    bg-white

                    px-5

                    font-red-hat-display
                    text-[14px]
                    font-[467]
                    leading-[1.4]
                    tracking-[0]

                    text-[#101828]

                    placeholder:text-[#98A2B3]

                    transition-colors

                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20

                    sm:h-[56px]
                    sm:text-[15px]
                  "
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="
                    font-red-hat-display
                    text-[12px]
                    font-[645]
                    leading-[1.4]
                    tracking-[0]

                    text-[#344054]

                    sm:text-[13px]
                  "
                >
                  {contact.form.fields.lastName.label}
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder={contact.form.fields.lastName.placeholder}
                  className="
                    mt-2
                    h-[52px]
                    w-full

                    rounded-[26px]

                    border
                    border-[#EAECF0]

                    bg-white

                    px-5

                    font-red-hat-display
                    text-[14px]
                    font-[467]
                    leading-[1.4]
                    tracking-[0]

                    text-[#101828]

                    placeholder:text-[#98A2B3]

                    transition-colors

                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20

                    sm:h-[56px]
                    sm:text-[15px]
                  "
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="
                  font-red-hat-display
                  text-[12px]
                  font-[645]
                  leading-[1.4]
                  tracking-[0]

                  text-[#344054]

                  sm:text-[13px]
                "
              >
                {contact.form.fields.email.label}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={contact.form.fields.email.placeholder}
                className="
                  mt-2
                  h-[52px]
                  w-full

                  rounded-[26px]

                  border
                  border-[#EAECF0]

                  bg-white

                  px-5

                  font-red-hat-display
                  text-[14px]
                  font-[467]
                  leading-[1.4]
                  tracking-[0]

                  text-[#101828]

                  placeholder:text-[#98A2B3]

                  transition-colors

                  focus:border-primary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20

                  sm:h-[56px]
                  sm:text-[15px]
                "
              />
            </div>

            {/* MESSAGE */}
            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="
                  font-red-hat-display
                  text-[12px]
                  font-[645]
                  leading-[1.4]
                  tracking-[0]

                  text-[#344054]

                  sm:text-[13px]
                "
              >
                {contact.form.fields.message.label}
              </label>

              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={contact.form.fields.message.placeholder}
                rows={6}
                className="
                  mt-2
                  w-full

                  resize-none

                  rounded-[20px]

                  border
                  border-[#EAECF0]

                  bg-white

                  px-5
                  py-4

                  font-red-hat-display
                  text-[14px]
                  font-[467]
                  leading-[1.5]
                  tracking-[0]

                  text-[#101828]

                  placeholder:text-[#98A2B3]

                  transition-colors

                  focus:border-primary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20

                  sm:rounded-[24px]
                  sm:text-[15px]
                "
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="
                mt-1

                flex
                h-[52px]
                w-full

                items-center
                justify-center
                gap-2

                rounded-[26px]

                bg-[#00897B]

                font-red-hat-display
                text-[14px]
                font-[645]
                leading-[1.4]
                tracking-[0]

                text-white

                transition-colors

                hover:bg-[#00796D]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2

                sm:h-[56px]
                sm:text-[15px]

                lg:text-[16px]
              "
            >
              <span>{contact.form.submitLabel}</span>

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
