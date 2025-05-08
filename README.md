# Elective Course Registration System

A web application for students to register for elective courses, faculty to manage their courses, and administrators to oversee the entire system.

## Features

- User authentication (students, faculty, admin)
- Course listing and registration
- Registration status tracking
- Dashboard views for different user roles
- Bulk registration with "Apply All" feature

## Project Structure

- **Frontend**: React application using Vite
- **Backend**: Node.js with Express and MongoDB

## Prerequisites

- Node.js (v14+)
- MongoDB

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`
   - Update the MongoDB connection string and other variables

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000

## API Endpoints

- Authentication: `/api/auth`
- Users: `/api/users`
- Courses: `/api/courses`
- Registrations: `/api/registrations`

## Troubleshooting

If you encounter MongoDB connection issues:
1. Check that your MongoDB connection string is correct in the `.env` file
2. Ensure your MongoDB service is running
3. Verify network connectivity to the MongoDB server

## License
Student:
Email: student@example.com
Password: password123
Faculty:
Email: faculty@example.com
Password: password123
Admin:
Email: admin@example.com
Password: password123
MIT 
