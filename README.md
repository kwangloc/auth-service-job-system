# PBL6
# Authentication Service - Job Search System

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Setup and Installation](#setup-and-installation)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Data Models](#data-models)
9. [Running the Service](#running-the-service)
10. [Testing](#testing)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

### About Job search system
The Job Search System is a microservices-based platform that connects job seekers and employers. It enables users to search for jobs, post job listings, manage applications, and receive notifications. The system comprises multiple services, including User Service, Authentication Service, Job Service, and Notification Service, which communicate through RESTful APIs and synchronize data through message brokers RabbitMQ.

### About Authentication Service

The **Auth Service** is a microservice in the Job Search System responsible for providing secure user authentication and authorization. This service ensures that only authenticated and authorized users can access protected resources across other services like User Service, Job Service, and Notification Service.

This service runs independently and communicates with other microservices like User Service, Job Service and Notification Service using **RESTful APIs** and **RabbitMQ** for messaging.

---

## Features
- User registration and login with role-based access
- Token-based authentication using JWT
- Password encryption using bcrypt
- Token validation and middleware for protecting endpoints
- Role-based authorization (Job Seeker, Employer, Admin)

---

## Architecture
The **User Service** is part of a microservices architecture with the following layers:
- **Startup**: Configuration files for database connections, route initialization, and logging.
- **Routes**: Define API endpoints and connect controllers.
- **Controllers**: Manage incoming HTTP requests and return responses.
- **Services**: Contain business logic for user operations.
- **Models**: Define MongoDB schemas and interact with the database.
- **Middlewares**: Implement authentication, error handling, logging, and role-based access control.

Key components:
1. **Node.js** with Express.js for building RESTful APIs
2. **MongoDB** for storing user data
3. **RabbitMQ** for message-driven communication
4. **JWT** for secure authentication

---

## Technology Stack
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ODM)
- **RabbitMQ** (for messaging)
- **JWT** (JSON Web Token)
- **bcrypt** (Password encryption)
- **Docker** (for containerization)
- **GitHub Actions** (CI/CD pipeline)

---

## Setup and Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v14+)
- MongoDB
- RabbitMQ
- Docker (optional for containerization)

### Steps to Set Up
1. Clone the repository:
   ```bash
   git clone https://github.com/kwangloc/auth-service-job-system
   cd AuthService
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see [Environment Variables](#environment-variables)).
4. Start MongoDB and RabbitMQ services.
5. Run the service:
   ```bash
   npm start
   ```

---

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT
MONGO_URI
RABBITMQ_URL
RABBITMQ_EXCHANGE
RABBITMQ_QUEUE
JWT_PRIVATE_KEY
```

---

## API Endpoints

### For Candidates
#### 1. User Registration
- **Method**: `POST`
- **Endpoint**: `/api/user/register`
- **Description**: Registers a new user.
- **Request Body**:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
- **Response**:
   ```json
   {
     "message": "User registered successfully",
     "userId": "12345"
   }
   ```

#### 2. User Login
- **Method**: `POST`
- **Endpoint**: `/api/user/login`
- **Description**: Authenticates a user and returns a JWT token.

#### 3. Get User Profile
- **Method**: `GET`
- **Endpoint**: `/api/user/:id`
- **Description**: Fetches user profile details.

#### 4. Update User Profile
- **Method**: `PUT`
- **Endpoint**: `/api/user/:id`
- **Description**: Updates user profile information.

---

## Data Models

### User Schema
```javascript
const UserSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,
        minlength: 2,
        maxlengh: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlengh: 1024 // hash password
    },
    gender: {
        type: String,
        enum: ["male", "female", "prefer not to say"],
        default: "male",  
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        default: ''
    },
    skills: {
        type: [skillSchema],
    },
    experience: {
        type: [expSchema],
    },
    education: {
        type: [eduSchema],
    },
    savedJobs: {
        type: [jobSchema]
    },
    appliedJobs: {
        type: [jobSchema]
    }
});
```

---

## Running the Service
To run the User Service in development mode:
```bash
npm run dev
```
To build and run with Docker:
```bash
docker build -t UserService .
docker run -p 5000:5000 UserService
```

---

## Testing
Run unit tests using Jest:
```bash
npm test
```

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature.
3. Submit a pull request with a clear description of your changes.

---

## License
This project is licensed under the MIT License.

---

## Contact
For questions or support, contact:
- **Name**: Quang Loc Truong
- **Email**: montserrat400italic@gmail.com
- **Repository**: https://github.com/kwangloc/user-service-job-system

