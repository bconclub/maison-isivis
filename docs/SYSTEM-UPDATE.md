# System Update — Maison ISIVIS

Running log of every change requested, its status, and what shipped.
Mirror of the **System Update** tab in the [All Products ISIVIS sheet](https://docs.google.com/spreadsheets/d/1y7f8D_hyjH3-HMxfVNqQI8lA6thEOFAjxTCPVcOVcIM).

Statuses: `Pending` · `In Progress` · `Blocked` · `Done`
Last updated: 2026-08-07

| ID | Date | Area | Item | Requested by | Priority | Status | Notes |
|----|------|------|------|--------------|----------|--------|-------|
| 1 | 2026-08-07 | Product data | Eulalie → "Eulalie Mini Dress" | Client | High | **Done** | Was already correct |
| 2 | 2026-08-07 | Product data | "Scarlet Lace" → "Scarlet Lace Dress" | Client | High | **Done** | Applied to live DB |
| 3 | 2026-08-07 | Product data | Noir Mini Dress — black only | Client | High | **Done** | 12 variants → 4, Ivory + Crimson removed |
| 4 | 2026-08-07 | Copy | Noir description claimed Noir/Ivory/Crimson | Client | High | **Done** | Now reads "Available in Noir across sizes XS to L" |
| 5 | 2026-08-07 | Pricing | Bianca Lilac Lace Corset Dress £145 → £295 | Client | High | **Done** | Same dress as Bianca Lace Corset Dress |
| 6 | 2026-08-07 | New product | Mary Sequinned Mini Skirt — £106.74 | Client | High | Pending | 3 images ready; goes in Back In Stock |
| 7 | 2026-08-07 | New product | Isolde (Navy Maxi Dress) — £500 | Client | High | Pending | Copy + 3 images supplied; top/skirt detachable |
| 8 | 2026-08-07 | Home page | Isolde on home page, made to stand out | Client | High | Pending | Depends on #7 |
| 9 | 2026-08-07 | New product | White Crystal-Embellished Mini Dress | Client | High | Blocked | 4 images ready — needs name + price |
| 10 | 2026-08-07 | Home page | Header video `ISIVIS 1 V12.mp4` | Client (asked 3×) | Medium | Blocked | File not supplied; assess size / autoplay / LCP |
| 11 | 2026-08-07 | Catalogue | Product-name consistency pass (65 products) | Client + internal | Medium | Blocked | Needs convention decision |
| 12 | 2026-08-07 | Copy | Description-vs-variant accuracy audit | Client | High | Pending | "Where are you getting all this info from?" |
| 13 | 2026-08-07 | Sheet | Rebuild product sheet from live site | Client | High | Pending | Client: list "doesn't match anything on the website" — confirmed, 0 overlap |
| 14 | 2026-08-07 | Catalogue | 22 of 65 products unpublished — publish or draft | Internal | Medium | Pending | Arabella / Amor / Ardelle / Astarte group |
| 15 | 2026-08-07 | Bug | Duplicate "Elektra Mesh Bodysuit" (CR-002 + CR-003) | Internal audit | Medium | Pending | Both £101 |
| 16 | 2026-08-07 | Bug | `elektra-mesh-body` copy refers to "The Valentina" | Internal audit | Medium | Pending | Wrong product name |
| 17 | 2026-08-07 | Bug | Bianca Lace Corset copy says "Ivory lace", variants White + Lavender | Internal audit | Low | Pending | |
| 18 | 2026-08-07 | Platform | Facebook Business Manager setup | Client | Medium | Pending | Scope required |
| 19 | 2026-08-07 | Platform | Payment gateways — business account changing | Client | High | Pending | Stripe keys + webhook cutover plan |
| 20 | 2026-08-07 | Process | Move requests off WhatsApp → brands@bconclub.com | Internal | Medium | Pending | |
| 21 | 2026-08-07 | Process | Client asked for one dedicated person on the account | Client | Medium | Pending | User decision |
| 22 | 2026-08-07 | Deploy | Ship uncommitted work (Back In Stock carousel + admin fixes) | Internal | High | Pending | 5 files modified, unpushed |

## Live incident — found 2026-08-07

| ID | Area | Item | Priority | Status | Notes |
|----|------|------|----------|--------|-------|
| 23 | Infrastructure | **`www.maisonisivis.com` TLS certificate expired 25 Jul 2026** | **Critical** | Blocked | Every visitor to the `www` host gets a browser security interstitial. Apex `maisonisivis.com` is healthy (cert valid to 24 Sep 2026). Needs Vercel dashboard access to re-issue |
| 24 | SEO / Ads | Google Merchant feed emits 148 product links on the broken `www` host | **Critical** | Blocked | `NEXT_PUBLIC_SITE_URL` is set to `https://www.maisonisivis.com`. Fix the cert, or repoint the env var at the apex and redeploy |
| 25 | Bug | Product pages soft-404: unknown slugs return HTTP 200 with not-found content | Medium | Pending | Pre-existing. Search engines index soft-404s |
