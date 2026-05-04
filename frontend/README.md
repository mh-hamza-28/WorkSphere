# WorkSphere - Project Management Frontend

A modern React frontend for the WorkSphere Project Management Application.

## Features

### Authentication
- User Registration with email verification
- User Login with JWT tokens
- Password reset functionality
- Protected routes

### Dashboard
- Overview of projects and tasks
- Statistics cards showing key metrics
- Recent projects listing

### Projects
- Create, read, update, and delete projects
- Add/remove project members
- Assign roles to members (Admin/Member)
- Project details with task kanban board

### Tasks
- Create, update, and delete tasks
- Assign tasks to team members
- Change task status (To Do, In Progress, Done)
- Create and manage subtasks
- Mark subtasks as complete

### User Profile
- View personal information
- Change password
- Email verification status

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Context API** - State management
- **Custom Hooks** - Data fetching and logic
- **CSS3** - Styling with CSS variables
- **Lucide React** - Icons
- **Date-fns** - Date formatting
- **React Hot Toast** - Notifications

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loader.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── projects/
│   │   │   └── ProjectCard.jsx
│   │   └── tasks/
│   │       └── TaskCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProjects.js
│   │   └── useTasks.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── projects/
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetails.jsx
│   │   ├── tasks/
│   │   │   └── Tasks.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   └── taskService.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your backend URL:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Backend Integration

This frontend is designed to work with the WorkSphere backend API. The backend should be running on the URL specified in the `VITE_API_URL` environment variable.

### API Endpoints Used

- **Auth**
  - `POST /api/v1/register/register` - Register new user
  - `POST /api/v1/login/login` - User login
  - `POST /api/v1/auth/logout` - User logout
  - `POST /api/v1/auth/current-user` - Get current user
  - `GET /api/v1/auth/verify-email/:token` - Verify email
  - `POST /api/v1/auth/resend-email-verification` - Resend verification email
  - `POST /api/v1/auth/forgot-password` - Request password reset
  - `POST /api/v1/auth/reset-password/:token` - Reset password
  - `POST /api/v1/auth/change-password` - Change password

- **Projects**
  - `GET /api/v1/projects` - Get all projects
  - `GET /api/v1/projects/:id` - Get project by ID
  - `POST /api/v1/projects` - Create project
  - `PUT /api/v1/projects/:id` - Update project
  - `DELETE /api/v1/projects/:id` - Delete project
  - `GET /api/v1/projects/:id/members` - Get project members
  - `POST /api/v1/projects/:id/members` - Add member
  - `PUT /api/v1/projects/:id/members/:userId` - Update member role
  - `DELETE /api/v1/projects/:id/members/:userId` - Remove member

- **Tasks**
  - `GET /api/v1/tasks/project/:projectId` - Get tasks by project
  - `POST /api/v1/tasks/project/:projectId` - Create task
  - `PUT /api/v1/tasks/:id` - Update task
  - `DELETE /api/v1/tasks/:id` - Delete task
  - `PATCH /api/v1/tasks/:id/assign` - Assign task
  - `PATCH /api/v1/tasks/:id/status` - Change task status
  - `POST /api/v1/tasks/:id/subtasks` - Create subtask
  - `PUT /api/v1/tasks/subtasks/:id` - Update subtask
  - `DELETE /api/v1/tasks/subtasks/:id` - Delete subtask
  - `PATCH /api/v1/tasks/subtasks/:id/status` - Mark subtask complete

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Key Features

### Responsive Design
- Mobile-first responsive layout
- Collapsible sidebar on mobile
- Adaptive grid systems

### User Experience
- Loading states with spinners
- Toast notifications for actions
- Form validation with error messages
- Modal dialogs for confirmations
- Empty states with helpful messaging

### Security
- JWT token-based authentication
- Protected routes for authenticated users
- Automatic token refresh on 401 errors
- Secure cookie handling

### Performance
- Lazy loading of routes
- Efficient re-rendering with proper state management
- Optimized API calls with proper caching strategies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
