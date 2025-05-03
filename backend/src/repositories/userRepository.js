const User = require('../models/User');
const Person = require('../models/Person');
const personRepository = require('./personRepository');

/**
 * Repository for User-related database operations
 */
class UserRepository {
  /**
   * Create a new user with associated person
   * @param {Object} userData - User data including person information
   * @returns {Promise<Object>} Created user with person data
   */
  async createUser(userData) {
    try {
      // First create the person
      const personData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData.profilePicture,
      };

      const person = await personRepository.createPerson(personData);

      // Create user with reference to person
      const user = new User({
        personId: person._id,
        role: userData.role || "student",
        password: userData.password, // Will be hashed by pre-save middleware
      });

      await user.save();

      // Return user with person data
      return {
        ...user.toJSON(),
        person: person.toJSON(),
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  /**
   * Find user by ID with person data
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User with person data or null if not found
   */
  async findById(id) {
    try {
      return await User.findById(id).populate("person");
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  /**
   * Find user by email (using person email)
   * @param {string} email - Email to search
   * @returns {Promise<Object|null>} User with person data or null if not found
   */
  async findByEmail(email) {
    try {
      // First find the person by email
      const person = await Person.findOne({ email });
      if (!person) return null;

      // Find the user associated with this person
      const user = await User.findOne({ personId: person._id });
      if (!user) return null;

      // Return with person data
      return {
        ...user.toJSON(),
        person: person.toJSON(),
      };
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object|null>} User data if authentication successful, null otherwise
   */
  async authenticateUser(email, password) {
    try {
      console.log("Finding person by email:", email);
      // Find person by email
      const person = await Person.findOne({ email });
      console.log("Person found:", person ? "Yes" : "No");
      if (!person) return null;

      console.log("Finding user by personId");
      // Find user associated with this person
      const user = await User.findOne({ personId: person._id });
      console.log("User found:", user ? "Yes" : "No");
      if (!user) return null;

      console.log("Comparing password");
      // Check password
      const isMatch = await user.comparePassword(password);
      console.log("Password match:", isMatch ? "Yes" : "No");
      if (!isMatch) return null;

      // Update last login time
      await personRepository.updateLastLogin(person._id);

      // Return user with person data
      return {
        ...user.toJSON(),
        person: person.toJSON(),
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  /**
   * Find users by role
   * @param {string} role - Role to filter by
   * @returns {Promise<Array>} List of users with person data
   */
  async findByRole(role) {
    try {
      const users = await User.find({ role }).populate("person").exec();
      console.log(users)
      return users;
    } catch (error) {
      throw new Error(`Error finding users by role: ${error.message}`);
    }
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update (can include person data)
   * @returns {Promise<Object|null>} Updated user with person data or null if not found
   */
  async updateUser(id, updateData) {
    try {
      // Extract person data
      const personData = {};
      const userData = {};

      // Separate user and person fields
      if (updateData.firstName) personData.firstName = updateData.firstName;
      if (updateData.lastName) personData.lastName = updateData.lastName;
      if (updateData.email) personData.email = updateData.email;
      if (updateData.phoneNumber)
        personData.phoneNumber = updateData.phoneNumber;
      if (updateData.profilePicture)
        personData.profilePicture = updateData.profilePicture;

      if (updateData.role) userData.role = updateData.role;
      if (updateData.password) userData.password = updateData.password;

      // Get user with person reference
      const user = await User.findById(id);
      if (!user) return null;

      // Update person if needed
      if (Object.keys(personData).length > 0) {
        await personRepository.updatePerson(user.personId, personData);
      }

      // Update user if needed
      if (Object.keys(userData).length > 0) {
        Object.assign(user, userData);
        await user.save();
      }

      // Return updated user with person data
      return await User.findById(id).populate("person");
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Delete user and associated person
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteUser(id) {
    try {
      const user = await User.findById(id);
      if (!user) return false;

      // Delete user
      await User.findByIdAndDelete(id);

      // Delete associated person
      await personRepository.deletePerson(user.personId);

      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  /**
   * Get all users with pagination
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} Object with users and pagination data
   */
  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const users = await User.find()
        .populate("person")
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments();

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }

  /**
   * Change user password
   * @param {string} id - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if password changed, false if current password is incorrect
   */
  async changePassword(id, currentPassword, newPassword) {
    try {
      const user = await User.findById(id);
      if (!user) return false;

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return false;

      // Update password
      user.password = newPassword; // Will be hashed by pre-save middleware
      await user.save();

      return true;
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();