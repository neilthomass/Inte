Integrate powerful AI capabilities using OpenAI's API. Generate text, create embeddings, and build AI-powered features with GPT models.

Install package:

```bash
npm install openai
```

Generate text completion:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing in simple terms.' }
  ],
  max_tokens: 150
});

console.log(completion.choices[0].message.content);
```

Create embeddings:

```javascript
const embedding = await openai.embeddings.create({
  model: 'text-embedding-ada-002',
  input: 'Your text to embed here'
});

const vector = embedding.data[0].embedding;
```
Stream completions:

```javascript
for await (const chunk of openai.beta.chat.completions.stream({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Tell me a joke' }]
})) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

Check moderation:

```javascript
const moderation = await openai.moderations.create({ input: 'Some text' });
console.log(moderation.results[0].flagged);
```
