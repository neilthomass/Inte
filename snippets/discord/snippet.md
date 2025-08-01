Connect your application with Discord using webhooks and bot API. Send messages, embeds, and manage Discord servers programmatically.

Install package:

```bash
npm install discord.js
```

Send webhook message:

```javascript
const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

await webhook.send({
  content: 'Hello from your app!',
  username: 'MyBot',
  avatarURL: 'https://example.com/avatar.png'
});
```

Send embed message:

```javascript
const embed = {
  title: 'Server Status',
  description: 'All systems operational',
  color: 0x00ff00,
  timestamp: new Date().toISOString(),
  fields: [
    { name: 'Uptime', value: '99.9%', inline: true },
    { name: 'Users Online', value: '1,234', inline: true }
  ]
};

await webhook.send({ embeds: [embed] });
```