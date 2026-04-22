# Postman API Testing Guide (New Postman UI)

This version is written for the latest Postman UI (like your screenshot), starting from zero settings.

## 1) Before opening Postman

1. Run backend:
   - `npm start` or `npm run dev`
2. Confirm server prints:
   - `MongoDB connected: ...`
   - `Server running on port 5000`
3. Use local base URL:
   - `http://localhost:5000`

## 2) First-time setup in new Postman UI

### 2.1 Create collection

1. In left sidebar, click `New Collection` (under `Collections`).
2. Name it: `TaskManager APIs`.
3. Create folders inside collection:
   - `Health`
   - `Auth`
   - `Tasks`
   - `Tags`
   - `AI`

### 2.2 Create environment (important)

1. In left sidebar, click `Environments`.
2. Click `+` (or `New`) to create one.
3. Name: `TaskManager Local`.
4. Add variables:
   - `baseUrl` = `http://localhost:5000`
   - `token` = *(empty)*
   - `taskId` = *(empty)*
   - `tagId` = *(empty)*
5. Save environment.
6. Top-right dropdown (currently showing `No environment`) -> select `TaskManager Local`.

## 3) How to create each request in new UI

For each request:

1. Click `+` tab to open `Untitled Request`.
2. Choose method from dropdown (`GET`, `POST`, `PATCH`, `DELETE`).
3. Enter URL.
4. If POST/PATCH, open `Body` tab -> `raw` -> `JSON`.
5. Click `Save`, choose your collection/folder, then `Send`.

For protected endpoints:
- Open `Authorization` tab
- Type: `Bearer Token`
- Token value: `{{token}}`

(You can also set header manually: `Authorization: Bearer {{token}}`)

## 4) Run these APIs in order

## 4.1 Health

### Get Health
- Method: `GET`
- URL: `{{baseUrl}}/health`
- Expected: `200`

## 4.2 Auth

### Signup
- Method: `POST`
- URL: `{{baseUrl}}/api/auth/signup`
- Body:

```json
{
  "name": "Gunisha",
  "email": "gunisha@example.com",
  "password": "password123"
}
```

- Expected: `201`

In `Tests` tab, paste:

```javascript
const json = pm.response.json();
if (json?.data?.token) pm.environment.set("token", json.data.token);
```

### Login
- Method: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Body:

```json
{
  "email": "gunisha@example.com",
  "password": "password123"
}
```

- Expected: `200`

Use same Tests script to refresh token.

## 4.3 Tasks

### Create Task
- Method: `POST`
- URL: `{{baseUrl}}/api/tasks`
- Auth: Bearer `{{token}}`
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

In `Tests` tab:

```javascript
const json = pm.response.json();
if (json?.data?._id) pm.environment.set("taskId", json.data._id);
```

### Get All Tasks
- `GET {{baseUrl}}/api/tasks`

### Filter Tasks
- `GET {{baseUrl}}/api/tasks?status=todo`
- `GET {{baseUrl}}/api/tasks?priority=high`
- `GET {{baseUrl}}/api/tasks?tags=career,urgent`
- `GET {{baseUrl}}/api/tasks?status=todo&priority=high`

### Search Tasks
- `GET {{baseUrl}}/api/tasks?search=interview`

### Get Single Task
- `GET {{baseUrl}}/api/tasks/{{taskId}}`

### Update Task
- Method: `PATCH`
- URL: `{{baseUrl}}/api/tasks/{{taskId}}`
- Body:

```json
{
  "title": "Prepare for technical interview",
  "priority": "medium",
  "tags": ["career", "prep"]
}
```

### Mark Task as Done
- `PATCH {{baseUrl}}/api/tasks/{{taskId}}/done`

### Delete Task
- `DELETE {{baseUrl}}/api/tasks/{{taskId}}`

## 4.4 Tags

### Create Tag
- Method: `POST`
- URL: `{{baseUrl}}/api/tags`
- Body:

```json
{
  "name": "career"
}
```

In `Tests` tab:

```javascript
const json = pm.response.json();
if (json?.data?._id) pm.environment.set("tagId", json.data._id);
```

### Get All Tags
- `GET {{baseUrl}}/api/tags`

### Rename Tag
- Method: `PATCH`
- URL: `{{baseUrl}}/api/tags/{{tagId}}`
- Body:

```json
{
  "name": "career-growth"
}
```

### Delete Tag
- `DELETE {{baseUrl}}/api/tags/{{tagId}}`

## 4.5 AI Suggest

### Suggest tags and subtasks
- Method: `POST`
- URL: `{{baseUrl}}/api/ai/suggest`
- Body:

```json
{
  "title": "Prepare for interview"
}
```

- Expected sample:

```json
{
  "success": true,
  "data": {
    "tags": ["career", "urgent"],
    "subtasks": ["Revise DSA", "Practice coding"]
  }
}
```

## 5) Error and security checks

Run these quickly:

- Signup with bad email -> expect `400`
- Signup with short password -> expect `400`
- Create task without title -> expect `400`
- Call tasks API without token -> expect `401`
- Call `GET /api/tasks/invalid-id` -> expect `400`

Expected error format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## 6) Data isolation check

1. Login as user A, create task/tag.
2. Login as user B.
3. `GET /api/tasks` and `GET /api/tags`.
4. Verify user B does not see user A data.

## 7) If something fails

- `No environment` shown on top-right:
  - select `TaskManager Local`
- `401` on protected routes:
  - run Login again and ensure `{{token}}` is populated
- `500` on AI route:
  - check `OPENROUTER_API_KEY` in `.env`
- Connection errors:
  - ensure MongoDB is running and `MONGO_URI` is valid
