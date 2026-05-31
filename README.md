# FlyMenu Backend API

Welcome to the backend engine of **FlyMenu**, a modern, real-time restaurant management platform. This API is built on **NestJS** and utilizes **Prisma ORM** with **PostgreSQL** to power dining applications, restaurant administrator dashboards, and super-admin platform controls.

---

## 🚀 Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript-first Node.js framework)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Engine**: [PostgreSQL](https://www.postgresql.org/) (Installed locally)
- **Real-time Engine**: [Socket.io](https://socket.io/) (WebSockets abstraction layer)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) (Stored locally under `/uploads`)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)

---

## 📁 Project Structure

```txt
backend/
├── prisma/
│   ├── schema.prisma   # Database schema definitions and relations
│   ├── seed.js         # Script to populate mock database entries
│   └── migrations/     # Generated SQL migration history files
├── src/
│   ├── main.ts         # NestJS bootstrap file (configures CORS, validation, static directories)
│   ├── app.module.ts   # Root module linking all platform components
│   ├── app.controller.ts # Root health controller
│   ├── common/         # Shared utilities (JWT Guards, password crypt, slug helpers, CSV exporter)
│   ├── integrations/   # Third-party integrations
│   │   ├── email/      # Email service (supports signup/password reset)
│   │   └── storage/    # Multer file uploading configurations
│   ├── realtime/       # Socket.io gateways for real-time orders & notification flows
│   └── modules/        # Domain-driven features
│       ├── auth/       # Registration, JWT token signing, password reset
│       ├── users/      # Platform identities, roles, and status
│       ├── restaurants/# Restaurant profiles, discoverability, services, and capacity
│       ├── menu/       # Menu Categories and Menu Items (tags, allergens, and nutrition)
│       ├── orders/     # Order placement, kitchen flow statuses, and tracking events
│       ├── reservations/# Table bookings, availability checks, confirmation QR codes
│       ├── staff/      # Employee directories, active status, efficiency tracking
│       ├── clients/     # Customer spend history, loyalty tiers, and visit metrics
│       ├── operations/ # Kitchen board load, operational incidents, and resolutions
│       ├── notifications/# In-app alerts, read tracking, and real-time dispatch
│       ├── analytics/  # Sales metrics, period snapshots, and revenue streams
│       ├── platform/   # Super-admin portal metrics and application approvals
│       ├── settings/   # Restaurant configuration (notification preferences, links)
│       └── media/      # Media Asset registry database tracker
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the `backend/` directory. Example setup:

```env
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1

# Database Connection (Replace with your actual local username/password)
DATABASE_URL="postgresql://postgres:Uwumuremyi2009!@localhost:5432/flymenu?schema=public"

# Auth Tokens
JWT_SECRET="change-me-in-development"
JWT_EXPIRES_IN="1d"
PASSWORD_RESET_TOKEN_TTL_MINUTES=30

# File Upload Configuration
UPLOADS_DIR=uploads
PUBLIC_UPLOADS_PATH=/uploads

# Email Settings
EMAIL_FROM=your-email@example.com
```

---

## 🛠️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations**:
   Run this command to create/sync all PostgreSQL tables in your local database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Mock Database**:
   Populate the database with initial restaurants, menu items, users, orders, bookings, and platform activity logs:
   ```bash
   npm run db:seed
   ```

5. **Start Dev Server**:
   ```bash
   npm run start:dev
   ```
   The API will start running at `http://localhost:4000/api/v1`.

---

## 📖 API Endpoint Reference

### 🔐 Authentication (`/auth`)
- `POST /auth/signup` - Register a new customer or restaurant owner.
- `POST /auth/login` - Authenticate and retrieve a signed JWT token.
- `POST /auth/password-reset/request` - Send a reset token to user email.
- `POST /auth/password-reset/confirm` - Update password using a valid token.
- `GET /auth/me` - Get current authenticated user profile details.

### 🍽️ Restaurants (`/restaurants`)
- `GET /restaurants` - Search, filter (cuisine, rating, city), and list active restaurants.
- `GET /restaurants/featured` - Get top-rated restaurants.
- `GET /restaurants/trending` - Get popular restaurants by order volume.
- `GET /restaurants/categories` - Fetch categories across all restaurants.
- `GET /restaurants/:id` - Fetch restaurant profile with menu categories, items, and settings.
- `POST /restaurants` - Create a restaurant profile (restaurant owner dashboard).
- `PATCH /restaurants/:id` - Update operating details and parameters.

### 📜 Menu & Categories (`/menu`)
- `GET /menu/categories` - List categories including their menu items.
- `POST /menu/categories` - Create a new menu category (starters, mains).
- `GET /menu/items` - Retrieve menu items.
- `POST /menu/items` - Create a menu item with nutrition info, allergens, and highlighted tag.
- `PATCH /menu/items/:id` - Update menu item details, status, or availability.

### 📅 Bookings & Reservations (`/reservations`)
- `GET /reservations/availability` - Query open table time slots by party size and date.
- `POST /reservations` - Create a new table booking (generates confirmation numbers & mock QR codes).
- `GET /reservations/:id` - Get specific booking summary details.
- `PATCH /reservations/:id/cancel` - Cancel a scheduled reservation.

### 📦 Orders (`/orders`)
- `GET /orders` - Fetch all orders (filters for restaurant dashboards).
- `POST /orders` - Place a new order with items and fulfillment type (`PICKUP` or `DINE_IN`).
- `GET /orders/:id` - Fetch specific order summary and detailed tracking event logs.
- `PATCH /orders/:id/status` - Update cooking/order status (`PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`). *Emits real-time updates.*
- `GET /orders/export/csv` - Download order records in CSV format.

### 👥 Staff Management (`/staff`)
- `GET /staff` - List employees at a restaurant.
- `POST /staff` - Onboard a new staff member (employee code, role, status).
- `PATCH /staff/:id` - Update employee details, tracked efficiency, and working hours.

### 📁 Clients / CRM (`/clients`)
- `GET /clients` - Browse a restaurant's client directory showing loyalty tiers and spend analytics.
- `POST /clients` - Create/register a new client card manually.
- `PATCH /clients/:id` - Update client information or modify loyalty levels.

### ⚠️ Operational Incidents (`/operations`)
- `GET /operations` - View operational dashboards, active ticket count, and live status.
- `POST /operations/incidents` - Log a service incident (severity levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- `PATCH /operations/incidents/:id/resolve` - Mark a logged incident as resolved.

### 📁 Media uploads (`/media`)
- `POST /media/upload` - Upload images (restaurant cover, profile picture, menu photos) using Multer. Files are served statically from `/uploads`.

### ⚙️ Restaurant Settings (`/settings`)
- `GET /settings/:restaurantId` - Get settings (notifications preferences, active integrations).
- `PATCH /settings/:restaurantId` - Update notifications and metadata.

### 👑 Platform Operations (Super Admin) (`/platform`)
- `GET /platform/dashboard` - Platform statistics (registered restaurants, pending queue, customer count, platform revenue).
- `GET /platform/restaurants/export/csv` - Export full restaurant registries.
- `GET /platform/customers/export/csv` - Export platform customer lists.
- `GET /platform/revenue` - Fetch gross transaction logs and charts.
- `GET /platform/activity` - Review system-wide admin audit logs.
- `GET /platform/system-status` - Check server health and operational incidents.

---

## ⚡ Real-time Event System (Socket.io)

Real-time coordination is facilitated through a WebSocket server listening at:
`ws://localhost:4000/realtime`

### Emitted Events (Server -> Client)
- **`orderUpdate`**: Sent to clients listening for status changes on a specific order.
  - Payload: `{ id: string, status: OrderStatus, order: Order }`
- **`notification`**: Dispatched to logged-in users whenever in-app alerts are created.
  - Payload: `{ id: string, type: NotificationType, title: string, body: string, actionUrl: string }`

---

## 🛢️ Schema Utilities
- **Prisma Studio**: Spin up a local browser UI to query/manage database entries directly:
  ```bash
  npx prisma studio
  ```
  Prisma Studio will be available at `http://localhost:5555`.
#   F l y M e n u  
 