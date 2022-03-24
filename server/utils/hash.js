const crypto = require("crypto");
const salt = crypto.randomBytes(16).toString("hex");

const encrypt = (password) => {
  var hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");
  return `${salt}$${hash}`;
};

const decrypt = (encryptedPassword, actualPassword) => {
  const [salt, hash] = encryptedPassword.split("$");
  const actualHash = crypto
    .createHmac("sha512", salt)
    .update(actualPassword)
    .digest("base64");
  return hash === actualHash;
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;
