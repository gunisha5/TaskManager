# TaskManager

## Live Demo

Frontend: https://task-manager-delta-seven-64.vercel.app/login
Backend: https://taskmanager-backend-ccya.onrender.com

**Note:** Initial backend response may take ~20–30 seconds due to free-tier cold start on Render.

---

## Overview

Personal Task Manager API with JWT authentication, user-isolated data access, task filtering, AI-powered suggestions, and tag management.

---

## Tech Stack

* Node.js
* Express
* MongoDB Atlas + Mongoose
* JWT Authentication
* OpenRouter API (AI suggestions)
* express-validator

---

## Project Structure

```
src/
  config/        # database connection
  controllers/   # request/response handlers
  middleware/    # auth, validation, error handling
  models/        # mongoose schemas
  routes/        # API route definitions
  services/      # business logic and DB operations
  app.js         # express app wiring
  server.js      # app startup
```

---

## Architecture Decisions

* **Layered Architecture**: The project is structured into controllers, services, and models to separate concerns. Controllers handle HTTP logic, services manage business logic, and models define schemas.
* **JWT Authentication**: Used for stateless and scalable authentication.
* **MongoDB**: Chosen for its flexible schema and ease of scaling.
* **Service Layer**: Keeps controllers lightweight and improves maintainability and testability.

---

## Setup (Run Locally)

### Backend

```bash
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Start server:

```bash
npm run dev   # development
npm start     # production
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

See `.env.example`.

### Example `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

**Security Notes:**

* Never commit `.env`
* Never expose secrets in frontend code

---

## API Endpoints

### Base URL: `/api`

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Tasks (JWT required)

* GET `/api/tasks` (supports status, priority, tags, search)
* POST `/api/tasks`
* GET `/api/tasks/:id`
* PATCH `/api/tasks/:id`
* DELETE `/api/tasks/:id`
* PATCH `/api/tasks/:id/done`

### Tags (JWT required)

* GET `/api/tags`
* POST `/api/tags`
* PATCH `/api/tags/:id`
* DELETE `/api/tags/:id`

### AI Suggestions (JWT required)

* POST `/api/ai/suggest`

### Health

* GET `/health`

---

## Error Format

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Deployment

### Option A: Render

* Push repo to GitHub
* Create Web Service on Render
* Build command: `npm install`
* Start command: `npm start`
* Add environment variables in dashboard

### Option B: Railway

* Create project from GitHub
* Configure service and deploy
* Add environment variables

---

## Database (MongoDB Atlas)

* Create cluster
* Create DB user
* Allow network access
* Add connection string to `MONGO_URI`

---

## Known Issues / Limitations

* Initial API response may be slow due to Render cold starts
* Subtasks are parsed from description text instead of structured storage
* No pagination implemented yet (may affect performance at scale)

---

## Notes

* All user data is isolated using JWT-based authentication and userId filtering
* Designed with scalability and maintainability in mind
