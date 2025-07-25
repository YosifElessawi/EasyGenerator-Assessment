# EasyGenerator Assessment

This is a full-stack application built with React 18 and NestJS 11. It includes user authentication module.

## Tech Stack

- **Frontend**: React 18 with TypeScript and TailwindCSS
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


## License

This project is licensed under the MIT License.