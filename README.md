# Personal Task Manager API

Backend API for a personal task manager with JWT authentication, user-isolated data access, task filtering, and tag management.

## Tech Stack

- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT authentication
- OpenRouter API (`axios`)
- `express-validator` for request validation

## Project Structure

```text
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

## Setup Steps

1. Install dependencies:
   - `npm install`
2. Create your env file:
   - copy `.env.example` to `.env`
3. Set valid values in `.env` (especially Atlas URI and JWT secret).
4. Start server:
   - dev: `npm run dev`
   - prod: `npm start`

## Environment Variables

See `.env.example`.

- `PORT` - API port (default: `5000`)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - secret used to sign/verify JWTs
- `OPENROUTER_API_KEY` - OpenRouter API key for AI suggestions
- `OPENROUTER_MODEL` - model name (default: `openai/gpt-3.5-turbo`)

Security notes:
- Never commit `.env`.
- Never expose `MONGO_URI`, `JWT_SECRET`, or `OPENROUTER_API_KEY` in client code.

## API Endpoints

Base URL: `/api`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Tasks (JWT required)

- `GET /api/tasks` (supports `status`, `priority`, `tags`, `search`)
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/done`

### Tags (JWT required)

- `GET /api/tags`
- `POST /api/tags`
- `PATCH /api/tags/:id`
- `DELETE /api/tags/:id`

### AI Suggestions (JWT required)

- `POST /api/ai/suggest` with body `{ "title": "Prepare for interview" }`

### Health

- `GET /health`

## Error Format

For failures, API returns:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Deployment

### Option A: Render

1. Push repository to GitHub.
2. Create a new Render Web Service from the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render dashboard:
   - `PORT` (optional on Render)
   - `MONGO_URI`
   - `JWT_SECRET`
6. Allow your Render backend domain in CORS if needed.

### Option B: Railway

1. Create a new Railway project from GitHub repo.
2. Configure service and deploy.
3. Set env vars:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional)
4. Verify the deployed API health endpoint.

### Database: MongoDB Atlas

1. Create an Atlas cluster.
2. Create DB user and password.
3. Add network access rule (IP allowlist).
4. Copy connection string into `MONGO_URI`.
5. Use the deployed backend URL for live API consumption.
