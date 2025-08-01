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
Handle message updates:

```javascript
const message = await webhook.send({ content: 'Initial message' });
await webhook.editMessage(message.id, { content: 'Updated content' });
```

Listen for bot commands:

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('messageCreate', (msg) => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```
