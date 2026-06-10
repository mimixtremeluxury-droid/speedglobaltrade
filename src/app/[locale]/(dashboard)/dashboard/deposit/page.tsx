"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  FileCheck2,
  Landmark,
  ShieldCheck,
  UploadCloud,
  Wallet,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPendingDeposit, hasCompletedDeposit } from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const USDT_WALLET_ADDRESS = "TQwKxo6PwSwH71PdX1HEeGXDHh2SpfYjPs";
const SUPPORT_EMAIL = "service@speedglobal.trade";

const depositMethods = [
  {
    label: "Wire Transfer",
    icon: Landmark,
    description: "Contact support for verified banking instructions before sending funds.",
  },
  {
    label: "USDT Transfer",
    icon: Wallet,
    description: "Send USDT on TRON (TRC20), then upload the transfer proof for review.",
  },
  {
    label: "Bank Card",
    icon: CreditCard,
    description: "Contact support for secure card-processing guidance before payment.",
  },
] as const;

type DepositMethod = (typeof depositMethods)[number]["label"];

const schema = z.object({
  amount: z.coerce.number().min(100, "Minimum deposit is 100."),
  method: z.enum(["Wire Transfer", "USDT Transfer", "Bank Card"]),
});

type FormValues = z.infer<typeof schema>;

function FundingInstructionDialog({
  amountLabel,
  busy,
  method,
  onClose,
  onConfirm,
  onCopyWallet,
}: {
  amountLabel: string;
  busy: boolean;
  method: DepositMethod;
  onClose: () => void;
  onConfirm: () => void;
  onCopyWallet: () => void;
}) {
  const isUsdt = method === "USDT Transfer";
  const title = isUsdt ? "USDT TRON funding instructions" : `${method} instructions`;
  const description = isUsdt
    ? "Deposit only USDT through the TRON (TRC20) network. After sending, upload your payment proof so operations can verify and approve the balance."
    : "Please contact support for verified funding instructions. Your dashboard balance remains unchanged until proof is uploaded and operations approves the deposit.";
  const supportEmailHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `${method} funding instructions`,
  )}&body=${encodeURIComponent(
    `Hello Speed Global Trade,\n\nI need verified ${method} funding instructions for a ${amountLabel} deposit request.\n\nThank you.`,
  )}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/80 px-4 py-6 backdrop-blur-xl">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111e] p-6 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-body/70 transition hover:border-cyan/40 hover:text-cyan"
          aria-label="Close funding instructions"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 pr-10">
          <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
            {isUsdt ? <Wallet className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <p className="section-kicker">Funding Desk</p>
            <h2 className="mt-2 font-heading text-2xl text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-body/72">{description}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-body/45">Requested amount</p>
          <p className="mt-2 font-heading text-3xl text-ink">{amountLabel}</p>
        </div>

        {isUsdt ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-body/45">Network</p>
                  <p className="mt-1 font-medium text-ink">TRON (TRC20)</p>
                </div>
                <div className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">20 confirmations</div>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-body/45">Wallet address</p>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-midnight/60 p-4">
                <p className="min-w-0 flex-1 break-all font-heading text-lg text-ink">{USDT_WALLET_ADDRESS}</p>
                <button
                  type="button"
                  onClick={onCopyWallet}
                  disabled={busy}
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-cyan transition hover:border-cyan/50 hover:bg-cyan/10 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Copy USDT wallet address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button type="button" onClick={onCopyWallet} disabled={busy} className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? "Creating request..." : "Copy Address and Create Request"}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-ink transition hover:border-cyan/40 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-60"
            >
              I copied it manually
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <a
              href={supportEmailHref}
              className="block rounded-2xl border border-cyan/25 bg-cyan/10 px-5 py-3 text-center text-sm font-semibold text-cyan transition hover:border-cyan/60 hover:bg-cyan/15"
            >
              Contact Support
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DepositPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const requestDeposit = useAppStore((state) => state.requestDeposit);
  const submitDepositProof = useAppStore((state) => state.submitDepositProof);
  const pushToast = useAppStore((state) => state.pushToast);
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod>("Wire Transfer");
  const [instructionMethod, setInstructionMethod] = useState<DepositMethod | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const pendingDeposit = getPendingDeposit(user);
  const activated = hasCompletedDeposit(user);
  const locale = params?.locale || "en";
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 1500,
      method: "Wire Transfer",
    },
  });

  if (!user) return null;

  const amount = Number(getValues("amount") || 0);
  const amountLabel = formatCurrency(Number.isFinite(amount) ? amount : 0, user.profile.currency);

  const openFundingInstructions = (method: DepositMethod) => {
    if (pendingDeposit) {
      pushToast({
        title: "Deposit already pending",
        description: "Upload proof for the current request or wait for operations approval before creating another one.",
        tone: "info",
      });
      return;
    }

    setSelectedMethod(method);
    setValue("method", method, { shouldValidate: true });
    void handleSubmit(() => setInstructionMethod(method))();
  };

  const createRequestAndReturn = async (method: DepositMethod, copiedAddress = false) => {
    try {
      setIsCreating(true);
      await requestDeposit(Number(getValues("amount")), method);
      pushToast({
        title: copiedAddress ? "Wallet copied and request created" : "Deposit request created",
        description: "Your balance remains unchanged until payment proof is uploaded and approved.",
        tone: "success",
      });
      setInstructionMethod(null);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      pushToast({
        title: "Funding request failed",
        description: (error as Error).message,
        tone: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyWalletAndCreateRequest = async () => {
    try {
      await navigator.clipboard.writeText(USDT_WALLET_ADDRESS);
      await createRequestAndReturn("USDT Transfer", true);
    } catch {
      pushToast({
        title: "Copy failed",
        description: "Copy the wallet address manually, then continue the request.",
        tone: "error",
      });
    }
  };

  const uploadProof = async () => {
    if (!pendingDeposit || !proofFile) {
      pushToast({
        title: "Payment proof required",
        description: "Choose a JPG, PNG, WEBP, or PDF payment slip before submitting.",
        tone: "error",
      });
      return;
    }

    try {
      setIsUploadingProof(true);
      await submitDepositProof(pendingDeposit.id, proofFile);
      pushToast({
        title: "Payment proof submitted",
        description: "Operations will review the payment and approve the deposit once confirmed.",
        tone: "success",
      });
      setProofFile(null);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      pushToast({
        title: "Unable to upload proof",
        description: (error as Error).message,
        tone: "error",
      });
    } finally {
      setIsUploadingProof(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      {instructionMethod ? (
        <FundingInstructionDialog
          amountLabel={amountLabel}
          busy={isCreating}
          method={instructionMethod}
          onClose={() => setInstructionMethod(null)}
          onConfirm={() => void createRequestAndReturn(instructionMethod)}
          onCopyWallet={() => void copyWalletAndCreateRequest()}
        />
      ) : null}

      <section className="surface p-6">
        <p className="section-kicker">Deposit Capital</p>
        <h1 className="mt-2 font-heading text-3xl text-ink">Request funding with secure approval controls</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-body/72">
          Choose a funding method, follow the instructions, and upload proof. Your account balance stays at 0.00 until
          operations verifies and approves the payment.
        </p>

        <form
          onSubmit={handleSubmit(() => setInstructionMethod(selectedMethod))}
          className="mt-8 space-y-5"
        >
          <input type="hidden" {...register("method")} />
          <div>
            <label className="mb-2 block text-sm text-body/72">Amount</label>
            <input
              type="number"
              min={100}
              step="any"
              {...register("amount")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
            />
            {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount.message}</p> : null}
          </div>

          <div>
            <label className="mb-3 block text-sm text-body/72">Funding method</label>
            <div className="grid gap-3">
              {depositMethods.map((method) => {
                const Icon = method.icon;
                const active = selectedMethod === method.label;
                return (
                  <button
                    key={method.label}
                    type="button"
                    onClick={() => openFundingInstructions(method.label)}
                    disabled={Boolean(pendingDeposit) || isCreating}
                    className={`group rounded-3xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      active
                        ? "border-cyan/50 bg-cyan/10"
                        : "border-white/10 bg-white/[0.03] hover:border-gold/40 hover:bg-gold/5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-2xl border p-3 ${active ? "border-cyan/30 text-cyan" : "border-white/10 text-gold"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-heading text-lg text-ink">{method.label}</p>
                        <p className="mt-1 text-sm leading-6 text-body/65">{method.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.method ? <p className="mt-2 text-sm text-red-300">{errors.method.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCreating || Boolean(pendingDeposit)}
            className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendingDeposit ? "Pending Deposit In Progress" : isCreating ? "Creating request..." : "Review Funding Instructions"}
          </button>
        </form>
      </section>

      <section className="surface p-6">
        <div className="flex items-center gap-3">
          {pendingDeposit ? <Clock3 className="h-5 w-5 text-cyan" /> : <CheckCircle2 className="h-5 w-5 text-gold" />}
          <div>
            <p className="section-kicker">Activation Status</p>
            <h2 className="mt-2 font-heading text-2xl text-ink">
              {pendingDeposit ? "Payment proof and approval required" : activated ? "Your dashboard is active" : "No deposit request yet"}
            </h2>
          </div>
        </div>

        {pendingDeposit ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-5">
              <p className="text-sm text-body/72">Pending amount</p>
              <p className="mt-2 font-heading text-3xl text-ink">{formatCurrency(pendingDeposit.amount, user.profile.currency)}</p>
              <p className="mt-4 text-sm text-body/72">Method</p>
              <p className="mt-1 text-base text-ink">{pendingDeposit.method ?? "Funding Desk"}</p>
              <p className="mt-4 text-sm leading-7 text-body/72">{pendingDeposit.note}</p>
              {pendingDeposit.proofSubmittedAt ? (
                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                  <div className="flex items-start gap-3">
                    <FileCheck2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <p>
                      Proof received
                      {pendingDeposit.proofFileName ? `: ${pendingDeposit.proofFileName}` : ""} on{" "}
                      {formatDate(pendingDeposit.proofSubmittedAt)}. Approval is now pending.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-xl text-ink">Upload payment slip</p>
                  <p className="mt-2 text-sm leading-6 text-body/65">
                    Upload a JPG, PNG, WEBP, or PDF file under 1MB. Your balance will update only after operations
                    approves the payment.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                  className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-body/80 file:mr-4 file:border-0 file:bg-gold file:px-4 file:py-3 file:font-semibold file:text-midnight"
                />
                <button
                  type="button"
                  onClick={() => void uploadProof()}
                  disabled={isUploadingProof}
                  className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploadingProof ? "Uploading proof..." : "Submit Proof for Review"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-body/68">
            {activated
              ? "Your first deposit has already been completed. You can top up again whenever you want to add more available cash."
              : "Create your first deposit request to unlock charts, transactions, and portfolio monitoring after operations approval."}
          </div>
        )}
      </section>
    </div>
  );
}
