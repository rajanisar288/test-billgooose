'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowRight, Check, ChevronDown, CircleHelp } from 'lucide-react';

import data from '@/data/content.json';

type CompareService = 'energy' | 'broadband';

export default function CompareFlow() {
  const { compareFlow } = data;

  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedService = searchParams.get('service');

  const selectedService: CompareService = requestedService === 'broadband' ? 'broadband' : 'energy';

  const serviceContent = compareFlow.services[selectedService];

  /*
   * Common fields
   */
  const initialPostcode = searchParams.get('postcode')?.toUpperCase() ?? '';

  const [postcode, setPostcode] = useState(initialPostcode);

  const [selectedAddress, setSelectedAddress] = useState('');

  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  /*
   * Energy fields
   */
  const [occupancyType, setOccupancyType] = useState(
    compareFlow.form.energy.occupancy.defaultValue,
  );

  const [alreadyInProperty, setAlreadyInProperty] = useState(
    compareFlow.form.energy.propertyStatus.defaultValue,
  );

  /*
   * Broadband fields
   */
  const [currentProvider, setCurrentProvider] = useState(
    compareFlow.form.broadband.currentProvider.defaultValue,
  );

  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);

  const [stillInContract, setStillInContract] = useState(
    compareFlow.form.broadband.contractStatus.defaultValue,
  );

  const addressDropdownRef = useRef<HTMLDivElement>(null);

  const providerDropdownRef = useRef<HTMLDivElement>(null);

  const ukPostcodePattern = /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;

  const isPostcodeValid = ukPostcodePattern.test(postcode.trim());

  const isEnergyValid =
    selectedService === 'energy' &&
    isPostcodeValid &&
    selectedAddress.length > 0 &&
    occupancyType.length > 0 &&
    alreadyInProperty.length > 0;

  const isBroadbandValid =
    selectedService === 'broadband' &&
    isPostcodeValid &&
    selectedAddress.length > 0 &&
    currentProvider.length > 0 &&
    stillInContract.length > 0;

  const isFormValid = isEnergyValid || isBroadbandValid;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (addressDropdownRef.current && !addressDropdownRef.current.contains(target)) {
        setAddressDropdownOpen(false);
      }

      if (providerDropdownRef.current && !providerDropdownRef.current.contains(target)) {
        setProviderDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    if (selectedService === 'energy') {
      sessionStorage.setItem(
        'compareFlowDetails',
        JSON.stringify({
          service: 'energy',
          postcode,
          address: selectedAddress,
          occupancyType,
          alreadyInProperty,
        }),
      );

      router.push('/steps/personal-details-form');

      return;
    }

    sessionStorage.setItem(
      'compareFlowDetails',
      JSON.stringify({
        service: 'broadband',
        postcode,
        address: selectedAddress,
        currentProvider,
        stillInContract,
      }),
    );

    router.push('/steps/personal-details-form');
  }

  return (
    <main
      className="
        min-h-screen

        md:px-6

        lg:px-[40px]

        xl:px-[30px]

        2xl:px-[100px]
      "
    >
      <section
        className="
          mx-auto
          grid
          w-full
          max-w-[1380px]
          grid-cols-1
          gap-10

          pb-12
          pl-5
          pr-4
          pt-5

          min-[390px]:pl-6
          min-[390px]:pr-5
          min-[390px]:pt-6

          md:max-w-[760px]
          md:gap-0
          md:px-6
          md:pb-16
          md:pt-6

          lg:max-w-[1380px]
          lg:grid-cols-[minmax(0,510px)_minmax(390px,1fr)]
          lg:items-start
          lg:gap-10
          lg:pb-16
          lg:pl-[50px]
          lg:pr-10
          lg:pt-6

          xl:grid-cols-[510px_648px]
          xl:justify-between
          xl:gap-[70px]
          xl:pl-[50px]
          xl:pr-[50px]
        "
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <div
          className="
            w-full
            max-w-[510px]

            md:max-w-none

            lg:max-w-[510px]
          "
        >
          {/* Back */}
          <Link
            href={compareFlow.backButton.href}
            className="
              inline-flex
              h-10
              w-fit
              items-center
              justify-center
              gap-[1px]

              rounded-full

              bg-white

              py-2
              pl-2
              pr-[14px]

              font-inter
              text-[16px]
              font-medium
              text-[#0D3B66]

              shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

              transition-transform
              duration-200

              hover:-translate-y-0.5

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#EEFFFB]

              md:h-[40px]
              md:text-[13px]

              lg:w-[172px]
              lg:justify-start
              lg:text-[15px]
              lg:font-[500]
            "
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <span
                aria-hidden="true"
                className="
                  h-[10px]
                  w-[10px]
                  shrink-0

                  rotate-45

                  border-b-2
                  border-l-2
                  border-[#00897B]
                "
              />
            </span>

            <span>{compareFlow.backButton.label}</span>
          </Link>

          {/* =================================================
              HEADING
          ================================================== */}
          <div
            className="
              mt-7

              md:mt-7

              lg:mt-[34px]
            "
          >
            <h1
              className="
                max-w-[510px]

                font-red-hat-display
                text-[30px]
                font-[645]
                leading-[36px]
                tracking-[0]
                text-secondary

                min-[360px]:text-[32px]
                min-[360px]:leading-[38px]

                min-[390px]:text-[38px]
                min-[390px]:leading-[44px]

                md:max-w-none
                md:whitespace-nowrap
                md:text-[30px]
                md:font-extrabold
                md:leading-[38px]

                min-[850px]:text-[32px]
                min-[850px]:leading-[40px]

                lg:max-w-[510px]
                lg:whitespace-normal
                lg:text-[50px]
                lg:font-extrabold
                lg:leading-[56px]
              "
            >
              {/* Mobile */}
              <span className="md:hidden">
                <span className="block min-[360px]:whitespace-nowrap">
                  {serviceContent.heading.firstLine}
                </span>

                <span className="block">{serviceContent.heading.secondLine}</span>
              </span>

              {/* Tablet */}
              <span className="hidden md:inline lg:hidden">
                {serviceContent.heading.firstLine} {serviceContent.heading.secondLine}
              </span>

              {/* Desktop */}
              <span className="hidden lg:block">
                <span className="block whitespace-nowrap">{serviceContent.heading.firstLine}</span>

                <span className="block whitespace-nowrap">{serviceContent.heading.secondLine}</span>
              </span>
            </h1>

            <p
              className="
                mt-3
                max-w-[510px]

                font-inter
                text-[14px]
                font-normal
                leading-[21px]
                tracking-[0]
                text-[#252B37]

                min-[390px]:text-[15px]
                min-[390px]:leading-[22px]

                md:max-w-[700px]
                md:text-[14px]
                md:font-semibold
                md:leading-[22px]

                min-[850px]:text-[15px]
                min-[850px]:leading-[23px]

                lg:mt-4
                lg:max-w-[510px]
                lg:text-[18px]
                lg:font-normal
                lg:leading-[25px]
              "
            >
              {serviceContent.description}
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================== */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="
              mt-8
              space-y-5

              md:mt-7
              md:space-y-[18px]

              lg:mt-10
              lg:space-y-5
            "
          >
            {/* Postcode */}
            <div>
              <label
                htmlFor="postcode"
                className="
                  mb-2
                  block

                  font-inter
                  text-[13px]
                  font-[500]
                  leading-5
                  text-[#344054]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.postcode.label}
              </label>

              <div className="relative">
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  value={postcode}
                  onChange={(event) => {
                    setPostcode(event.target.value.toUpperCase());
                  }}
                  placeholder={compareFlow.form.postcode.placeholder}
                  autoComplete="postal-code"
                  aria-invalid={postcode.length > 0 && !isPostcodeValid}
                  className="
                    h-12
                    w-full

                    rounded-full

                    border
                    border-[#D0D5DD]

                    bg-[#FAF9FA]

                    px-[18px]
                    py-[14px]
                    pr-12

                    font-inter
                    text-[15px]
                    font-normal
                    leading-6
                    text-[#344054]

                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                    outline-none
                    transition

                    placeholder:text-[#667085]

                    focus:border-black
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#EEFFFB]

                    md:h-[50px]
                    md:text-[14px]

                    lg:h-[52px]
                    lg:text-[16px]
                  "
                />

                <CircleHelp
                  size={20}
                  strokeWidth={1.33}
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute
                    right-[18px]
                    top-1/2

                    -translate-y-1/2

                    text-[#98A2B3]
                  "
                />
              </div>

              {postcode.length > 0 && !isPostcodeValid && (
                <p className="mt-1.5 font-inter text-[12px] text-red-600">
                  {compareFlow.form.postcode.invalidError}
                </p>
              )}

              <button
                type="button"
                onClick={() => setPostcode('')}
                className="
                  mt-2
                  block

                  font-inter
                  text-[13px]
                  font-normal
                  leading-5

                  text-[#045C9E]

                  underline
                  underline-offset-2

                  md:text-[12px]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.postcode.changeText}
              </button>
            </div>

            {/* =================================================
                ADDRESS
            ================================================== */}
            <div>
              <label
                id="address-label"
                className="
                  mb-2
                  block

                  font-inter
                  text-[13px]
                  font-[500]
                  leading-5
                  text-[#344054]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.address.label}
              </label>

              <div
                ref={addressDropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  aria-labelledby="address-label"
                  aria-expanded={addressDropdownOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setAddressDropdownOpen((current) => !current);

                    setProviderDropdownOpen(false);
                  }}
                  className={`
                    flex
                    h-12
                    w-full
                    items-center
                    justify-between
                    gap-2

                    rounded-full

                    border

                    bg-white

                    px-[18px]
                    py-[14px]

                    text-left

                    font-inter
                    text-[14px]
                    font-normal
                    leading-6

                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                    outline-none
                    transition

                    md:h-[50px]

                    lg:h-[52px]
                    lg:text-[16px]

                    ${
                      addressDropdownOpen
                        ? 'border-black ring-4 ring-[#EEFFFB]'
                        : 'border-[#D0D5DD]'
                    }
                  `}
                >
                  <span
                    className={`min-w-0 truncate ${
                      selectedAddress ? 'text-black' : 'text-[#667085]'
                    }`}
                  >
                    {selectedAddress || compareFlow.form.address.placeholder}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`
                      h-5
                      w-5
                      shrink-0

                      text-[#354052]

                      transition-transform

                      ${addressDropdownOpen ? 'rotate-180' : ''}
                    `}
                    strokeWidth={2}
                  />
                </button>

                {addressDropdownOpen && (
                  <DropdownPanel>
                    {compareFlow.form.address.options.map((address) => {
                      const isSelected = selectedAddress === address.label;

                      return (
                        <button
                          key={address.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedAddress(address.label);

                            setAddressDropdownOpen(false);
                          }}
                          className={`
                              flex
                              min-h-9
                              w-full
                              items-center
                              justify-between
                              gap-2

                              rounded-[30px]

                              px-[9px]
                              py-2

                              text-left

                              font-inter
                              text-[13px]
                              leading-5

                              text-[#344054]

                              transition-colors

                              hover:bg-[#F5F5F5]

                              lg:text-[14px]

                              ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                            `}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Image
                              src="/images/location-icon.png"
                              alt=""
                              width={12}
                              height={14}
                              aria-hidden="true"
                              className="h-[13.66px] w-[12px] shrink-0 object-contain"
                            />

                            <span className="truncate">{address.label}</span>
                          </span>

                          {isSelected && (
                            <Check
                              size={16}
                              strokeWidth={2}
                              className="shrink-0 text-[#00897B]"
                            />
                          )}
                        </button>
                      );
                    })}
                  </DropdownPanel>
                )}
              </div>

              <button
                type="button"
                className="
                  mt-2
                  block

                  font-inter
                  text-[13px]
                  font-[500]
                  leading-5
                  text-[#045C9E]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.address.manualText}
              </button>
            </div>

            {/* =================================================
                ENERGY ONLY
            ================================================== */}
            {selectedService === 'energy' && (
              <>
                <fieldset>
                  <legend
                    className="
                      mb-2

                      font-inter
                      text-[13px]
                      font-medium
                      leading-5
                      text-[#344054]

                      lg:text-[14px]
                    "
                  >
                    {compareFlow.form.energy.occupancy.label}
                  </legend>

                  <div className="flex flex-wrap items-center gap-2">
                    {compareFlow.form.energy.occupancy.options.map((option) => (
                      <ChoicePill
                        key={option.id}
                        label={option.label}
                        selected={occupancyType === option.value}
                        onClick={() => setOccupancyType(option.value)}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="sr-only">
                    {compareFlow.form.energy.propertyStatus.label}
                  </legend>

                  <BinaryChoiceField
                    label={compareFlow.form.energy.propertyStatus.label}
                    value={alreadyInProperty}
                    options={compareFlow.form.energy.propertyStatus.options}
                    onChange={setAlreadyInProperty}
                  />
                </fieldset>
              </>
            )}

            {/* =================================================
                BROADBAND ONLY
            ================================================== */}
            {selectedService === 'broadband' && (
              <>
                {/* Current provider */}
                <div>
                  <label
                    id="provider-label"
                    className="
                      mb-2
                      block

                      font-inter
                      text-[13px]
                      font-[500]
                      leading-5
                      text-[#344054]

                      lg:text-[14px]
                    "
                  >
                    {compareFlow.form.broadband.currentProvider.label}
                  </label>

                  <div
                    ref={providerDropdownRef}
                    className="relative"
                  >
                    <button
                      type="button"
                      aria-labelledby="provider-label"
                      aria-expanded={providerDropdownOpen}
                      aria-haspopup="listbox"
                      onClick={() => {
                        setProviderDropdownOpen((current) => !current);

                        setAddressDropdownOpen(false);
                      }}
                      className={`
                        flex
                        h-12
                        w-full
                        items-center
                        justify-between
                        gap-2

                        rounded-full

                        border

                        bg-white

                        px-[18px]

                        text-left

                        font-inter
                        text-[14px]
                        font-normal
                        text-[#344054]

                        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                        outline-none
                        transition

                        md:h-[50px]

                        lg:h-[52px]
                        lg:text-[16px]

                        ${
                          providerDropdownOpen
                            ? 'border-black ring-4 ring-[#EEFFFB]'
                            : 'border-[#D0D5DD]'
                        }
                      `}
                    >
                      <span className={currentProvider ? 'text-[#101828]' : 'text-[#667085]'}>
                        {currentProvider
                          ? compareFlow.form.broadband.currentProvider.options.find(
                              (option) => option.value === currentProvider,
                            )?.label
                          : compareFlow.form.broadband.currentProvider.placeholder}
                      </span>

                      <ChevronDown
                        aria-hidden="true"
                        className={`
                          h-5
                          w-5

                          shrink-0

                          text-[#354052]

                          transition-transform

                          ${providerDropdownOpen ? 'rotate-180' : ''}
                        `}
                        strokeWidth={2}
                      />
                    </button>

                    {providerDropdownOpen && (
                      <DropdownPanel>
                        {compareFlow.form.broadband.currentProvider.options.map((provider) => {
                          const isSelected = currentProvider === provider.value;

                          return (
                            <button
                              key={provider.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setCurrentProvider(provider.value);

                                setProviderDropdownOpen(false);
                              }}
                              className={`
                                  flex
                                  min-h-10
                                  w-full
                                  items-center
                                  justify-between

                                  rounded-[30px]

                                  px-3
                                  py-2

                                  font-inter
                                  text-[13px]
                                  text-[#344054]

                                  transition-colors

                                  hover:bg-[#F5F5F5]

                                  lg:text-[14px]

                                  ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                                `}
                            >
                              <span>{provider.label}</span>

                              {isSelected && (
                                <Check
                                  size={16}
                                  strokeWidth={2}
                                  className="text-[#00897B]"
                                />
                              )}
                            </button>
                          );
                        })}
                      </DropdownPanel>
                    )}
                  </div>
                </div>

                {/* Contract status */}
                <fieldset>
                  <legend className="sr-only">
                    {compareFlow.form.broadband.contractStatus.label}
                  </legend>

                  <BinaryChoiceField
                    label={compareFlow.form.broadband.contractStatus.label}
                    value={stillInContract}
                    options={compareFlow.form.broadband.contractStatus.options}
                    onChange={setStillInContract}
                  />

                  <p
                    className="
                      mt-2

                      font-inter
                      text-[11px]
                      font-normal
                      leading-4
                      text-[#667085]

                      lg:text-[12px]
                    "
                  >
                    {compareFlow.form.broadband.contractStatus.helperText}
                  </p>
                </fieldset>
              </>
            )}

            {/* Continue */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="
                inline-flex
                h-12
                w-full
                items-center
                justify-center
                gap-2

                rounded-full

                border

                px-5

                font-inter
                text-[14px]
                font-semibold
                leading-5
                text-white

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                transition-all
                duration-200

                enabled:border-[#00897B]
                enabled:bg-[#00897B]

                enabled:hover:-translate-y-0.5

                disabled:cursor-not-allowed
                disabled:border-[#73BEB7]
                disabled:bg-[#73BEB7]

                md:h-[50px]
                md:text-[13px]

                lg:h-12
                lg:text-[14px]
              "
            >
              <span>{compareFlow.form.continueButton.label}</span>

              <ArrowRight
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </form>
        </div>

        {/* =====================================================
            RIGHT IMAGE - DESKTOP/LAPTOP
        ====================================================== */}
        <div
          className="
            hidden

            lg:block
            lg:w-full
            lg:justify-self-end

            xl:h-[731px]
            xl:w-[648px]
          "
        >
          {selectedService === 'broadband' ? (
            <div
              className="
      relative

      ml-auto
      mt-4

      aspect-[568/691]
      w-full
      max-w-[568px]

      overflow-hidden

      xl:mt-10
      xl:h-[691px]
      xl:w-[568px]
    "
            >
              <Image
                src={serviceContent.image.src}
                alt={serviceContent.image.alt}
                fill
                priority
                sizes="
                  (max-width:1023px) 0px,
                  (max-width:1279px) 45vw,
                  568px
                "
                className="
                  object-cover
                  object-center
                "
              />
            </div>
          ) : (
            /*
             * Energy:
             * preserve your existing artwork styling
             */
            <div
              className="
                lg:mx-0
                lg:w-full
                lg:max-w-none
                lg:rounded-[30px]
                lg:p-[20px_24px]

                xl:h-[731px]
                xl:w-[648px]
                xl:p-[20px_40px]
              "
            >
              <div
                className="
                  relative

                  aspect-[568/691]
                  w-full

                  overflow-hidden

                  rounded-[22px]

                  bg-[#E9EAEB]

                  lg:rounded-[30px]

                  xl:h-[691px]
                  xl:w-[568px]
                "
              >
                <Image
                  src={serviceContent.image.src}
                  alt={serviceContent.image.alt}
                  fill
                  priority
                  sizes="
                    (max-width:1023px) 0px,
                    (max-width:1279px) 45vw,
                    568px
                  "
                  className="
                    scale-[0.92]

                    bg-[#E9EAEB]

                    object-contain
                    object-center
                  "
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   DROPDOWN PANEL
========================================================= */

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="listbox"
      className="
        absolute
        left-0
        top-[calc(100%+8px)]
        z-50

        max-h-[220px]
        w-full

        overflow-y-auto

        rounded-[20px]

        bg-white

        p-[5px]

        shadow-[0px_2px_4px_0px_rgba(84,84,84,0.15),0px_7px_7px_0px_rgba(84,84,84,0.13),0px_15px_9px_0px_rgba(84,84,84,0.08),0px_27px_11px_0px_rgba(84,84,84,0.02)]

        lg:max-h-[190px]
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   ENERGY CHOICE
========================================================= */

type ChoicePillProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function ChoicePill({ label, selected, onClick }: ChoicePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        inline-flex
        h-9
        items-center
        justify-center
        gap-2

        rounded-full

        border

        bg-white

        px-3

        font-inter
        text-[13px]
        font-normal
        leading-5

        transition-colors

        md:h-[34px]
        md:text-[12px]

        lg:h-9
        lg:text-[14px]

        ${selected ? 'border-[#00897B] text-[#344054]' : 'border-[#D0D5DD] text-[#667085]'}
      `}
    >
      <span
        className={`
          flex
          h-4
          w-4
          items-center
          justify-center

          rounded-full

          border

          ${selected ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
        `}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[#00897B]" />}
      </span>

      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   YES / NO FIELD
========================================================= */

type BinaryChoiceFieldProps = {
  label: string;
  value: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
};

function BinaryChoiceField({ label, value, options, onChange }: BinaryChoiceFieldProps) {
  return (
    <div
      className="
        flex
        min-h-12
        w-full
        items-center
        justify-between
        gap-[18px]

        rounded-full

        border
        border-[#D0D5DD]

        bg-white

        py-[9px]
        pl-4
        pr-2

        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

        min-[390px]:pl-6

        md:h-[50px]
        md:min-h-[50px]
        md:pl-5

        lg:h-[52px]
        lg:min-h-[52px]
      "
    >
      <span
        className="
          font-inter
          text-[12px]
          font-medium
          leading-5
          text-[#344054]

          min-[390px]:text-[13px]

          lg:text-[14px]
        "
      >
        {label}
      </span>

      <div className="flex h-[34px] shrink-0 items-center">
        {options.map((option) => (
          <PropertyOption
            key={option.id}
            label={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

type PropertyOptionProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function PropertyOption({ label, selected, onClick }: PropertyOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        inline-flex
        h-[34px]
        min-w-[39px]
        items-center
        justify-center

        rounded-full

        border

        px-3
        py-2

        font-inter
        text-[13px]
        leading-none

        transition-colors

        md:text-[12px]

        lg:text-[14px]

        ${
          selected
            ? 'border-[#00897B] bg-[#E6F4F2] font-extrabold text-[#00897B]'
            : 'border-transparent bg-transparent font-medium text-[#667085]'
        }
      `}
    >
      {label}
    </button>
  );
}
