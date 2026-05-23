"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CountryCurrencySelect, {
  DEFAULT_SIGNUP_COUNTRY,
  getCountryByName,
  getCurrencyLabel,
} from "@/components/CountryCurrencySelect";
import { Link, useRouter } from "@/i18n/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { useAppStore } from "@/lib/store";
import { AppLocale } from "@/lib/types";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email."),
  phoneNumber: z.string().min(7, "Please enter a valid phone number."),
  nationality: z.string().min(2, "Please choose your nationality."),
  currency: z.string().length(3, "Please choose your funding currency."),
  password: z.string().min(8, "Choose a password with at least 8 characters."),
  termsAccepted: z.boolean().refine((value) => value, {
    message: "Please accept the terms to continue.",
  }),
});

type FormValues = z.infer<typeof schema>;

const ADDITIONAL_SIGNUP_COPY: Record<
  AppLocale,
  {
    phoneNumber: string;
    nationality: string;
    currency: string;
    termsAgreement: string;
    termsLink: string;
    startingBalanceLabel: string;
    phonePlaceholder: string;
    fundingSummary: string;
    balanceSummary: string;
  }
> = {
  en: {
    phoneNumber: "Phone number",
    nationality: "Nationality",
    currency: "Currency",
    termsAgreement: "I accept the onboarding terms, product disclosures, and service conditions for this account.",
    termsLink: "Review terms",
    startingBalanceLabel: "Starting balance",
    phonePlaceholder: "Enter your mobile or WhatsApp number",
    fundingSummary: "Your account opens in {currency}, your nationality is set to {nationality}, and the dashboard stays at 0.00 until a deposit is confirmed.",
    balanceSummary: "Your live portfolio stays at 0.00 until your first completed deposit settles inside the dashboard.",
  },
  es: {
    phoneNumber: "Telefono",
    nationality: "Nacionalidad",
    currency: "Moneda",
    termsAgreement: "Acepto los terminos de onboarding, las divulgaciones del producto y las condiciones del servicio para esta cuenta.",
    termsLink: "Revisar terminos",
    startingBalanceLabel: "Saldo inicial",
    phonePlaceholder: "Ingresa tu numero movil o de WhatsApp",
    fundingSummary: "Tu cuenta se abre en {currency}, tu nacionalidad actual es {nationality} y el panel se mantiene en 0.00 hasta que se confirme un deposito.",
    balanceSummary: "Tu portafolio en vivo se mantiene en 0.00 hasta que se liquide tu primer deposito completado dentro del panel.",
  },
  zh: {
    phoneNumber: "\u624b\u673a\u53f7",
    nationality: "\u56fd\u7c4d",
    currency: "\u8d27\u5e01",
    termsAgreement: "\u6211\u63a5\u53d7\u6b64\u8d26\u6237\u7684\u5f00\u6237\u6761\u6b3e\u3001\u4ea7\u54c1\u62ab\u9732\u4e0e\u670d\u52a1\u6761\u4ef6\u3002",
    termsLink: "\u67e5\u770b\u6761\u6b3e",
    startingBalanceLabel: "\u521d\u59cb\u4f59\u989d",
    phonePlaceholder: "\u8bf7\u8f93\u5165\u60a8\u7684\u624b\u673a\u53f7\u6216 WhatsApp \u53f7\u7801",
    fundingSummary: "\u60a8\u7684\u8d26\u6237\u5c06\u4ee5 {currency} \u5f00\u901a\uff0c\u56fd\u7c4d\u8bbe\u4e3a {nationality}\uff0c\u5728\u9996\u7b14\u5165\u91d1\u786e\u8ba4\u524d\u4eea\u8868\u76d8\u5c06\u4fdd\u6301 0.00\u3002",
    balanceSummary: "\u5728\u63a7\u5236\u53f0\u4e2d\u7b2c\u4e00\u7b14\u5df2\u5b8c\u6210\u5165\u91d1\u5230\u8d26\u4e4b\u524d\uff0c\u60a8\u7684\u5b9e\u65f6\u7ec4\u5408\u4f59\u989d\u5c06\u4fdd\u6301 0.00\u3002",
  },
  ar: {
    phoneNumber: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
    nationality: "\u0627\u0644\u062c\u0646\u0633\u064a\u0629",
    currency: "\u0627\u0644\u0639\u0645\u0644\u0629",
    termsAgreement: "\u0623\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0648\u0625\u0641\u0635\u0627\u062d\u0627\u062a \u0627\u0644\u0645\u0646\u062a\u062c \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u062d\u0633\u0627\u0628.",
    termsLink: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0634\u0631\u0648\u0637",
    startingBalanceLabel: "\u0627\u0644\u0631\u0635\u064a\u062f \u0627\u0644\u0627\u0641\u062a\u062a\u0627\u062d\u064a",
    phonePlaceholder: "\u0623\u062f\u062e\u0644 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 \u0623\u0648 WhatsApp",
    fundingSummary: "\u064a\u062a\u0645 \u0641\u062a\u062d \u0627\u0644\u062d\u0633\u0627\u0628 \u0628\u0639\u0645\u0644\u0629 {currency}\u060c \u0648\u0627\u0644\u062c\u0646\u0633\u064a\u0629 \u0627\u0644\u0645\u062d\u062f\u062f\u0629 \u0647\u064a {nationality}\u060c \u0648\u064a\u0628\u0642\u0649 \u0627\u0644\u0631\u0635\u064a\u062f 0.00 \u062d\u062a\u0649 \u062a\u0623\u0643\u064a\u062f \u0623\u0648\u0644 \u0625\u064a\u062f\u0627\u0639.",
    balanceSummary: "\u064a\u0628\u0642\u0649 \u0631\u0635\u064a\u062f \u0645\u062d\u0641\u0638\u062a\u0643 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 0.00 \u062d\u062a\u0649 \u062a\u0633\u0648\u064a\u0629 \u0623\u0648\u0644 \u0625\u064a\u062f\u0627\u0639 \u0645\u0643\u062a\u0645\u0644 \u062f\u0627\u062e\u0644 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645.",
  },
  hi: {
    phoneNumber: "\u092b\u094b\u0928 \u0928\u0902\u092c\u0930",
    nationality: "\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f\u0924\u093e",
    currency: "\u0915\u0930\u0947\u0902\u0938\u0940",
    termsAgreement: "\u092e\u0948\u0902 \u0907\u0938 \u0916\u093e\u0924\u0947 \u0915\u0947 \u0932\u093f\u090f \u0911\u0928\u092c\u094b\u0930\u094d\u0921\u093f\u0902\u0917 \u0936\u0930\u094d\u0924\u094b\u0902, \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f \u0921\u093f\u0938\u094d\u0915\u094d\u0932\u094b\u091c\u0930 \u0914\u0930 \u0938\u0947\u0935\u093e \u0928\u093f\u092f\u092e\u094b\u0902 \u0915\u094b \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0915\u0930\u0924\u093e \u0939\u0942\u0901.",
    termsLink: "\u0928\u093f\u092f\u092e \u0926\u0947\u0916\u0947\u0902",
    startingBalanceLabel: "\u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0936\u0947\u0937\u0930\u093e\u0936\u093f",
    phonePlaceholder: "\u0905\u092a\u0928\u093e \u092e\u094b\u092c\u093e\u0907\u0932 \u092f\u093e WhatsApp \u0928\u0902\u092c\u0930 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
    fundingSummary: "\u0906\u092a\u0915\u093e \u0916\u093e\u0924\u093e {currency} \u092e\u0947\u0902 \u0916\u0941\u0932\u0947\u0917\u093e, \u091a\u0941\u0928\u0940 \u0917\u0908 \u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f\u0924\u093e {nationality} \u0939\u0948, \u0914\u0930 \u092a\u0939\u0932\u093e \u0921\u093f\u092a\u0949\u091c\u093f\u091f \u0915\u0928\u094d\u092b\u0930\u094d\u092e \u0939\u094b\u0928\u0947 \u0924\u0915 \u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921 0.00 \u092a\u0930 \u0930\u0939\u0947\u0917\u093e.",
    balanceSummary: "\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921 \u0915\u0947 \u0905\u0902\u0926\u0930 \u092a\u0939\u0932\u093e \u0938\u092b\u0932 \u0921\u093f\u092a\u0949\u091c\u093f\u091f \u0938\u0947\u091f\u0932 \u0939\u094b\u0928\u0947 \u0924\u0915 \u0906\u092a\u0915\u0940 \u0932\u093e\u0907\u0935 \u092a\u094b\u0930\u094d\u091f\u092b\u094b\u0932\u093f\u092f\u094b \u0935\u0948\u0932\u094d\u092f\u0942 0.00 \u0930\u0939\u0947\u0917\u0940.",
  },
};

function SignupFieldShell({
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

function inputClassName(withTrailingIcon = false) {
  return `h-7 w-full bg-transparent text-sm text-ink outline-none placeholder:text-body/35 ${withTrailingIcon ? "pr-8" : ""}`;
}

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const signUp = useAppStore((state) => state.signUp);
  const pushToast = useAppStore((state) => state.pushToast);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState(DEFAULT_SIGNUP_COUNTRY);
  const [selectedCurrency, setSelectedCurrency] = useState("GBP");
  const [phoneValue, setPhoneValue] = useState("");
  const copy = ADDITIONAL_SIGNUP_COPY[locale as AppLocale] ?? ADDITIONAL_SIGNUP_COPY.en;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      nationality: DEFAULT_SIGNUP_COUNTRY,
      currency: "GBP",
      phoneNumber: "",
      termsAccepted: false,
    },
  });

  const selectedJurisdiction = useMemo(
    () => getCountryByName(selectedNationality) ?? getCountryByName(DEFAULT_SIGNUP_COUNTRY)!,
    [selectedNationality],
  );

  return (
    <PageShell className="py-8 sm:py-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d]/92 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(245,166,35,0.18),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(0,240,255,0.09),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)]" />
        <div className="relative grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
          <aside className="border-b border-white/8 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="max-w-xl">
              <p className="section-kicker">{t("eyebrow")}</p>
              <h1 className="mt-4 font-heading text-4xl tracking-[-0.05em] text-ink sm:text-5xl">{t("title")}</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-body/75">{t("description")}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="surface-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold/88">{copy.nationality}</p>
                  <p className="mt-3 font-heading text-xl text-ink">
                    {selectedJurisdiction.flag} {selectedJurisdiction.name}
                  </p>
                  <p className="mt-1 text-sm text-body/62">{selectedJurisdiction.code}</p>
                </div>
                <div className="surface-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold/88">{copy.currency}</p>
                  <p className="mt-3 font-heading text-xl text-ink">{selectedCurrency}</p>
                  <p className="mt-1 text-sm text-body/62">{getCurrencyLabel(selectedCurrency)}</p>
                </div>
              </div>

              <div className="surface-soft mt-6 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-gold/20 bg-gold/10 p-2 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-lg text-ink">{t("verificationTitle")}</p>
                    <p className="mt-2 text-sm leading-7 text-body/70">{t("successDescription")}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-[1.3rem] border border-white/8 bg-white/[0.02] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-body/45">{copy.startingBalanceLabel}</p>
                      <p className="mt-1 font-heading text-2xl text-ink">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: selectedCurrency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(0)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-cyan" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-body/68">{copy.balanceSummary}</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="p-6 sm:p-8">
            {notice ? (
              <div className="mb-6 rounded-3xl border border-cyan/20 bg-cyan/10 px-4 py-4 text-sm leading-7 text-body/82">
                {notice === "auth-unavailable"
                  ? t("authUnavailableNotice")
                  : notice === "verification-expired"
                    ? t("verificationExpiredNotice")
                    : t("verificationInvalidNotice")}
              </div>
            ) : null}
            <form
              onSubmit={handleSubmit(async (values) => {
                try {
                  await signUp({
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                    country: values.nationality,
                    locale: locale as AppLocale,
                  });
                  pushToast({
                    title: t("verificationTitle"),
                    description: t("successDescription"),
                    tone: "success",
                  });
                  router.push(`/login?email=${encodeURIComponent(values.email)}&notice=verify-signup`);
                } catch (error) {
                  pushToast({
                    title: t("errorTitle"),
                    description: (error as Error).message,
                    tone: "error",
                  });
                }
              })}
              className="space-y-4"
            >
              <input type="hidden" {...register("phoneNumber")} />
              <input type="hidden" {...register("nationality")} />
              <input type="hidden" {...register("currency")} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <SignupFieldShell label={t("fullName")} icon={UserRound} error={errors.fullName?.message}>
                    <input
                      {...register("fullName")}
                      className={inputClassName()}
                      placeholder="Oliver Grant"
                      autoComplete="name"
                    />
                  </SignupFieldShell>
                </div>

                <div className="md:col-span-2">
                  <SignupFieldShell label={t("email")} icon={Mail} error={errors.email?.message}>
                    <input
                      {...register("email")}
                      className={inputClassName()}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </SignupFieldShell>
                </div>

                <div className="md:col-span-2">
                  <SignupFieldShell label={copy.phoneNumber} icon={Phone} error={errors.phoneNumber?.message}>
                    <input
                      value={phoneValue}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setPhoneValue(nextValue);
                        setValue("phoneNumber", nextValue, { shouldDirty: true, shouldValidate: true });
                      }}
                      name="phoneNumber"
                      className={inputClassName()}
                      placeholder={copy.phonePlaceholder}
                      autoComplete="tel"
                    />
                  </SignupFieldShell>
                </div>

                <div className="md:col-span-2">
                  <CountryCurrencySelect
                    country={selectedNationality}
                    currency={selectedCurrency}
                    countryLabel={copy.nationality}
                    currencyLabel={copy.currency}
                    countryError={errors.nationality?.message}
                    currencyError={errors.currency?.message}
                    onSelect={({ country, currency }) => {
                      setSelectedNationality(country);
                      setSelectedCurrency(currency);
                      setValue("nationality", country, { shouldDirty: true, shouldValidate: true });
                      setValue("currency", currency, { shouldDirty: true, shouldValidate: true });
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <SignupFieldShell label={t("password")} icon={ShieldCheck} error={errors.password?.message}>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className={inputClassName(true)}
                        placeholder="Create a secure password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-0 top-0 inline-flex h-7 items-center text-body/55 transition hover:text-ink"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </SignupFieldShell>
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-sm leading-7 text-body/72">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-gold focus:ring-gold/60"
                />
                <span>
                  {copy.termsAgreement}{" "}
                  <Link href="/terms-of-service" className="text-gold transition hover:text-[#ffd36f]">
                    {copy.termsLink}
                  </Link>
                  .
                </span>
              </label>
              {errors.termsAccepted ? <p className="text-sm text-red-300">{errors.termsAccepted.message}</p> : null}

              <div className="rounded-[1.4rem] border border-cyan/15 bg-cyan/10 px-4 py-4 text-sm text-body/82">
                <p className="font-medium text-ink">
                  {copy.currency}: {selectedCurrency}
                </p>
                <p className="mt-1 text-body/72">
                  {copy.fundingSummary
                    .replace("{currency}", selectedCurrency)
                    .replace("{nationality}", selectedJurisdiction.name)}
                </p>
              </div>

              <button type="submit" disabled={isSubmitting} className="gold-button h-14 w-full text-base">
                {isSubmitting ? t("submitting") : t("submit")}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-body/68">
              {t("loginPrompt")}{" "}
              <Link href="/login" className="text-gold transition hover:text-[#ffd36f]">
                {t("loginLink")}
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
