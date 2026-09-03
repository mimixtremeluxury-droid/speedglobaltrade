import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  isReleaseWritePaused,
  ReleaseWritePausedError,
  requireReleaseWritesEnabled,
} from "../src/lib/server/release-write-guard";
import {
  copyTraderAllocation,
  investInPlan,
  requestDeposit,
  submitDepositProof,
  withdrawFromAccount,
} from "../src/lib/server/account-service";
import { submitCustomerPaymentProof } from "../src/lib/server/payment-proof-service";

const proof = {
  fileName: "proof.png",
  fileType: "image/png",
  fileSize: 8,
  proofData: "data:image/png;base64,iVBORw0KGgo=",
};

describe("C7 customer release write guard", () => {
  it("fails closed in production for absent, true, and malformed values", () => {
    assert.equal(isReleaseWritePaused(undefined, "production"), true);
    assert.equal(isReleaseWritePaused("true", "production"), true);
    assert.equal(isReleaseWritePaused("invalid", "production"), true);
    assert.equal(isReleaseWritePaused("false", "production"), false);
    assert.throws(() => requireReleaseWritesEnabled("true", "production"), ReleaseWritePausedError);
  });

  it("blocks financial and proof writers before any database access", async () => {
    const original = process.env.SGT_RELEASE_WRITE_PAUSE;
    Reflect.set(process.env, "SGT_RELEASE_WRITE_PAUSE", "true");
    const blocked = (error: unknown) => error instanceof ReleaseWritePausedError
      && error.status === 503
      && error.code === "release_maintenance";
    try {
      await assert.rejects(() => requestDeposit("user", 100, "bank"), blocked);
      await assert.rejects(() => submitDepositProof("user", "deposit", proof, crypto.randomUUID()), blocked);
      await assert.rejects(() => submitCustomerPaymentProof("user", "deposit", proof, crypto.randomUUID()), blocked);
      await assert.rejects(() => withdrawFromAccount("user", 100, "bank", {}, crypto.randomUUID()), blocked);
      await assert.rejects(() => investInPlan("user", "plan", 100), blocked);
      await assert.rejects(() => copyTraderAllocation("user", "trader"), blocked);
    } finally {
      if (original === undefined) Reflect.deleteProperty(process.env, "SGT_RELEASE_WRITE_PAUSE");
      else process.env.SGT_RELEASE_WRITE_PAUSE = original;
    }
  });

  it("keeps the guard at all service boundaries without a generic bypass", () => {
    const account = readFileSync("src/lib/server/account-service.ts", "utf8");
    const paymentProof = readFileSync("src/lib/server/payment-proof-service.ts", "utf8");
    assert.equal((account.match(/requireReleaseWritesEnabled\(\)/g) ?? []).length, 5);
    assert.equal((paymentProof.match(/requireReleaseWritesEnabled\(\)/g) ?? []).length, 1);
    assert.equal(existsSync("src/app/api/dashboard/deposits/[transactionId]/complete/route.ts"), false);
    assert.doesNotMatch(account, /completePendingDeposit|cash_balance\s*=\s*cash_balance\s*\+/);
    assert.doesNotMatch(account + paymentProof, /maintenance.*bypass|bypass.*maintenance/i);
  });
});
