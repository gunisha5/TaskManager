# DESIGN

## Overview

This backend is designed around clean layering:

- Routes define endpoints and attach middleware.
- Controllers handle HTTP request/response only.
- Services encapsulate business and database logic.
- Models define MongoDB schemas and indexes.

This separation keeps code maintainable as features grow.

## DB Schema Reasoning

### User

- Fields: `name`, `email`, `password`, timestamps.
- `email` is unique and indexed for fast login checks.
- `password` stores only hashed values.

### Task

- Fields: `title`, `description`, `dueDate`, `priority`, `status`, `tags`, `userId`, timestamps.
- `userId` links each task to a single owner.
- `priority` and `status` enums enforce controlled states.
- `tags` as string array gives simple filtering and quick iteration.

### Tag

- Fields: `name`, `userId`, timestamps.
- `userId` ensures each tag is user-scoped.
- Tag deletion removes references from that user's tasks, not tasks themselves.

## Indexing Strategy

Current indexes:

- User:
  - `email` unique index
- Task:
  - `userId` index
  - `title` index
  - text index on `title`
- Tag:
  - `userId` index

Why:

- `userId` indexes support fast per-user filtering and isolation.
- `title` indexes support search operations.
- unique user email supports fast auth and uniqueness guarantees.

For growth, consider compound indexes:

- `{ userId: 1, status: 1 }`
- `{ userId: 1, priority: 1 }`
- `{ userId: 1, dueDate: 1 }`

## Data Isolation Logic

Isolation is enforced in three layers:

1. JWT auth middleware verifies token and attaches `req.user.userId`.
2. Services always scope queries with `userId`.
3. Update/delete by ID always use `{ _id, userId }`.

Result:

- users can read only their own tasks and tags.
- users cannot update/delete other users' records even with valid IDs.

## Scaling Challenges (100k users)

Primary challenges:

1. Hot query patterns (list/filter/search tasks) under high concurrency.
2. Regex search cost on large task collections.
3. Increasing write load from frequent task updates.
4. Background cleanup or analytics competing with API workload.

Mitigations:

- Add compound indexes for common filters.
- Prefer text or Atlas Search for high-scale search relevance/performance.
- Add pagination and field projections to reduce payload size.
- Introduce Redis caching for common reads (optional).
- Use read replicas and connection tuning as traffic grows.
- Add structured logging and metrics for query latency and error rates.

## Future Improvements

- Tag model evolution: migrate tasks to store tag IDs for stronger referential integrity.
- Token strategy: introduce refresh token flow and token revocation list.
- Testing: add integration tests for auth, isolation, and filtering behavior.
