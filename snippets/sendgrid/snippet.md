Reliable email delivery service integration with SendGrid. Send transactional emails, newsletters, and automated email campaigns with high deliverability.

Install package:

```bash
npm install @sendgrid/mail
```

Send an email:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'user@example.com',
  from: 'noreply@yourapp.com',
  subject: 'Welcome to our service',
  text: 'Thank you for signing up!',
  html: '<strong>Thank you for signing up!</strong>'
};

await sgMail.send(msg);
```

Send multiple emails:

```javascript
const messages = [
  { to: 'user1@example.com', from: 'noreply@yourapp.com', subject: 'Hello User 1', text: 'Message 1' },
  { to: 'user2@example.com', from: 'noreply@yourapp.com', subject: 'Hello User 2', text: 'Message 2' }
];

await sgMail.send(messages);
```
Add attachments:

```javascript
const fileData = require('fs').readFileSync('./invoice.pdf').toString('base64');
await sgMail.send({
  ...msg,
  attachments: [
    {
      content: fileData,
      filename: 'invoice.pdf',
      type: 'application/pdf',
      disposition: 'attachment'
    }
  ]
});
```

Check email statistics:

```javascript
const stats = await sgMail.client.request({
  method: 'GET',
  url: '/v3/stats',
  qs: { start_date: '2024-01-01', end_date: '2024-01-31' }
});
console.log(stats[1]);
```
