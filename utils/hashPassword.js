const { hash } = require("bcrypt");

exports.hashPassword = async (value, saltValue) => {
  const result = await hash(value, saltValue);
  return result;
};
