CREATE TABLE IF NOT EXISTS deposit_proofs (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  proof_data TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_deposit_proofs_transaction_id ON deposit_proofs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_deposit_proofs_user_id ON deposit_proofs(user_id);
