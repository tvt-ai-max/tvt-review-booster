const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

let server;
let baseUrl;

function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, baseUrl);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

before(async () => {
  if (fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
  }
  const app = require('../src/server');
  server = app.listen(0);
  await new Promise((resolve) => server.on('listening', resolve));
  const addr = server.address();
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
  }
});

beforeEach(() => {
  if (fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
  }
});

describe('POST /api/v1/feedback', () => {
  const validPayload = {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    rating: 2,
    category: 'Thời gian chờ',
    message: 'Tôi đợi quá lâu.',
  };

  it('saves valid feedback and returns 201', async () => {
    const res = await request('POST', '/api/v1/feedback', validPayload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.id);
  });

  it('persists feedback to feedback.json', async () => {
    await request('POST', '/api/v1/feedback', validPayload);
    const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    assert.equal(data.length, 1);
    assert.equal(data[0].name, 'Nguyễn Văn A');
    assert.equal(data[0].phone, '0912345678');
  });

  it('rejects missing name', async () => {
    const res = await request('POST', '/api/v1/feedback', { ...validPayload, name: '' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.includes('Name'));
  });

  it('rejects missing phone', async () => {
    const res = await request('POST', '/api/v1/feedback', { ...validPayload, phone: '' });
    assert.equal(res.status, 400);
  });

  it('rejects invalid phone number', async () => {
    const res = await request('POST', '/api/v1/feedback', { ...validPayload, phone: '12345' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.includes('phone'));
  });
});

describe('GET /api/v1/stats', () => {
  it('returns aggregated stats', async () => {
    await request('POST', '/api/v1/feedback', {
      name: 'Test User',
      phone: '0987654321',
      rating: 1,
      category: 'Chi phí',
      message: 'Quá đắt.',
    });
    const res = await request('GET', '/api/v1/stats');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body.total === 'number');
    assert.ok(typeof res.body.positive === 'number');
    assert.ok(typeof res.body.negative === 'number');
  });
});

describe('POST /api/v1/sentiment', () => {
  it('returns REDIRECT_GOOGLE for rating 5', async () => {
    const res = await request('POST', '/api/v1/sentiment', { rating: 5 });
    assert.equal(res.status, 200);
    assert.equal(res.body.action, 'REDIRECT_GOOGLE');
  });

  it('returns SHOW_FEEDBACK_FORM for rating 2', async () => {
    const res = await request('POST', '/api/v1/sentiment', { rating: 2 });
    assert.equal(res.status, 200);
    assert.equal(res.body.action, 'SHOW_FEEDBACK_FORM');
  });

  it('rejects missing rating', async () => {
    const res = await request('POST', '/api/v1/sentiment', {});
    assert.equal(res.status, 400);
  });
});

describe('GET /health', () => {
  it('returns health status', async () => {
    const res = await request('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });
});
