const express = require("express");
const resourceController = require("../controllers/resourceController");
const { verifyToken, requireRoles } = require("../middlewares/auth");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Upload a new resource (Instructors, Admins only)
router.post(
  "/",
  requireRoles(["instructor", "admin"]),
  resourceController.uploadResource
);

// Get all resources for a course
router.get("/course/:courseId", resourceController.getCourseResources);

// Get resources by type for a course
router.get(
  "/course/:courseId/type/:type",
  resourceController.getResourcesByType
);

// Search resources for a course
router.get("/course/:courseId/search", resourceController.searchResources);

// Get a resource by ID
router.get("/:id", resourceController.getResource);

// Update a resource (Instructors, Admins only)
router.put(
  "/:id",
  requireRoles(["instructor", "admin"]),
  resourceController.updateResource
);

// Delete a resource (Instructors, Admins only)
router.delete(
  "/:id",
  requireRoles(["instructor", "admin"]),
  resourceController.deleteResource
);

// Download a resource
router.get("/:id/download", resourceController.downloadResource);

module.exports = router;
