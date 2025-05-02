const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/sendVerificationCode", authController.sendVerificationCode);
router.post("/verifyCode", authController.verifyCode);

module.exports = router;
