const router = require("express").Router();
const authController = require("../controllers/authController");
const { identifier } = require("../middlewares/identification");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", identifier, authController.logout);

router.post(
  "/sendVerificationCode",
  identifier,
  authController.sendVerificationCode
);
router.post("/verifyCode", identifier, authController.verifyCode);
router.patch("/changePassword", identifier, authController.changePassword);

module.exports = router;
