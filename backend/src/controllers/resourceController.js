const resourceRepository = require("../repositories/resourceRepository");
const asyncHandler = require("../middlewares/asyncHandler");
const multer = require("multer");
const path = require("path");

// Set up multer for memory storage (we'll handle disk storage ourselves)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      // Images
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      // Documents
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".xls",
      ".xlsx",
      ".txt",
      // Audio/Video
      ".mp3",
      ".mp4",
      ".wav",
      // Other
      ".zip",
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      return cb(null, true);
    }

    cb(new Error("Invalid file type. Only specific file types are allowed."));
  },
}).single("file"); // 'file' is the field name in the form

/**
 * Upload middleware handler
 */
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error (e.g., file too large)
      return res.status(400).json({
        error: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // Other error
      return res.status(400).json({
        error: err.message,
      });
    }

    // Success - continue to next middleware
    next();
  });
};

/**
 * Upload a new resource
 * @route POST /api/resources
 * @access Private (Instructors, Admins)
 */
exports.uploadResource = [
  handleUpload,
  asyncHandler(async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    // Check if required fields are provided
    if (!req.body.courseId) {
      return res.status(400).json({
        error: "Course ID is required",
      });
    }

    // Create resource
    const resourceData = {
      title: req.body.title,
      description: req.body.description,
      courseId: req.body.courseId,
      uploadedBy: req.user.id, // From auth middleware
    };

    const resource = await resourceRepository.createResource(
      resourceData,
      req.file.buffer,
      req.file.originalname
    );

    res.status(201).json({
      success: true,
      data: resource,
    });
  }),
];

/**
 * Get all resources for a course
 * @route GET /api/resources/course/:courseId
 * @access Private
 */
exports.getCourseResources = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Get resources
  const resources = await resourceRepository.findByCourse(courseId);

  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources,
  });
});

/**
 * Get resources by type for a course
 * @route GET /api/resources/course/:courseId/type/:type
 * @access Private
 */
exports.getResourcesByType = asyncHandler(async (req, res) => {
  const { courseId, type } = req.params;

  // Get resources
  const resources = await resourceRepository.findByType(courseId, type);

  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources,
  });
});

/**
 * Search resources for a course
 * @route GET /api/resources/course/:courseId/search
 * @access Private
 */
exports.searchResources = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Search term is required",
    });
  }

  // Search resources
  const resources = await resourceRepository.searchResources(courseId, q);

  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources,
  });
});

/**
 * Get a resource by ID
 * @route GET /api/resources/:id
 * @access Private
 */
exports.getResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get resource
  const resource = await resourceRepository.findById(id);

  if (!resource) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  res.status(200).json({
    success: true,
    data: resource,
  });
});

/**
 * Update a resource
 * @route PUT /api/resources/:id
 * @access Private (Instructors, Admins)
 */
exports.updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get resource to check permissions
  const resource = await resourceRepository.findById(id);

  if (!resource) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  // Check if user is the uploader or an admin
  if (
    resource.uploadedBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "Not authorized to update this resource",
    });
  }

  // Update resource
  const updatedResource = await resourceRepository.updateResource(id, {
    title: req.body.title,
    description: req.body.description,
  });

  res.status(200).json({
    success: true,
    data: updatedResource,
  });
});

/**
 * Delete a resource
 * @route DELETE /api/resources/:id
 * @access Private (Instructors, Admins)
 */
exports.deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get resource to check permissions
  const resource = await resourceRepository.findById(id);

  if (!resource) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  // Check if user is the uploader or an admin
  if (
    resource.uploadedBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "Not authorized to delete this resource",
    });
  }

  // Delete resource
  await resourceRepository.deleteResource(id);

  res.status(200).json({
    success: true,
    message: "Resource deleted successfully",
  });
});

/**
 * Download a resource
 * @route GET /api/resources/:id/download
 * @access Private
 */
exports.downloadResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get resource
  const resource = await resourceRepository.findById(id);

  if (!resource) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  try {
    // Get file
    const fileData = await resourceRepository.getFile(resource.fileUrl);

    // Extract original filename from fileUrl
    const filename = path.basename(resource.fileUrl);
    const originalFilename = filename.substring(filename.indexOf("-") + 1);

    // Set headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalFilename}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Send file
    res.send(fileData);
  } catch (error) {
    return res.status(404).json({
      error: "File not found",
    });
  }
});
