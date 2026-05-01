"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
        <p className="section-kicker">Secure Login</p>
        <h1 className="mt-3 font-heading text-4xl text-ink">Access your investor workspace</h1>
        <p className="mt-4 text-sm leading-7 text-body/72">
          Signed session cookies protect dashboard routes, while your portfolio mock data stays persisted locally.
        </p>

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              const user = signIn(values.email, values.password);
              await establishSession(user.profile.email, user.profile.fullName);
              pushToast({
                title: "Welcome back",
                description: "Your premium dashboard is ready.",
                tone: "success",
              });
              router.push("/dashboard");
            } catch (error) {
              pushToast({
                title: "Login failed",
                description: (error as Error).message,
                tone: "error",
              });
            }
          })}
          className="mt-8 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm text-body/72">Email</label>
            <input
              {...register("email")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-300">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-body/72">Password</label>
            <input
              type="password"
              {...register("password")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.password ? <p className="mt-2 text-sm text-red-300">{errors.password.message}</p> : null}
          </div>
          <button type="submit" disabled={isSubmitting} className="gold-button w-full">
            {isSubmitting ? "Entering..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={async () => {
            try {
              const user = loadDemoAccount();
              await establishSession(user.profile.email, user.profile.fullName);
              pushToast({
                title: "Demo account loaded",
                description: "Explore the premium dashboard with pre-seeded portfolio data.",
                tone: "info",
              });
              router.push("/dashboard");
            } catch (error) {
              pushToast({
                title: "Demo access failed",
                description: (error as Error).message,
                tone: "error",
              });
            }
          }}
          className="ghost-button mt-4 w-full"
        >
          Use Demo Account
        </button>

        <p className="mt-6 text-sm text-body/68">
          Need a new account?{" "}
          <Link href="/signup" className="text-gold transition hover:text-[#ffd36f]">
            Open one here
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
