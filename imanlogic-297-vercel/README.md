# ImanLogic £297 Vercel Funnel

Routes:
- `/` — offer page
- `/checkout/` — Stripe Embedded Checkout
- `/api/create-checkout-session` — server-side Stripe Checkout Session creation

## Vercel setup

1. Import this folder/repository into Vercel.
2. Project Settings → Environment Variables.
3. Add `STRIPE_SECRET_KEY` with the live Stripe secret key (`sk_live_...`). Do not commit it to Git.
4. Apply it to Production. Add Preview too if you want preview checkout tests.
5. Redeploy after adding the variable.
6. Add custom domain `297.imanlogic.com` in Vercel Project Settings → Domains.
7. Follow Vercel's DNS instruction for the subdomain.

## Stripe configuration

- Publishable key is embedded client-side, which is safe for Stripe publishable keys.
- Price: `price_1U1iDBEnWy9c22gjbEKXob6l`
- Mode: recurring subscription
- Success return: `https://imanlogic.com/onboarding/?session_id={CHECKOUT_SESSION_ID}`
- Promotion codes enabled.

## Lead form

The offer page submits to the existing GHL webhook and redirects to `/checkout/`.

## Production test

Do not test Embedded Checkout inside an editor iframe. Open the deployed `/checkout/` URL directly in a browser.
