const userRepository = require("../repositories/userRepository");
const personRepository = require("../repositories/personRepository");
const asyncHandler = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");

/**
 * Get all users
 * @route GET /api/users
 * @access Private (Admin)
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  // Get query parameters for pagination
  const { page = 1, limit = 10 } = req.query;

  // Get users using repository
  const result = await userRepository.getAllUsers(page, limit);

  res.status(200).json({
    success: true,
    count: result.users.length,
    pagination: result.pagination,
    data: result.users,
  });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private (Admin, Self)
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get user using repository
  const user = await userRepository.findById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if user is requesting their own data or is an admin
  if (id !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to access this user" });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Get user by email
 * @route GET /api/users/email/:email
 * @access Private (Admin)
 */
exports.getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Get user using repository
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Create new user
 * @route POST /api/users
 * @access Private (Admin)
 */
exports.addUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  // Check if user with email already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  // Create user data object
  const userData = {
    firstName,
    lastName,
    email,
    password,
    role: role || "student",
    phoneNumber,
  };

  // Create user using repository
  const user = await userRepository.createUser(userData);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      firstName: user.person.firstName,
      lastName: user.person.lastName,
      email: user.person.email,
      role: user.role,
    },
  });
});

/**
 * Update user
 * @route PUT /api/users/:id
 * @access Private (Admin, Self)
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if user is updating their own data or is an admin
  if (id !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to update this user" });
  }

  // Get user to ensure it exists
  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Only admins can update roles
  if (updateData.role && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to update role" });
  }

  // Update user using repository
  const updatedUser = await userRepository.updateUser(id, updateData);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 * @access Private (Admin)
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Only admins can delete users
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to delete users" });
  }

  // Delete user using repository
  const result = await userRepository.deleteUser(id);

  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, bio } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Create update data object
  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (bio) updateData.bio = bio;

  // Update user using repository
  const updatedUser = await userRepository.updateUser(req.user.id, updateData);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/**
 * Change password
 * @route PUT /api/users/password
 * @access Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current password and new password are required" });
  }

  // Change password using repository
  const result = await userRepository.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  if (!result) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

/**
 * Get current user
 * @route GET /api/users/me
 * @access Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  // Get user using repository
  const user = await userRepository.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Get users by role
 * @route GET /api/users/role/:role
 * @access Private (Admin)
 */
exports.getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  // Check if role is valid
  const validRoles = ["student", "instructor", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Get users by role using repository
  const users = await userRepository.findByRole(role);
  console.log(users);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
