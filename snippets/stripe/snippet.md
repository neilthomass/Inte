Complete payment processing integration with Stripe. Handle customers, charges, and payment methods securely in your Node.js application.

Install package:

```bash
npm install stripe
```

Create a customer:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const customer = await stripe.customers.create({ email: 'alice@example.com' });
```

List charges:

```javascript
const charges = await stripe.charges.list({ limit: 5 });
```

Create payment intent:

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: { enabled: true }
});
```

Handle webhook events:

```javascript
const express = require('express');
const app = express();
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // handle event types
  res.json({ received: true });
});
```
