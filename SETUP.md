# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

Start the backend:
```bash
npm start
# or for development
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 3. MongoDB Atlas Setup (When Ready)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` with your Atlas connection string
5. Make sure to whitelist your IP address in Atlas Network Access settings

### 4. First User

1. Register a new account through the UI
2. To create an admin user, you can either:
   - Update the user's role in MongoDB to "admin"
   - Or use the backend API directly to create an admin user

## Default Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:5173 (Vite default)

## Features Implemented

✅ Task Creation with title, description, due date, priority
✅ Task List with Ajax loading
✅ Task Details page
✅ Task Editing
✅ Task Deletion with confirmation dialog
✅ Task Status Update (pending, in progress, completed)
✅ User Authentication (Login/Register)
✅ User Management (Add/Remove users - Admin only)
✅ Task Assignment to users
✅ Priority Management (Low, Medium, High columns)
✅ Color-coded priority lists
✅ Responsive design with Bootstrap

