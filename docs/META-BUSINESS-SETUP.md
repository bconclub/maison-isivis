# Meta (Facebook) Business Manager — setup scope

Client (2026-08-07): *"I will need the fb business manager worked on as well"*.

The ask is broad, so this splits it into what the codebase can do vs what needs account access. **Nothing here is executed** — every step below requires being signed into the client's Meta account, which we don't have.

## What already exists (good news)

- **Product feed** — [/api/feed/google-merchant](src/app/api/feed/google-merchant/route.ts) serves 188 variant-level items as RSS 2.0 with the full `g:` namespace (`g:id`, `g:item_group_id`, `g:price`, `g:availability`, `g:size`, `g:color`, `g:brand`, shipping, GTIN handling). Verified 200, 744 KB, and it already includes Mary and Isolde.
  **Meta Commerce accepts this exact format.** The catalogue can be pointed at the same URL — no new feed to build.
- Feed revalidates every 6 hours (`revalidate = 21600`), which is inside Meta's recommended refresh window.
- Footer already links to `facebook.com/maisonisivis` ([src/lib/constants.ts:91](src/lib/constants.ts:91)).

## What's missing

**There is no Meta Pixel on the site.** A grep for `fbq` / `fbevents` / pixel across `src/` returns nothing. Without it there is no conversion tracking, no retargeting audiences, and no way to optimise ad delivery — ads would run blind.

## Steps, in order

1. **Business Manager account** — create or claim `business.facebook.com`. Confirm whether the client already has one; creating a second for the same brand causes asset-ownership headaches that are painful to unwind.
2. **Domain verification** — verify `maisonisivis.com` via DNS TXT or meta-tag. Required before Aggregated Event Measurement can be configured.
3. **Pixel / dataset** — create it, then we add it to the site. This is the one step that needs a code change; everything else is dashboard work.
4. **Conversions API** — strongly recommended alongside the pixel. iOS/ad-blocker loss makes browser-only tracking unreliable for a store at this price point. Needs a server-side endpoint plus an access token.
5. **Catalogue** — Commerce Manager → Catalogue → Data source → Scheduled feed → point at `https://www.maisonisivis.com/api/feed/google-merchant`, set 6-hourly refresh.
6. **Aggregated Event Measurement** — rank the 8 priority events (Purchase first).
7. **Ad account + payment method + roles** — client-side admin work.

## What we need from the client to proceed

- Admin access to the Meta Business account (or an invite as a partner/agency)
- Confirmation of whether a Business Manager already exists for the brand
- Whether Instagram Shopping is in scope (it rides on the same catalogue)
- Sign-off on adding the Pixel, since it drops third-party cookies and the cookie/consent notice may need updating to match

## Code work this implies

Only step 3 (and 4, if Conversions API is wanted) touches the repo:
- Pixel base script in the root layout, gated on consent
- `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` events wired to the existing cart/checkout flow
- If CAPI: a `/api/meta/capi` route mirroring the same events server-side, deduplicated by `event_id`

Estimate is small once access exists. It is blocked entirely on access, not on effort.
