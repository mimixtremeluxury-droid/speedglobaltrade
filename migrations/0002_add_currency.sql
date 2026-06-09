-- Add currency column to users table
ALTER TABLE users ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
