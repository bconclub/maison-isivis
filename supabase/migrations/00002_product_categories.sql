-- ============================================
-- PRODUCT CATEGORIES (Many-to-Many)
-- Allows each product to belong to multiple categories
-- ============================================

CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, category_id)
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product categories viewable by everyone"
  ON product_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage product categories"
  ON product_categories FOR ALL USING (true);

CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- Migrate existing data: copy each product's current category_id into the junction table
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;
