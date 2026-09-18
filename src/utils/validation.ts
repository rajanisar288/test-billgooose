export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+(?:\.[A-Za-z]{2,10})+$/;
export const UK_MOBILE_REGEX = /^(?:07\d{9}|\+447\d{9})$/;

/**
 * Sanitizes user input for email fields:
 * - Strips whitespace
 * - Restricts invalid characters
 * - Allows at most one '@' symbol
 * - Ensures domain contains only valid hostname characters ([a-zA-Z0-9.-])
 * - Restricts domain segments after dot (TLD) to maximum 10 characters
 */
export function sanitizeEmailInput(raw: string): string {
  let val = raw.replace(/\s/g, '').replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, '');

  const atIndex = val.indexOf('@');
  if (atIndex !== -1) {
    const localPart = val.slice(0, atIndex);
    let domain = val.slice(atIndex + 1);

    // Prevent any subsequent @
    domain = domain.replace(/@/g, '');

    // Domain can only contain letters, digits, dots, and hyphens
    domain = domain.replace(/[^a-zA-Z0-9.-]/g, '');

    // Restrict segments after dot to at most 10 characters
    const parts = domain.split('.');
    if (parts.length > 1) {
      const cappedParts = [parts[0], ...parts.slice(1).map((part) => part.slice(0, 10))];
      domain = cappedParts.join('.');
    }

    val = `${localPart}@${domain}`;
  }

  return val;
}

/**
 * Sanitizes user input for UK mobile fields in real time:
 * - Allows only digits, optional single '+' at index 0, and '-' separator
 * - If starting with '+44' or '+', allows max 12 digits (e.g. +447123456789 or +44-7123-456789)
 * - If starting with '0' or digits, allows max 11 digits (e.g. 07123456789 or 07123-456789)
 */
export function sanitizeUkMobileInput(raw: string): string {
  // Allow only digits, '+' and '-'
  let val = raw.replace(/[^\d+-]/g, '');

  // '+' is only allowed at the very beginning
  if (val.includes('+')) {
    const hasLeadingPlus = val.startsWith('+');
    val = (hasLeadingPlus ? '+' : '') + val.replace(/\+/g, '');
  }

  // Prevent multiple consecutive hyphens or leading hyphens
  val = val.replace(/^-+/, '').replace(/-{2,}/g, '-');

  // Enforce maximum digits based on prefix
  const maxDigits = val.startsWith('+') ? 12 : 11;

  let digitCount = 0;
  let truncated = '';

  for (const char of val) {
    if (/\d/.test(char)) {
      if (digitCount < maxDigits) {
        digitCount++;
        truncated += char;
      }
    } else {
      truncated += char;
    }
  }

  return truncated;
}

/**
 * Strips formatting characters to produce a normalized compact UK mobile string.
 */
export function normalizeUkMobile(value: string): string {
  const compact = value.replace(/[\s()-]/g, '');

  if (compact.startsWith('0044')) {
    return `+${compact.slice(2)}`;
  }

  if (compact.startsWith('447')) {
    return `+${compact}`;
  }

  return compact;
}

/**
 * Validates whether the given string is a valid UK mobile number.
 */
export function isValidUkMobile(value: string): boolean {
  return UK_MOBILE_REGEX.test(normalizeUkMobile(value));
}
