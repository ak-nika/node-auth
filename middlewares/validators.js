const joi = require("joi");

exports.authSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(50)
    .required()
    .email({ tlds: ["com", "net"] }),
  password: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.acceptCodeSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(50)
    .required()
    .email({ tlds: ["com", "net"] }),
  code: joi.number().required(),
});

exports.changePasswordSchema = joi.object({
  oldPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
  newPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});
