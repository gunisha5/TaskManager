# TaskManagerr Design Document

## Data Model
The application uses **MongoDB** with **Mongoose** as the ODM. The schema is designed for a multi-tenant task management system.

### Key Collections:
- **Users**: Stores authentication details (email, hashed password). Uses email as the unique identifier.
- **Tasks**: The core entity. Each task belongs to a user and contains metadata like title, status (todo, in-progress, done), priority, and tags.
  - *Note on Subtasks*: Subtasks are currently stored as Markdown-style text within the `description` field and parsed dynamically on the frontend. This avoids complex relational nesting and keeps the write operations simple.
- **Tags**: A user-specific collection of custom tags. While tasks store tag names as a string array for performance, this collection provides a registry for user-defined categories.

## Indexes
To ensure performant queries, the following indexes have been added:
- **`User.email` (Unique)**: Critical for login lookups and enforcing unique accounts.
- **`Task.userId`**: Every task query is scoped to a user. This index ensures that fetching a user's task list is $O(1)$ relative to the total database size.
- **`Task.title` (Text Index)**: Enables efficient keyword searching across task titles.
- **`Tag.userId`**: Ensures fast lookups for a user's tag registry.

## Data Isolation
Data isolation is strictly enforced at two levels:
1.  **Authentication Middleware**: Every request must include a valid JWT. The middleware decodes the token and attaches the `userId` to the request object.
2.  **Service Layer Enforcement**: All database queries (find, update, delete) in the service layer explicitly include the `userId` in the filter (e.g., `Task.findOne({ _id: taskId, userId })`). This ensures a user can never access or modify data belonging to another ID, even if they guess a valid Task UUID.

## Scalability at 100,000 Active Users
At this scale, the primary bottleneck will be **database read/write contention** on the `Tasks` collection and **memory pressure** on the Node.js API instances. The current `listTasks` endpoint returns all user tasks at once, which will cause significant latency and bandwidth waste as users accumulate history. To handle this, I would implement **pagination (limit/skip or cursor-based)** immediately. Additionally, I would implement **database sharding by `userId`** to distribute the storage load and introduce a **Redis caching layer** for frequently accessed dashboard data to reduce expensive MongoDB aggregations.

## Feature for "Another Day"
**Team Collaboration & Shared Projects**: Currently, the app is strictly single-user. I would add a "Teams" entity that allows users to invite others to specific project folders. This would involve updating the `Task` schema to support a `projectId` and `sharedWith` array, as well as more complex RBAC (Role-Based Access Control) to distinguish between "Viewers" and "Editors".
