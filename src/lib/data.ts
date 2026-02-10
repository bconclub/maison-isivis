import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Product,
  ProductImage,
  ProductVariant,
  ProductFilters,
  PaginatedProducts,
  Category,
  Collection,
} from "@/types/product";
import type { Review } from "@/types/user";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_REVIEWS,
  COLLECTION_PRODUCT_MAP,
} from "@/lib/mock-data";

// ─── DB row → Product converter (mirrors admin API) ──────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    shortDescription: row.short_description,
    description: row.description,
    price: parseFloat(row.price),
    salePrice: row.sale_price ? parseFloat(row.sale_price) : null,
    compareAtPrice: row.compare_at_price
      ? parseFloat(row.compare_at_price)
      : null,
    inStock: row.in_stock,
    stockQuantity: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold,
    allowBackorder: row.allow_backorder,
    images: (typeof row.images === "string"
      ? JSON.parse(row.images)
      : row.images ?? []) as ProductImage[],
    videoUrl: row.video_url,
    categoryId: row.category_id,
    hasVariants: row.has_variants,
    variants: (typeof row.variants === "string"
      ? JSON.parse(row.variants)
      : row.variants ?? []) as ProductVariant[],
    fabric: row.fabric,
    careInstructions: row.care_instructions,
    measurements: row.measurements
      ? typeof row.measurements === "string"
        ? JSON.parse(row.measurements)
        : row.measurements
      : null,
    featured: row.featured,
    newArrival: row.new_arrival,
    bestseller: row.bestseller,
    badge: row.badge,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords,
    displayOrder: row.display_order,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    parentId: row.parent_id,
    showInMenu: row.show_in_menu,
    displayOrder: row.display_order,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Fetch all products (Supabase first, mock fallback) ──────

async function fetchAllProducts(): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(dbToProduct);
    }
  } catch (err) {
    console.warn("[data] Supabase products fetch failed, using mock:", err);
  }
  return MOCK_PRODUCTS.filter((p) => p.published);
}

async function fetchAllCategories(): Promise<Category[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(dbToCategory);
    }
  } catch (err) {
    console.warn("[data] Supabase categories fetch failed, using mock:", err);
  }
  return MOCK_CATEGORIES;
}

// ─── Public query functions ─────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const products = await fetchAllProducts();
  const categories = await fetchAllCategories();

  // Join category objects onto products
  return products.map((p) => {
    const category = categories.find((c) => c.id === p.categoryId);
    return category ? { ...p, category } : p;
  });
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await fetchAllProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return undefined;

  const categories = await fetchAllCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  return category ? { ...product, category } : product;
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const categories = await fetchAllCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getCollectionBySlug(
  slug: string
): Promise<Collection | undefined> {
  // Collections are still mock-only for now
  return MOCK_COLLECTIONS.find((c) => c.slug === slug);
}

export async function getFeaturedProducts(
  limit = 12
): Promise<Product[]> {
  const products = await fetchAllProducts();
  const categories = await fetchAllCategories();

  // Only return products explicitly marked as featured
  return products
    .filter((p) => p.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, limit)
    .map((p) => {
      const category = categories.find((c) => c.id === p.categoryId);
      return category ? { ...p, category } : p;
    });
}

export async function getRelatedProducts(
  productId: string,
  limit = 4
): Promise<Product[]> {
  const products = await fetchAllProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export async function getReviewsByProduct(
  productId: string
): Promise<Review[]> {
  // Reviews are still mock-only for now
  return MOCK_REVIEWS.filter((r) => r.productId === productId && r.approved);
}

// ─── Filtered + paginated query ─────────────────────────────

export async function getFilteredProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  const allProducts = await fetchAllProducts();
  const allCategories = await fetchAllCategories();

  let products = [...allProducts];

  // Category filter
  if (filters.categorySlug) {
    const category = allCategories.find(
      (c) => c.slug === filters.categorySlug
    );
    if (category) {
      products = products.filter((p) => p.categoryId === category.id);
    }
  }

  // Collection filter (still uses mock mapping)
  if (filters.collectionSlug) {
    const productIds = COLLECTION_PRODUCT_MAP[filters.collectionSlug];
    if (productIds) {
      products = products.filter((p) => productIds.includes(p.id));
    }
  }

  // Price range
  if (filters.minPrice != null) {
    products = products.filter(
      (p) => (p.salePrice ?? p.price) >= filters.minPrice!
    );
  }
  if (filters.maxPrice != null) {
    products = products.filter(
      (p) => (p.salePrice ?? p.price) <= filters.maxPrice!
    );
  }

  // Size filter
  if (filters.sizes && filters.sizes.length > 0) {
    products = products.filter((p) =>
      p.variants.some(
        (v) => v.size && filters.sizes!.includes(v.size) && v.stock > 0
      )
    );
  }

  // Color filter
  if (filters.colors && filters.colors.length > 0) {
    products = products.filter((p) =>
      p.variants.some(
        (v) => v.color && filters.colors!.includes(v.color) && v.stock > 0
      )
    );
  }

  // In stock only
  if (filters.inStockOnly) {
    products = products.filter((p) => p.inStock && p.stockQuantity > 0);
  }

  // On sale
  if (filters.onSale) {
    products = products.filter((p) => p.salePrice != null);
  }

  // New arrivals
  if (filters.newArrivals) {
    products = products.filter((p) => p.newArrival);
  }

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sortBy = filters.sortBy ?? "featured";
  switch (sortBy) {
    case "featured":
      products.sort(
        (a, b) =>
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
          a.displayOrder - b.displayOrder
      );
      break;
    case "newest":
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "price-asc":
      products.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
      break;
    case "price-desc":
      products.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
      break;
    case "bestseller":
      products.sort(
        (a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)
      );
      break;
    case "name-asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // Pagination
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return { products: paginated, total, page, limit, totalPages };
}
