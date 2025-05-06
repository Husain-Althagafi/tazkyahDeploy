// backend/src/controllers/personController.js
const personRepository = require("../repositories/personRepository");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * Get person by ID
 * @route GET /api/persons/:id
 * @access Private (Admin, Self)
 */
exports.getPersonById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get person using repository
  const person = await personRepository.findById(id);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  // Check if user is requesting their own data or is an admin
  const userPersonId = req.user.personId.toString();
  if (id !== userPersonId && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to access this person" });
  }

  res.status(200).json({
    success: true,
    data: person,
  });
});

/**
 * Get person by email
 * @route GET /api/persons/email/:email
 * @access Private (Admin)
 */
exports.getPersonByEmail = asyncHandler(async (req, res) => {
  // Only admins can search persons by email
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to search persons by email" });
  }

  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Get person using repository
  const person = await personRepository.findByEmail(email);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  res.status(200).json({
    success: true,
    data: person,
  });
});

/**
 * Update person
 * @route PUT /api/persons/:id
 * @access Private (Admin, Self)
 */
exports.updatePerson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if user is updating their own data or is an admin
  const userPersonId = req.user.personId.toString();
  if (id !== userPersonId && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to update this person" });
  }

  // Get person to ensure it exists
  const person = await personRepository.findById(id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  // Update person using repository
  const updatedPerson = await personRepository.updatePerson(id, updateData);

  res.status(200).json({
    success: true,
    message: "Person updated successfully",
    data: updatedPerson,
  });
});

/**
 * Update profile picture
 * @route PUT /api/persons/:id/profile-picture
 * @access Private (Admin, Self)
 */
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res.status(400).json({ error: "Profile picture URL is required" });
  }

  // Check if user is updating their own data or is an admin
  const userPersonId = req.user.personId.toString();
  if (id !== userPersonId && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to update this profile picture" });
  }

  // Get person to ensure it exists
  const person = await personRepository.findById(id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  // Update profile picture using repository
  const updatedPerson = await personRepository.updatePerson(id, {
    profilePicture,
  });

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    data: {
      profilePicture: updatedPerson.profilePicture,
    },
  });
});

/**
 * Get current person
 * @route GET /api/persons/me
 * @access Private
 */
exports.getCurrentPerson = asyncHandler(async (req, res) => {
  // Get person using repository
  const person = await personRepository.findById(req.user.personId);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  res.status(200).json({
    success: true,
    data: person,
  });
});
