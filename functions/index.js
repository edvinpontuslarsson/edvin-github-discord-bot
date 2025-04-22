const functions = require('firebase-functions');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Load webhook URL from env or .env
let DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  const dotenvPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    const lines = fs.readFileSync(dotenvPath, 'utf-8').split('\n');
    for (const line of lines) {
      const [key, value] = line.trim().split('=');
      if (key === 'DISCORD_WEBHOOK_URL') {
        DISCORD_WEBHOOK_URL = value;
        break;
      }
    }
  }
}

exports.githubWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'issues' && payload.action === 'opened') {
    const issue = payload.issue;
    const repo = payload.repository;

    const message = {
      embeds: [
        {
          title: `📝 New Issue: ${issue.title}`,
          url: issue.html_url,
          description: issue.body
            ? issue.body.substring(0, 200) + '...'
            : '_No description_',
          color: 0x7289da,
          author: {
            name: issue.user.login,
            icon_url: issue.user.avatar_url,
            url: issue.user.html_url,
          },
          footer: {
            text: `${repo.full_name} • Issue #${issue.number}`,
          },
          timestamp: new Date(issue.created_at),
        },
      ],
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return res.status(200).send('Issue posted to Discord');
  }

  return res.status(200).send('Event ignored');
});
