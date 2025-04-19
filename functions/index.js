const functions = require('firebase-functions');
require('dotenv').config();

// prettier-ignore
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || functions.config().discord.webhook_url;
