const PRICE_ID = 'price_1U1iDBEnWy9c22gjbEKXob6l';
const RETURN_URL = 'https://imanlogic.com/onboarding/?session_id={CHECKOUT_SESSION_ID}';

async function createSession(secret, uiMode) {
  const body = new URLSearchParams();
  body.set('mode', 'subscription');
  body.set('ui_mode', uiMode);
  body.set('line_items[0][price]', PRICE_ID);
  body.set('line_items[0][quantity]', '1');
  body.set('return_url', RETURN_URL);
  body.set('billing_address_collection', 'auto');
  body.set('allow_promotion_codes', 'true');
  if (uiMode === 'embedded_page') body.set('redirect_on_completion', 'always');

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await response.json();
  return { response, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !secret.startsWith('sk_')) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured in Vercel.' });
  }

  try {
    let result = await createSession(secret, 'embedded_page');

    if (!result.response.ok) {
      const message = result.data?.error?.message || '';
      const modeRejected = /ui_mode|embedded_page|redirect_on_completion/i.test(message);
      if (modeRejected) result = await createSession(secret, 'embedded');
    }

    if (!result.response.ok) {
      return res.status(result.response.status).json({ error: result.data?.error?.message || 'Stripe rejected the checkout session.' });
    }

    if (!result.data?.client_secret) {
      return res.status(502).json({ error: 'Stripe did not return a Checkout client secret.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ clientSecret: result.data.client_secret, sessionId: result.data.id });
  } catch (error) {
    console.error('Stripe checkout error', error);
    return res.status(500).json({ error: 'Unable to initialise Stripe checkout.' });
  }
}
