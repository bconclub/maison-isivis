export interface ProductImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProductVariant {
  variantId: string;
  size?: string;
  color?: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  salePrice: number | null;
  compareAtPrice: number | null;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  images: ProductImage[];
  videoUrl: string | null;
  categoryId: string | null;
  categoryIds: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  fabric: string | null;
  careInstructions: string | null;
  measurements: Record<string, string> | null;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  badge: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[] | null;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  showInMenu: boolean;
  displayOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  heroImageUrl: string | null;
  heroVideoUrl: string | null;
  collectionType: "featured" | "style" | "seasonal" | "curated" | null;
  featured: boolean;
  displayOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categorySlug?: string;
  collectionSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  onSale?: boolean;
  newArrivals?: boolean;
  search?: string;
  sortBy?:
    | "featured"
    | "newest"
    | "price-asc"
    | "price-desc"
    | "bestseller"
    | "name-asc";
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
