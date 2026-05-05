export type SignupJurisdiction = {
  nationality: string;
  currency: string;
  currencyLabel: string;
  dialCode: string;
};

export const SIGNUP_JURISDICTIONS: SignupJurisdiction[] = [
  { nationality: "Australia", currency: "AUD", currencyLabel: "Australian Dollar", dialCode: "+61" },
  { nationality: "Canada", currency: "CAD", currencyLabel: "Canadian Dollar", dialCode: "+1" },
  { nationality: "China", currency: "CNY", currencyLabel: "Chinese Yuan", dialCode: "+86" },
  { nationality: "France", currency: "EUR", currencyLabel: "Euro", dialCode: "+33" },
  { nationality: "Germany", currency: "EUR", currencyLabel: "Euro", dialCode: "+49" },
  { nationality: "India", currency: "INR", currencyLabel: "Indian Rupee", dialCode: "+91" },
  { nationality: "Japan", currency: "JPY", currencyLabel: "Japanese Yen", dialCode: "+81" },
  { nationality: "Saudi Arabia", currency: "SAR", currencyLabel: "Saudi Riyal", dialCode: "+966" },
  { nationality: "Singapore", currency: "SGD", currencyLabel: "Singapore Dollar", dialCode: "+65" },
  { nationality: "South Korea", currency: "KRW", currencyLabel: "South Korean Won", dialCode: "+82" },
  { nationality: "Switzerland", currency: "CHF", currencyLabel: "Swiss Franc", dialCode: "+41" },
  { nationality: "United Arab Emirates", currency: "AED", currencyLabel: "UAE Dirham", dialCode: "+971" },
  { nationality: "United Kingdom", currency: "GBP", currencyLabel: "British Pound", dialCode: "+44" },
  { nationality: "United States", currency: "USD", currencyLabel: "US Dollar", dialCode: "+1" },
];

export const SIGNUP_CURRENCIES = Array.from(
  new Map(SIGNUP_JURISDICTIONS.map((item) => [item.currency, item])).values(),
).map(({ currency, currencyLabel }) => ({
  code: currency,
  label: currencyLabel,
}));

export function getJurisdictionByNationality(nationality: string) {
  return SIGNUP_JURISDICTIONS.find((item) => item.nationality === nationality) ?? null;
}
