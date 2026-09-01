-- Shared C6-F schema: permanent upload idempotency and canonical C3 proof snapshots.
PRAGMA defer_foreign_keys = ON;

CREATE UNIQUE INDEX idx_payment_proof_files_idempotency_permanent
  ON payment_proof_files(user_id, idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE deposit_settlements_c6 (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  admin_user_id TEXT NOT NULL,
  idempotency_key_hash TEXT NOT NULL UNIQUE,
  proof_id TEXT,
  canonical_proof_file_id TEXT,
  proof_sha256_hex TEXT,
  proof_object_key TEXT,
  amount_snapshot REAL NOT NULL CHECK (amount_snapshot > 0),
  currency_snapshot TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('claimed', 'balance_applied', 'completed')),
  balance_applied_at TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  CHECK (
    (proof_id IS NOT NULL AND canonical_proof_file_id IS NULL AND proof_sha256_hex IS NULL AND proof_object_key IS NULL)
    OR
    (proof_id IS NULL AND canonical_proof_file_id IS NOT NULL AND length(proof_sha256_hex) = 64 AND length(proof_object_key) > 0)
  ),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE RESTRICT,
  FOREIGN KEY (proof_id) REFERENCES deposit_proofs(id) ON DELETE RESTRICT,
  FOREIGN KEY (canonical_proof_file_id) REFERENCES payment_proof_files(id) ON DELETE RESTRICT
);

INSERT INTO deposit_settlements_c6 (
  id, transaction_id, user_id, admin_user_id, idempotency_key_hash,
  proof_id, canonical_proof_file_id, proof_sha256_hex, proof_object_key,
  amount_snapshot, currency_snapshot, status, balance_applied_at, created_at, completed_at
)
SELECT id, transaction_id, user_id, admin_user_id, idempotency_key_hash,
       proof_id, NULL, NULL, NULL, amount_snapshot, currency_snapshot,
       status, balance_applied_at, created_at, completed_at
FROM deposit_settlements;

CREATE TABLE deposit_settlement_commits_c6 (
  settlement_id TEXT PRIMARY KEY,
  invariant_ok INTEGER NOT NULL CHECK (invariant_ok = 1),
  committed_at TEXT NOT NULL,
  FOREIGN KEY (settlement_id) REFERENCES deposit_settlements_c6(id) ON DELETE RESTRICT
);
INSERT INTO deposit_settlement_commits_c6
SELECT settlement_id, invariant_ok, committed_at FROM deposit_settlement_commits;

DROP TABLE deposit_settlement_commits;
DROP TABLE deposit_settlements;
ALTER TABLE deposit_settlements_c6 RENAME TO deposit_settlements;
ALTER TABLE deposit_settlement_commits_c6 RENAME TO deposit_settlement_commits;
CREATE INDEX idx_deposit_settlements_user_id ON deposit_settlements(user_id);
CREATE INDEX idx_deposit_settlements_status_created_at ON deposit_settlements(status, created_at);
CREATE INDEX idx_deposit_settlements_canonical_proof ON deposit_settlements(canonical_proof_file_id);

PRAGMA defer_foreign_keys = OFF;
