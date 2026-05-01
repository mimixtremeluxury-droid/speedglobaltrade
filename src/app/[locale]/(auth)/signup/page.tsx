"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { useAppStore } from "@/lib/store";
import { AppLocale } from "@/lib/types";

const schema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name."),
    email: z.string().email("Please enter a valid email."),
    country: z.string().min(2, "Please enter your country."),
    password: z.string().min(8, "Choose a password with at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

type FormValues = z.infer<typeof schema>;

async function establishSession(email: string, fullName: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, fullName }),
  });
  if (!response.ok) throw new Error("Unable to establish a secure session.");
}

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const signUp = useAppStore((state) => state.signUp);
  const pushToast = useAppStore((state) => state.pushToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      country: "United Kingdom",
    },
  });

  return (
    <PageShell className="flex min-h-screen items-center justify-center py-12">
      <div className="surface w-full max-w-2xl p-7 sm:p-8">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="mt-3 font-heading text-4xl text-ink">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-body/72">{t("description")}</p>

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              const user = signUp({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                country: values.country,
                locale: locale as AppLocale,
              });
              await establishSession(user.profile.email, user.profile.fullName);
              pushToast({
                title: t("successTitle"),
                description: t("successDescription"),
                tone: "success",
              });
              router.push("/dashboard");
            } catch (error) {
              pushToast({
                title: t("errorTitle"),
                description: (error as Error).message,
                tone: "error",
              });
            }
          })}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-body/72">{t("fullName")}</label>
            <input
              {...register("fullName")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.fullName ? <p className="mt-2 text-sm text-red-300">{errors.fullName.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-body/72">{t("email")}</label>
            <input
              {...register("email")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-300">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-body/72">{t("country")}</label>
            <input
              {...register("country")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.country ? <p className="mt-2 text-sm text-red-300">{errors.country.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-body/72">{t("password")}</label>
            <input
              type="password"
              {...register("password")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.password ? <p className="mt-2 text-sm text-red-300">{errors.password.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-body/72">{t("confirmPassword")}</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.confirmPassword ? <p className="mt-2 text-sm text-red-300">{errors.confirmPassword.message}</p> : null}
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="gold-button w-full">
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-body/68">
          {t("loginPrompt")}{" "}
          <Link href="/login" className="text-gold transition hover:text-[#ffd36f]">
            {t("loginLink")}
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
