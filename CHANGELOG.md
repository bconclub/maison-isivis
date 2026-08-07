# Changelog

## 2026-08-07 · Isolde spotlight, Mary skirt, product data corrections

- **New home page section** — `ProductSpotlight`, a full-width editorial slot for a single piece, placed directly under the hero. Used for Isolde, per the client's "should be on home page and stand out".
- **Back In Stock carousel** — new `getProductsBySlugs()` fetches a hand-curated list in exact slug order, skipping anything hidden or deleted. Mary Sequinned Mini Skirt added to the line-up.
- **Old product URL kept alive** — `/products/elektra-mesh-body` now 308s to `/products/valentina-corset-bodysuit`. ISV-CR-002 was mislabelled "Elektra Mesh Bodysuit" while its images, copy and meta title all said Valentina; the product name was the error, not the copy.
- **Admin: duplicate SKU/slug no longer fails silently** — the products API returns a 409 naming the clashing field, and the form surfaces it on the offending input instead of a generic toast.
- **Admin: slug and SKU auto-generation** — slugs suffix `-2`, `-3`… when the name is already taken; SKU numbering skips past numbers already in use. Added the `JW` category code for Jewellery.
- **Admin: GIF removed from the image uploader** — the Supabase bucket rejects `image/gif` server-side, so offering it produced a confusing failure.
- Removed an unused `Link` import from the store home page.

User-facing: Isolde Navy Maxi Dress (£500) and Mary Sequinned Mini Skirt (£106.74) are live; Scarlet Lace renamed to Scarlet Lace Dress; Noir Mini Dress is black-only; Bianca Lilac repriced to £295.

Docs added: `docs/SYSTEM-UPDATE.md` (running change log), `docs/PAYMENT-GATEWAY-CUTOVER.md`, `docs/META-BUSINESS-SETUP.md`.
