const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

let helmet;
try {
  helmet = require('helmet');
} catch {
  helmet = null;
}

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch {
  rateLimit = null;
}

const apiRoutes = require('./routes/api');

const app = express();

if (helmet) {
  app.use(helmet({ contentSecurityPolicy: false }));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use(limiter);
}

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use('/api/v1', apiRoutes);

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(config.PORT, () => {
    console.log(`TVT Review Booster running on port ${config.PORT}`);
  });
}

module.exports = app;
