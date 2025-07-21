# WhatsApp AI Agent

A WhatsApp AI Agent application with user authentication built using modern web technologies.

## Tech Stack

- **Frontend**: React 18 with TypeScript and TailwindCSS
- **Backend**: NestJS with TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: React Context API

## Project Structure

```
.
├── backend/          # NestJS backend application
└── frontend/         # React frontend application
```

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (local or cloud instance)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Backend

- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with watch mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run format` - Format code using Prettier
- `npm run lint` - Lint code using ESLint

### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run test` - Run unit tests
- `npm run lint` - Lint code using ESLint

## Development

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with a descriptive message

3. Push your changes and create a pull request

## License

This project is licensed under the MIT License.