-- Add email column to orders table (was referenced in Stripe webhook but missing from schema)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
