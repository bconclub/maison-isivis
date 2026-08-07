# Payment Gateway Cutover — new business account

Client (2026-08-07): *"business acc will change soon so payment gateways need to be updated"*.

This is the runbook. Nothing here has been executed — the new account's keys don't exist yet.

## What is actually wired to Stripe

| Thing | Where | Notes |
|---|---|---|
| Stripe client | [src/lib/stripe.ts:11](src/lib/stripe.ts:11) | Lazy-init, reads `STRIPE_SECRET_KEY`, pinned to API version `2026-01-28.clover` |
| Webhook receiver | [src/app/api/webhooks/stripe/route.ts:26](src/app/api/webhooks/stripe/route.ts:26) | Verifies with `STRIPE_WEBHOOK_SECRET` |
| Events handled | [route.ts:49](src/app/api/webhooks/stripe/route.ts:49) | **Only `checkout.session.completed`** |
| Client-side | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Baked into the browser bundle at build time |
| Health check | [/admin/status](src/app/(admin)/admin/status/page.tsx:388) | Shows presence (not validity) of all three keys |

Three env vars total: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## The one thing that will bite

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is **inlined at build time**, not read at runtime. Changing it in the host's dashboard does nothing until a **fresh deploy**. Rotating the secret key without redeploying leaves the browser publishing to the old account while the server talks to the new one — checkouts fail with key-mismatch errors that look like nothing is wrong.

## Order of operations

1. **Before anything** — new account must have: business verification passed, payout bank account attached, and the same currency (GBP) as the current one. A currency mismatch is not a config change, it's a re-pricing exercise across all 67 products.
2. Create the webhook endpoint on the **new** account pointing at `https://www.maisonisivis.com/api/webhooks/stripe`, subscribed to `checkout.session.completed`. Copy its signing secret.
3. Put the site in a low-traffic window. There is no dual-account support in the code — it is a hard swap.
4. Update all three env vars on the host **together**.
5. **Redeploy** (mandatory — see above).
6. Verify `/admin/status` shows all three present.
7. Run one real low-value test order end to end. Confirm: Stripe shows the payment on the **new** account, the order row lands in Supabase, and the confirmation email sends (Resend is a separate integration and is *not* affected by the Stripe swap).
8. Leave the old account's webhook enabled for ~48h so any in-flight sessions still settle, then disable.

## Open questions for the client

- Does the new account keep the same legal entity and VAT registration? `vat_enabled` is per-product and would need review if not.
- Any active subscriptions or saved payment methods on the old account? Those do **not** migrate — Stripe cannot move customer payment methods between accounts without a support-led migration request.
- Preferred cutover window?

## Not covered by this change

Resend (transactional email), Supabase, and Google Sheets credentials are independent. Only touch them if the business email domain changes too — in which case `FROM_ADDRESS` in [src/lib/email.ts:64](src/lib/email.ts:64) needs updating and the new domain needs DNS verification in Resend.
