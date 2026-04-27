"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/app/providers";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  twoFactorEnabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const { user, updateProfile, pushToast } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.profile.name ?? "",
      email: user?.profile.email ?? "",
      password: user?.profile.password ?? "",
      twoFactorEnabled: user?.profile.twoFactorEnabled ?? false,
    },
  });

  if (!user) return null;
  return (
    <form
      onSubmit={handleSubmit((values) => {
        updateProfile(values);
        pushToast("success", "Profile updated.");
      })}
      className="glass max-w-xl space-y-4 p-6"
    >
      <h1 className="font-heading text-2xl">Profile Settings</h1>
      <input {...register("name")} placeholder="Name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
      <input {...register("email")} placeholder="Email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
      <input type="password" {...register("password")} placeholder="Password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.password && <p className="text-xs text-red-300">{errors.password.message}</p>}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("twoFactorEnabled")} />
        Enable mock 2FA (TOTP simulation)
      </label>
      <button className="gold-button">Save Changes</button>
    </form>
  );
}
