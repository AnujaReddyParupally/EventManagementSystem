const crypto = require("crypto");
const salt =  "e6d9bf952dc51e7320c6ae7e3f7d98e2";

const encrypt = (password) => {
  var hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");
  return hash;
};

const validPassword = (password,dbpassword) => {
  var hashpassword = encrypt(password);
  return hashpassword === dbpassword;
}

exports.encrypt = encrypt;
exports.validPassword = validPassword;
