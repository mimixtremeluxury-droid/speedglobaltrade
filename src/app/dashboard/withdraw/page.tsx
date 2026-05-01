"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/lib/store";

const schema = z.object({
  amount: z.coerce.number().min(100, "Minimum withdrawal is $100."),
  method: z.string().min(2, "Choose a settlement rail."),
});

type FormValues = z.infer<typeof schema>;

export default function WithdrawPage() {
  const withdraw = useAppStore((state) => state.withdraw);
  const pushToast = useAppStore((state) => state.pushToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 500,
      method: "USDT Transfer",
    },
  });

  return (
    <section className="surface max-w-3xl p-6">
      <p className="section-kicker">Withdraw Capital</p>
      <h1 className="mt-2 font-heading text-3xl text-ink">Request payouts with a simplified, premium workflow</h1>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            withdraw(values.amount, values.method);
            pushToast({
              title: "Withdrawal queued",
              description: `${values.method} has been added to the release queue.`,
              tone: "success",
            });
            reset({ ...values, amount: 500 });
          } catch (error) {
            pushToast({
              title: "Unable to withdraw",
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
          <label className="mb-2 block text-sm text-body/72">Settlement method</label>
          <select
            {...register("method")}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111e] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
          >
            <option>USDT Transfer</option>
            <option>Bank Transfer</option>
            <option>Stablecoin Desk</option>
          </select>
          {errors.method ? <p className="mt-2 text-sm text-red-300">{errors.method.message}</p> : null}
        </div>
        <button type="submit" disabled={isSubmitting} className="gold-button w-full">
          {isSubmitting ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </form>
    </section>
  );
}
