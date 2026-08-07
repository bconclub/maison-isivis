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

## 2026-08-07 · Header brand pattern, mobile hero video

- **Header background** — the brand ornament artwork (`011.png`) now sits over the existing gradient at 30% opacity. The source is not seamless (it carries a radial gradient), so it covers rather than tiles, and only a centre band is shipped: 2.6 MB PNG → 78 KB webp.
- **Nav links lifted from `white/80` to `white/90`** — at 30% the pattern's light ornament strokes dropped white/80 text to 4.24:1, under WCAG AA. At white/90 it measures 4.93:1.
- **Mobile hero video** — the brand film plays full-bleed on mobile with a poster frame and a sound toggle. It carries a voiceover, so it autoplays muted (browsers require that) and the viewer opts in.
- Desktop keeps the still image. The video master is 464x848 portrait, which fits a phone viewport natively but would upscale roughly 4x on desktop.
- Video 2.9 MB → 1.8 MB (h264, faststart). A VP9/webm encode came out larger than the mp4, so it was dropped rather than shipped.
