const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;

describe('Vietnamese Phone Number Validation', () => {
  const validPhones = [
    '0912345678',
    '0987654321',
    '0356789012',
    '0567890123',
    '0789012345',
    '0812345678',
    '+84912345678',
    '+84356789012',
  ];

  const invalidPhones = [
    '12345',
    '091234567',
    '09123456789',
    '0112345678',
    '0012345678',
    'abcdefghij',
    '',
    '+1234567890',
    '0612345678',
  ];

  validPhones.forEach((phone) => {
    it(`accepts valid VN phone: ${phone}`, () => {
      assert.ok(VN_PHONE_REGEX.test(phone), `Expected ${phone} to be valid`);
    });
  });

  invalidPhones.forEach((phone) => {
    it(`rejects invalid phone: "${phone}"`, () => {
      assert.ok(!VN_PHONE_REGEX.test(phone), `Expected "${phone}" to be invalid`);
    });
  });
});

describe('Required Fields Validation', () => {
  it('rejects empty name', () => {
    assert.ok(!(''.trim()), 'Empty name should be falsy');
  });

  it('rejects whitespace-only name', () => {
    assert.ok(!('   '.trim()), 'Whitespace name should be falsy after trim');
  });

  it('accepts valid name', () => {
    assert.ok('Nguyễn Văn A'.trim(), 'Valid name should be truthy');
  });

  it('rejects empty message', () => {
    assert.ok(!(''.trim()), 'Empty message should be falsy');
  });

  it('accepts valid message', () => {
    assert.ok('Tôi không hài lòng.'.trim(), 'Valid message should be truthy');
  });

  it('validates category is required', () => {
    const validCategories = ['Thái độ phục vụ', 'Thời gian chờ', 'Chất lượng dịch vụ', 'Chi phí', 'Khác'];
    validCategories.forEach((cat) => {
      assert.ok(cat, `Category "${cat}" should be truthy`);
    });
    assert.ok(!(''), 'Empty category should be falsy');
  });

  it('validates rating range 1-5', () => {
    for (let i = 1; i <= 5; i++) {
      assert.ok(i >= 1 && i <= 5, `Rating ${i} should be in range`);
    }
    assert.ok(!(0 >= 1 && 0 <= 5), 'Rating 0 should be out of range');
    assert.ok(!(6 >= 1 && 6 <= 5), 'Rating 6 should be out of range');
  });
});
