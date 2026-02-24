-- ============================================
-- ADD TRENDING COLUMN TO PRODUCTS
-- ============================================
-- Adds a boolean `trending` column to match the existing
-- `featured`, `new_arrival`, and `bestseller` flags.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;

-- Index for quick filtering on the storefront
CREATE INDEX IF NOT EXISTS idx_products_trending
  ON products(trending) WHERE trending = true;
