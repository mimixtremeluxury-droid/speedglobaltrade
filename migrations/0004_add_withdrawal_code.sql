-- Add withdrawal_code column to transactions table for support verification
ALTER TABLE transactions ADD COLUMN withdrawal_code TEXT;
