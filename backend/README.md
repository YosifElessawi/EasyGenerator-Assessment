
# Backend API

NestJS backend with MongoDB for the GoPartners Assessment application. This backend provides authentication and user management APIs.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- MongoDB (v6.0 or later) or Docker (for local development)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # MongoDB (choose one option below)
   
   # Option 1: Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/gopartners
   
   # Option 2: MongoDB Atlas (uncomment and update with your connection string)
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gopartners?retryWrites=true&w=majority

   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1d

   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

### 🐳 Local Development with Docker (Recommended)

1. Start MongoDB using Docker:
   ```bash
   docker run --name mongo -p 27017:27017 -d mongo:latest
   ```


### Installation

1. Install dependencies:
   


### Running the App

```bash
#Installation
$ npm install

# Development
$ npm run start:dev

# Production build
$ npm run build
$ npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## 📚 API Documentation

### Authentication

#### Register a new user

```http
POST /auth/signup
```

**Request body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "yourpassword123"
}
```

**Success Response (201):**
```json
{
  "user": {
    "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d"
}
```

#### Login

```http
POST /auth/signin
```

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d"
}
```

### User Profile

#### Get user profile (Protected)

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
    "_id": "687fe3eefccd5e414479db48",
    "email": "test@example.com",
    "name": "Joe",
    "createdAt": "2025-07-22T19:18:06.050Z",
    "updatedAt": "2025-07-22T19:18:06.050Z"
}
```

#### Logout (Protected)

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server will run on | `3000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gopartners` |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |


## 📝 License

This project is [MIT licensed](LICENSE).
