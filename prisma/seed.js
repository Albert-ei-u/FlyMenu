const { randomBytes, scrypt: scryptCallback } = require('node:crypto');
const { promisify } = require('node:util');
require('dotenv/config');

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@flymenu.com';
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'Password123!';
  
  const adminPassword = await hashPassword(adminRawPassword);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN', emailVerified: true, passwordHash: adminPassword },
    create: {
      email: adminEmail,
      fullName: 'Admin Root',
      role: 'SUPER_ADMIN',
      passwordHash: adminPassword,
      emailVerified: true,
    },
  });

  const ownerPassword = await hashPassword('Password123!');
  const owner = await prisma.user.upsert({
    where: { email: 'uwumuremyialbert70@gmail.com' },
    update: { role: 'RESTAURANT_OWNER', emailVerified: true, passwordHash: ownerPassword },
    create: {
      email: 'uwumuremyialbert70@gmail.com',
      fullName: 'Marcus Thorne',
      phone: '+1 (555) 092-1283',
      role: 'RESTAURANT_OWNER',
      passwordHash: ownerPassword,
      emailVerified: true,
    },
  });

  const customerPassword = await hashPassword('Password123!');
  const customer = await prisma.user.upsert({
    where: { email: 'scrutiqrecov@gmail.com' },
    update: { role: 'CUSTOMER', emailVerified: true, passwordHash: customerPassword },
    create: {
      email: 'scrutiqrecov@gmail.com',
      fullName: 'Sarah M.',
      phone: '+44 20 7946 0958',
      role: 'CUSTOMER',
      passwordHash: customerPassword,
      emailVerified: true,
      customerProfile: {
        create: {
          loyaltyTier: 'PLATINUM',
          preferences: ['Window Seat', 'Red Wine', 'No Onions'],
          city: 'Kigali',
        },
      },
    },
    include: { customerProfile: true },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'the-obsidian-grill' },
    update: { ownerId: owner.id },
    create: {
      ownerId: owner.id,
      name: 'The Obsidian Grill',
      slug: 'the-obsidian-grill',
      businessType: 'Restaurant',
      cuisine: 'Modern Fusion Cuisine',
      description: 'A premium dining destination focused on volcanic-stone grilled meats and elevated cocktails.',
      shortDescription: 'Modern fusion and artisan cocktails.',
      priceRange: '$$$ Expensive',
      status: 'ACTIVE',
      email: 'reservations@obsidiangrill.com',
      phone: '+1 (555) 080-2244',
      addressLine: '324 Elevated Street, Metropolis Financial District',
      city: 'Kigali',
      country: 'Rwanda',
      openingTime: '17:00',
      closingTime: '23:00',
      daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      services: ['Dine In', 'Takeaway', 'Private Events'],
      totalTables: 24,
      averageSeats: 4,
      maxPartySize: 12,
      reservationRequired: true,
      privateDining: true,
      outdoorSeating: true,
      ratingAverage: 4.8,
      ratingCount: 2400,
      settings: {
        create: {
          emailNotifications: true,
          smsAlerts: false,
          orderUpdates: true,
        },
      },
    },
  });

  const starters = await prisma.menuCategory.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'starters' } },
    update: {},
    create: { restaurantId: restaurant.id, name: 'Starters', slug: 'starters', sortOrder: 1 },
  });

  const mains = await prisma.menuCategory.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'signature-mains' } },
    update: {},
    create: { restaurantId: restaurant.id, name: 'Signature Mains', slug: 'signature-mains', sortOrder: 2 },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        categoryId: starters.id,
        name: 'Truffle Infused Arancini',
        description: 'Wild mushroom arancini with parmesan and truffle aioli.',
        price: 18,
        status: 'AVAILABLE',
        isLive: true,
        tags: ['Vegetarian'],
        allergens: ['Dairy'],
      },
      {
        restaurantId: restaurant.id,
        categoryId: starters.id,
        name: 'Charred Octopus',
        description: 'Smoked paprika, saffron, and preserved lemon.',
        price: 24,
        status: 'AVAILABLE',
        isLive: true,
        tags: ['Spicy'],
        allergens: ['Seafood'],
      },
      {
        restaurantId: restaurant.id,
        categoryId: mains.id,
        name: 'Dry-Aged Wagyu Ribeye',
        description: '45-day aged A5 Wagyu with bone marrow butter.',
        price: 85,
        status: 'AVAILABLE',
        isLive: true,
        isHighlighted: true,
        tags: ['Chef Special'],
        allergens: [],
      },
    ],
    skipDuplicates: true,
  });

  const table = await prisma.restaurantTable.upsert({
    where: { restaurantId_code: { restaurantId: restaurant.id, code: 'T-01' } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      code: 'T-01',
      tableType: 'Booth',
      capacity: 4,
      notes: 'Near Window',
    },
  });

  await prisma.staffMember.upsert({
    where: { restaurantId_employeeCode: { restaurantId: restaurant.id, employeeCode: '4421-E' } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      employeeCode: '4421-E',
      fullName: 'Elena Petrov',
      role: 'Chef',
      status: 'ACTIVE',
      efficiency: 98,
      hoursWorked: 156.5,
    },
  });

  await prisma.reservation.upsert({
    where: { confirmationNumber: `BK-${new Date().getFullYear()}-08472` },
    update: {},
    create: {
      confirmationNumber: `BK-${new Date().getFullYear()}-08472`,
      restaurantId: restaurant.id,
      customerId: customer.id,
      tableId: table.id,
      guestName: customer.fullName,
      contactNumber: customer.phone,
      partySize: 4,
      reservationDate: new Date('2026-06-15T00:00:00.000Z'),
      reservationTime: '20:00',
      status: 'CONFIRMED',
      qrCodeUrl: '/uploads/demo-booking-qr.png',
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: 'ORD-2026-0847' },
    update: {},
    create: {
      orderNumber: 'ORD-2026-0847',
      restaurantId: restaurant.id,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      status: 'PREPARING',
      subtotal: 76.5,
      serviceFee: 6.7,
      total: 83.2,
      etaMinutes: 18,
      items: {
        create: [
          { name: 'Margherita Premium', quantity: 1, unitPrice: 42, notes: 'Medium-Well' },
          { name: 'Truffle Wagyu Burger', quantity: 1, unitPrice: 34.5, notes: 'Add Truffle Oil' },
        ],
      },
      trackingEvents: {
        create: [
          { status: 'CONFIRMED', title: 'Order Confirmed', message: 'Your order has been received.' },
          { status: 'PREPARING', title: 'Preparing Your Food', message: 'The kitchen is preparing your meal.' },
        ],
      },
    },
  });

  await prisma.restaurantApplication.upsert({
    where: { id: 'seed-application-obsidian' },
    update: {},
    create: {
      id: 'seed-application-obsidian',
      applicantName: owner.fullName,
      applicantEmail: owner.email,
      applicantPhone: owner.phone,
      restaurantName: 'The Obsidian Grill',
      category: 'High-End Dining',
      city: 'Kigali',
      country: 'Rwanda',
      description: 'Premium restaurant partner application.',
      status: 'UNDER_REVIEW',
      priority: 'URGENT',
      documents: {
        create: [
          { label: 'Business License', fileUrl: '/uploads/business-license.pdf' },
          { label: 'Health Inspection', fileUrl: '/uploads/health-inspection.pdf' },
        ],
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      action: 'seed.completed',
      entity: 'System',
      metadata: { message: 'FlyMenu seed data created.' },
    },
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
