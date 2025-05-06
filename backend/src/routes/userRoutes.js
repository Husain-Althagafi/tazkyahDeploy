const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, requireRoles } = require("../middleware/auth");

// Apply authentication middleware to all routes
process.on('uncaughtException', (err) => {
  console.error('Route Error:', err);
  // Restart the server if needed
});
router.use(verifyToken);

// Admin routes
router.get("/", requireRoles(["admin"]), userController.getAllUsers);
router.get(
  "/email/:email",
  requireRoles(["admin"]),
  userController.getUserByEmail
);
router.get(
  "/role/:role",
  requireRoles(["admin"]),
  userController.getUsersByRole
);
router.post("/", requireRoles(["admin"]), userController.addUser);
router.delete("/:id", requireRoles(["admin"]), userController.deleteUser);

// User routes
router.get("/me", userController.getCurrentUser);
router.put("/profile", userController.updateUserProfile);
router.put("/password", userController.changePassword);

// Mixed access routes (Self or Admin)
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

module.exports = router;