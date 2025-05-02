const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const { verifyToken, requireRoles } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(verifyToken);

// Admin routes
router.get(
  "/email/:email",
  requireRoles(["admin"]),
  personController.getPersonByEmail
);

// Mixed access routes (Self or Admin)
router.get("/:id", personController.getPersonById);
router.put("/:id", personController.updatePerson);
router.put("/:id/profile-picture", personController.updateProfilePicture);

// User routes
router.get("/me", personController.getCurrentPerson);

module.exports = router;