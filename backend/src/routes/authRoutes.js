const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", verifyToken, authController.getMe);
router.post("/refresh-token", verifyToken, authController.refreshToken);

module.exports = router;
