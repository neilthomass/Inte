# Stripe Integration

> **Complete payment processing integration with Stripe. Handle customers, charges, and payment methods securely in your Node.js application.**

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
