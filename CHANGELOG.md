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

## 2026-08-07 · Lighter frost, softened panel edges

- **Frost reduced** — panel tint 45% → 40%, blur `md` → `sm`, so more of the motif reads through the glass.
- The sub-line now carries the weight instead of the panel (`white/80` → `white/95`), which is what allows the frost to come down without losing legibility. Measured against the tiled motif's brightest stroke — rgb(214,205,245), *brighter* than the raw artwork, since the tile is tinted and its alpha boosted — the heading sits at 5.00:1 and the sub-line at 4.71:1.
- Worth noting: at the previous 45% the sub-line was actually at 4.32:1, marginally under AA. Earlier figures had been computed against the full-bleed artwork, before the background became a tinted tile.
- **New radius step** — `rounded-luxury-lg` (12px) added to the scale. The house style is 2px/4px, which reads as unfinished on a large glass surface with a visible blur edge, but anything app-like would fight the brand. One step in between, added to the scale rather than hardcoded, and applied to both the copy panel and the film frame so they match.

## 2026-08-07 · Founder's Pick in the hero

- The hero now carries a **Founder's Pick** — Isolde Navy Maxi Dress. The product already existed (`ISV-DR-032`, £500, published, 3 images) and was already flagged `featured`; the flag couldn't drive this on its own, because six products carry it. The hero pick is named explicitly via `HERO_FEATURE_SLUG`, matching the file's existing `BACK_IN_STOCK_SLUGS` convention.
- **Image slider** — the product's frames cross-fade every 2s. All frames are stacked and faded rather than swapped, so the box never reflows and nothing shifts as it advances. Skipped under `prefers-reduced-motion`, and the timer keys off the frame *count* so a fresh array identity each render can't restart it mid-cycle.
- Indicators use the brand palette — `brand-blue-40` active, `brand-purple-20` inactive — rather than plain white.
- Mobile: the name wraps instead of truncating. At 375px that column is roughly 159px wide, which would otherwise cut the name mid-word. Verified no horizontal overflow at 375px.
- Dev server moved to `autoPort`, since port 3000 collides with another project's server.

## 2026-08-07 · Founder's Pick as its own piece

- The Founder's Pick is no longer nested inside the hero copy panel. It is now a separate card sitting below it, carrying its own glass so it still reads against the motif. The two are siblings, not parent and child.

## 2026-08-07 · Three-column hero

- Hero rearranged to match the reference: copy left, film centre, Founder's Pick right. The pick is now a stacked card — image above, then label, name, price and a "View details" link — rather than a horizontal row.
- **The three tracks only engage at `xl`, not `lg`.** At 1024px the fixed film and pick columns leave the copy column 176px, and the panel's padding alone takes 80 of that against a 317px heading. Below `xl` everything stacks.
- Fixed a related trap: the film and pick carried `lg:max-w-none`, which below `xl` (now a single-column stack) would have let the film stretch to the full container — a ~1036px box for a 464px master. Both moved to `xl`.
- Verified: 1280 resolves to three tracks with no overflow; 1100 and 375 collapse to a stack with the film capped at 360px and 300px respectively.
- Heading no longer steps up to `text-hero`, since the copy column is narrower in a three-track layout.
- Kept the brand palette. The reference is navy-and-gold, which is a palette change rather than a layout one, so it was not applied.

## 2026-08-07 · Centred film, right-sized hero, simpler sound control

- **Film is now centred.** The grid was `1fr / 380px / 280px` — a flexible left track against a fixed right one, which made the copy column wider and pushed the film off-centre. Outer tracks are now `1fr` each, so the film sits dead centre by construction rather than by tuning.
- Film track is 320px at `xl` and 380px at `2xl`. At 1280 that leaves the copy column 416px, 352px inside its padding, against a 317px heading — a wider film track there would clip it.
- **Hero no longer forces a full-viewport height.** It carried `min-h-[85vh] sm:min-h-screen`, which no other section has — every other section uses `section-spacing` and hugs its content. On a tall monitor that meant ~1280px of section for ~585px of content, which is the "blown out of proportion" look. Height is now content-driven: roughly 745px at `xl`, 854px at `2xl`.
- **"Play film" pill replaced** with a small 40px mute toggle at the film's bottom-right. The label was misleading anyway — the film is already playing, muted, because autoplay requires it.

## 2026-08-07 · Honest naming for the featured row, mobile hero order

- **"Handpicked Treasures / Curated for you" renamed to "Featured Pieces / The featured edit".** That row is `featured === true` straight from the admin — no curation happens — so the old name claimed something the data doesn't do.
- **Founder's Pick removed from the featured row.** The hero already gives that piece a slot of its own, and it was reappearing as the first card immediately beneath. The row now shows 5 products; Isolde appears once, in the hero.
- **Mobile hero order is now film → product → heading**, matching how it should read on a phone. Desktop keeps copy left, film centre, pick right.

## 2026-08-07 · Scalloped cartouche cut-out for the film

- The film is now cut to a **scalloped cartouche** — points top and bottom, seven scallops a side — replacing the plain ogee arch. Matches the reference outline far more closely.
- Generated **parametrically** rather than hand-drawn, so the scallops stay evenly spaced and both axes mirror exactly. The generator emits the path twice: `objectBoundingBox` units (0–1) for the clip path, so one path serves every width, and viewBox units for the stroked outline.
- The outline is a sibling SVG rather than a border: a clipped element cuts its own border off.
- **Shoulder taper reduced from 17% to 9%.** At 17% the shape tapered away 34% of the frame's height and was clipping too much of the film; at 9% it tapers 18%, keeping the cartouche silhouette while showing much more footage.
- Mute button moved to 11% from the bottom. The cartouche tapers to a point below 91% of its height, so a bottom-corner button would have floated outside the shape entirely.

## 2026-08-09 · Hero subtext removed, atelier image joined to Join The Queendom

- Removed the "Prêt-à-couture from our London atelier." line from the hero panel.
- The atelier image now carries Join The Queendom's blue (`bg-brand-blue-20`) and is inset inside the container rather than running full-bleed on black. The two sections share a background and sit flush, so they read as one block instead of a white band floating above a blue one.

## 2026-08-09 · Load the hero pattern before the film

- The motif is a CSS background, so the browser could not discover it until the stylesheet was parsed and the element laid out — by which point the 1.8 MB film was already fetching. The pattern lost the race to a file 46x its size.
- Both the motif (38 KB) and the film's poster (18 KB) are now `<link rel="preload" as="image" fetchPriority="high">` in the document head. Discovery moves from post-layout to byte 3,414 of the document, against the video tag at byte 283,411.
- Net effect: the patterned field and the poster frame paint first, so the hero never shows a bare purple block waiting on video bytes.

## 2026-08-09 · Mirror cut-out, Founder's Pick out of the hero

- **New film cut-out** — a baroque mirror silhouette (points top and bottom, wide shoulders, waist, flared hips) replacing the uniform scalloped cartouche. Generated from a half-width profile smoothed with Catmull-Rom, so the undulation is even and both axes mirror exactly.
- **Hero is now two columns**: copy left, film right. The film track goes back to 380px since it no longer shares the row with a third column.
- **Founder's Pick lifted out into its own section** directly below the hero, as a new `FoundersPick` component — larger image, slider, price, short description and a "View details" link on a light band. The slider state moved with it, so the hero no longer carries an interval timer it doesn't use.
- Page order is now hero → Founder's Pick → Featured Pieces.

## 2026-08-09 · Venetian mirror cut-out, capped hero copy panel

- **Film cut-out rebuilt to match the reference**: soft crest point, shoulders projecting outward past a concave notch, and straight vertical sides. The previous version undulated down the whole side, which the reference does not.
- Built as an explicit segment list for the right half, with the left half generated by walking that list backwards, mirroring x and swapping each cubic's control points. An earlier attempt mirrored the x coordinates while keeping segments in top-to-bottom order, which drew the left half in the wrong direction and produced a broken shape.
- **Hero copy panel capped at `max-w-xl`.** With the hero at `1fr / 380px`, the copy column runs ~1500px on a wide monitor and the panel was stretching to fill it.

## 2026-08-09 · Cusped frame for the film, double rule

- **Reshaped the film frame to match the reference**: straight edges with corners that scoop inward to a point. Previously the silhouette tapered along the whole side, which cropped the footage badly — the reference frames the video rather than cutting it.
- Each corner is a single cubic whose end tangents run perpendicular to the edges it joins; that perpendicularity is what produces the cusp rather than a rounded or chamfered corner.
- **Double rule** — two stroked paths at 0.55 and 0.3 opacity, tracing the frame just inside the clip, matching the reference's twin border lines.
- Mute button moved clear of the bottom cusp.

## 2026-08-09 · Pull the hero pair together

- The copy panel and the film were drifting to opposite edges on a wide monitor. The copy track was `1fr`, so it absorbed all the spare width — roughly 420px of empty pattern opened up between them at 1440px and above, and the two read as unrelated rather than one composition.
- Both tracks are now bounded (520/360 at `xl`, 560/380 at `2xl`) and the pair is centred with `justify-center`, so the gap stays at 40–48px regardless of viewport width.

## 2026-08-09 · ISIVIS Brooch added (draft)

- **ISIVIS Brooch** created — `ISV-AC-001`, £160, in Accessories. First product to use the `AC` SKU code. One Size / Gold variant, New Arrival badge, care instructions, SEO title, meta description and keywords all set.
- **Held as a draft: no image supplied.** The founder-wearing shot exists only as a chat screenshot, and there is nothing brooch-related in the assets folder. Publishing a £160 jewellery product with an empty gallery is the same fault already flagged against the other 23 drafts, so it is unpublished until artwork lands in `New Products/ISIVIS Brooch/`.
- Copy written fresh in the register of the supplied reference. The reference was a competitor's live product description, so the tone was matched rather than the text reused.
- Material deliberately left as "gold-tone metal" — no one has stated what the piece is actually made from, and at this price the specific material should not be guessed.
