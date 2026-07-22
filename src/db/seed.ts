import { db } from './db';
import { users } from './schema';

async function seed() {
  console.log('Seeding sample users...');
  
  const sampleUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
    { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' },
    { name: 'Alice Brown', email: 'alice@example.com', password: 'password123' },
    { name: 'Charlie Green', email: 'charlie@example.com', password: 'password123' },
  ];

  for (const user of sampleUsers) {
    const hashedPassword = await Bun.password.hash(user.password);
    await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    console.log(`Created user: ${user.name} (${user.email})`);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
