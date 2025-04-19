const functions = require('firebase-functions');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Load env only when running locally or during deploy
let DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  // Attempt to load from .env manually (only works at build/deploy time)
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

if (!DISCORD_WEBHOOK_URL) {
  throw new Error('DISCORD_WEBHOOK_URL is not set');
}
