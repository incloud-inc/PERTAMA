import { describe, it, expect, mock } from 'bun:test';

// Define a variable to hold mock database state
let mockUsersList: any[] = [];

// Mock the './db/db' module
mock.module('./db/db', () => {
  return {
    db: {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => mockUsersList,
          }),
        }),
      }),
      insert: () => ({
        values: () => {
          // Simulate user insertion by populating the mock list
          mockUsersList = [
            {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              createdAt: new Date(),
            },
          ];
          return Promise.resolve();
        },
      }),
    },
  };
});

// Import the app after mocking the database
import { app } from './index';

describe('User Registration API', () => {
  it('should successfully register a new user', async () => {
    // Reset mock state
    mockUsersList = [];

    const response = await app.handle(
      new Request('http://localhost/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    expect(response.status).toBe(201);
    const data: any = await response.json();
    expect(data.message).toBe('User registered successfully');
    expect(data.user).toBeDefined();
    expect(data.user.name).toBe('Test User');
    expect(data.user.email).toBe('test@example.com');
  });

  it('should fail registration if name is missing', async () => {
    const response = await app.handle(
      new Request('http://localhost/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    expect(response.status).toBe(422); // Validation error status (Unprocessable Entity)
  });

  it('should fail registration if email is already registered', async () => {
    // Populate database state to simulate existing user
    mockUsersList = [
      {
        id: 1,
        name: 'Existing User',
        email: 'test@example.com',
        createdAt: new Date(),
      },
    ];

    const response = await app.handle(
      new Request('http://localhost/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    expect(response.status).toBe(409); // Conflict error status
    const data: any = await response.json();
    expect(data.error).toBe('Email already registered');
  });
});
