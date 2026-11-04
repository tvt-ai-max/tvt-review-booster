const https = require('https');
const config = require('../config');

function formatMessage(feedback) {
  const stars = '⭐️'.repeat(feedback.rating);
  return [
    '🚨 [CẢNH BÁO KHIẾU NẠI KHÁCH HÀNG] 🚨',
    '',
    `• Đánh giá: ${stars} ${feedback.rating}/5 Sao`,
    `• Khách hàng: ${feedback.name} (${feedback.phone})`,
    `• Vấn đề: ${feedback.category}`,
    `• Nội dung: "${feedback.message}"`,
    `• Thời gian: ${feedback.timestamp}`,
    '',
    '👉 Ban Giám đốc cần liên hệ xử lý ngay trước khi khách đăng lên mạng xã hội!',
  ].join('\n');
}

function sendAlert(feedback) {
  if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
    return Promise.resolve({ ok: false, reason: 'Telegram not configured' });
  }

  const text = formatMessage(feedback);
  const payload = JSON.stringify({
    chat_id: config.TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'HTML',
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({ ok: false, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { sendAlert, formatMessage };
