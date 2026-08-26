# Task Manager

A full-stack task management application. Users can register, log in, and manage their personal tasks with full CRUD operations.

## Tech Stack

- **Client:** React, Axios, React Router
- **Server:** Node.js, Express
- **Database:** MySQL (Sequelize ORM)
- **Auth:** JWT (JSON Web Tokens), bcrypt

## Project Structure

```
task-manager/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Login, Register, Dashboard, TaskList
│       └── services/       # API client (api.js)
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── middleware/          # JWT verification
│   ├── models/             # Sequelize models (User, Task)
│   └── routes/             # Auth and task routes
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL

### 1. Clone the repo

```bash
git clone https://github.com/creepahh/task-manager.git
cd task-manager
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in `server/`:

```env
DB_NAME=task_manager
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost
JWT_SECRET=your-secret-key
PORT=5000
```

Create a `.env` file in `client/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend (in a separate terminal):

```bash
cd client
npm start
```

The app will be available at `http://localhost:3000`.

## API Endpoints

### Auth

| Method | Endpoint       | Description          | Body                        |
|--------|----------------|----------------------|-----------------------------|
| POST   | `/api/register`| Register a new user  | `{ email, password }`       |
| POST   | `/api/login`   | Log in               | `{ email, password }`       |

### Tasks (requires `Authorization: Bearer <token>`)

| Method | Endpoint           | Description    | Body                     |
|--------|--------------------|----------------|--------------------------|
| GET    | `/api/tasks`       | Get all tasks  | —                        |
| POST   | `/api/tasks`       | Create a task  | `{ title, description }` |
| PUT    | `/api/tasks/:id`   | Update a task  | `{ title, description }` |
| DELETE | `/api/tasks/:id`   | Delete a task  | —                        |
