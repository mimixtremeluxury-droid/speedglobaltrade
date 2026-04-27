"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/app/providers";

const schema = z.object({
  amount: z.coerce.number().min(10, "Minimum deposit is $10"),
  method: z.enum(["Bank Transfer", "Crypto"]),
});

type FormValues = z.infer<typeof schema>;

export default function DepositPage() {
  const { deposit, pushToast } = useApp();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { method: "Bank Transfer" },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        deposit(values.amount, values.method);
        pushToast("success", "Deposit completed.");
        reset({ amount: undefined, method: "Bank Transfer" });
      })}
      className="glass max-w-lg space-y-4 p-6"
    >
      <h1 className="font-heading text-2xl">Deposit Funds</h1>
      <input type="number" {...register("amount")} placeholder="Amount (USD)" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.amount && <p className="text-xs text-red-300">{errors.amount.message}</p>}
      <select {...register("method")} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3">
        <option>Bank Transfer</option>
        <option>Crypto</option>
      </select>
      <button disabled={isSubmitting} className="gold-button w-full">Confirm Deposit</button>
    </form>
  );
}
