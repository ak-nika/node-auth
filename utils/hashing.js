const { createHmac } = require("crypto");
const { hash, compare } = require("bcrypt");

exports.hashPassword = async (value, saltValue) => {
  const result = await hash(value, saltValue);
  return result;
};

exports.comparePassword = async (password, hashedPassword) => {
  const result = await compare(password, hashedPassword);
  return result;
};

exports.hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
