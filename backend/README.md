
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
| `FRONTEND_URL` | URL of the frontend application | `http://localhost:3001` |
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

This project uses Swagger/OpenAPI for API documentation. The interactive API documentation is automatically generated from the codebase using decorators.

### Accessing the API Documentation

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api/docs
   ```

### Documenting New Endpoints

To document a new endpoint, use the following decorators in your controllers:

```typescript
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved users',
    type: [UserResponseDto]
  })
  async findAll() {
    return this.usersService.findAll();
  }
}
```

### Documenting DTOs

Use decorators to document your DTOs:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    minLength: 8,
    example: 'securePassword123!',
    required: true,
  })
  password: string;
}
```

### Authentication

The API uses JWT authentication. To test authenticated endpoints:

1. Use the `/auth/login` endpoint to get a token
2. Click the "Authorize" button in the Swagger UI
3. Enter your token in the format: `Bearer <your-jwt-token>`


#### Postman Collection
A Postman collection is available at [postman/GP Task.postman_collection.json](./postman/GP%20Task.postman_collection.json). Import this file into Postman to quickly test all available API endpoints with pre-configured requests.

## 📝 License

This project is [MIT licensed](LICENSE).
