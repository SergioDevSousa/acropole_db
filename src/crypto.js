const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = crypto
  .createHash('sha256')
  .update(process.env.CRYPTO_SECRET)
  .digest('base64')
  .substr(0, 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final(),
  ]);

  return Buffer.concat([iv, encrypted]);
}

function decrypt(buffer) {
  const iv = buffer.subarray(0, 16);
  const encryptedText = buffer.subarray(16);

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
}

module.exports = { encrypt, decrypt };