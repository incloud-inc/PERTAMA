# Planning: User Registration Feature Setup

This document serves as a high-level guide for implementing the database updates, user registration API, and seeding sample data.

## Requirements

### 1. Database Schema Update
- Ensure the MySQL database is created.
- Update the Drizzle schema (`src/db/schema.ts`) to define/update the `users` table with the following columns:
  - `id`: Primary key, auto-increment integer.
  - `name`: String, non-nullable.
  - `email`: String, unique, non-nullable.
  - `password`: String, non-nullable.
  - `createdAt`: Timestamp/datetime, defaults to current time.
- Generate and run Drizzle migrations to apply the schema to the database.

### 2. User Registration API
- Open `src/index.ts`.
- Implement a `POST /register` endpoint in the Elysia application.
- The endpoint should:
  - Accept `name`, `email`, and `password` in the request body.
  - Hash the password securely (using a hashing utility like `Bun.password.hash`).
  - Insert the new user record into the database.
  - Return a success message and the user details (excluding the password).

### 3. Seed Sample Data
- Create a seeding script (e.g., `src/db/seed.ts`).
- Populate the `users` table with exactly 5 sample user records (with hashed passwords).
- Add a script in `package.json` to execute this seed script (e.g., `bun run db:seed`).
### 4. API Testing
- Create a test file (e.g., `src/index.test.ts` or `test/register.test.ts`) using Bun's built-in test runner (`bun:test`).
- Write integration tests to test the `POST /register` endpoint.
- Test cases should include:
  - **Successful Registration**: Returns user details without password, status code is 200 or 201.
  - **Validation Failure**: Missing/invalid request parameters (e.g., invalid email format, empty name) should return a validation error.
  - **Duplicate Email**: Registering with an already existing email should return a conflicts error.
- Add a script in `package.json` to run the test suite (`bun test`).

## Verification Steps
- Run the migration commands to verify the schema is applied.
- Run the seed script and verify 5 records exist in the database.
- Run the test suite using `bun test` and verify that all test cases pass.
- Start the server (`bun run dev`) and test the endpoints manually using a client.
