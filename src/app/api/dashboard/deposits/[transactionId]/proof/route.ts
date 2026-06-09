import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { submitDepositProof } from "@/lib/server/account-service";

const MAX_PROOF_SIZE_BYTES = 1024 * 1024;
const allowedProofTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mediaType = file.type || "application/octet-stream";
  return `data:${mediaType};base64,${buffer.toString("base64")}`;
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ transactionId: string }>;
  },
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const proof = formData.get("proof");

  if (!(proof instanceof File)) {
    return NextResponse.json({ error: "Upload a payment slip or receipt to continue." }, { status: 400 });
  }

  if (!allowedProofTypes.has(proof.type)) {
    return NextResponse.json({ error: "Payment proof must be a JPG, PNG, WEBP, or PDF file." }, { status: 400 });
  }

  if (proof.size > MAX_PROOF_SIZE_BYTES) {
    return NextResponse.json({ error: "Payment proof must be 1MB or smaller." }, { status: 400 });
  }

  const { transactionId } = await context.params;

  try {
    const user = await submitDepositProof(session.userId, transactionId, {
      fileName: proof.name || "payment-proof",
      fileType: proof.type,
      fileSize: proof.size,
      proofData: await fileToDataUrl(proof),
    });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload this payment proof." },
      { status: 400 },
    );
  }
}
