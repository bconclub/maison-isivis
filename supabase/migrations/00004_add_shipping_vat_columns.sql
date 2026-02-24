-- Add per-product shipping and VAT toggle columns (both default to true)
ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_enabled BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_enabled BOOLEAN DEFAULT true;
