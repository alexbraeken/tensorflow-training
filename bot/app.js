const { App } = require('@slack/bolt');
const handleMessage = require('./listeners/messages');
const { getSecret } = require('../services/secret-manager');
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, 
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// Listeners
app.message(handleMessage);

// Start
(async () => {
  await app.start();
  console.log('⚡ Slackbot running in Socket Mode');
})();