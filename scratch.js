require('dotenv/config');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const users = await prisma.user.findMany({
    select: { email: true, role: true, emailVerified: true }
  });
  console.log(users);
  await prisma.$disconnect();
}

main().catch(console.error);
