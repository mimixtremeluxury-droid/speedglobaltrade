"use client";

import { BadgeCheck, Check, ChevronDown, Globe2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

type CurrencyOption = {
  code: string;
  label: string;
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

const CURRENCIES: CurrencyOption[] = Array.from(new Set(COUNTRIES.map((country) => country.currency)))
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
    <div className="block">
      <span className="mb-2 block text-sm text-body/70">{label}</span>
      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] px-4 py-3 transition focus-within:border-cyan/45 focus-within:bg-white/[0.05]">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

function DropdownTrigger({
  open,
  title,
  subtitle,
  leading,
  onClick,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  leading?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-[1.2rem] border border-white/8 bg-[#0f1727] px-4 py-3 text-left transition hover:border-cyan/35 hover:bg-[#121d31]"
      aria-expanded={open}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading ? <span className="text-lg leading-none">{leading}</span> : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <p className="truncate text-xs text-body/55">{subtitle}</p>
        </div>
      </div>
      <ChevronDown className={`h-4 w-4 shrink-0 text-body/55 transition ${open ? "rotate-180" : ""}`} />
    </button>
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<"country" | "currency" | null>(null);
  const [countryQuery, setCountryQuery] = useState("");

  const currentCountry = useMemo(
    () => getCountryByName(country) ?? getCountryByName(DEFAULT_SIGNUP_COUNTRY) ?? COUNTRIES[0],
    [country],
  );

  const currentCurrency = useMemo(
    () => CURRENCIES.find((option) => option.code === currency) ?? { code: currency, label: getCurrencyLabel(currency) },
    [currency],
  );

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    if (!query) {
      return COUNTRIES;
    }

    return COUNTRIES.filter((option) => {
      return (
        option.name.toLowerCase().includes(query) ||
        option.code.toLowerCase().includes(query) ||
        option.currency.toLowerCase().includes(query)
      );
    });
  }, [countryQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCountry = (nextCountry: CountryCurrencyOption) => {
    onSelect({
      country: nextCountry.name,
      countryCode: nextCountry.code,
      currency: nextCountry.currency,
      currencyLabel: getCurrencyLabel(nextCountry.currency),
      flag: nextCountry.flag,
    });
    setCountryQuery("");
    setOpenMenu(null);
  };

  const selectCurrency = (nextCurrency: CurrencyOption) => {
    onSelect({
      country: currentCountry.name,
      countryCode: currentCountry.code,
      currency: nextCurrency.code,
      currencyLabel: nextCurrency.label,
      flag: currentCountry.flag,
    });
    setOpenMenu(null);
  };

  return (
    <div ref={rootRef} className="grid gap-4 md:grid-cols-2">
      <FieldShell label={countryLabel} icon={Globe2} error={countryError}>
        <div className="relative">
          <DropdownTrigger
            open={openMenu === "country"}
            title={currentCountry.name}
            subtitle={`${currentCountry.code} · ${currentCountry.currency}`}
            leading={currentCountry.flag}
            onClick={() => setOpenMenu((current) => (current === "country" ? null : "country"))}
          />

          {openMenu === "country" ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[95] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#08111e]/98 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/8 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <Search className="h-4 w-4 text-body/45" />
                  <input
                    value={countryQuery}
                    onChange={(event) => setCountryQuery(event.target.value)}
                    placeholder="Search country or currency"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-body/35"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredCountries.map((option) => {
                  const isSelected = option.code === currentCountry.code;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => selectCountry(option)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-lg leading-none">{option.flag}</span>
                        <div className="min-w-0">
                          <p className={`truncate text-sm ${isSelected ? "text-gold" : "text-ink"}`}>{option.name}</p>
                          <p className="truncate text-xs text-body/55">
                            {option.code} · {option.currency}
                          </p>
                        </div>
                      </div>
                      {isSelected ? <Check className="h-4 w-4 shrink-0 text-gold" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </FieldShell>

      <FieldShell label={currencyLabel} icon={BadgeCheck} error={currencyError}>
        <div className="relative">
          <DropdownTrigger
            open={openMenu === "currency"}
            title={currentCurrency.code}
            subtitle={currentCurrency.label}
            onClick={() => setOpenMenu((current) => (current === "currency" ? null : "currency"))}
          />

          {openMenu === "currency" ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[95] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#08111e]/98 shadow-2xl backdrop-blur-xl">
              <div className="max-h-72 overflow-y-auto p-2">
                {CURRENCIES.map((option) => {
                  const isSelected = option.code === currentCurrency.code;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => selectCurrency(option)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className={`truncate text-sm ${isSelected ? "text-gold" : "text-ink"}`}>{option.code}</p>
                        <p className="truncate text-xs text-body/55">{option.label}</p>
                      </div>
                      {isSelected ? <Check className="h-4 w-4 shrink-0 text-gold" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </FieldShell>
    </div>
  );
}
