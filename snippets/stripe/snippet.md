# Stripe Integration

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
