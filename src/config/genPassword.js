const SHA256 = require("crypto-js");
const {
  salt,
  secretKey
} = require('./local');

const ciphertext = CryptoJS.AES.encrypt(salt, 'secret key 123');

console.log(SHA256(salt));
