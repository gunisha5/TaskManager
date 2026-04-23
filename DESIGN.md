# System Design & Architecture

## Data Model & Reasoning
The application uses a NoSQL document database (MongoDB) with Mongoose for schema definition. The data model is kept deliberately flat to optimize for fast, independent document retrieval.
* **User**: Stores authentication credentials (`email`, hashed `password`) and basic profile info.
* **Task**: The core entity. Instead of using complex joins, `tags` are stored as an array of strings directly on the document. This denormalization optimizes read performance, as fetching a user's task list requires no additional lookups for tag resolution.
* **Tag**: A lightweight entity storing global tag definitions for a specific user. This exists purely to populate the sidebar and "Manage Tags" page UI, acting independently from the string-based tags on the `Task` documents.

## Indexes Added & Why
To maintain rapid query performance as the collection grows, the following indexes are configured:
* **User (`email: 1, unique: true`)**: Ensures O(1) lookup during authentication and prevents duplicate account creation.
* **Task (`userId: 1`)**: The most critical index. Every task query is filtered by user; this index ensures we only scan documents belonging to the authenticated tenant.
* **Task (`title: 1`) & (`title: "text"`)**: Supports the frontend search functionality. The text index allows for efficient partial text matching without executing full collection scans.
* **Tag (`userId: 1`)**: Ensures fast retrieval of a user's tag list for the sidebar.

## Data Isolation Between Users
Data isolation is strictly enforced at the service layer using a mandatory `userId` filter.
1. The `authMiddleware` validates the stateless JWT and injects the `req.user.userId` into the request object.
2. Every business logic method (e.g., `taskService.listTasks`, `taskService.updateTask`) inherently requires `userId` as its primary argument.
3. Database queries explicitly scope the operation (e.g., `Task.findOneAndUpdate({ _id: taskId, userId })`). This guarantees that even if a malicious actor guesses a valid Task Object ID, the query will return null unless the authenticated user actually owns that document.

## Scaling to 100,000 Active Users
At 100k active users, **the `GET /api/tasks` endpoint will break first.** Currently, the API fetches all of a user's tasks into memory without pagination. As users accumulate hundreds of tasks over time, this will lead to massive payload sizes, severe Node.js memory pressure (garbage collection pauses), and excessive MongoDB query times. To fix this, I would immediately implement cursor-based pagination (or limit/offset) on the backend, alongside an infinite scroll or paginated view on the frontend. Additionally, I would introduce a Redis caching layer for the `GET /api/tags` endpoint, as tags are read frequently but mutated rarely.

## Feature Deliberately Left Out (Next Day Addition)
**Real-time Synchronization (WebSockets).** Currently, if a user has the app open on their phone and laptop simultaneously, checking off a task on the phone won't update the laptop until the page is refreshed. With another day, I would integrate `Socket.io` to broadcast `task:updated` and `task:created` events specific to a user's room. This would make the application feel truly magical, responsive, and seamlessly synced across all their devices in real-time.
