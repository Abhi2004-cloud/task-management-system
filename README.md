# Task Management System

A full-stack task management application built with MERN stack (MongoDB, Express, React, Node.js) and Bootstrap for responsive design.

## Features

1. **Task Creation**: Create new tasks with title, description, due date, and priority
2. **Task List**: Display tasks with pagination and AJAX filtering
3. **Task Details**: View detailed information about specific tasks
4. **Task Editing**: Update task details including title, description, due date, status, and priority
5. **Task Deletion**: Delete tasks with confirmation dialog
6. **Task Status Update**: Mark tasks as pending, in progress, or completed
7. **User Authentication**: Login/Register system with JWT authentication
8. **User Management**: Admins can add/remove users and assign tasks
9. **Priority Management**: Color-coded priority lists (Low, Medium, High) with drag-and-drop functionality
10. **Visual Representation**: Each priority list is color-coded for quick identification

## Tech Stack

- **Frontend**: React, React Router, Axios, Bootstrap, date-fns
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

## Usage

1. Register a new account or login with existing credentials
2. First user registered will be an employee by default. You can create an admin user through the backend or update the first user's role in the database
3. As an admin, you can:
   - View all tasks
   - Create, edit, and delete any task
   - Manage users (add/remove users)
   - Assign tasks to users
4. As an employee, you can:
   - View only your assigned tasks
   - Update task status and priority
   - Edit your assigned tasks
5. Tasks are organized by priority (Low, Medium, High) in color-coded columns
6. Use pagination to navigate through multiple pages of tasks
7. Filter tasks by status and priority

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination and filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in the backend `.env` file with your Atlas connection string
5. Make sure to whitelist your IP address in Atlas network access settings

## Project Structure

```
task-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── UserManagementModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Notes

- The application uses JWT tokens for authentication
- Tokens are stored in localStorage
- Admin users have full access to all features
- Employee users can only see and manage their assigned tasks
- Tasks are automatically filtered based on user role

