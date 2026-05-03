CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  tier TEXT NOT NULL DEFAULT 'Signature',
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  email_verified_at TEXT,
  cash_balance REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  intent TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'en',
  redirect_path TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  label TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  note TEXT NOT NULL,
  method TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investment_positions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  principal REAL NOT NULL,
  roi_from REAL NOT NULL,
  term TEXT NOT NULL,
  status TEXT NOT NULL,
  accent TEXT NOT NULL,
  started_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS copied_trader_positions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  trader_id TEXT NOT NULL,
  trader_name TEXT NOT NULL,
  allocation REAL NOT NULL,
  roi_snapshot REAL NOT NULL,
  copied_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  label TEXT NOT NULL,
  value REAL NOT NULL,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires_at ON verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_positions_user_id ON investment_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_copied_trader_positions_user_id ON copied_trader_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_user_id ON portfolio_snapshots(user_id);
