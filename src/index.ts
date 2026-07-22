import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .get('/status', () => ({
    status: 'ok',
    runtime: 'Bun',
    databaseConnected: 'Not tested (run MySQL to test database routes)'
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
