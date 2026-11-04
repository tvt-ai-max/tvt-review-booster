const QRCode = require('qrcode');
const config = require('../config');

async function generateQRDataURL(url) {
  const target = url || `${config.BASE_URL}`;
  return QRCode.toDataURL(target, {
    width: 400,
    margin: 2,
    color: { dark: '#003189', light: '#F8FAFC' },
  });
}

async function generateQRBuffer(url) {
  const target = url || `${config.BASE_URL}`;
  return QRCode.toBuffer(target, {
    type: 'png',
    width: 400,
    margin: 2,
    color: { dark: '#003189', light: '#F8FAFC' },
  });
}

module.exports = { generateQRDataURL, generateQRBuffer };
