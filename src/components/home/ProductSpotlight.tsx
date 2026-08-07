import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductSpotlightProps {
  product: Product;
  eyebrow?: string;
}

// Full-width editorial slot for a single hero product. Used when a piece needs
// to stand on its own rather than compete inside a carousel.
export function ProductSpotlight({ product, eyebrow }: ProductSpotlightProps) {
  const cover = product.images?.[0];

  return (
    <section className="bg-brand-purple text-white section-spacing">
      <div className="container-luxury">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <Link
            href={`/products/${product.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-brand-purple-80"
          >
            {cover && (
              <Image
                src={cover.url}
                alt={cover.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </Link>

          {/* Copy */}
          <div className="text-center lg:text-left">
            {eyebrow && (
              <p className="text-caption font-medium uppercase tracking-luxury-wide text-brand-purple-20">
                {eyebrow}
              </p>
            )}

            <h2 className="mt-4 font-heading text-h1 font-light uppercase tracking-luxury">
              {product.name}
            </h2>

            <p className="mt-4 font-body text-body-lg text-white/70">
              {formatPrice(product.price)}
            </p>

            {product.shortDescription && (
              <p className="mx-auto mt-6 max-w-md font-body text-white/80 lg:mx-0">
                {product.shortDescription}
              </p>
            )}

            <Link
              href={`/products/${product.slug}`}
              className="mt-10 inline-block border border-white px-10 py-4 text-caption font-medium uppercase tracking-luxury-wide transition-colors duration-300 hover:bg-white hover:text-brand-purple"
            >
              Discover the piece
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
