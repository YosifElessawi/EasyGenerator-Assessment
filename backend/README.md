
# Backend API

NestJS backend with MongoDB for the EasyGenerator Assessment application. This backend provides authentication and user management APIs.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- MongoDB (v6.0 or later) or Docker (for local development)

### DB Setup 

#### Option 1: Local MongoDB with Docker
1. Start a MongoDB container:
   ```bash
   docker run --name my-mongo -p 27017:27017 -v mongo-data:/data/db -d mongo
   ```

#### Option 2: MongoDB Atlas
1. get connection string from MongoDB Atlas

2. update `MONGODB_URI` in `.env`

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


### 🔧 Environment Variables
Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server will run on | `3000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGODB_URI` | MongoDB connection string. Can be either:
  - Local: `mongodb://localhost:27017/devDB`
  - Atlas: `mongodb+srv://<username>:<password>@<cluster-address>/<database>?retryWrites=true&w=majority` | `mongodb://localhost:27017/devDB` |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### 🧪 Testing

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

### Users

#### Get All Users (Protected)

```http
GET /users
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "_id": "70f9e6b4a2c1d3e5f7g8h9i0",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

#### Get User Profile (Protected)

```http
GET /users/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get User by ID (Protected)

```http
GET /users/:id
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID

**Success Response (200):**
```json
{
  "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Update User (Protected)

```http
PATCH /users/:id
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID

**Request body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Success Response (200):**
```json
{
  "_id": "60f8d5a9e6b3f1b9d8f7c6b5",
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Delete User (Protected)

```http
DELETE /users/:id
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```
#### Postman Collection
A Postman collection is available at [postman/GP Task.postman_collection.json](./postman/GP%20Task.postman_collection.json). Import this file into Postman to quickly test all available API endpoints with pre-configured requests.

## 📝 License

This project is [MIT licensed](LICENSE).
