"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/lib/store";

const schema = z.object({
  amount: z.coerce.number().min(100, "Minimum deposit is $100."),
  method: z.string().min(2, "Choose a funding method."),
});

type FormValues = z.infer<typeof schema>;

export default function DepositPage() {
  const deposit = useAppStore((state) => state.deposit);
  const pushToast = useAppStore((state) => state.pushToast);
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

  return (
    <section className="surface max-w-3xl p-6">
      <p className="section-kicker">Deposit Capital</p>
      <h1 className="mt-2 font-heading text-3xl text-ink">Fund your workspace with a premium intake flow</h1>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            deposit(values.amount, values.method);
            pushToast({
              title: "Funds confirmed",
              description: `${values.method} has been recorded in your portfolio.`,
              tone: "success",
            });
            reset({ ...values, amount: 1500 });
          } catch (error) {
            pushToast({
              title: "Funding failed",
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
        <button type="submit" disabled={isSubmitting} className="gold-button w-full">
          {isSubmitting ? "Processing..." : "Confirm Deposit"}
        </button>
      </form>
    </section>
  );
}
