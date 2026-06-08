require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);

async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const storedKey = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, 64);

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

async function testLogin() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = process.env.ADMIN_EMAIL || 'admin@flymenu.com';
  const password = process.env.ADMIN_PASSWORD || 'Password123!';

  console.log(`Testing login for: ${email}`);
  console.log(`Using password: ${password}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found in DB');
      return;
    }

    console.log('User found:', { email: user.email, role: user.role, emailVerified: user.emailVerified });
    console.log('Stored Hash:', user.passwordHash);

    const isValid = await verifyPassword(password, user.passwordHash);
    console.log('Password is valid:', isValid);

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testLogin();
