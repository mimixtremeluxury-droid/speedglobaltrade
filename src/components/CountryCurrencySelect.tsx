"use client";

import { BadgeCheck, ChevronDown, Globe2 } from "lucide-react";

export type CountryCurrencyOption = {
  code: string;
  name: string;
  currency: string;
  flag: string;
};

type CountryCurrencySelectProps = {
  country: string;
  currency: string;
  countryLabel: string;
  currencyLabel: string;
  countryError?: string;
  currencyError?: string;
  onSelect: (data: {
    country: string;
    countryCode: string;
    currency: string;
    currencyLabel: string;
    flag: string;
  }) => void;
};

const currencyDisplayNames = new Intl.DisplayNames(["en"], { type: "currency" });

export const COUNTRIES: CountryCurrencyOption[] = [
  { code: "AF", name: "Afghanistan", currency: "AFN", flag: "🇦🇫" },
  { code: "AL", name: "Albania", currency: "ALL", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", currency: "DZD", flag: "🇩🇿" },
  { code: "AD", name: "Andorra", currency: "EUR", flag: "🇦🇩" },
  { code: "AO", name: "Angola", currency: "AOA", flag: "🇦🇴" },
  { code: "AG", name: "Antigua and Barbuda", currency: "XCD", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", currency: "ARS", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", currency: "AMD", flag: "🇦🇲" },
  { code: "AU", name: "Australia", currency: "AUD", flag: "🇦🇺" },
  { code: "AT", name: "Austria", currency: "EUR", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", currency: "AZN", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", currency: "BSD", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", currency: "BHD", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", currency: "BDT", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", currency: "BBD", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", currency: "BYN", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", currency: "EUR", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", currency: "BZD", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", currency: "XOF", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", currency: "BTN", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", currency: "BOB", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", currency: "BAM", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", currency: "BWP", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", currency: "BRL", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", currency: "BND", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", currency: "BGN", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", currency: "XOF", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", currency: "BIF", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", currency: "CVE", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", currency: "KHR", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", currency: "XAF", flag: "🇨🇲" },
  { code: "CA", name: "Canada", currency: "CAD", flag: "🇨🇦" },
  { code: "CF", name: "Central African Republic", currency: "XAF", flag: "🇨🇫" },
  { code: "TD", name: "Chad", currency: "XAF", flag: "🇹🇩" },
  { code: "CL", name: "Chile", currency: "CLP", flag: "🇨🇱" },
  { code: "CN", name: "China", currency: "CNY", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", currency: "COP", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", currency: "KMF", flag: "🇰🇲" },
  { code: "CG", name: "Congo", currency: "XAF", flag: "🇨🇬" },
  { code: "CD", name: "Congo (DRC)", currency: "CDF", flag: "🇨🇩" },
  { code: "CR", name: "Costa Rica", currency: "CRC", flag: "🇨🇷" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮" },
  { code: "HR", name: "Croatia", currency: "EUR", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", currency: "CUP", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", currency: "EUR", flag: "🇨🇾" },
  { code: "CZ", name: "Czechia", currency: "CZK", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", currency: "DKK", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", currency: "DJF", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", currency: "XCD", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", currency: "DOP", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", currency: "USD", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", currency: "EGP", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", currency: "USD", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", currency: "XAF", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", currency: "ERN", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", currency: "EUR", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", currency: "SZL", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", currency: "ETB", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", currency: "FJD", flag: "🇫🇯" },
  { code: "FI", name: "Finland", currency: "EUR", flag: "🇫🇮" },
  { code: "FR", name: "France", currency: "EUR", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", currency: "XAF", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", currency: "GMD", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", currency: "GEL", flag: "🇬🇪" },
  { code: "DE", name: "Germany", currency: "EUR", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "🇬🇭" },
  { code: "GR", name: "Greece", currency: "EUR", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", currency: "XCD", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", currency: "GTQ", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", currency: "GNF", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", currency: "XOF", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", currency: "GYD", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", currency: "HTG", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", currency: "HNL", flag: "🇭🇳" },
  { code: "HU", name: "Hungary", currency: "HUF", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", currency: "ISK", flag: "🇮🇸" },
  { code: "IN", name: "India", currency: "INR", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", currency: "IDR", flag: "🇮🇩" },
  { code: "IR", name: "Iran", currency: "IRR", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", currency: "IQD", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", currency: "EUR", flag: "🇮🇪" },
  { code: "IL", name: "Israel", currency: "ILS", flag: "🇮🇱" },
  { code: "IT", name: "Italy", currency: "EUR", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", currency: "JMD", flag: "🇯🇲" },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", currency: "JOD", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", currency: "KZT", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", currency: "AUD", flag: "🇰🇮" },
  { code: "KP", name: "North Korea", currency: "KPW", flag: "🇰🇵" },
  { code: "KR", name: "South Korea", currency: "KRW", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", currency: "KWD", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", currency: "KGS", flag: "🇰🇬" },
  { code: "LA", name: "Laos", currency: "LAK", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", currency: "EUR", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", currency: "LBP", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", currency: "LSL", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", currency: "LRD", flag: "🇱🇷" },
  { code: "LY", name: "Libya", currency: "LYD", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", currency: "CHF", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", currency: "EUR", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", currency: "EUR", flag: "🇱🇺" },
  { code: "MG", name: "Madagascar", currency: "MGA", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", currency: "MWK", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", currency: "MYR", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", currency: "MVR", flag: "🇲🇻" },
  { code: "ML", name: "Mali", currency: "XOF", flag: "🇲🇱" },
  { code: "MT", name: "Malta", currency: "EUR", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", currency: "USD", flag: "🇲🇭" },
  { code: "MR", name: "Mauritania", currency: "MRU", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", currency: "MUR", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", currency: "MXN", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", currency: "USD", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", currency: "MDL", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", currency: "EUR", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", currency: "MNT", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", currency: "EUR", flag: "🇲🇪" },
  { code: "MA", name: "Morocco", currency: "MAD", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", currency: "MZN", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", currency: "MMK", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", currency: "NAD", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", currency: "AUD", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", currency: "NPR", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", currency: "EUR", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", currency: "NZD", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", currency: "NIO", flag: "🇳🇮" },
  { code: "NE", name: "Niger", currency: "XOF", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { code: "MK", name: "North Macedonia", currency: "MKD", flag: "🇲🇰" },
  { code: "NO", name: "Norway", currency: "NOK", flag: "🇳🇴" },
  { code: "OM", name: "Oman", currency: "OMR", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", currency: "PKR", flag: "🇵🇰" },
  { code: "PW", name: "Palau", currency: "USD", flag: "🇵🇼" },
  { code: "PS", name: "Palestine", currency: "ILS", flag: "🇵🇸" },
  { code: "PA", name: "Panama", currency: "PAB", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", currency: "PGK", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", currency: "PYG", flag: "🇵🇾" },
  { code: "PE", name: "Peru", currency: "PEN", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", currency: "PHP", flag: "🇵🇭" },
  { code: "PL", name: "Poland", currency: "PLN", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", currency: "EUR", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", currency: "QAR", flag: "🇶🇦" },
  { code: "RO", name: "Romania", currency: "RON", flag: "🇷🇴" },
  { code: "RU", name: "Russia", currency: "RUB", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", currency: "RWF", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts and Nevis", currency: "XCD", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", currency: "XCD", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", currency: "XCD", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", currency: "WST", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", currency: "EUR", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", currency: "STN", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", currency: "XOF", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", currency: "RSD", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", currency: "SCR", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", currency: "SLL", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", currency: "SGD", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", currency: "EUR", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", currency: "EUR", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", currency: "SBD", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", currency: "SOS", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", currency: "ZAR", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", currency: "SSP", flag: "🇸🇸" },
  { code: "ES", name: "Spain", currency: "EUR", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", currency: "LKR", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", currency: "SDG", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", currency: "SRD", flag: "🇸🇷" },
  { code: "SE", name: "Sweden", currency: "SEK", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", currency: "CHF", flag: "🇨🇭" },
  { code: "SY", name: "Syria", currency: "SYP", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", currency: "TWD", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", currency: "TJS", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", currency: "TZS", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", currency: "THB", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", currency: "USD", flag: "🇹🇱" },
  { code: "TG", name: "Togo", currency: "XOF", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", currency: "TOP", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", currency: "TTD", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", currency: "TND", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", currency: "TRY", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", currency: "TMT", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", currency: "AUD", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", currency: "UGX", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", currency: "UAH", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
  { code: "US", name: "United States", currency: "USD", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", currency: "UYU", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", currency: "UZS", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", currency: "VUV", flag: "🇻🇺" },
  { code: "VA", name: "Vatican City", currency: "EUR", flag: "🇻🇦" },
  { code: "VE", name: "Venezuela", currency: "VES", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", currency: "VND", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", currency: "YER", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", currency: "ZMW", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", currency: "ZWL", flag: "🇿🇼" },
  { code: "XK", name: "Kosovo", currency: "EUR", flag: "🇽🇰" },
].sort((left, right) => left.name.localeCompare(right.name));

export const DEFAULT_SIGNUP_COUNTRY = "United Kingdom";

export function getCountryByName(name: string) {
  return COUNTRIES.find((country) => country.name === name) ?? null;
}

export function getCurrencyLabel(currencyCode: string) {
  return currencyDisplayNames.of(currencyCode) ?? currencyCode;
}

const CURRENCIES = Array.from(new Set(COUNTRIES.map((country) => country.currency)))
  .sort((left, right) => left.localeCompare(right))
  .map((currency) => ({
    code: currency,
    label: getCurrencyLabel(currency),
  }));

function FieldShell({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-body/70">{label}</span>
      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] px-4 py-3 transition focus-within:border-cyan/45 focus-within:bg-white/[0.05]">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0 text-gold/80" />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </label>
  );
}

export default function CountryCurrencySelect({
  country,
  currency,
  countryLabel,
  currencyLabel,
  countryError,
  currencyError,
  onSelect,
}: CountryCurrencySelectProps) {
  const currentCountry = getCountryByName(country) ?? getCountryByName(DEFAULT_SIGNUP_COUNTRY) ?? COUNTRIES[0];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FieldShell label={countryLabel} icon={Globe2} error={countryError}>
        <div className="relative">
          <select
            name="country"
            value={currentCountry.name}
            onChange={(event) => {
              const nextCountry = getCountryByName(event.target.value);
              if (!nextCountry) {
                return;
              }

              onSelect({
                country: nextCountry.name,
                countryCode: nextCountry.code,
                currency: nextCountry.currency,
                currencyLabel: getCurrencyLabel(nextCountry.currency),
                flag: nextCountry.flag,
              });
            }}
            className="h-7 w-full appearance-none bg-transparent pr-6 text-left text-sm text-ink outline-none"
          >
            {COUNTRIES.map((option) => (
              <option key={option.code} value={option.name}>
                {option.flag} {option.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1 h-4 w-4 text-body/55" />
        </div>
      </FieldShell>

      <FieldShell label={currencyLabel} icon={BadgeCheck} error={currencyError}>
        <div className="relative">
          <select
            name="currency"
            value={currency}
            onChange={(event) => {
              onSelect({
                country: currentCountry.name,
                countryCode: currentCountry.code,
                currency: event.target.value,
                currencyLabel: getCurrencyLabel(event.target.value),
                flag: currentCountry.flag,
              });
            }}
            className="h-7 w-full appearance-none bg-transparent pr-6 text-left text-sm text-ink outline-none"
          >
            {CURRENCIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1 h-4 w-4 text-body/55" />
        </div>
      </FieldShell>
    </div>
  );
}
