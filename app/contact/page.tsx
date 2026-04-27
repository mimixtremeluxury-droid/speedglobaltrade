"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageShell } from "@/components/ui/page-shell";
import { useApp } from "@/app/providers";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Please provide more details"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const { pushToast } = useApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <PageShell className="space-y-8">
      <h1 className="section-title">Contact Us</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <form
          onSubmit={handleSubmit(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            pushToast("success", "Message sent successfully.");
            reset();
          })}
          className="glass space-y-4 p-6"
        >
          <input {...register("name")} placeholder="Name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
          {errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
          <input {...register("email")} placeholder="Email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
          {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
          <textarea {...register("message")} placeholder="Message" rows={5} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
          {errors.message && <p className="text-xs text-red-300">{errors.message.message}</p>}
          <button disabled={isSubmitting} className="gold-button w-full">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
        <div className="space-y-4">
          <div className="glass p-5 text-sm text-mutedText">Email: support@speedglobaltrade.com</div>
          <div className="glass p-5 text-sm text-mutedText">Phone: +1 (800) 555-0199</div>
          <div className="glass p-5 text-sm text-mutedText">Address: 77 Wallbrook Ave, New York, NY</div>
          <div className="glass flex h-48 items-center justify-center text-mutedText">Map Placeholder</div>
        </div>
      </div>
    </PageShell>
  );
}
