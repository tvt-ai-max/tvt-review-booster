const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatMessage } = require('../src/services/telegram-alert');

describe('Telegram Alert', () => {
  const sampleFeedback = {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    rating: 2,
    category: 'Thời gian chờ',
    message: 'Tôi đặt lịch lúc 9h nhưng phải đợi đến 10h mới được phục vụ.',
    timestamp: '2024-01-15T10:30:00.000Z',
  };

  it('formats message with siren emoji header', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('🚨'));
    assert.ok(msg.includes('CẢNH BÁO KHIẾU NẠI KHÁCH HÀNG'));
  });

  it('includes customer name and phone', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('Nguyễn Văn A'));
    assert.ok(msg.includes('0912345678'));
  });

  it('includes star rating', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('2/5 Sao'));
    assert.ok(msg.includes('⭐️'));
  });

  it('includes category', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('Thời gian chờ'));
  });

  it('includes feedback message content', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('Tôi đặt lịch lúc 9h'));
  });

  it('includes call-to-action for management', () => {
    const msg = formatMessage(sampleFeedback);
    assert.ok(msg.includes('Ban Giám đốc'));
    assert.ok(msg.includes('👉'));
  });

  it('generates correct number of star emojis', () => {
    const msg1 = formatMessage({ ...sampleFeedback, rating: 1 });
    const msg3 = formatMessage({ ...sampleFeedback, rating: 3 });
    assert.ok(msg1.includes('⭐️ 1/5'));
    assert.ok(msg3.includes('⭐️⭐️⭐️ 3/5'));
  });
});
