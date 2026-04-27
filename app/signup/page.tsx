"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, loginUser } from "@/lib/storage";
import { PageShell } from "@/components/ui/page-shell";
import { useApp } from "@/app/providers";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { pushToast, refreshUser } = useApp();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <PageShell className="max-w-md">
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            createUser({
              name: values.name,
              email: values.email,
              password: values.password,
              twoFactorEnabled: false,
            });
            loginUser(values.email, values.password);
            refreshUser();
            pushToast("success", "Account created.");
            router.push("/dashboard");
          } catch (error) {
            pushToast("error", (error as Error).message);
          }
        })}
        className="glass space-y-4 p-6"
      >
        <h1 className="font-heading text-3xl">Create Account</h1>
        <input {...register("name")} placeholder="Name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
        <input {...register("email")} placeholder="Email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        <input type="password" {...register("password")} placeholder="Password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.password && <p className="text-xs text-red-300">{errors.password.message}</p>}
        <input type="password" {...register("confirmPassword")} placeholder="Confirm password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.confirmPassword && <p className="text-xs text-red-300">{errors.confirmPassword.message}</p>}
        <button disabled={isSubmitting} className="gold-button w-full">Create Account</button>
        <p className="text-sm text-mutedText">
          Already registered? <Link href="/login" className="text-gold">Login</Link>
        </p>
      </form>
    </PageShell>
  );
}
