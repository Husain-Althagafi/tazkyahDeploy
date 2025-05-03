# Tazkhya.org

**Tazkhya.org** is a bilingual (Arabic & English) online platform dedicated to the Tazkyah initiative. Our mission is to nurture a generation of responsible and principled youth by offering high-quality, interactive courses that instill essential moral values in children.

## Motivation

In today's fast-paced and ever-changing world, parents face increased challenges balancing work, technology, and raising children with strong moral values. Tazkyah aims to address this need by providing engaging courses taught by professional mentors. Our platform makes it easy for children to learn and grow, while also informing the public about the initiative's mission.

## Summary

Tazkhya.org serves as a course hosting and information platform where:
- **Users** can sign up, enroll in courses, attend lectures, and access course materials.
- **Instructors** can add courses, conduct online classes, and share resources.
- **Admins** can update initiative details targeted at school-age children.

Due to limitations with the previous website—which was built using online blog tools without a dedicated backend—the owners reached out to us, a team of university students from KFUPM, to help reshape the platform into a fully functional and reliable online learning application.

## Table of Contents
- [Project Overview](#project-overview)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [Person Routes](#person-routes)
  - [Course Routes](#course-routes)
  - [Resource Routes](#resource-routes)
- [Database Models](#database-models)
- [Team](#team)
- [Contributing](#contributing)

## Installation

### Frontend Setup

Follow these steps to set up the frontend:

1. *Clone the Repository:*
   bash
   git clone https://github.com/Elecwizer/tazkyah.git
   cd tazkyah
   

2. *Install Dependencies:*
   bash
   npm install
   npm install react-router-dom
   

3. *Start the Development Server:*
   bash
   npm start
   

### Backend Setup

Follow these steps to set up the backend server:

1. *Navigate to the Backend Directory:*
   bash
   cd backend
   

2. *Install Dependencies:*
   bash
   npm install
   

3. *Set Up Environment Variables:*
   Create a .env file in the backend directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. *Initialize the Database:*
   bash
   node src/utils/seeder.js
   
   This will create sample data including admin, instructor, and student accounts, along with some courses.

5. *Start the Backend Server:*
   bash
   npm start
   
   or for development with auto-restart:
   bash
   npm run dev
   

## Environment Variables

Create a .env file in the backend directory with the following variables:


# Server Configuration
BACKEND_PORT=5005
NODE_ENV=development

# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/tazkyah
# or with authentication:
# MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/tazkyah?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=1h

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=uploads


Notes:
- JWT_SECRET should be a long, random string for security purposes
- MONGO_URL depends on your MongoDB setup (local or cloud-based like MongoDB Atlas)
- Make sure to create the uploads directory in the backend root if it doesn't exist

## API Documentation

The backend API is organized into several modules. All protected routes require a valid JWT token in the Authorization header:

Authorization: Bearer <your_token>


### Authentication Routes

*Base Path:* /api/auth

| Method | Endpoint | Auth Required | Description | Request Body | Success Response |
|--------|----------|---------------|-------------|--------------|------------------|
| POST | /register | No | Register a new user | { firstName, lastName, email, password, role? } | { success: true, token, user: {...} } |
| POST | /login | No | Login user | { email, password } | { success: true, token, user: {...} } |
| GET | /me | Yes | Get current user | - | { success: true, data: {...} } |
| POST | /refresh-token | Yes | Refresh JWT token | - | { success: true, token } |

### User Routes

*Base Path:* /api/users

| Method | Endpoint | Auth Required | Roles | Description | Request Body/Params | Success Response |
|--------|----------|---------------|-------|-------------|---------------------|------------------|
| GET | / | Yes | Admin | Get all users | Query: page, limit | { success: true, count, pagination, data } |
| GET | /:id | Yes | Admin, Self | Get user by ID | Param: id | { success: true, data } |
| GET | /email/:email | Yes | Admin | Get user by email | Param: email | { success: true, data } |
| GET | /role/:role | Yes | Admin | Get users by role | Param: role | { success: true, count, data } |
| POST | / | Yes | Admin | Create a new user | { firstName, lastName, email, password, role, phoneNumber } | { success: true, message, data } |
| PUT | /:id | Yes | Admin, Self | Update user | Param: id, Body: User data | { success: true, message, data } |
| DELETE | /:id | Yes | Admin | Delete user | Param: id | { success: true, message } |
| GET | /me | Yes | Any | Get current user | - | { success: true, data } |
| PUT | /profile | Yes | Any | Update user profile | { firstName, lastName, phoneNumber, bio } | { success: true, message, data } |
| PUT | /password | Yes | Any | Change password | { currentPassword, newPassword } | { success: true, message } |

### Person Routes

*Base Path:* /api/persons

| Method | Endpoint | Auth Required | Roles | Description | Request Body/Params | Success Response |
|--------|----------|---------------|-------|-------------|---------------------|------------------|
| GET | /email/:email | Yes | Admin | Get person by email | Param: email | { success: true, data } |
| GET | /me | Yes | Any | Get current person | - | { success: true, data } |
| GET | /:id | Yes | Admin, Self | Get person by ID | Param: id | { success: true, data } |
| PUT | /:id | Yes | Admin, Self | Update person | Param: id, Body: Person data | { success: true, message, data } |
| PUT | /:id/profile-picture | Yes | Admin, Self | Update profile picture | Param: id, Body: { profilePicture } | { success: true, message, data } |

### Course Routes

*Base Path:* /api/courses

| Method | Endpoint | Auth Required | Roles | Description | Request Body/Params | Success Response |
|--------|----------|---------------|-------|-------------|---------------------|------------------|
| GET | / | No | Any | Get all courses | Query: status, search, page, limit | { success: true, count, pagination, data } |
| GET | /:code | No | Any | Get course by code | Param: code | { success: true, data } |
| GET | /enrolled | Yes | Student | Get student's enrolled courses | - | { success: true, count, data } |
| POST | / | Yes | Instructor, Admin | Create a new course | Course data | { success: true, message, data } |
| PUT | /:code | Yes | Instructor, Admin | Update course | Param: code, Body: Course data | { success: true, message, data } |
| DELETE | /:code | Yes | Instructor, Admin | Delete course | Param: code | { success: true, message } |
| GET | /:code/students | Yes | Instructor, Admin | Get enrolled students | Param: code | { success: true, count, data } |
| POST | /:code/enroll | Yes | Student | Enroll in course | Param: code | { success: true, message } |
| DELETE | /:code/enroll | Yes | Student | Unenroll from course | Param: code | { success: true, message } |

### Resource Routes

*Base Path:* /api/resources

| Method | Endpoint | Auth Required | Roles | Description | Request Body/Params | Success Response |
|--------|----------|---------------|-------|-------------|---------------------|------------------|
| POST | / | Yes | Instructor, Admin | Upload resource | Form Data: file, title, description, courseId | { success: true, data } |
| GET | /course/:courseId | Yes | Any | Get course resources | Param: courseId | { success: true, count, data } |
| GET | /course/:courseId/type/:type | Yes | Any | Get resources by type | Params: courseId, type | { success: true, count, data } |
| GET | /course/:courseId/search | Yes | Any | Search resources | Param: courseId, Query: q | { success: true, count, data } |
| GET | /:id | Yes | Any | Get resource | Param: id | { success: true, data } |
| PUT | /:id | Yes | Instructor, Admin | Update resource | Param: id, Body: { title, description } | { success: true, data } |
| DELETE | /:id | Yes | Instructor, Admin | Delete resource | Param: id | { success: true, message } |
| GET | /:id/download | Yes | Any | Download resource | Param: id | Binary file data |

## Database Models

The application uses MongoDB with the following main models:

### User Model
- *personId*: Reference to Person document
- *role*: User role (student, instructor, admin)
- *password*: Hashed password

### Person Model
- *firstName*: Person's first name
- *lastName*: Person's last name
- *email*: Person's email (unique)
- *phoneNumber*: Contact number
- *profilePicture*: URL to profile image
- *createdAt*: Account creation date
- *lastLogin*: Last login timestamp

### Course Model
- *title*: Course title
- *code*: Unique course code
- *description*: Course description
- *status*: Course status (active, inactive, upcoming)
- *enrollmentCapacity*: Maximum number of students
- *enrolledStudents*: Array of student user IDs
- *startDate*: Course start date
- *endDate*: Course end date
- *instructorId*: Reference to instructor User
- *createdAt*: Course creation date
- *courseStatus*: Availability status
- *img*: Course image URL
- *courseModernity*: Course age category

### Resource Model
- *title*: Resource title
- *description*: Resource description
- *fileUrl*: Path to stored file
- *fileType*: Type of resource (document, image, video, etc.)
- *courseId*: Reference to Course
- *uploadedAt*: Upload timestamp
- *uploadedBy*: Reference to User who uploaded

### Enrollment Model
- *userId*: Reference to User (student)
- *courseId*: Reference to Course
- *progress*: Course completion percentage
- *enrollmentDate*: Enrollment date
- *status*: Enrollment status (active, completed, dropped)


## Team
This project was developed by Team 12 for Course 363 at KFUPM University. Our team members and their responsibilities are as follows:

**Oukba Bouketir**:
NavBar, Footer, and Login/Register Page

**Marwan Khayat**:
Home Page

**Hassan Alhassan**:
Courses Page

**Omar Abdalla**:
Course Enrollment Form

**Husain Al Thagafi**:
Course Enrollment Confirmation Page

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. **Fork the repository**

2. **Create your feature branch:**
   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes:**
   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**
   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request:**

Please make sure to follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard when creating your commits.
