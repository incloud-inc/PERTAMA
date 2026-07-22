import { Elysia, t } from 'elysia';
import { db } from './db/db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .get('/status', async () => {
    try {
      await db.select({ id: users.id }).from(users).limit(1);
      return { status: 'ok', runtime: 'Bun', databaseConnected: true };
    } catch (e: any) {
      return { status: 'ok', runtime: 'Bun', databaseConnected: false, error: e.message };
    }
  })
  .post('/register', async ({ body, set }) => {
    const { name, email, password } = body;
    
    try {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        set.status = 409;
        return { error: 'Email already registered' };
      }

      // Hash the password
      const hashedPassword = await Bun.password.hash(password);

      // Insert user
      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
      });

      // Retrieve new user details
      const [newUser] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.email, email)).limit(1);

      set.status = 201;
      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error: any) {
      set.status = 500;
      return { error: error.message || 'Internal server error' };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String(),
      password: t.String({ minLength: 6 }),
    })
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
