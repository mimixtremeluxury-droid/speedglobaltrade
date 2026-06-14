"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { hasCompletedDeposit } from "@/lib/account";
import { DashboardOnboardingCard } from "@/components/dashboard/dashboard-onboarding-card";
import { useAppStore } from "@/lib/store";

const schema = z.object({
  amount: z.coerce.number().min(100, "Minimum withdrawal is $100."),
  method: z.enum(["USDT Withdrawal (Bitcoin)", "PayPal", "Bank Withdrawal", "Cash App Tag"], {
    required_error: "Choose a withdrawal method.",
  }),
  usdtAddress: z.string().optional(),
  paypalEmail: z.string().email("Invalid PayPal email.").optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
  cashAppTag: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function WithdrawPage() {
  const user = useAppStore((state) => state.user);
  const pushToast = useAppStore((state) => state.pushToast);
  const [withdrawalCode, setWithdrawalCode] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 500,
      method: "USDT Withdrawal (Bitcoin)",
    },
  });

  const selectedMethod = watch("method");

  if (!user) return null;
  if (!hasCompletedDeposit(user)) return <DashboardOnboardingCard />;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/dashboard/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: values.amount,
          method: values.method,
          usdtAddress: values.usdtAddress,
          paypalEmail: values.paypalEmail,
          bankName: values.bankName,
          bankAccountNumber: values.bankAccountNumber,
          bankRoutingNumber: values.bankRoutingNumber,
          cashAppTag: values.cashAppTag,
        }),
      });

      const data = await response.json() as { ok?: boolean; error?: string; withdrawalCode?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to create withdrawal request.");
      }

      setWithdrawalCode(data.withdrawalCode || null);
      setShowDialog(true);
      pushToast({
        title: "Withdrawal submitted",
        description: "Your withdrawal request is pending approval.",
        tone: "success",
      });
      reset({ amount: 500, method: "USDT Withdrawal (Bitcoin)" });
    } catch (error) {
      pushToast({
        title: "Unable to withdraw",
        description: (error as Error).message,
        tone: "error",
      });
    }
  };

  const copyToClipboard = () => {
    if (withdrawalCode) {
      navigator.clipboard.writeText(withdrawalCode);
      pushToast({
        title: "Code copied",
        description: "Withdrawal code copied to clipboard.",
        tone: "success",
      });
    }
  };

  return (
    <section className="surface max-w-3xl p-6">
      <p className="section-kicker">Withdraw Capital</p>
      <h1 className="mt-2 font-heading text-3xl text-ink">Request payouts with a simplified, premium workflow</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-body/72">Amount</label>
          <input
            type="number"
            {...register("amount")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          />
          {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-body/72">Withdrawal Method</label>
          <select
            {...register("method")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111e] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          >
            <option>USDT Withdrawal (Bitcoin)</option>
            <option>PayPal</option>
            <option>Bank Withdrawal</option>
            <option>Cash App Tag</option>
          </select>
          {errors.method ? <p className="mt-2 text-sm text-red-300">{errors.method.message}</p> : null}
        </div>

        {selectedMethod === "USDT Withdrawal (Bitcoin)" && (
          <div>
            <label className="mb-2 block text-sm text-body/72">USDT/Bitcoin Wallet Address</label>
            <input
              type="text"
              {...register("usdtAddress", { required: selectedMethod === "USDT Withdrawal (Bitcoin)" ? "Wallet address is required." : false })}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
              placeholder="Enter your USDT or Bitcoin wallet address"
            />
            {errors.usdtAddress ? <p className="mt-2 text-sm text-red-300">{errors.usdtAddress.message}</p> : null}
          </div>
        )}

        {selectedMethod === "PayPal" && (
          <div>
            <label className="mb-2 block text-sm text-body/72">PayPal Email</label>
            <input
              type="email"
              {...register("paypalEmail", { required: selectedMethod === "PayPal" ? "PayPal email is required." : false })}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
              placeholder="Enter your PayPal email"
            />
            {errors.paypalEmail ? <p className="mt-2 text-sm text-red-300">{errors.paypalEmail.message}</p> : null}
          </div>
        )}

        {selectedMethod === "Bank Withdrawal" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-body/72">Bank Name</label>
              <input
                type="text"
                {...register("bankName", { required: selectedMethod === "Bank Withdrawal" ? "Bank name is required." : false })}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
                placeholder="Enter your bank name"
              />
              {errors.bankName ? <p className="mt-2 text-sm text-red-300">{errors.bankName.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm text-body/72">Account Number</label>
              <input
                type="text"
                {...register("bankAccountNumber", { required: selectedMethod === "Bank Withdrawal" ? "Account number is required." : false })}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
                placeholder="Enter your account number"
              />
              {errors.bankAccountNumber ? <p className="mt-2 text-sm text-red-300">{errors.bankAccountNumber.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm text-body/72">Routing Number</label>
              <input
                type="text"
                {...register("bankRoutingNumber", { required: selectedMethod === "Bank Withdrawal" ? "Routing number is required." : false })}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
                placeholder="Enter your routing number"
              />
              {errors.bankRoutingNumber ? <p className="mt-2 text-sm text-red-300">{errors.bankRoutingNumber.message}</p> : null}
            </div>
          </div>
        )}

        {selectedMethod === "Cash App Tag" && (
          <div>
            <label className="mb-2 block text-sm text-body/72">Cash App Tag</label>
            <input
              type="text"
              {...register("cashAppTag", { required: selectedMethod === "Cash App Tag" ? "Cash App tag is required." : false })}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
              placeholder="Enter your Cash App tag (e.g., $username)"
            />
            {errors.cashAppTag ? <p className="mt-2 text-sm text-red-300">{errors.cashAppTag.message}</p> : null}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="gold-button w-full">
          {isSubmitting ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </form>

      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-midnight/80 backdrop-blur-md duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#07101c] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.48)] duration-200 data-[state=closed]:scale-95 data-[state=open]:scale-100 focus:outline-none">
            <Dialog.Title className="font-heading text-xl text-ink">Withdrawal Submitted</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-body/72">
              Your withdrawal request is pending approval. Contact support with your unique withdrawal code.
            </Dialog.Description>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/65">Withdrawal Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-white/5 px-3 py-2 font-mono text-sm text-cyan">{withdrawalCode}</code>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                  title="Copy code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-4">
              <p className="text-sm text-ink">
                Contact support at{" "}
                <a href="mailto:support@speedglobal.trade" className="font-semibold text-gold hover:underline">
                  support@speedglobal.trade
                </a>{" "}
                with this withdrawal code for approval.
              </p>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-cyan px-4 py-3 font-semibold text-white transition hover:bg-cyan/90"
              >
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
