const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
process.on('uncaughtException', (err) => {
    console.error('Route Error:', err);
    // Restart the server if needed
  });
// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", verifyToken, authController.getMe);
router.post("/refresh-token", verifyToken, authController.refreshToken);

module.exports = router;
