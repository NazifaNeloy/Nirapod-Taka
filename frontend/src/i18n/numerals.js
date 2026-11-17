// Bangla and English numeral converter

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts Western digits to Bangla numerals when language is 'bn', otherwise keeps Western digits.
 * @param {number|string} input - Number or string containing digits.
 * @param {string} [lang='bn'] - Target language code ('bn' or 'en').
 * @returns {string} Formatted string with appropriate numerals.
 */
export function formatNumerals(input, lang = 'bn') {
  if (input === null || input === undefined) return '';
  const str = String(input);
  if (lang !== 'bn') return str;
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[Number(digit)] || digit);
}

/**
 * Converts Bangla numerals to standard Western digits for internal normalization.
 * @param {string} input - String containing potential Bangla numerals.
 * @returns {string} String with all Bangla numerals replaced by Western digits (0-9).
 */
export function parseBanglaNumerals(input) {
  if (!input) return '';
  let str = String(input);
  BANGLA_DIGITS.forEach((bnDigit, idx) => {
    str = str.split(bnDigit).join(ENGLISH_DIGITS[idx]);
  });
  return str;
}
