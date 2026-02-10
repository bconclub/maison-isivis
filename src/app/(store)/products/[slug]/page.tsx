import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProduct,
} from "@/lib/mock-data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product | Maison ISIVIS" };
  }

  return {
    title: `${product.metaTitle ?? product.name} | Maison ISIVIS`,
    description:
      product.metaDescription ??
      product.shortDescription ??
      `Shop ${product.name} at Maison ISIVIS. Handcrafted luxury fashion from our London atelier.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // If product not in static mock data, fall back to client-side admin store lookup
  if (!product) {
    return <ProductDetailClient params={params} />;
  }

  const reviews = getReviewsByProduct(product.id);
  const relatedProducts = getRelatedProducts(product.id);

  // Build breadcrumb trail
  const breadcrumbItems = [];
  if (product.category) {
    breadcrumbItems.push({
      label: product.category.name,
      href: `/collections/${product.category.slug}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <div className="container-luxury py-8 sm:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...breadcrumbItems,
        ]}
        className="mb-8"
      />

      {/* Product Layout: Gallery + Info */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>

      {/* Accordion details */}
      <div className="mt-12 max-w-3xl">
        <ProductAccordion product={product} />
      </div>

      {/* Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
