"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/lib/store";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  country: z.string().min(2, "Please enter your country."),
  locale: z.enum(["en", "es"]),
  twoFactorEnabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const user = useAppStore((state) => state.user);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const pushToast = useAppStore((state) => state.pushToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    reset({
      fullName: user.profile.fullName,
      country: user.profile.country,
      locale: user.profile.locale,
      twoFactorEnabled: user.profile.twoFactorEnabled,
    });
  }, [reset, user]);

  if (!user) return null;

  return (
    <section className="surface max-w-4xl p-6">
      <p className="section-kicker">Profile Settings</p>
      <h1 className="mt-2 font-heading text-3xl text-ink">Refine your workspace preferences</h1>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            updateSettings(values);
            pushToast({
              title: "Preferences saved",
              description: "Your investor profile has been updated locally.",
              tone: "success",
            });
          } catch (error) {
            pushToast({
              title: "Settings update failed",
              description: (error as Error).message,
              tone: "error",
            });
          }
        })}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-body/72">Full name</label>
          <input
            {...register("fullName")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          />
          {errors.fullName ? <p className="mt-2 text-sm text-red-300">{errors.fullName.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-body/72">Country</label>
          <input
            {...register("country")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          />
          {errors.country ? <p className="mt-2 text-sm text-red-300">{errors.country.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-body/72">Marketing language</label>
          <select
            {...register("locale")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111e] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <label className="md:col-span-2 flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4">
          <div>
            <p className="font-medium text-ink">Two-factor protection</p>
            <p className="text-sm text-body/65">Keep route access gated with a stronger investor posture.</p>
          </div>
          <input type="checkbox" {...register("twoFactorEnabled")} className="h-5 w-5 accent-[#F5A623]" />
        </label>
        <div className="md:col-span-2">
          <button type="submit" disabled={isSubmitting} className="gold-button w-full">
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </section>
  );
}
