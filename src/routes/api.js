const express = require('express');
const router = express.Router();
const { evaluateRating } = require('../services/sentiment-router');
const { saveFeedback, getStats } = require('../services/feedback-storage');
const { sendAlert } = require('../services/telegram-alert');
const { generateQRBuffer } = require('../services/qr-generator');

const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;

router.post('/sentiment', (req, res) => {
  try {
    const { rating, place_id, min_stars } = req.body;
    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: 'Rating is required' });
    }
    const result = evaluateRating(rating, { placeId: place_id, minStars: min_stars });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { name, phone, rating, category, message, place_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }
    if (!VN_PHONE_REGEX.test(phone)) {
      return res.status(400).json({ error: 'Invalid Vietnamese phone number' });
    }
    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const record = await saveFeedback({ name: name.trim(), phone, rating, category, message: message.trim(), place_id });

    sendAlert(record).catch(() => {});

    return res.status(201).json({ success: true, id: record.id });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

router.get('/qr', async (req, res) => {
  try {
    const url = req.query.url;
    const buffer = await generateQRBuffer(url);
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline; filename="tvt-review-qr.png"');
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;
