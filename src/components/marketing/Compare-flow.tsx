'use client';
import { storeJourney } from '@/constants/shared';
import data from '@/data/content.json';
import { useToast } from '@/hooks/useToast';
import { Address, Journey, MoveStatus, OccupancyStatus } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';
import { ArrowRight, CalendarDays, Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

export default function CompareFlow() {
  const { compareFlow } = data;
  const { journey, setJourney } = useJourneyStore();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [postcode, setPostcode] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<Address>({});
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const [occupancyType, setOccupancyType] = useState<OccupancyStatus>(
    compareFlow.form.energy.occupancy.defaultValue as OccupancyStatus,
  );
  const [alreadyInProperty, setAlreadyInProperty] = useState<MoveStatus>(
    compareFlow.form.energy.propertyStatus.defaultValue as MoveStatus,
  );
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const ukPostcodePattern = /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
  const isPostcodeValid = ukPostcodePattern.test(postcode.trim());
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);
  const [moveInDate, setMoveInDate] = useState('');

  const searchParams = useSearchParams();
  const urlPostcode = searchParams.get('postcode') || '';

  const [addressOptions, setAddressOptions] = useState<
    Array<{ id: string; label: string; value: string; fullAddressObject: Address }>
  >([]);

  const isFormValid =
    isPostcodeValid && selectedAddress && occupancyType.length > 0 && alreadyInProperty.length > 0;

  async function getAddresses(postalCode: string) {
    if (!postalCode) return;

    try {
      console.warn('journery', journey);
      setIsAddressLoading(true);
      setPostcode(postalCode);
      const journeyId = localStorage.getItem(storeJourney);
      const res = await journeyApi.getAddress(journeyId!, { postcode: postalCode });
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

  useEffect(() => {
    getAddresses(urlPostcode);

    function handleOutsideClick(event: MouseEvent) {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setAddressDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handlePostalCode = () => {
    if (postcode && isPostcodeValid) {
      getAddresses(postcode);
    }
  };

  const handleForm = async () => {
    try {
      const journeyId = journey?.id || journey?.journeyId || localStorage.getItem(storeJourney);
      if (!journeyId) {
        showError('Journey ID iS required');
        return;
      }
      let payload: Journey = {
        address: selectedAddress,
        uuid: journeyId,
        lastUrl: '/steps/address/',
        serviceType: 'energy',
        customer: {
          occupancyStatus: occupancyType,
          moveStatus:
            alreadyInProperty === MoveStatus.ALREADY_MOVED_IN
              ? MoveStatus.ALREADY_MOVED_IN
              : MoveStatus.MOVING_IN,
          moveInDate: alreadyInProperty === MoveStatus.MOVING_IN ? moveInDate : null,
        },
      };

      const updatedJourney = await journeyApi.createJourney(payload);

      if (!updatedJourney?.data) {
        throw new Error('No data received from API');
      }

      setJourney(updatedJourney.data);
      const formattedPostcode = postcode.trim().toUpperCase().replace(/\s+/g, ' ');
      showSuccess(
        "🎉 Great! We're getting you in at " +
          formattedPostcode +
          "! Let's finalize your details. 🚀",
      );
      router.push(`/steps/personal-details-form?postcode=${encodeURIComponent(formattedPostcode)}`);
    } catch (error) {
      console.error(' Failed to update journey:', error);
    } finally {
      // setIsLoading(false);
    }
  };
  // const handleSubmit = () => {};

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
          mx-auto grid w-full max-w-[1380px]
          grid-cols-1
          gap-10

          pb-12
          pl-5 pr-4
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
        {/* Left content */}
        <div
          className="
            w-full max-w-[510px]

            md:max-w-none

            lg:max-w-[510px]
          "
        >
          {/* Back */}
          <Link
            href={compareFlow.backButton.href}
            className="
              inline-flex h-10 w-fit
              items-center justify-center
              gap-[1px]
              rounded-full
              bg-white

              py-2 pl-2 pr-[14px]

              font-inter
              text-[16px] font-medium
              text-[#0D3B66]

              shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

              transition-transform duration-200

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

          {/* Heading */}
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
              {/* Mobile */}
              <span className="md:hidden">
                <span className="block min-[360px]:whitespace-nowrap">
                  {compareFlow?.services.energy.heading?.firstLine}
                </span>

                <span className="block">{compareFlow.services.energy.heading.secondLine}</span>
              </span>

              {/* Tablet */}
              <span className="hidden md:inline lg:hidden">
                {compareFlow.services.energy.heading.firstLine}{' '}
                {compareFlow.services.energy.heading.secondLine}
              </span>

              {/* Desktop */}
              {/* Desktop - exactly 2 lines */}
              <span className="hidden lg:block">
                <span className="block whitespace-nowrap">
                  {compareFlow.services.energy.heading.firstLine}
                </span>

                <span className="block whitespace-nowrap">
                  {compareFlow.services.energy.heading.secondLine}
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
              {compareFlow.services.energy.description}
            </p>
          </div>

          {/* Form */}
          <form
            noValidate
            className="
              mt-8 space-y-5

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
                  mb-2 block

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
                    h-12 w-full
                    rounded-full

                    border border-[#D0D5DD]
                    bg-[#FAF9FA]

                    px-[18px]
                    py-[14px]
                    pr-12

                    font-inter
                    text-[15px]
                    font-normal
                    leading-6
                    tracking-[0]

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

                {/* <CircleHelp
                  size={20}
                  strokeWidth={1.33}
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute right-[18px]
                    top-1/2
                    -translate-y-1/2

                    text-[#98A2B3]

                    md:h-[18px]
                    md:w-[18px]

                    lg:h-5
                    lg:w-5
                  "
                /> */}
                <button
                  type="button"
                  disabled={postcode === '' || !isPostcodeValid}
                  className={`
    absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-white
    h-10 px-5
    transition-colors duration-200 bg-primary
    ${postcode === '' || !isPostcodeValid ? 'border border-primary text-primary !bg-[#00897b17] pointer-none aria-readonly' : '!bg-primary'}
  `}
                  onClick={handlePostalCode}
                >
                  {isAddressLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Loading...
                    </span>
                  ) : postcode === '' || !isPostcodeValid ? (
                    'Edit'
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>

              {postcode.length > 0 && !isPostcodeValid && (
                <p className="mt-1.5 font-inter text-[12px] text-red-600">
                  {compareFlow.form.postcode.invalidError}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setPostcode('');
                  setAddressOptions([]);
                  setSelectedAddress({});
                }}
                className="
                  mt-2 block

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

            {/* Address */}
            <div>
              <label
                id="address-label"
                className="
                  mb-2 block

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
                    setAddressDropdownOpen((currentValue) => !currentValue);
                  }}
                  className={`
                    flex h-12 w-full
                    items-center justify-between
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
                    className={`min-w-0 truncate ${
                      selectedAddress ? 'text-[#000000]' : 'text-[#667085]'
                    }`}
                  >
                    {selectedAddress?.fullAddress || compareFlow.form.address.placeholder}
                  </span>

                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`
                      h-5 w-5 shrink-0

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
                      absolute left-0
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
                      const isSelected = selectedAddress === address.label;

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
                              flex min-h-9 w-full
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

                              md:min-h-[38px]
                              md:text-[13px]

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
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                              className="shrink-0 text-[#00897B]"
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
                  mt-2 block

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
                {compareFlow.form.energy.occupancy.label}
              </legend>

              <div className="flex flex-wrap items-center gap-2">
                {compareFlow.form.energy.occupancy.options.map((option) => (
                  <ChoicePill
                    key={option.id}
                    label={option.label}
                    selected={occupancyType === option.value}
                    onClick={() => setOccupancyType(option.value as OccupancyStatus)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Already in property */}
            <fieldset>
              <legend className="sr-only">{compareFlow.form.energy.propertyStatus.label}</legend>

              <div
                className="
                  flex min-h-12 w-full
                  items-center
                  justify-between

                  gap-[18px]

                  rounded-full

                  border border-[#D0D5DD]

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
                  {compareFlow.form.energy.propertyStatus.label}
                </span>

                <div className="flex h-[34px] shrink-0 items-center">
                  {compareFlow.form.energy.propertyStatus.options.map((option) => (
                    <PropertyOption
                      key={option.id}
                      label={option.label}
                      selected={alreadyInProperty === option.value}
                      onClick={() => {
                        console.log('valaue', option.value);
                        setAlreadyInProperty(option.value as MoveStatus);
                      }}
                    />
                  ))}
                </div>
              </div>
            </fieldset>

            {alreadyInProperty === MoveStatus.MOVING_IN && (
              <FormField label="">
                <div className="relative w-full">
                  <input
                    id="date-of-birth"
                    type="date"
                    value=""
                    onChange={(e) => setMoveInDate(e.target.value)}
                    autoComplete="bday"
                    className={`
                    }

                           pr-11

                           lg:pr-[50px]

                           [&::-webkit-calendar-picker-indicator]:absolute
                           [&::-webkit-calendar-picker-indicator]:right-[18px]
                           [&::-webkit-calendar-picker-indicator]:h-[18px]
                           [&::-webkit-calendar-picker-indicator]:w-[18px]
                           [&::-webkit-calendar-picker-indicator]:cursor-pointer
                           [&::-webkit-calendar-picker-indicator]:opacity-0
                         `}
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

                           flex h-8
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

            {/* Continue */}
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleForm}
              className="
                inline-flex h-12 w-full
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

                transition-all duration-200

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
                className="
                  md:h-4
                  md:w-4

                  lg:h-[18px]
                  lg:w-[18px]
                "
              />
            </button>
          </form>
        </div>

        {/* Right illustration - desktop only */}
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
              src={compareFlow.services.energy.image.src}
              alt={compareFlow.services.energy.image?.alt}
              fill
              priority
              sizes="
                (max-width: 1023px) 0px,
                (max-width: 1279px) 45vw,
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
      </section>
    </main>
  );
}

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
        inline-flex h-9
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
          flex h-4 w-4
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
        inline-flex h-[34px]
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
