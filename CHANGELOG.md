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

## 2026-08-07 · Hero rebuilt around the brand film

- **Header reverted** — the ornament pattern and the `white/90` nav tweak are gone; the header is back to the plain brand gradient.
- **Hero is now the brand pattern with the film playing on it.** Copy sits left, the video right, stacked on mobile. The film is held at its native 464x848 ratio and capped in width, so it is never upscaled — which is what let it run on desktop at all.
- **Mobile legibility** — `cover` blows the motif up and crops it hard on a tall narrow phone, which read as noise behind the copy. The pattern is held to 40% below `sm` and shown in full above it. White text measures 6.65:1 on desktop and roughly 13:1 on mobile, against 1.77:1 with no scrim at all.
- **Isolde spotlight section removed.** Isolde is featured again so it still appears on the home page, in Handpicked Treasures.
- **The old hero still moved down** to sit directly above Join The Queendom.

## 2026-08-07 · Fix hero heading overflow

- The hero heading was clipped on the right between `lg` and `xl`. `text-hero` is sized off the viewport (`clamp(3rem, 8vw, 4.5rem)`), but the heading now lives in a half-width grid column. Measured in Italiana, "Turning Fantasy" is 476px at 72px, against a 448px column at `lg` — a 28px overflow, and the forced line break left it nowhere to wrap.
- Heading now steps up to `text-hero` only at `xl`, where the column is 576px. Added `min-w-0` to the column, since grid children default to `min-width: auto` and overflow rather than shrink.

## 2026-08-07 · Frosted panel behind the hero copy

- The pattern was fighting the copy. Legibility now comes from a frosted panel behind the text rather than from flattening the artwork, so the pattern can be shown at full strength: the section scrim drops from 55% to 15% and the mobile dimming is gone entirely.
- The panel tint is dark, not white. The copy is white, so a light frost would lift the backdrop and cost contrast — the opposite of what a frosted panel is for here.
- Kept deliberately thin (45% tint, medium blur) so the pattern still reads through the glass. White text measures 6.35:1 and the sub-line 4.74:1, both above AA, before the blur softens the strokes further.
- Heading now steps up to `text-hero` at `2xl` rather than `xl`: the panel's padding takes 80px off the column, which left only 496px against 476px of text at `xl`.

## 2026-08-07 · Tiled brand motif with parallax

- The hero pattern is now a repeating motif rather than one stretched image. `011.png` repeats every 284x377px — found by autocorrelating a high-passed copy — so that block was cut out, high-passed to drop its radial gradient, and reduced to an alpha mask that can be tinted.
- The full artwork could never tile: its edges mismatched by 20.5 (horizontal) and 25.8 (vertical). The extracted tile mismatches by 6.9 and 9.0. Tile height was tuned to 377px rather than the measured 374px, which cut the vertical seam from 59.3 to 9.0.
- Rendered at 150px on mobile and 200px from `sm`, so the motif reads as fine repeating ornament instead of one oversized crop.
- **Parallax** — the motif pans at 0.35x scroll speed. It shifts `background-position` rather than transforming the layer: a repeating background can be panned indefinitely without exposing an edge, so no oversized element is needed. Written straight to the DOM inside `requestAnimationFrame`, so scrolling never re-renders the hero, and skipped entirely under `prefers-reduced-motion`.
- Asset dropped from 279 KB to 38 KB.
