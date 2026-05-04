# WorkSphere - Project Management Application

A full-stack Project Management Application built with the MERN stack (MongoDB, Express, React, Node.js). WorkSphere helps teams collaborate, manage projects, track tasks, and organize work efficiently.

![WorkSphere](https://img.shields.io/badge/WorkSphere-Project%20Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18%2B-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green)

## Features

### Authentication & User Management
- User registration with email verification
- Secure JWT-based authentication
- Password reset functionality
- User profile management
- Role-based access control

### Project Management
- Create, update, and delete projects
- Add/remove project members
- Assign admin or member roles
- View all your projects in one place
- Project details with member list

### Task Management
- Create, update, and delete tasks
- Assign tasks to team members
- Track task status (To Do, In Progress, Done)
- Create subtasks for detailed tracking
- Mark subtasks as complete
- Kanban board view in project details

### Dashboard
- Overview of all projects and tasks
- Statistics showing project progress
- Recent projects quick access
- Task distribution by status

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with CSS variables
- **Lucide React** - Icons
- **Date-fns** - Date formatting
- **React Hot Toast** - Notifications

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud instance)
- [Git](https://git-scm.com/) (for cloning)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Backend
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
```

**Required environment variables for backend:**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/worksphere
ACCESS_TOKEN_SECRET=your_jwt_access_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_here
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5173

# Email configuration (for verification & password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional
FORGOT_PASSWORD_URL=http://localhost:5173/reset-password
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env
```

**Required environment variables for frontend:**

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
# From the root directory
npm run dev
# or
npm start
```

**Terminal 2 - Frontend:**
```bash
# From the frontend directory
cd frontend
npm run dev
```

### Option 2: Using Concurrently (Recommended)

Install `concurrently` to run both with one command:

```bash
# In the root directory
npm install -g concurrently

# Add this script to root package.json:
# "scripts": {
#   "dev": "concurrently \"npm run dev\" \"cd frontend && npm run dev\""
# }

npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api/v1

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/register/register` | Register new user |
| POST | `/api/v1/login/login` | User login |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/current-user` | Get current user |
| GET | `/api/v1/auth/verify-email/:token` | Verify email |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |
| POST | `/api/v1/auth/change-password` | Change password |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | Get all projects |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/:id` | Get project details |
| PUT | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |
| GET | `/api/v1/projects/:id/members` | Get members |
| POST | `/api/v1/projects/:id/members` | Add member |
| PUT | `/api/v1/projects/:id/members/:userId` | Update role |
| DELETE | `/api/v1/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks/project/:projectId` | Get tasks |
| POST | `/api/v1/tasks/project/:projectId` | Create task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| PATCH | `/api/v1/tasks/:id/assign` | Assign task |
| PATCH | `/api/v1/tasks/:id/status` | Change status |
| POST | `/api/v1/tasks/:id/subtasks` | Create subtask |
| PUT | `/api/v1/tasks/subtasks/:id` | Update subtask |
| DELETE | `/api/v1/tasks/subtasks/:id` | Delete subtask |
| PATCH | `/api/v1/tasks/subtasks/:id/status` | Toggle subtask |

## Project Structure

```
Backend/
├── src/
│   ├── controllers/      # Route controllers
│   ├── db/             # Database connection
│   ├── middlewares/    # Auth & validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── validators/      # Input validation
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── styles/      # CSS files
│   └── public/
├── index.js             # Entry point
├── package.json
└── .env.example
```

## User Roles

- **Admin:** Full access to project - can edit, delete, manage members
- **Member:** Can view project and tasks, update assigned tasks

## Task Status

- **TODO:** Task is pending
- **IN_PROGRESS:** Task is being worked on
- **DONE:** Task is completed

## Development Commands

### Backend
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start normally
```

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | JWT secret for access tokens | Yes |
| `REFRESH_TOKEN_SECRET` | JWT secret for refresh tokens | Yes |
| `CORS_ORIGIN` | Allowed frontend URL | Yes |
| `SMTP_HOST` | Email server host | Yes (for email features) |
| `SMTP_USER` | Email username | Yes (for email features) |
| `SMTP_PASS` | Email password | Yes (for email features) |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Check if IP is whitelisted in MongoDB Atlas

### CORS Errors
- Verify `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Include `http://localhost:5173` for development

### Email Not Sending
- For Gmail, use an App Password instead of your regular password
- Enable 2FA on your Gmail account
- Check SMTP settings in `.env`

## License

This project is licensed under the ISC License.

## Author

Created by Hamza

---

**Happy Project Managing with WorkSphere! 🚀**
