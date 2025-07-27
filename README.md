# EasyGenerator Assessment

This is a full-stack application built with React and NestJS. It includes user authentication module.

## Tech Stack

- **Frontend**: React with TypeScript and TailwindCSS
- **Backend**: NestJS with TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: Redux 
- **Testing**: Jest, Supertest


## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (local or cloud instance)
- Git


## Getting Started

### DB Setup 🐳 (Recommended)

1. Pull the MongoDB image:
   ```bash
   docker pull mongo
   ```

2. Run the MongoDB container:
   ```bash
   docker run --name my-mongo -p 27017:27017 -v mongo-data:/data/db -d mongo
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```


### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```


## Areas Covered

- **Full-stack Development**: Required pages for signup, signin, and app(protected route)
- **API Endpoints**: Required api routes for signup, signin, and (protected endpoints)
- **Security**: JWT-based authentication, password hashing and input validation 
- **Testing**: Backend endpoints tests
- **Error Handling**: Global filter for error handling
- **Logging**: Global logger for logging backend process and exceptions
- **CI/CD Pipeline**: Basic CI/CD pipeline using GitHub Actions
- **Documentation**: Basic API documentation using Swagger

## Areas for Improvement

- **Testing Coverage**: Expand test coverage for frontend and backend
- **Error Handling**: More comprehensive error handling and user feedback
- **Security**: Use refresh tokens and blacklisting for logout
- **Authentication**: Social authentication and password recovery


## License

This project is licensed under the MIT License.