-- C6: private R2 payment-proof metadata and resumable migration tracking only.
-- No legacy payload deletion, financial mutation, or public object access is introduced.

CREATE TABLE IF NOT EXISTS payment_proof_files (
  id TEXT PRIMARY KEY,
  legacy_proof_id TEXT UNIQUE,
  transaction_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('legacy_migration','customer_upload')),
  storage_state TEXT NOT NULL CHECK (storage_state IN ('pending_upload','r2_stored','verified','active','superseded','migration_failed','quarantined')),
  object_key TEXT UNIQUE,
  original_filename TEXT,
  content_type TEXT,
  size_bytes INTEGER CHECK (size_bytes IS NULL OR size_bytes >= 0),
  sha256_hex TEXT CHECK (sha256_hex IS NULL OR length(sha256_hex) = 64),
  r2_etag TEXT,
  r2_version TEXT,
  idempotency_key_hash TEXT,
  created_at TEXT NOT NULL,
  uploaded_at TEXT,
  verified_at TEXT,
  superseded_at TEXT,
  migration_attempts INTEGER NOT NULL DEFAULT 0,
  last_migration_attempt_at TEXT,
  failure_code TEXT,
  FOREIGN KEY (legacy_proof_id) REFERENCES deposit_proofs(id) ON DELETE RESTRICT,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_proof_files_active_transaction
  ON payment_proof_files(transaction_id)
  WHERE storage_state = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_proof_files_upload_idempotency
  ON payment_proof_files(user_id, idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL AND storage_state IN ('pending_upload','r2_stored','verified','active');
CREATE INDEX IF NOT EXISTS idx_payment_proof_files_migration
  ON payment_proof_files(source_type, storage_state, last_migration_attempt_at);

CREATE TABLE IF NOT EXISTS payment_proof_migration_runs (
  id TEXT PRIMARY KEY,
  source_snapshot_at TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running','completed','partial','failed')),
  started_by TEXT NOT NULL,
  eligible_count INTEGER NOT NULL DEFAULT 0,
  uploaded_count INTEGER NOT NULL DEFAULT 0,
  verified_count INTEGER NOT NULL DEFAULT 0,
  quarantined_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);
