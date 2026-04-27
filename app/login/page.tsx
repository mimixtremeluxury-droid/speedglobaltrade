"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ensureDemoUser, loginUser } from "@/lib/storage";
import { PageShell } from "@/components/ui/page-shell";
import { useApp } from "@/app/providers";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
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
            loginUser(values.email, values.password);
            refreshUser();
            pushToast("success", "Welcome back.");
            router.push("/dashboard");
          } catch (error) {
            pushToast("error", (error as Error).message);
          }
        })}
        className="glass space-y-4 p-6"
      >
        <h1 className="font-heading text-3xl">Login</h1>
        <input {...register("email")} placeholder="Email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        <input type="password" {...register("password")} placeholder="Password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.password && <p className="text-xs text-red-300">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="gold-button w-full">Login</button>
        <button
          type="button"
          onClick={() => {
            ensureDemoUser();
            refreshUser();
            pushToast("success", "Demo account loaded.");
            router.push("/dashboard");
          }}
          className="w-full rounded-full border border-white/15 px-5 py-2.5 hover:border-gold"
        >
          Demo Login
        </button>
        <p className="text-sm text-mutedText">
          New here? <Link href="/signup" className="text-gold">Create account</Link>
        </p>
      </form>
    </PageShell>
  );
}
