const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const { authSchema, acceptCodeSchema } = require("../middlewares/validators");
const {
  hashPassword,
  comparePassword,
  hmacProcess,
} = require("../utils/hashing");
const transporter = require("../middlewares/sendMail");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error, value } = authSchema.validate({ email, password });

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error, value } = authSchema.validate({ email, password });
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

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid email or password" });
    }

    const isCorrectPassword = await comparePassword(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        verified: user.verified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        status: "Success",
        message: "User logged in",
        token,
      });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.logout = (req, res) => {
  res
    .clearCookie("Authorization", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ status: "Success", message: "User logged out" });
};

exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }
    if (user.verified) {
      return res
        .status(401)
        .json({ status: "Failed", message: "User already verified" });
    }

    const code = Math.floor(Math.random() * 1000000).toString();
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email address",
      html: `<p>Hi,</p>
            <p>To verify your email address, please enter the following code:</p>
            <h1>${code}</h1>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Thanks,</p>
            <p>The Team</p>`,
    });

    if (info.accepted[0] === user.email) {
      const hashedCode = hmacProcess(code, process.env.HMAC_CODE_SECRET);
      user.verificationCode = hashedCode;
      user.verificationCodeValidation = Date.now();
      user.save();

      return res.status(200).json({
        status: "Success",
        message: "Your validation code has been sent",
      });
    }

    res.status(400).json({ status: "Failed", message: "Failed to send code " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const { error, value } = acceptCodeSchema.validate({ email, code });
    if (error) {
      let message = error.details[0].message;

      if (error.details[0].context.key === "code") {
        message = "Code must be a number";
      } else if (error.details[0].context.key === "email") {
        message = "Email must be a valid email address";
      }
      return res.status(401).json({ status: "Failed", message });
    }

    const codeValue = code.toString();
    const user = await User.findOne({ email }).select("+verificationCode");

    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }
    if (user.verified) {
      return res
        .status(401)
        .json({ status: "Failed", message: "User already verified" });
    }
    if (!user.verificationCode || !user.verificationCodeValidation) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Verification code not found" });
    }
    if (Date.now() - user.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(401).json({
        status: "Failed",
        message: "Verification code expired",
      });
    }

    const hashedCode = hmacProcess(codeValue, process.env.HMAC_CODE_SECRET);
    if (hashedCode !== user.verificationCode) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid verification code" });
    }
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationCodeValidation = undefined;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "User verified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
