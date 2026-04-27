"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { INVESTMENT_PLANS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApp } from "@/app/providers";

const schema = z.object({
  planId: z.string().min(1),
  amount: z.coerce.number().min(100, "Amount too low"),
});

type FormValues = z.infer<typeof schema>;

export default function InvestmentsPage() {
  const { user, invest, claimReturns, pushToast } = useApp();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { planId: INVESTMENT_PLANS[0].id },
  });
  if (!user) return null;

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit((values) => {
          const plan = INVESTMENT_PLANS.find((item) => item.id === values.planId);
          if (!plan) return;
          if (values.amount < plan.minDeposit) {
            pushToast("error", `Minimum for ${plan.name} is ${formatCurrency(plan.minDeposit)}.`);
            return;
          }
          try {
            invest(values.amount, plan);
            pushToast("success", "Investment created.");
            reset({ amount: undefined, planId: plan.id });
          } catch (error) {
            pushToast("error", (error as Error).message);
          }
        })}
        className="glass max-w-2xl space-y-4 p-6"
      >
        <h1 className="font-heading text-2xl">Create Investment</h1>
        <select {...register("planId")} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3">
          {INVESTMENT_PLANS.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.name} - min {formatCurrency(plan.minDeposit)}</option>
          ))}
        </select>
        <input type="number" {...register("amount")} placeholder="Amount (USD)" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
        {errors.amount && <p className="text-xs text-red-300">{errors.amount.message}</p>}
        <button className="gold-button">Start Investment</button>
      </form>

      <div className="glass overflow-x-auto p-5">
        <h2 className="font-heading text-xl">My Investments</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-mutedText">
            <tr>
              <th>Plan</th><th>Amount</th><th>Start</th><th>End</th><th>Returns</th><th>Status</th><th />
            </tr>
          </thead>
          <tbody>
            {user.investments.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="py-2">{item.planName}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.endDate)}</td>
                <td>{formatCurrency(item.estimatedReturn)}</td>
                <td className="capitalize">{item.status}</td>
                <td>
                  <button
                    disabled={item.status !== "matured" || item.claimed}
                    onClick={() => {
                      try {
                        claimReturns(item.id);
                        pushToast("success", "Returns claimed.");
                      } catch (error) {
                        pushToast("error", (error as Error).message);
                      }
                    }}
                    className="rounded-full border border-white/20 px-3 py-1 disabled:opacity-50"
                  >
                    Claim Returns
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
