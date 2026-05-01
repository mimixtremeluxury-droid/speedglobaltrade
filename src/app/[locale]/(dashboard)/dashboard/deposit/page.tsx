"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPendingDeposit, hasCompletedDeposit } from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  amount: z.coerce.number().min(100, "Minimum deposit is $100."),
  method: z.string().min(2, "Choose a funding method."),
});

type FormValues = z.infer<typeof schema>;

export default function DepositPage() {
  const user = useAppStore((state) => state.user);
  const requestDeposit = useAppStore((state) => state.requestDeposit);
  const completeDeposit = useAppStore((state) => state.completeDeposit);
  const pushToast = useAppStore((state) => state.pushToast);
  const pendingDeposit = getPendingDeposit(user);
  const activated = hasCompletedDeposit(user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 1500,
      method: "Wire Transfer",
    },
  });

  if (!user) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="surface p-6">
        <p className="section-kicker">Deposit Capital</p>
        <h1 className="mt-2 font-heading text-3xl text-ink">Request funding, then simulate settlement to activate the dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-body/72">
          New accounts stay in a waiting state until a deposit request is completed. In this mock workflow, you can
          submit a request and then confirm it with one click.
        </p>

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              requestDeposit(values.amount, values.method);
              pushToast({
                title: "Deposit request created",
                description: `${values.method} is now waiting for confirmation.`,
                tone: "success",
              });
              reset({ ...values, amount: 1500 });
            } catch (error) {
              pushToast({
                title: "Funding request failed",
                description: (error as Error).message,
                tone: "error",
              });
            }
          })}
          className="mt-8 space-y-4"
        >
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
            <label className="mb-2 block text-sm text-body/72">Method</label>
            <select
              {...register("method")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111e] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            >
              <option>Wire Transfer</option>
              <option>USDT Transfer</option>
              <option>Bank Card</option>
            </select>
            {errors.method ? <p className="mt-2 text-sm text-red-300">{errors.method.message}</p> : null}
          </div>
          <button type="submit" disabled={isSubmitting || Boolean(pendingDeposit)} className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Submitting..." : pendingDeposit ? "Pending Deposit In Progress" : "Create Deposit Request"}
          </button>
        </form>
      </section>

      <section className="surface p-6">
        <div className="flex items-center gap-3">
          {pendingDeposit ? <Clock3 className="h-5 w-5 text-cyan" /> : <CheckCircle2 className="h-5 w-5 text-gold" />}
          <div>
            <p className="section-kicker">Activation Status</p>
            <h2 className="mt-2 font-heading text-2xl text-ink">
              {pendingDeposit ? "Waiting for settlement confirmation" : activated ? "Your dashboard is active" : "No deposit request yet"}
            </h2>
          </div>
        </div>

        {pendingDeposit ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-5">
              <p className="text-sm text-body/72">Amount</p>
              <p className="mt-2 font-heading text-3xl text-ink">{formatCurrency(pendingDeposit.amount)}</p>
              <p className="mt-4 text-sm text-body/72">Method</p>
              <p className="mt-1 text-base text-ink">{pendingDeposit.method ?? "Funding Desk"}</p>
              <p className="mt-4 text-sm text-body/72">{pendingDeposit.note}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  completeDeposit(pendingDeposit.id);
                  pushToast({
                    title: "Deposit completed",
                    description: "Your balance has been credited and dashboard tracking is now active.",
                    tone: "success",
                  });
                } catch (error) {
                  pushToast({
                    title: "Unable to complete deposit",
                    description: (error as Error).message,
                    tone: "error",
                  });
                }
              }}
              className="gold-button w-full"
            >
              Simulate Successful Deposit
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-body/68">
            {activated
              ? "Your first deposit has already been completed. You can top up again whenever you want to add more available cash."
              : "Create your first deposit request to unlock charts, transactions, and portfolio monitoring."}
          </div>
        )}
      </section>
    </div>
  );
}
