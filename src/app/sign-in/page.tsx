'use client';

import { type FormEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowRight, Check } from 'lucide-react';

import Header from '@/components/marketing/Header';
import data from '@/data/content.json';

type LoginStage = 'email' | 'otp' | 'success';

export default function SignInPage() {
  const router = useRouter();

  const { hero, footer2 } = data;

  const [stage, setStage] = useState<LoginStage>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  /* =========================================================
     GET OTP
  ========================================================= */

  function handleGetOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Please enter your email address.');
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!emailIsValid) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setOtpError('');
    setStage('otp');
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!otp.trim()) {
      setOtpError('Please enter your OTP.');
      return;
    }

    if (otp !== '0000') {
      setOtpError('Incorrect OTP. Please enter 0000.');
      return;
    }

    setOtpError('');

    sessionStorage.setItem(
      'billgooseSignedInUser',
      JSON.stringify({
        email: email.trim(),
        signedIn: true,
      }),
    );

    /*
     * Update any mounted Header immediately
     * inside the same browser tab.
     */
    window.dispatchEvent(new Event('billgoose-auth-changed'));

    setStage('success');
  }

  /* =========================================================
     SUCCESS → RETURN AFTER 5 SECONDS
  ========================================================= */

  useEffect(() => {
    if (stage !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const storedReturnTo = sessionStorage.getItem('billgooseSignInReturnTo');

      /*
       * Prevent accidentally sending the user
       * straight back to /sign-in.
       */
      const returnTo =
        storedReturnTo && !storedReturnTo.startsWith('/sign-in') ? storedReturnTo : '/';

      sessionStorage.removeItem('billgooseSignInReturnTo');

      router.push(returnTo);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router, stage]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-white">
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <Header />

      {/* =====================================================
          HERO / SIGN-IN AREA
      ====================================================== */}
      <section
        className="
          w-full
          bg-white

          px-3
          pb-6
          pt-3

          sm:px-5

          lg:px-8
          lg:pb-8
          lg:pt-5
        "
      >
        <div className="mx-auto w-full max-w-[1440px]">
          {/* =================================================
              SAME OUTER HERO BORDER
          ================================================== */}
          <div
            className="
              relative

              rounded-[22px]

              bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]

              p-px

              lg:rounded-[30px]
            "
          >
            {/* =================================================
                SAME INNER HERO
            ================================================== */}
            <div
              className="
                relative

                overflow-hidden

                rounded-[21px]

                bg-white

                lg:rounded-[29px]
              "
            >
              {/* =================================================
                  SAME HERO BACKGROUND
              ================================================== */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  bg-[linear-gradient(180deg,#EEFFFB_0%,rgba(238,255,251,0)_100.01%)]
                "
              />

              <div
                className="
                  relative

                  min-h-[620px]

                  sm:min-h-[680px]

                  md:min-h-[720px]

                  lg:grid
                  lg:min-h-[610px]
                  lg:grid-cols-[53%_47%]
                "
              >
                {/* =================================================
                    LEFT CONTENT
                ================================================== */}
                <div
                  className="
                    relative
                    z-20

                    flex
                    items-center

                    px-[11px]
                    py-8

                    sm:px-7
                    sm:py-10

                    md:px-9

                    lg:px-12
                    lg:py-16

                    xl:px-16
                  "
                >
                  <div
                    className="
                      w-full

                      lg:max-w-[568px]
                    "
                  >
                    {/* =============================================
                        FORM CARD BORDER
                    ============================================== */}
                    <div
                      className="
                        w-full

                        rounded-[24px]

                        bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]

                        p-px

                        shadow-[0px_19px_42px_0px_#B0B0B01A,0px_77px_77px_0px_#B0B0B017,0px_174px_104px_0px_#B0B0B00D,0px_309px_123px_0px_#B0B0B003,0px_482px_135px_0px_#B0B0B000]

                        sm:rounded-[28px]

                        lg:h-[509px]
                        lg:rounded-[36px]
                      "
                    >
                      {/* ===========================================
                          CARD INNER
                      ============================================ */}
                      <div
                        className="
                          flex
                          h-full
                          w-full
                          flex-col

                          rounded-[23px]

                          bg-white

                          px-5
                          py-7

                          sm:rounded-[27px]
                          sm:px-8
                          sm:py-9

                          md:px-10

                          lg:rounded-[35px]
                          lg:px-[44px]
                          lg:py-[46px]
                        "
                      >
                        {/* =========================================
                            SUCCESS STATE
                        ========================================== */}
                        {stage === 'success' ? (
                          <div
                            className="
                              flex
                              h-full
                              w-full

                              flex-col
                              items-center
                              justify-center

                              text-center
                            "
                          >
                            {/* Success icon */}
                            <div
                              className="
                                flex
                                h-[82px]
                                w-[82px]

                                items-center
                                justify-center

                                rounded-full

                                bg-[#00897B]

                                sm:h-[94px]
                                sm:w-[94px]

                                md:h-[100px]
                                md:w-[100px]

                                lg:h-[108px]
                                lg:w-[108px]
                              "
                            >
                              <Image
                                src="/images/thanks-tick.png"
                                alt=""
                                width={64}
                                height={64}
                                aria-hidden="true"
                                className="
                                  h-[48px]
                                  w-[48px]

                                  object-contain

                                  sm:h-[54px]
                                  sm:w-[54px]

                                  md:h-[58px]
                                  md:w-[58px]

                                  lg:h-[64px]
                                  lg:w-[64px]
                                "
                              />
                            </div>

                            <h1
                              className="
                                mt-5

                                font-red-hat-display

                                text-[24px]
                                font-extrabold
                                leading-[30px]
                                tracking-[0]

                                text-[#082A49]

                                sm:text-[28px]
                                sm:leading-[34px]

                                md:text-[30px]
                                md:leading-[38px]

                                lg:mt-6
                                lg:text-[34px]
                                lg:leading-[42px]
                              "
                            >
                              Verification Success
                            </h1>

                            <p
                              className="
                                mt-2

                                font-red-hat-display

                                text-[13px]
                                font-[467]
                                leading-[19px]
                                tracking-[0]

                                text-[#667085]

                                sm:text-[14px]
                                sm:leading-5

                                md:text-[15px]
                                md:leading-[21px]

                                lg:text-[16px]
                                lg:leading-[22px]
                              "
                            >
                              Your identity has been successfully verified.
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* =====================================
                                LOGIN HEADING
                            ====================================== */}
                            <header>
                              <h1
                                className="
                                  font-red-hat-display

                                  text-[30px]
                                  font-[755]
                                  leading-[38px]
                                  tracking-[0]

                                  text-[#082A49]

                                  sm:text-[34px]
                                  sm:leading-[42px]

                                  md:text-[38px]
                                  md:leading-[46px]

                                  lg:text-[44px]
                                  lg:leading-[52px]
                                "
                              >
                                Login to BillGoose
                              </h1>

                              <p
                                className="
                                  mt-2

                                  font-red-hat-display

                                  text-[14px]
                                  font-[467]
                                  leading-[20px]
                                  tracking-[0]

                                  text-[#0C3354]

                                  sm:text-[15px]

                                  md:text-[16px]

                                  lg:mt-3
                                  lg:text-[18px]
                                  lg:leading-[18px]
                                "
                              >
                                Please enter your credential
                              </p>
                            </header>

                            {/* =====================================
                                EMAIL STAGE
                            ====================================== */}
                            {stage === 'email' && (
                              <form
                                onSubmit={handleGetOtp}
                                noValidate
                                className="
                                  mt-8

                                  sm:mt-9

                                  lg:mt-[54px]
                                "
                              >
                                <LoginField
                                  id="login-email"
                                  type="email"
                                  label="Email address"
                                  placeholder="Enter your email address"
                                  value={email}
                                  error={emailError}
                                  onChange={(value) => {
                                    setEmail(value);

                                    if (emailError) {
                                      setEmailError('');
                                    }
                                  }}
                                />

                                <button
                                  type="submit"
                                  className="
                                    mt-5

                                    inline-flex
                                    h-[46px]
                                    w-full

                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-full

                                    bg-[#00897B]

                                    px-5

                                    font-red-hat-display
                                    text-[13px]
                                    font-semibold
                                    leading-5

                                    text-white

                                    transition-colors

                                    hover:bg-[#00796D]

                                    focus-visible:outline-none
                                    focus-visible:ring-4
                                    focus-visible:ring-[#CFECE8]

                                    sm:h-[48px]
                                    sm:text-[14px]

                                    lg:h-[52px]
                                  "
                                >
                                  <span>Get OTP</span>

                                  <ArrowRight
                                    aria-hidden="true"
                                    className="
                                      h-4
                                      w-4
                                      shrink-0
                                    "
                                    strokeWidth={2}
                                  />
                                </button>
                              </form>
                            )}

                            {/* =====================================
                                OTP STAGE
                            ====================================== */}
                            {stage === 'otp' && (
                              <form
                                onSubmit={handleLogin}
                                noValidate
                                className="
                                  mt-7

                                  sm:mt-8

                                  lg:mt-[42px]
                                "
                              >
                                <LoginField
                                  id="login-email"
                                  type="email"
                                  label="Email address"
                                  placeholder="Enter your email address"
                                  value={email}
                                  onChange={setEmail}
                                />

                                <div className="mt-5">
                                  <LoginField
                                    id="login-otp"
                                    type="text"
                                    inputMode="numeric"
                                    label="Enter OTP"
                                    placeholder="Enter your OTP"
                                    value={otp}
                                    error={otpError}
                                    maxLength={4}
                                    onChange={(value) => {
                                      const numericValue = value.replace(/\D/g, '').slice(0, 4);

                                      setOtp(numericValue);

                                      if (otpError) {
                                        setOtpError('');
                                      }
                                    }}
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="
                                    mt-5

                                    inline-flex
                                    h-[46px]
                                    w-full

                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-full

                                    bg-[#00897B]

                                    px-5

                                    font-red-hat-display
                                    text-[14px]
                                    font-semibold
                                    leading-5

                                    text-white

                                    transition-colors

                                    hover:bg-[#00796D]

                                    focus-visible:outline-none
                                    focus-visible:ring-4
                                    focus-visible:ring-[#CFECE8]

                                    sm:h-[48px]
                                    sm:text-[15px]

                                    lg:h-[52px]
                                    lg:text-[16px]
                                  "
                                >
                                  <span>Login</span>

                                  <ArrowRight
                                    aria-hidden="true"
                                    className="
                                      h-[17px]
                                      w-[17px]
                                      shrink-0
                                    "
                                    strokeWidth={2}
                                  />
                                </button>
                              </form>
                            )}

                            {/* =====================================
                                TERMS
                            ====================================== */}
                            <div
                              className={`
                                flex
                                items-start
                                gap-2

                                ${stage === 'email' ? 'mt-6 lg:mt-[27px]' : 'mt-5'}
                              `}
                            >
                              <span
                                className="
                                  mt-[2px]

                                  flex
                                  h-[14px]
                                  w-[14px]
                                  shrink-0

                                  items-center
                                  justify-center

                                  rounded-[3px]

                                  bg-[#00897B]
                                "
                              >
                                <Check
                                  aria-hidden="true"
                                  className="
                                    h-[9px]
                                    w-[9px]

                                    text-white
                                  "
                                  strokeWidth={3}
                                />
                              </span>

                              <p
                                className="
                                  max-w-[410px]

                                  font-inter
                                  text-[10px]
                                  font-normal
                                  leading-[15px]

                                  text-[#667085]

                                  sm:text-[11px]
                                  sm:leading-[16px]

                                  lg:text-[12px]
                                  lg:leading-[18px]
                                "
                              >
                                By proceeding with BillGoose, you are confirming that you agree to
                                the{' '}
                                <a
                                  href="/terms"
                                  className="
                                    font-medium
                                    text-[#00897B]
                                    underline
                                    underline-offset-2
                                  "
                                >
                                  terms &amp; conditions
                                </a>{' '}
                                of our service and to our{' '}
                                <a
                                  href="/privacy"
                                  className="
                                    font-medium
                                    text-[#00897B]
                                    underline
                                    underline-offset-2
                                  "
                                >
                                  privacy policy
                                </a>{' '}
                                that govern how your information will be processed.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    MOBILE + TABLET HERO IMAGE
                ================================================== */}
                <div
                  className="
                    pointer-events-none

                    absolute
                    bottom-0
                    left-1/2
                    z-10

                    h-[300px]
                    w-[320px]

                    -translate-x-1/2

                    sm:h-[350px]
                    sm:w-[380px]

                    md:h-[390px]
                    md:w-[440px]

                    lg:hidden
                  "
                >
                  <Image
                    src={hero.mobileImage.src}
                    alt={hero.mobileImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 440px, 0px"
                    className="
                      object-contain
                      object-bottom
                    "
                  />
                </div>

                {/* =================================================
                    DESKTOP HERO IMAGE
                ================================================== */}
                <div
                  className="
                    relative

                    hidden
                    min-h-[610px]

                    lg:block
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0

                      lg:left-[-2%]
                      lg:right-[-20%]
                      lg:translate-y-8

                      xl:left-[0%]
                      xl:right-[-34%]
                    "
                  >
                    <Image
                      src={hero.image.src}
                      alt={hero.image.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 54vw, 0px"
                      className="
                        object-contain
                        object-center
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER 2
      ====================================================== */}
      <footer
        className="
          w-full

          border-t
          border-[#EAECF0]

          bg-white
        "
      >
        <div
          className="
            mx-auto

            flex
            w-full
            max-w-[1440px]

            flex-col
            items-center
            justify-between

            gap-3

            px-4
            py-4

            min-[390px]:px-5

            sm:px-6

            md:flex-row
            md:gap-6
            md:px-8

            lg:min-h-[66px]
            lg:py-3
          "
        >
          <p
            className="
              order-2

              font-inter
              text-[10px]
              font-normal
              leading-4

              text-[#101828]

              md:order-1

              lg:text-[12px]
            "
          >
            {footer2.copyright}
          </p>

          <nav
            aria-label={footer2.navigationAriaLabel}
            className="
              order-1

              flex
              flex-wrap
              items-center
              justify-center

              gap-2

              md:order-2
              md:justify-end

              lg:gap-3
            "
          >
            {footer2.links.map((link, index) => (
              <div
                key={link.id}
                className="
                  flex
                  items-center
                  gap-2

                  lg:gap-3
                "
              >
                <a
                  href={link.href}
                  className="
                    font-inter
                    text-[10px]
                    font-medium
                    leading-4

                    text-[#101828]

                    underline
                    underline-offset-2

                    transition-colors

                    hover:text-[#00897B]

                    lg:text-[12px]
                  "
                >
                  {link.label}
                </a>

                {index < footer2.links.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="
                      text-[9px]
                      text-[#98A2B3]
                    "
                  >
                    •
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   LOGIN FIELD
========================================================= */

type LoginFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'search' | 'url' | 'none';
  maxLength?: number;
  onChange: (value: string) => void;
};

function LoginField({
  id,
  label,
  placeholder,
  value,
  error,
  type = 'text',
  inputMode,
  maxLength,
  onChange,
}: LoginFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          mb-2
          block

          font-inter
          text-[12px]
          font-medium
          leading-[18px]

          text-[#344054]

          sm:text-[13px]

          lg:text-[14px]
          lg:leading-5
        "
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          h-[46px]
          w-full

          rounded-full

          border

          bg-white

          px-4

          font-inter
          text-[13px]
          font-normal
          leading-5

          text-[#101828]

          shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

          outline-none

          transition

          placeholder:text-[#98A2B3]

          focus:ring-4
          focus:ring-[#E6F4F2]

          sm:h-[48px]
          sm:px-[18px]
          sm:text-[14px]

          lg:h-[52px]

          ${
            error
              ? `
                border-[#F04438]
                focus:border-[#F04438]
              `
              : `
                border-[#D0D5DD]
                focus:border-[#00897B]
              `
          }
        `}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="
            mt-1.5

            font-inter
            text-[11px]
            font-normal
            leading-4

            text-[#D92D20]

            sm:text-[12px]
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}
