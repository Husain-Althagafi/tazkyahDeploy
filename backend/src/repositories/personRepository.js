const Person = require('../models/Person');

/**
 * Repository for Person-related database operations
 */
class PersonRepository {
    /**
     * Create a new person
     * @param {Object} personData - Person data
     * @returns {Promise<Object>} Created person
     */
    async createPerson(personData) {
        try {
            const person = new Person(personData);
            await person.save();
            return person;
        } catch (error) {
            throw new Error(`Error creating person: ${error.message}`);
        }
    }
    
    /**
     * Find person by email
     * @param {string} email - Email to search
     * @returns {Promise<Object|null>} Person or null if not found
     */
    async findByEmail(email) {
        try {
            return await Person.findOne({ email });
        } catch (error) {
            throw new Error(`Error finding person by email: ${error.message}`);
        }
    }
    
    /**
     * Find person by ID
     * @param {string} id - Person ID
     * @returns {Promise<Object|null>} Person or null if not found
     */
    async findById(id) {
        try {
            return await Person.findById(id);
        } catch (error) {
            throw new Error(`Error finding person by ID: ${error.message}`);
        }
    }
    
    /**
     * Update person
     * @param {string} id - Person ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated person or null if not found
     */
    async updatePerson(id, updateData) {
        try {
            return await Person.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating person: ${error.message}`);
        }
    }
    
    /**
     * Delete person
     * @param {string} id - Person ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async deletePerson(id) {
        try {
            const result = await Person.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Error deleting person: ${error.message}`);
        }
    }
    
    /**
     * Update last login time
     * @param {string} id - Person ID
     * @returns {Promise<void>}
     */
    async updateLastLogin(id) {
        try {
            await Person.findByIdAndUpdate(id, { 
                lastLogin: new Date() 
            });
        } catch (error) {
            throw new Error(`Error updating last login: ${error.message}`);
        }
    }
}

module.exports = new PersonRepository();