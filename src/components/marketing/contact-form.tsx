"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store";
import { wait } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(12, "Tell us a bit more so we can route your request."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("contact");
  const pushToast = useAppStore((state) => state.pushToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(async () => {
        await wait(500);
        pushToast({
          title: t("successTitle"),
          description: t("successDescription"),
          tone: "success",
        });
        reset();
      })}
      className="surface space-y-4 p-6"
    >
      <div>
        <label className="mb-2 block text-sm text-body/72">{t("name")}</label>
        <input
          {...register("name")}
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
        />
        {errors.name ? <p className="mt-2 text-sm text-red-300">{errors.name.message}</p> : null}
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
        <label className="mb-2 block text-sm text-body/72">{t("message")}</label>
        <textarea
          rows={6}
          {...register("message")}
          className="w-full rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink outline-none transition focus:border-cyan/60"
        />
        {errors.message ? <p className="mt-2 text-sm text-red-300">{errors.message.message}</p> : null}
      </div>
      <button type="submit" disabled={isSubmitting} className="gold-button w-full">
        {isSubmitting ? t("sending") : t("send")}
      </button>
    </form>
  );
}
