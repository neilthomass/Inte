Send and manage SMS messages using Twilio's communication API. Perfect for notifications, alerts, and two-way messaging in your applications.

Install package:

```bash
npm install twilio
```

Send a message:

```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
await client.messages.create({ body: 'hello', from: '+10000000000', to: '+19999999999' });
```

Fetch message list:

```javascript
const messages = await client.messages.list({ limit: 5 });
```

Check delivery status:

```javascript
const status = await client.messages('SM123').fetch();
console.log(status.status);
```

Make a voice call:

```javascript
await client.calls.create({
  twiml: '<Response><Say>Hello!</Say></Response>',
  from: '+10000000000',
  to: '+19999999999'
});
```
