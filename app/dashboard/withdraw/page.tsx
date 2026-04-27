"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/app/providers";

const schema = z.object({
  amount: z.coerce.number().min(20, "Minimum withdrawal is $20"),
  walletAddress: z.string().min(6, "Wallet address required"),
});

type FormValues = z.infer<typeof schema>;

export default function WithdrawPage() {
  const { withdraw, pushToast } = useApp();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          withdraw(values.amount, values.walletAddress);
          pushToast("success", "Withdrawal request submitted.");
          reset();
        } catch (error) {
          pushToast("error", (error as Error).message);
        }
      })}
      className="glass max-w-lg space-y-4 p-6"
    >
      <h1 className="font-heading text-2xl">Withdraw Funds</h1>
      <input type="number" {...register("amount")} placeholder="Amount (USD)" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.amount && <p className="text-xs text-red-300">{errors.amount.message}</p>}
      <input {...register("walletAddress")} placeholder="Wallet address" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
      {errors.walletAddress && <p className="text-xs text-red-300">{errors.walletAddress.message}</p>}
      <button disabled={isSubmitting} className="gold-button w-full">Request Withdrawal</button>
    </form>
  );
}
