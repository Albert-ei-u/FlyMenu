# FlyMenu Backend API

Welcome to the backend engine of **FlyMenu**, a modern, real-time restaurant management platform. This API is built on **NestJS** and uses **Prisma ORM** with **PostgreSQL** to power dining applications, restaurant admin dashboards, and super-admin platform controls.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database ORM | Prisma |
| Database Engine | PostgreSQL (local) |
| Real-time | Socket.io (WebSockets) |
| File Uploads | Multer (local /uploads) |
| Validation | class-validator + class-transformer |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # All database models and relations
│   ├── seed.js              # Mock data seeder
│   └── migrations/          # SQL migration history
├── src/
│   ├── main.ts              # App bootstrap (CORS, validation, static files)
│   ├── app.module.ts        # Root module wiring all features
│   ├── common/              # Guards, password hashing, slug helpers, CSV utils
│   ├── integrations/
│   │   ├── email/           # Email service for password reset
│   │   └── storage/         # Multer disk storage configuration
│   ├── realtime/            # Socket.io gateway for orders and notifications
│   └── modules/
│       ├── auth/            # Registration, JWT signing, password reset
│       ├── users/           # User identities, roles, status
│       ├── restaurants/     # Restaurant profiles and discoverability
│       ├── restaurant-applications/  # Partner onboarding and approvals
│       ├── menu/            # Categories, items, allergens, nutrition
│       ├── orders/          # Order placement, kitchen statuses, tracking
│       ├── reservations/    # Table bookings, availability, QR codes
│       ├── customers/       # Customer accounts and profiles
│       ├── clients/         # CRM per restaurant (spend, visits, loyalty)
│       ├── staff/           # Employee directory, efficiency tracking
│       ├── operations/      # Kitchen load, incidents, resolutions
│       ├── notifications/   # In-app alerts with real-time push
│       ├── analytics/       # Sales metrics and revenue snapshots
│       ├── platform/        # Super-admin dashboards and system status
│       ├── settings/        # Restaurant notification and profile settings
│       ├── media/           # Media asset registry (Multer uploads)
│       ├── tables/          # Restaurant table management
│       ├── favorites/       # Customer saved restaurants
│       └── reviews/         # Customer ratings and feedback
```

---

## Environment Configuration

Copy the example file and fill in your local values:

```
cp .env.example .env
```

Key variables in `.env`:

```env
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1

# PostgreSQL connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/flymenu?schema=public"

# JWT
JWT_SECRET="change-me-in-development"
JWT_EXPIRES_IN="1d"
PASSWORD_RESET_TOKEN_TTL_MINUTES=30

# File uploads (local Multer)
UPLOADS_DIR=uploads
PUBLIC_UPLOADS_PATH=/uploads

# Email (for password reset)
EMAIL_FROM=your-email@example.com
```

---

## Local Setup

**1. Install dependencies**

```bash
npm install
```

**2. Generate Prisma Client**

```bash
npx prisma generate
```

**3. Create the flymenu database in PostgreSQL**

Using psql:

```sql
CREATE DATABASE flymenu;
```

Or use pgAdmin to create a database named `flymenu`.

**4. Run database migrations**

```bash
npx prisma migrate dev --name init
```

**5. Seed mock data**

```bash
npm run db:seed
```

**6. Start the development server**

```bash
npm run start:dev
```

The API runs at: `http://localhost:4000/api/v1`

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start dev server in watch mode |
| `npm run build` | Compile TypeScript to dist/ |
| `npm run start` | Start compiled production build |
| `npm run prisma:generate` | Re-generate Prisma Client |
| `npm run prisma:migrate` | Run pending migrations |
| `npm run prisma:studio` | Open Prisma Studio at localhost:5555 |
| `npm run db:seed` | Seed the database with mock data |

---

## API Endpoint Reference

Base URL: `http://localhost:4000/api/v1`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/signup | Register a new account |
| POST | /auth/login | Login and get JWT token |
| POST | /auth/password-reset/request | Request password reset email |
| POST | /auth/password-reset/confirm | Confirm reset with token |
| GET | /auth/me | Get current authenticated user |

### Restaurants

| Method | Endpoint | Description |
|---|---|---|
| GET | /restaurants | Search and list active restaurants |
| GET | /restaurants/featured | Top rated restaurants |
| GET | /restaurants/trending | Most ordered from restaurants |
| GET | /restaurants/categories | All menu category names |
| GET | /restaurants/:id | Full restaurant profile |
| POST | /restaurants | Create a new restaurant |
| PATCH | /restaurants/:id | Update restaurant details |

### Menu

| Method | Endpoint | Description |
|---|---|---|
| GET | /menu/categories | List all categories with items |
| POST | /menu/categories | Create a menu category |
| GET | /menu/items | List all menu items |
| POST | /menu/items | Create a new menu item |
| PATCH | /menu/items/:id | Update menu item details |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | /orders | List all orders |
| POST | /orders | Place a new order |
| GET | /orders/:id | Get order with tracking events |
| PATCH | /orders/:id/status | Update order status (emits real-time event) |
| GET | /orders/export/csv | Export orders as CSV |

### Reservations

| Method | Endpoint | Description |
|---|---|---|
| GET | /reservations/availability | Check available tables by date and party size |
| POST | /reservations | Create a new booking |
| GET | /reservations/:id | Get booking details |
| PATCH | /reservations/:id/cancel | Cancel a reservation |

### Restaurant Applications

| Method | Endpoint | Description |
|---|---|---|
| GET | /restaurant-applications | List all applications |
| POST | /restaurant-applications | Submit a new application |
| GET | /restaurant-applications/:id | Get application details |
| POST | /restaurant-applications/:id/approve | Approve an application |
| POST | /restaurant-applications/:id/reject | Reject an application |
| POST | /restaurant-applications/:id/request-info | Request more info |
| POST | /restaurant-applications/:id/documents | Attach a document |

### Staff

| Method | Endpoint | Description |
|---|---|---|
| GET | /staff | List all staff members |
| POST | /staff | Add a new staff member |
| PATCH | /staff/:id | Update staff details |

### Clients / CRM

| Method | Endpoint | Description |
|---|---|---|
| GET | /clients | List restaurant client profiles |
| POST | /clients | Create a new client |
| GET | /clients/:id | Get client profile |
| PATCH | /clients/:id | Update client details |

### Operations

| Method | Endpoint | Description |
|---|---|---|
| GET | /operations | Dashboard: tickets, incidents |
| POST | /operations/incidents | Log a new incident |
| PATCH | /operations/incidents/:id/resolve | Resolve an incident |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | /notifications | List all notifications |
| POST | /notifications | Create and push a notification |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | /analytics | Dashboard metrics |
| GET | /analytics/snapshots | Historical metric snapshots |

### Platform (Super Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | /platform/dashboard | Platform-wide statistics |
| GET | /platform/restaurants | All restaurants |
| GET | /platform/restaurants/export/csv | Export restaurants as CSV |
| GET | /platform/customers | All customers |
| GET | /platform/customers/export/csv | Export customers as CSV |
| GET | /platform/revenue | Revenue and transaction logs |
| GET | /platform/revenue/export/csv | Export revenue as CSV |
| GET | /platform/activity | System audit log |
| GET | /platform/system-status | Server and incident health check |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| GET | /settings/:restaurantId | Get restaurant settings |
| PATCH | /settings/:restaurantId | Update settings |

### Media

| Method | Endpoint | Description |
|---|---|---|
| POST | /media/upload | Upload a file (image/document) |

Uploaded files are served statically at: `http://localhost:4000/uploads/`

### Tables

| Method | Endpoint | Description |
|---|---|---|
| GET | /tables | List all tables |
| POST | /tables | Create a table |
| GET | /tables/:id | Get table details |
| PATCH | /tables/:id | Update table |
| PATCH | /tables/:id/deactivate | Deactivate a table |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | /reviews | List reviews |
| POST | /reviews | Submit a review (also updates restaurant rating) |

### Favorites

| Method | Endpoint | Description |
|---|---|---|
| GET | /favorites | List user favorites |
| POST | /favorites | Add a restaurant to favorites |
| DELETE | /favorites/:id | Remove from favorites |

---

## Real-time Events (Socket.io)

WebSocket server: `ws://localhost:4000/realtime`

### Events emitted by server

| Event | Trigger | Payload |
|---|---|---|
| `orderUpdate` | Order status changes | `{ id, status, order }` |
| `notification` | New notification created | `{ id, type, title, body, actionUrl }` |

---

## Seeded Demo Accounts

After running `npm run db:seed`, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@flymenu.local | Password123! |
| Restaurant Owner | owner@obsidiangrill.local | Password123! |
| Customer | sarah@flymenu.local | Password123! |

---

## Phase 1 Modules

Included in this release:

- Auth, Users, Restaurants, Restaurant Applications
- Menu, Orders, Reservations, Tables
- Customers, Clients, Staff
- Operations, Notifications, Analytics
- Platform (Super Admin), Media, Settings
- Email integration (password reset)
- Socket.io real-time (orders and notifications)

## Phase 2 (Planned)

- Payments and Checkout
- Promo Codes and Loyalty
- Courier and Fleet Management
- Staff Shifts and Roster
- Inventory Tracking
- Customer Support Ticketing
- Payouts and Financial Reporting
- Background Jobs and Queues
- SMS Integrations
- Cloudinary / S3 Media Storage