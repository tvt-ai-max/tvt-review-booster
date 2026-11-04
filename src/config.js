const path = require('path');

require('dotenv').config();

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3003,
  GOOGLE_PLACE_ID: process.env.GOOGLE_PLACE_ID || 'YOUR_GOOGLE_PLACE_ID',
  MIN_STARS_FOR_GOOGLE: parseInt(process.env.MIN_STARS_FOR_GOOGLE, 10) || 4,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  DATA_DIR: process.env.DATA_DIR || path.join(__dirname, 'data'),
  BASE_URL: process.env.BASE_URL || 'http://localhost:3003',
};
