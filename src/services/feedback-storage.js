const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');

const FEEDBACK_FILE = path.join(config.DATA_DIR, 'feedback.json');

let writeLock = Promise.resolve();

function ensureDataDir() {
  if (!fs.existsSync(config.DATA_DIR)) {
    fs.mkdirSync(config.DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readAll() {
  ensureDataDir();
  const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveFeedback(entry) {
  const record = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    name: entry.name,
    phone: entry.phone,
    rating: parseInt(entry.rating, 10),
    category: entry.category,
    message: entry.message,
    place_id: entry.place_id || config.GOOGLE_PLACE_ID,
  };

  writeLock = writeLock.then(() => {
    const data = readAll();
    data.push(record);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2), 'utf8');
    return record;
  });

  return writeLock;
}

function getStats() {
  const data = readAll();
  const total = data.length;
  const negative = data.filter((d) => d.rating < config.MIN_STARS_FOR_GOOGLE).length;
  const positive = total - negative;

  return { total, positive, negative, feedbacks: data };
}

module.exports = { saveFeedback, getStats, readAll };
