const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { verifyToken } = require("../middleware/authVerification");

router.post("/register", authController.register);
router.post("/verification", verifyToken, authController.verification);
router.post("/login", authController.login);
router.post("/change-password", verifyToken, authController.changePassword);
router.post("/reset-password", authController.sendLinkResetPassword);
router.post("/admin/login", authController.loginAdmin);

module.exports = router;
