---
name: testing-todo-api
description: Test the Todo REST API end-to-end. Use when verifying Todo API endpoint changes or new feature additions.
---

## Overview
This is a Node.js + Express.js REST API with in-memory data storage. No database or external services required.

## Prerequisites
- Node.js installed
- `npm install` completed

## Running Unit Tests
```bash
npm test
```
Expects all tests to pass (Jest + supertest). Tests are in `app.test.js`.

## Running Live Server Tests
1. Start the server:
   ```bash
   npm start
   # or: PORT=3001 node server.js (to use a different port)
   ```
2. Test endpoints with curl:
   ```bash
   # List todos (empty)
   curl -s http://localhost:3000/todos

   # Create a todo
   curl -s -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Test task"}'

   # Update completion status
   curl -s -X PATCH http://localhost:3000/todos/1 -H "Content-Type: application/json" -d '{"completed":true}'

   # Delete a todo
   curl -s -X DELETE http://localhost:3000/todos/1
   ```

## Architecture Notes
- `app.js` exports the Express app (no server listening) for testability
- `server.js` is the entry point that starts listening on a port
- `app.resetTodos()` resets in-memory state (used by tests in `beforeEach`)

## Key Edge Cases to Test
- `PATCH` with `completed: false` — falsy but valid value. Code uses `=== undefined` check, not `!completed`
- `POST` with empty string `""` title — should be rejected (400). Code uses `if (!title)` which handles this
- Non-existent IDs should return 404
- Missing required fields should return 400 with descriptive error message

## Devin Secrets Needed
None. No authentication or external services required.
