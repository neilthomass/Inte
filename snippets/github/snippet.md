Quick integration guide for GitHub's REST API using Octokit.js. Manage repositories, issues, and other GitHub resources programmatically.

Install Octokit:

```bash
npm install @octokit/rest
```

List repositories:

```javascript
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repos = await octokit.repos.listForAuthenticatedUser();
```

Create issue:

```javascript
await octokit.issues.create({ owner: 'org', repo: 'repo', title: 'New issue' });
```
