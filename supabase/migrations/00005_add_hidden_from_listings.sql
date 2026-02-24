-- Add hidden_from_listings column (product stays active but won't appear in browse/search)
ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden_from_listings BOOLEAN DEFAULT false;
