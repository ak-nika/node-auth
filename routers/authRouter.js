const router = require("express").Router();
const authController = require("../controllers/authController");
const { identifier } = require("../middlewares/identification");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", identifier, authController.logout);

router.patch(
  "/sendVerificationCode",
  identifier,
  authController.sendVerificationCode
);
router.patch("/verifyCode", identifier, authController.verifyCode);
router.patch("/changePassword", identifier, authController.changePassword);
router.patch("/sendForgotCode", authController.sendForgotPasswordCode);
router.patch("/verifyForgotPassword", authController.verifyForgotPasswordCode);

module.exports = router;
