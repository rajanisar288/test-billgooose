'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowRight, CalendarDays, Check, ChevronDown } from 'lucide-react';

import { storeJourney } from '@/constants/shared';
import data from '@/data/content.json';
import { MoveStatus, type Address } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';

type CompareService = 'energy' | 'broadband' | 'insurance';

export default function CompareFlow() {
  const { compareFlow } = data;

  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedService = searchParams.get('service');
  const requestedFlow = searchParams.get('flow');

  const selectedService: CompareService =
    requestedService === 'broadband'
      ? 'broadband'
      : requestedService === 'insurance'
        ? 'insurance'
        : 'energy';

  const isBundleFlow = requestedFlow === 'bundle';

  const serviceContent =
    selectedService === 'insurance'
      ? compareFlow.services.energy
      : compareFlow.services[selectedService];

  /* =========================================================
     COMMON STATE
  ========================================================= */

  const initialPostcode = searchParams.get('postcode')?.toUpperCase() ?? '';

  const [postcode, setPostcode] = useState(initialPostcode);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  /*
   * Bundle Bills only:
   *
   * These controls are local to Bundle because the current
   * content.json does not contain compareFlow.form.occupancy
   * or compareFlow.form.propertyStatus.
   *
   * Normal Energy and Broadband remain untouched.
   */
  const bundleOccupancyOptions = [
    {
      id: 'rental',
      label: 'Rental',
      value: 'rental',
    },
    {
      id: 'homeowner',
      label: 'Homeowner',
      value: 'homeowner',
    },
  ];

  const bundlePropertyStatusOptions = [
    {
      id: 'yes',
      label: 'Yes',
      value: 'yes',
    },
    {
      id: 'no',
      label: 'No',
      value: 'no',
    },
  ];

  const [occupancyType, setOccupancyType] = useState('homeowner');

  const [alreadyInProperty, setAlreadyInProperty] = useState('yes');

  const [moveInDate, setMoveInDate] = useState('');

  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);

  const [addressOptions, setAddressOptions] = useState<
    Array<{
      id: string;
      label: string;
      value: string;
      fullAddressObject: Address;
    }>
  >([]);

  /* =========================================================
     ENERGY STATE
  ========================================================= */

  const [energyServiceType, setEnergyServiceType] = useState(
    compareFlow.form.energy.serviceType.defaultValue,
  );

  const [energyServiceDropdownOpen, setEnergyServiceDropdownOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(
    compareFlow.form.energy.paymentMethod.defaultValue,
  );

  /* =========================================================
     BROADBAND STATE
  ========================================================= */

  const [currentProvider, setCurrentProvider] = useState(
    compareFlow.form.broadband.currentProvider.defaultValue,
  );

  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);

  const [stillInContract, setStillInContract] = useState(
    compareFlow.form.broadband.contractStatus.defaultValue,
  );

  const hasNoCurrentProvider = currentProvider === 'no-current-provider';

  const shouldShowContractStatus =
    selectedService === 'broadband' && Boolean(currentProvider) && !hasNoCurrentProvider;

  /* =========================================================
     INSURANCE STATE
  ========================================================= */

  const insuranceTypeOptions = [
    { id: 'life-insurance', label: 'Life Insurance', value: 'life-insurance' },
    { id: 'home-insurance', label: 'Home Insurance', value: 'home-insurance' },
    { id: 'vehicle-insurance', label: 'Vehicle Insurance', value: 'vehicle-insurance' },
    { id: 'health-insurance', label: 'Health Insurance', value: 'health-insurance' },
  ];

  const [email, setEmail] = useState('');
  const [insuranceType, setInsuranceType] = useState('life-insurance');
  const [insuranceTypeDropdownOpen, setInsuranceTypeDropdownOpen] = useState(false);

  /* =========================================================
     REFS
  ========================================================= */

  const addressDropdownRef = useRef<HTMLDivElement>(null);

  const providerDropdownRef = useRef<HTMLDivElement>(null);

  const energyServiceDropdownRef = useRef<HTMLDivElement>(null);

  const insuranceTypeDropdownRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     VALIDATION
  ========================================================= */

  const ukPostcodePattern = /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;

  const isPostcodeValid = ukPostcodePattern.test(postcode.trim());

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailPattern.test(email.trim());

  const isFormValid =
    selectedService === 'insurance'
      ? Boolean(isPostcodeValid && selectedAddress && isEmailValid && insuranceType)
      : selectedService === 'broadband'
        ? Boolean(
            isPostcodeValid &&
            selectedAddress &&
            currentProvider &&
            (hasNoCurrentProvider || stillInContract),
          )
        : Boolean(
            isPostcodeValid &&
            selectedAddress &&
            occupancyType.length > 0 &&
            alreadyInProperty.length > 0,
          );

  /* =========================================================
     API FUNCTIONS
  ========================================================= */

  async function getAddresses(postalCode: string) {
    if (!postalCode) {
      return;
    }

    try {
      setIsAddressLoading(true);

      setPostcode(postalCode);

      const journeyId = localStorage.getItem(storeJourney);

      const res = await journeyApi.getAddress(journeyId!, {
        postcode: postalCode,
      });

      setAddressOptions(
        res.data.addresses.map((address: any) => ({
          id: address.uprn || address.providerReference || crypto.randomUUID(),

          label: address.fullAddress,

          value: address.fullAddress,

          fullAddressObject: address,
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddressLoading(false);
    }
  }

  const handlePostalCode = () => {
    if (postcode && isPostcodeValid) {
      getAddresses(postcode);
    }
  };

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const urlPostcode = searchParams.get('postcode') || '';

    if (urlPostcode) {
      getAddresses(urlPostcode);
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (addressDropdownRef.current && !addressDropdownRef.current.contains(target)) {
        setAddressDropdownOpen(false);
      }

      if (providerDropdownRef.current && !providerDropdownRef.current.contains(target)) {
        setProviderDropdownOpen(false);
      }

      if (energyServiceDropdownRef.current && !energyServiceDropdownRef.current.contains(target)) {
        setEnergyServiceDropdownOpen(false);
      }

      if (insuranceTypeDropdownRef.current && !insuranceTypeDropdownRef.current.contains(target)) {
        setInsuranceTypeDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    /* =======================================================
       INSURANCE
    ======================================================= */

    if (selectedService === 'insurance') {
      sessionStorage.setItem(
        'compareFlowDetails',
        JSON.stringify({
          service: 'insurance',
          flow: 'insurance',
          postcode: postcode.trim(),
          address: selectedAddress,
          email: email.trim(),
          insuranceType,
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'insurance');
      sessionStorage.setItem('billgooseJourneyFlow', 'insurance');

      window.dispatchEvent(new Event('billgoose-compare-flow-changed'));

      router.push('/steps/personal-details-form?service=insurance');

      return;
    }

    /* =======================================================
       ENERGY / BUNDLE BILLS
    ======================================================= */

    if (selectedService === 'energy') {
      sessionStorage.setItem(
        'compareFlowDetails',
        JSON.stringify({
          service: 'energy',

          flow: isBundleFlow ? 'bundle' : 'energy',

          postcode: postcode.trim(),

          address: selectedAddress,

          serviceType: energyServiceType,

          ...(isBundleFlow
            ? {
                occupancyType,
                alreadyInProperty,
              }
            : {
                paymentMethod,
              }),
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'energy');

      sessionStorage.setItem('billgooseJourneyFlow', isBundleFlow ? 'bundle' : 'energy');

      window.dispatchEvent(new Event('billgoose-compare-flow-changed'));

      if (isBundleFlow) {
        router.push('/steps/personal-details-form?service=energy&flow=bundle');

        return;
      }

      router.push('/current-usage?service=energy');

      return;
    }

    /* =======================================================
       BROADBAND
    ======================================================= */

    sessionStorage.setItem(
      'compareFlowDetails',
      JSON.stringify({
        service: 'broadband',

        flow: 'broadband',

        postcode: postcode.trim(),

        address: selectedAddress,

        currentProvider,

        stillInContract,
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', 'broadband');

    sessionStorage.setItem('billgooseJourneyFlow', 'broadband');

    window.dispatchEvent(new Event('billgoose-compare-flow-changed'));

    router.push('/result?service=broadband');
  };

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
            LEFT CONTENT
        ====================================================== */}

        <div
          className="
            w-full
            max-w-[510px]

            md:max-w-none

            lg:max-w-[510px]
          "
        >
          {/* =================================================
              BACK BUTTON
          ================================================== */}

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
            <span
              className="
                flex
                h-6
                w-6
                shrink-0

                items-center
                justify-center
              "
            >
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
                lg:font-[645]
                lg:font-extrabold
                lg:leading-[56px]
              "
            >
              <span className="md:hidden">
                <span
                  className="
                    block

                    min-[360px]:whitespace-nowrap
                  "
                >
                  {serviceContent.heading.firstLine}
                </span>

                <span className="block">{serviceContent.heading.secondLine}</span>
              </span>

              <span
                className="
                  hidden

                  md:inline

                  lg:hidden
                "
              >
                {serviceContent.heading.firstLine} {serviceContent.heading.secondLine}
              </span>

              <span
                className="
                  hidden

                  lg:block
                "
              >
                <span
                  className="
                    block
                    whitespace-nowrap
                  "
                >
                  {serviceContent.heading.firstLine}
                </span>

                <span
                  className="
                    block
                    whitespace-nowrap
                  "
                >
                  {serviceContent.heading.secondLine}
                </span>
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
                lg:font-[400]
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
            noValidate
            onSubmit={handleSubmit}
            className="
              mt-8
              space-y-5

              md:mt-7
              md:space-y-[18px]

              lg:mt-10
              lg:space-y-5
            "
          >
            {/* =================================================
                POSTCODE
            ================================================== */}

            <div>
              <label
                htmlFor="postcode"
                className="
                  mb-2
                  block

                  font-inter

                  text-[13px]
                  font-medium
                  font-[500]
                  leading-5
                  tracking-[0]

                  text-[#344054]

                  md:text-[13px]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.postcode.label}
              </label>

              <div
                className="
                  relative

                  flex
                  h-[42px]
                  w-full

                  items-center

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                  md:h-[44px]

                  lg:h-[44px]
                "
              >
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  value={postcode}
                  autoComplete="postal-code"
                  placeholder={compareFlow.form.postcode.placeholder}
                  aria-invalid={postcode.length > 0 && !isPostcodeValid}
                  onChange={(event) => {
                    setPostcode(event.target.value.toUpperCase());

                    setSelectedAddress(null);

                    setAddressDropdownOpen(false);
                  }}
                  className="
                    h-full
                    min-w-0
                    flex-1

                    rounded-full

                    border-0

                    bg-transparent

                    pl-[14px]
                    pr-[120px]

                    font-inter

                    text-[13px]
                    font-normal
                    leading-5

                    text-[#667085]

                    outline-none

                    placeholder:text-[#667085]

                    md:text-[13px]

                    lg:text-[14px]
                  "
                />

                <button
                  type="button"
                  disabled={postcode === '' || !isPostcodeValid}
                  onClick={handlePostalCode}
                  className={`
                    absolute
                    right-[4px]
                    top-1/2

                    flex
                    h-[34px]
                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    px-[14px]

                    font-inter

                    text-[11px]
                    font-medium
                    leading-4

                    transition-colors
                    duration-200

                    ${
                      postcode === '' || !isPostcodeValid
                        ? 'cursor-not-allowed bg-[#E6F4F2] text-[#00897B]'
                        : 'bg-[#0D3B66] text-white hover:bg-[#082A49]'
                    }
                  `}
                >
                  {isAddressLoading ? (
                    <span
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          inline-block
                          h-3.5
                          w-3.5

                          animate-spin

                          rounded-full

                          border-2
                          border-white
                          border-t-transparent
                        "
                      />
                      Loading...
                    </span>
                  ) : (
                    'Find address'
                  )}
                </button>
              </div>

              {postcode.length > 0 && !isPostcodeValid && (
                <p
                  className="
                      mt-1.5

                      font-inter

                      text-[11px]
                      font-normal
                      leading-4

                      text-[#D92D20]

                      lg:text-[12px]
                    "
                >
                  {compareFlow.form.postcode.invalidError}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setPostcode('');

                  setAddressOptions([]);

                  setSelectedAddress(null);
                }}
                className="
                  mt-2
                  block

                  font-inter

                  text-[13px]
                  font-normal
                  leading-5
                  tracking-[0]

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
                  font-medium
                  font-[500]
                  leading-5
                  tracking-[0]

                  text-[#344054]

                  md:text-[13px]

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
                  disabled={addressOptions.length === 0}
                  onClick={() => {
                    setAddressDropdownOpen((current) => !current);

                    setProviderDropdownOpen(false);

                    setEnergyServiceDropdownOpen(false);

                    setInsuranceTypeDropdownOpen(false);
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
                    leading-6
                    tracking-[0]

                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                    outline-none

                    transition

                    md:h-[50px]
                    md:text-[14px]

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
                    className={`
                      min-w-0
                      truncate

                      ${selectedAddress ? 'text-[#101828]' : 'text-[#667085]'}
                    `}
                  >
                    {selectedAddress?.fullAddress || compareFlow.form.address.placeholder}
                  </span>

                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`
                      h-5
                      w-5
                      shrink-0

                      text-[#354052]

                      transition-transform
                      duration-200

                      md:h-[18px]
                      md:w-[18px]

                      lg:h-5
                      lg:w-5

                      ${addressDropdownOpen ? 'rotate-180' : ''}
                    `}
                  />
                </button>

                {addressDropdownOpen && (
                  <div
                    role="listbox"
                    aria-labelledby="address-label"
                    className="
                      absolute
                      left-0
                      top-[calc(100%+8px)]
                      z-50

                      max-h-[190px]
                      w-full

                      overflow-y-auto

                      rounded-[20px]

                      bg-white

                      p-[5px]

                      shadow-[0px_2px_4px_0px_rgba(84,84,84,0.15),0px_7px_7px_0px_rgba(84,84,84,0.13),0px_15px_9px_0px_rgba(84,84,84,0.08),0px_27px_11px_0px_rgba(84,84,84,0.02)]

                      md:max-h-[220px]

                      lg:max-h-[190px]
                    "
                  >
                    {addressOptions.map((address) => {
                      const isSelected = selectedAddress?.fullAddress === address.label;

                      return (
                        <button
                          key={address.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedAddress(address.fullAddressObject);

                            setAddressDropdownOpen(false);
                          }}
                          className={`
                              flex
                              min-h-10
                              w-full

                              items-center
                              justify-between

                              gap-2

                              rounded-[30px]

                              px-3
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
                          <span
                            className="
                                flex
                                min-w-0

                                items-center

                                gap-2
                              "
                          >
                            <Image
                              src="/images/location-icon.png"
                              alt=""
                              width={12}
                              height={14}
                              aria-hidden="true"
                              className="
                                  h-[13.66px]
                                  w-[12px]
                                  shrink-0

                                  object-contain
                                "
                            />

                            <span className="truncate">{address.label}</span>
                          </span>

                          {isSelected && (
                            <Check
                              aria-hidden="true"
                              className="
                                  h-4
                                  w-4
                                  shrink-0

                                  text-[#00897B]
                                "
                              strokeWidth={2}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="
                  mt-2
                  block

                  font-inter

                  text-[13px]
                  font-regular
                  font-[500]
                  leading-5
                  tracking-[0]

                  text-[#045C9E]

                  md:text-[12px]

                  lg:text-[14px]
                "
              >
                {compareFlow.form.address.manualText}
              </button>
            </div>

            {/* Rental / homeowner */}
            {/* <fieldset>
              <legend
                className="
                  mb-2
                  font-inter
                  text-[13px] font-medium
                  leading-5 tracking-[0]
                  text-[#344054]
                  md:text-[13px]
                  lg:text-[14px]
                "
              >
                {compareFlow.form.energy.serviceType.label}
              </legend>

              <div className="flex flex-wrap items-center gap-2">
                {compareFlow.form.energy.serviceType.options.map((option) => (
                  <ChoicePill
                    key={option.id}
                    label={option.label}
                    selected={occupancyType === option.value}
                    onClick={() => setOccupancyType(option.value as OccupancyStatus)}
                  />
                ))}
              </div>
            </fieldset> */}

            {/* Already in property */}
            {/* <fieldset>
              <legend className="sr-only">{compareFlow.form.energy.serviceType.label}</legend>

              <div
                className="
                  flex min-h-12 w-full
                  items-center justify-between
                  gap-[18px]
                  rounded-full
                  border border-[#D0D5DD]
                  bg-white
                  py-[9px] pl-4 pr-2
                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                  min-[390px]:pl-6
                  md:h-[50px] md:min-h-[50px] md:pl-5
                  lg:h-[52px] lg:min-h-[52px]
                "
              >
                <span
                  className="
                    font-inter
                    text-[12px] font-medium
                    leading-5 tracking-[0]
                    text-[#344054]
                    min-[390px]:text-[13px]
                    md:text-[13px]
                    lg:text-[14px]
                  "
                >
                  {compareFlow.form.energy.serviceType.label}
                </span>

                <div className="flex h-[34px] shrink-0 items-center">
                  {compareFlow.form.energy.serviceType.options.map((option) => (
                    <PropertyOption
                      key={option.id}
                      label={option.label}
                      selected={alreadyInProperty === option.value}
                      onClick={() => {
                        setAlreadyInProperty(option.value as MoveStatus);
                      }}
                    />
                  ))}
                </div>
              </div>
            </fieldset> */}

            {/* =================================================
                INSURANCE
            ================================================== */}

            {selectedService === 'insurance' && (
              <>
                <div>
                  <label
                    htmlFor="insurance-email"
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
                    Email address
                  </label>

                  <input
                    id="insurance-email"
                    name="insurance-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="Enter your email address"
                    aria-invalid={email.length > 0 && !isEmailValid}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    className="
                      h-12
                      w-full
                      rounded-full
                      border
                      border-[#D0D5DD]
                      bg-white
                      px-[18px]
                      font-inter
                      text-[14px]
                      font-normal
                      leading-6
                      text-[#344054]
                      shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                      outline-none
                      transition
                      placeholder:text-[#667085]
                      focus:border-black
                      focus:ring-4
                      focus:ring-[#EEFFFB]
                      md:h-[50px]
                      lg:h-[52px]
                      lg:text-[16px]
                    "
                  />

                  {email.length > 0 && !isEmailValid && (
                    <p
                      className="
                        mt-1.5
                        font-inter
                        text-[11px]
                        font-normal
                        leading-4
                        text-[#D92D20]
                        lg:text-[12px]
                      "
                    >
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    id="insurance-type-label"
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
                    Insurance Type
                  </label>

                  <div
                    ref={insuranceTypeDropdownRef}
                    className="relative"
                  >
                    <button
                      type="button"
                      aria-labelledby="insurance-type-label"
                      aria-expanded={insuranceTypeDropdownOpen}
                      aria-haspopup="listbox"
                      onClick={() => {
                        setInsuranceTypeDropdownOpen((current) => !current);
                        setAddressDropdownOpen(false);
                        setProviderDropdownOpen(false);
                        setEnergyServiceDropdownOpen(false);
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
                        leading-6
                        text-[#344054]
                        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                        outline-none
                        transition
                        md:h-[50px]
                        lg:h-[52px]
                        lg:text-[16px]
                        ${
                          insuranceTypeDropdownOpen
                            ? 'border-black ring-4 ring-[#EEFFFB]'
                            : 'border-[#D0D5DD]'
                        }
                      `}
                    >
                      <span>
                        {
                          insuranceTypeOptions.find((option) => option.value === insuranceType)
                            ?.label
                        }
                      </span>

                      <ChevronDown
                        aria-hidden="true"
                        className={`
                          h-5
                          w-5
                          shrink-0
                          text-[#354052]
                          transition-transform
                          ${insuranceTypeDropdownOpen ? 'rotate-180' : ''}
                        `}
                        strokeWidth={2}
                      />
                    </button>

                    {insuranceTypeDropdownOpen && (
                      <DropdownPanel>
                        {insuranceTypeOptions.map((option) => {
                          const isSelected = insuranceType === option.value;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setInsuranceType(option.value);
                                setInsuranceTypeDropdownOpen(false);
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
                                text-left
                                font-inter
                                text-[13px]
                                text-[#344054]
                                transition-colors
                                hover:bg-[#F5F5F5]
                                lg:text-[14px]
                                ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                              `}
                            >
                              <span>{option.label}</span>

                              {isSelected && (
                                <Check
                                  aria-hidden="true"
                                  className="h-4 w-4 text-[#00897B]"
                                  strokeWidth={2}
                                />
                              )}
                            </button>
                          );
                        })}
                      </DropdownPanel>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* =================================================
                ENERGY
            ================================================== */}

            {selectedService === 'energy' && (
              <>
                <div>
                  <label
                    id="energy-service-label"
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
                    {compareFlow.form.energy.serviceType.label}
                  </label>

                  <div
                    ref={energyServiceDropdownRef}
                    className="relative"
                  >
                    <button
                      type="button"
                      aria-labelledby="energy-service-label"
                      aria-expanded={energyServiceDropdownOpen}
                      aria-haspopup="listbox"
                      onClick={() => {
                        setEnergyServiceDropdownOpen((current) => !current);

                        setAddressDropdownOpen(false);

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

                        text-left

                        font-inter

                        text-[14px]
                        font-normal
                        leading-6

                        text-[#344054]

                        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                        outline-none

                        transition

                        md:h-[50px]

                        lg:h-[52px]
                        lg:text-[16px]

                        ${
                          energyServiceDropdownOpen
                            ? 'border-black ring-4 ring-[#EEFFFB]'
                            : 'border-[#D0D5DD]'
                        }
                      `}
                    >
                      <span>
                        {
                          compareFlow.form.energy.serviceType.options.find(
                            (option) => option.value === energyServiceType,
                          )?.label
                        }
                      </span>

                      <ChevronDown
                        aria-hidden="true"
                        className={`
                          h-5
                          w-5
                          shrink-0

                          text-[#354052]

                          transition-transform

                          ${energyServiceDropdownOpen ? 'rotate-180' : ''}
                        `}
                        strokeWidth={2}
                      />
                    </button>

                    {energyServiceDropdownOpen && (
                      <DropdownPanel>
                        {compareFlow.form.energy.serviceType.options.map((option) => {
                          const isSelected = energyServiceType === option.value;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setEnergyServiceType(option.value);

                                setEnergyServiceDropdownOpen(false);
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

                                  text-left

                                  font-inter

                                  text-[13px]

                                  text-[#344054]

                                  transition-colors

                                  hover:bg-[#F5F5F5]

                                  lg:text-[14px]

                                  ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                                `}
                            >
                              <span>{option.label}</span>

                              {isSelected && (
                                <Check
                                  aria-hidden="true"
                                  className="
                                      h-4
                                      w-4

                                      text-[#00897B]
                                    "
                                  strokeWidth={2}
                                />
                              )}
                            </button>
                          );
                        })}
                      </DropdownPanel>
                    )}
                  </div>
                </div>

                {/* =================================================
                    BUNDLE ONLY — OCCUPANCY / PROPERTY STATUS
                ================================================== */}

                {isBundleFlow && (
                  <>
                    {/* Rental / homeowner */}
                    <fieldset>
                      <legend
                        className="
                          mb-2

                          font-inter

                          text-[13px]
                          font-medium
                          leading-5
                          tracking-[0]

                          text-[#344054]

                          md:text-[13px]

                          lg:text-[14px]
                        "
                      >
                        Are you a renter or homeowner?
                      </legend>

                      <div className="flex flex-wrap items-center gap-2">
                        {bundleOccupancyOptions.map((option) => (
                          <ChoicePill
                            key={option.id}
                            label={option.label}
                            selected={occupancyType === option.value}
                            onClick={() => {
                              setOccupancyType(option.value);
                            }}
                          />
                        ))}
                      </div>
                    </fieldset>

                    {/* Already in property */}
                    <fieldset>
                      <legend className="sr-only">Are you already in the property?</legend>

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
                            tracking-[0]

                            text-[#344054]

                            min-[390px]:text-[13px]

                            md:text-[13px]

                            lg:text-[14px]
                          "
                        >
                          Are you already in the property?
                        </span>

                        <div className="flex h-[34px] shrink-0 items-center">
                          {bundlePropertyStatusOptions.map((option) => (
                            <PropertyOption
                              key={option.id}
                              label={option.label}
                              selected={alreadyInProperty === option.value}
                              onClick={() => {
                                setAlreadyInProperty(option.value);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </fieldset>
                  </>
                )}

                {!isBundleFlow && (
                  <fieldset>
                    <legend
                      className="
                        mb-2

                        font-inter

                        text-[13px]
                        font-[500]
                        leading-5

                        text-[#344054]

                        lg:text-[14px]
                      "
                    >
                      {compareFlow.form.energy.paymentMethod.label}
                    </legend>

                    <div
                      className="
                        flex
                        flex-wrap

                        items-center

                        gap-2
                      "
                    >
                      {compareFlow.form.energy.paymentMethod.options.map((option) => (
                        <ChoicePill
                          key={option.id}
                          label={option.label}
                          selected={paymentMethod === option.value}
                          onClick={() => {
                            setPaymentMethod(option.value);
                          }}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}
              </>
            )}

            {/* =================================================
                BROADBAND
            ================================================== */}

            {selectedService === 'broadband' && (
              <>
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

                        setEnergyServiceDropdownOpen(false);
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

                                if (provider.value === 'no-current-provider') {
                                  setStillInContract(
                                    compareFlow.form.broadband.contractStatus.defaultValue,
                                  );
                                }

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

                                  text-left

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
                                  aria-hidden="true"
                                  className="
                                      h-4
                                      w-4

                                      text-[#00897B]
                                    "
                                  strokeWidth={2}
                                />
                              )}
                            </button>
                          );
                        })}
                      </DropdownPanel>
                    )}
                  </div>
                </div>

                {shouldShowContractStatus && (
                  <>
                    <fieldset>
                      <legend className="sr-only">
                        {compareFlow.form.broadband.contractStatus.label}
                      </legend>

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
                          {compareFlow.form.broadband.contractStatus.label}
                        </span>

                        <div
                          className="
                        flex
                        h-[34px]
                        shrink-0

                        items-center
                      "
                        >
                          {compareFlow.form.broadband.contractStatus.options.map((option) => (
                            <PropertyOption
                              key={option.id}
                              label={option.label}
                              selected={stillInContract === option.value}
                              onClick={() => {
                                setStillInContract(option.value);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </fieldset>
                  </>
                )}
              </>
            )}

            {/* =================================================
                MOVE IN DATE
            ================================================== */}

            {alreadyInProperty == String(MoveStatus.MOVING_IN) && (
              <FormField label="">
                <div className="relative w-full">
                  <input
                    id="date-of-birth"
                    type="date"
                    value={moveInDate}
                    onChange={(event) => setMoveInDate(event.target.value)}
                    autoComplete="bday"
                    className="
                      flex
                      h-12
                      w-full

                      items-center

                      rounded-full

                      border

                      bg-white

                      px-[18px]
                      pr-11

                      font-inter

                      text-[14px]
                      font-normal

                      text-[#344054]

                      shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                      outline-none

                      transition

                      lg:pr-[50px]

                      [&::-webkit-calendar-picker-indicator]:absolute
                      [&::-webkit-calendar-picker-indicator]:right-[18px]
                      [&::-webkit-calendar-picker-indicator]:h-[18px]
                      [&::-webkit-calendar-picker-indicator]:w-[18px]
                      [&::-webkit-calendar-picker-indicator]:cursor-pointer
                      [&::-webkit-calendar-picker-indicator]:opacity-0
                    "
                  />

                  <button
                    type="button"
                    aria-label="Open date of birth calendar"
                    onClick={() => {
                      const input = document.getElementById(
                        'date-of-birth',
                      ) as HTMLInputElement | null;

                      if (input?.showPicker) {
                        input.showPicker();
                      } else {
                        input?.click();
                      }

                      input?.focus();
                    }}
                    className="
                      absolute
                      right-[14px]
                      top-1/2

                      flex
                      h-8
                      w-8
                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      text-[#667085]

                      hover:bg-[#F2F4F7]

                      focus-visible:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-[#EEFFFB]
                    "
                  >
                    <CalendarDays
                      aria-hidden="true"
                      className="
                        h-4
                        w-4

                        lg:h-[18px]
                        lg:w-[18px]
                      "
                      strokeWidth={1.6}
                    />
                  </button>
                </div>
              </FormField>
            )}

            {/* =================================================
                CONTINUE
            ================================================== */}

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
                py-3

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
                aria-hidden="true"
                className="
                  h-[18px]
                  w-[18px]

                  md:h-4
                  md:w-4

                  lg:h-[18px]
                  lg:w-[18px]
                "
                strokeWidth={2}
              />
            </button>
          </form>
        </div>

        {/* =====================================================
            RIGHT ILLUSTRATION - DESKTOP ONLY
        ====================================================== */}

        <div
          className="
            hidden

            lg:block
            lg:mx-0
            lg:w-full
            lg:max-w-none
            lg:justify-self-end
            lg:rounded-[30px]
            lg:p-[20px_24px]

            xl:h-[731px]
            xl:w-[648px]
            xl:p-[20px_40px]
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
                sizes="(max-width:1023px) 0px, (max-width:1279px) 45vw, 568px"
                className="
                  object-cover
                  object-center
                "
              />
            </div>
          ) : (
            <div
              className="
                relative

                aspect-[568/691]
                w-full

                overflow-hidden

                rounded-[22px]

                bg-[#E9EAEB]

                min-[390px]:rounded-[26px]

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
                sizes="(max-width: 1023px) 0px, (max-width: 1279px) 45vw, 568px"
                className="
                  object-cover
                  object-center
                "
              />
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
   CHOICE PILL
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
        {selected && (
          <span
            className="
              h-2
              w-2

              rounded-full

              bg-[#00897B]
            "
          />
        )}
      </span>

      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   PROPERTY OPTION
========================================================= */

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

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block w-full">
      <label
        className="
          mb-1.5
          block

          font-inter

          text-[11px]
          font-medium
          leading-4

          text-[#344054]

          sm:text-[12px]

          lg:mb-2
          lg:text-[14px]
          lg:leading-5
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}
