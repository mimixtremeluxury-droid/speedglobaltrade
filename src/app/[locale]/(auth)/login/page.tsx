"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { PageShell } from "@/components/ui/page-shell";
import { useAppStore } from "@/lib/store";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Please enter your password."),
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

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const signIn = useAppStore((state) => state.signIn);
  const loadDemoAccount = useAppStore((state) => state.useDemoAccount);
  const pushToast = useAppStore((state) => state.pushToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEMO_CREDENTIALS,
  });

  return (
    <PageShell className="flex min-h-screen items-center justify-center py-12">
      <div className="surface w-full max-w-lg p-7 sm:p-8">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="mt-3 font-heading text-4xl text-ink">{t("title")}</h1>
        <p className="mt-4 text-sm leading-7 text-body/72">{t("description")}</p>

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              const user = signIn(values.email, values.password);
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
          className="mt-8 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm text-body/72">{t("email")}</label>
            <input
              {...register("email")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-300">{errors.email.message}</p> : null}
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
          <button type="submit" disabled={isSubmitting} className="gold-button w-full">
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>

        <button
          type="button"
          onClick={async () => {
            try {
              const user = loadDemoAccount();
              await establishSession(user.profile.email, user.profile.fullName);
              pushToast({
                title: t("demoTitle"),
                description: t("demoDescription"),
                tone: "info",
              });
              router.push("/dashboard");
            } catch (error) {
              pushToast({
                title: t("demoErrorTitle"),
                description: (error as Error).message,
                tone: "error",
              });
            }
          }}
          className="ghost-button mt-4 w-full"
        >
          {t("demo")}
        </button>

        <p className="mt-6 text-sm text-body/68">
          {t("signupPrompt")}{" "}
          <Link href="/signup" className="text-gold transition hover:text-[#ffd36f]">
            {t("signupLink")}
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
