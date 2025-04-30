const User = require("../models/usersModel");
const { signupSchema } = require("../middlewares/validators");
const { hashPassword } = require("../utils/hashPassword");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      let message = error.details[0].message;

      if (error.details[0].context.key === "password") {
        message =
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number";
      } else if (error.details[0].context.key === "email") {
        message = "Email must be a valid email address";
      }
      return res.status(401).json({ status: "Failed", message });
    }

    const hashedPassword = await hashPassword(password, 12);

    const newUser = {
      email,
      password: hashedPassword,
    };

    const user = await User.create(newUser);

    res
      .status(201)
      .json({ status: "Success", message: "User created", data: user });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
