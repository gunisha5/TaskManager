# Thunder Client API Testing Guide (VS Code)

This guide helps you test all backend APIs using Thunder Client in VS Code, including the AI suggest endpoint.

> If Collections and Environments are locked in your Thunder Client plan, use this guide in fully manual mode. You can still test all APIs.

## 1) Prerequisites

1. Backend is running:
   - `npm start` or `npm run dev`
2. `.env` has valid values:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY` (for AI API)
3. Install Thunder Client extension in VS Code.

Default local base URL:
- `http://localhost:5000`

## 2) Open Thunder Client

1. In VS Code, click Thunder Client icon in left sidebar.
2. Open:
   - **Collections**
   - **Environments**

## 3) If Environments are not available (Free plan)

Use these manual values during testing:

- Base URL: `http://localhost:5000`
- Token: copy from login response and paste into protected requests
- Task ID: copy from create task response
- Tag ID: copy from create tag response

Keep a small notepad with:

- `TOKEN=...`
- `TASK_ID=...`
- `TAG_ID=...`

## 4) If Collections are not available (Free plan)

Use this approach:

1. Open a new request tab each time and name it manually:
   - `01 Health`
   - `02 Signup`
   - `03 Login`
   - `04 Create Task`
   - ...
2. Save requests in "Requests" (or keep tabs open) if your UI allows.
3. Run requests in the exact order from Section 6.

You can fully test every API without collection folders.

## 5) Important Notes for Thunder

- Use full URLs manually: `http://localhost:5000/...`
- For POST/PATCH:
  - Body type: JSON
- For protected routes:
  - Add header: `Authorization: Bearer <paste_token_here>`

## 6) API Test Order (Run in sequence, even without collections)

## 6.1 Health

### Get Health
- Method: `GET`
- URL: `http://localhost:5000/health`
- Expected: `200 OK`

## 6.2 Auth

### Signup
- Method: `POST`
- URL: `http://localhost:5000/api/auth/signup`
- Body:

```json
{
  "name": "Gunisha",
  "email": "gunisha@example.com",
  "password": "password123"
}
```

- Expected: `201`
- Copy token manually from response: `data.token`
- Save in notepad as `TOKEN`

### Login
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body:

```json
{
  "email": "gunisha@example.com",
  "password": "password123"
}
```

- Expected: `200`
- Copy `data.token` and replace your saved `TOKEN` value (recommended every new session).

## 6.3 Tasks

### Create Task
- Method: `POST`
- URL: `http://localhost:5000/api/tasks`
- Headers:
  - `Authorization: Bearer <TOKEN>`
- Body:

```json
{
  "title": "Prepare for interview",
  "description": "Company interview in 3 days",
  "priority": "high",
  "status": "todo",
  "tags": ["career", "urgent"],
  "dueDate": "2026-05-01T10:00:00.000Z"
}
```

- Expected: `201`
- Copy response `data._id` and save as `TASK_ID`.

### Get All Tasks
- Method: `GET`
- URL: `http://localhost:5000/api/tasks`
- Header: `Authorization: Bearer <TOKEN>`

### Filter by status
- `GET http://localhost:5000/api/tasks?status=todo`

### Filter by priority
- `GET http://localhost:5000/api/tasks?priority=high`

### Filter by tags
- `GET http://localhost:5000/api/tasks?tags=career,urgent`

### Search by partial title
- `GET http://localhost:5000/api/tasks?search=interview`

### Get Single Task
- Method: `GET`
- URL: `http://localhost:5000/api/tasks/<TASK_ID>`

### Update Task
- Method: `PATCH`
- URL: `http://localhost:5000/api/tasks/<TASK_ID>`
- Body:

```json
{
  "title": "Prepare for technical interview",
  "priority": "medium",
  "tags": ["career", "prep"]
}
```

### Mark Task as Done
- Method: `PATCH`
- URL: `http://localhost:5000/api/tasks/<TASK_ID>/done`

### Delete Task
- Method: `DELETE`
- URL: `http://localhost:5000/api/tasks/<TASK_ID>`

## 6.4 Tags

### Create Tag
- Method: `POST`
- URL: `http://localhost:5000/api/tags`
- Header: `Authorization: Bearer <TOKEN>`
- Body:

```json
{
  "name": "career"
}
```

- Expected: `201`
- Copy `data._id` and save as `TAG_ID`.

### Get All Tags
- Method: `GET`
- URL: `http://localhost:5000/api/tags`

### Rename Tag
- Method: `PATCH`
- URL: `http://localhost:5000/api/tags/<TAG_ID>`
- Body:

```json
{
  "name": "career-growth"
}
```

### Delete Tag
- Method: `DELETE`
- URL: `http://localhost:5000/api/tags/<TAG_ID>`

Note: deleting tag removes the tag from that user's tasks, not the tasks themselves.

## 6.5 AI Service

### Suggest tags and subtasks
- Method: `POST`
- URL: `http://localhost:5000/api/ai/suggest`
- Header: `Authorization: Bearer <TOKEN>`
- Body:

```json
{
  "title": "Prepare for interview"
}
```

- Expected: `200`
- Expected response format:

```json
{
  "success": true,
  "data": {
    "tags": ["career", "urgent"],
    "subtasks": ["Revise DSA", "Practice coding"]
  }
}
```

## 7) Validation + Error Testing

Quick checks:

1. Signup with invalid email -> expect `400`
2. Signup with short password -> expect `400`
3. Create task without title -> expect `400`
4. Call protected route without token -> expect `401`
5. Call `/api/tasks/invalid-id` -> expect `400`

Expected error format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## 8) Data Isolation Test

1. Login as User A, create task and tag.
2. Login as User B (different email), update `token`.
3. Call:
   - `GET /api/tasks`
   - `GET /api/tags`
4. Verify User B cannot see User A data.

## 9) Troubleshooting

- `401 Unauthorized`
  - token expired/missing; login again and update `token`.
- `500` on AI endpoint
  - check `OPENROUTER_API_KEY` in `.env`.
- DB connection issues
  - verify MongoDB is running and `MONGO_URI` is valid.
- Validation errors
  - read response `message` and correct body/query params.
