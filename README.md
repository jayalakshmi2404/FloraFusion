# Flora Fusion

Flora Fusion is a full-stack e-commerce platform for flower and keepsake preservation. Customers can browse a catalog of preserved flowers and handcrafted keepsake products, submit their own flowers from a wedding, anniversary, or other meaningful event for professional preservation, and track each order from checkout through delivery.

Live site: https://flora-fusion-nine.vercel.app

## Overview

Fresh flowers from significant occasions wilt within days, and most people have no accessible way to preserve them. Flora Fusion solves this by letting customers submit flowers for expert preservation and order them as lasting keepsakes, with full visibility into cost, feasibility, and order status at every step.

## Features

- Flower and keepsake product catalog with category, colour, season, and price filters
- Custom flower preservation submissions with a feasibility and cost estimate
- Cart and multi-step checkout with coupon support
- Order confirmation and tracking with live manufacturing progress
- Customer and admin authentication with role-based access
- Admin dashboard for managing orders, products, and flower submissions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit (Svelte 5), TypeScript, Tailwind CSS |
| Backend | SvelteKit server endpoints (Node.js runtime) |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Authentication | Firebase Authentication |
| Server Admin | Firebase Admin SDK |
| Validation | Zod |
| Testing | Vitest, Playwright |
| Deployment | Vercel |

## Project Structure

```
src/
  lib/
    components/     Reusable UI components (flower, product, cart, order)
    repositories/    Data access layer for flowers, products, and orders
    server/          Server-only helpers (Firebase Admin, catalog, coupons)
    services/        Client-side services (auth, analytics, pricing)
    stores/          Svelte stores (cart)
    constants/       Local catalog data used as a fallback for Firestore
  routes/
    flowers/         Flower catalog and detail pages
    products/        Keepsake product catalog and detail pages
    submit-flower/    Custom flower preservation submission form
    cart/            Shopping cart
    checkout/        Multi-step checkout
    orders/          Order history and tracking
    dashboard/        Customer dashboard (submissions, notifications, reviews)
    admin/           Admin dashboard for orders, products, and flowers
    api/             Server endpoints (checkout, auth session)
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Firebase project with Authentication, Firestore, and Storage enabled

### Installation

```bash
npm install
```

### Environment Variables

Copy the example environment file and fill in your own Firebase project credentials:

```bash
cp .env.example .env
```

The following variables are required:

**Firebase Client SDK (public)**
- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `PUBLIC_FIREBASE_MEASUREMENT_ID`

**Firebase Admin SDK (private, server-only)**
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `FIREBASE_ADMIN_STORAGE_BUCKET`

Generate the Admin SDK credentials from Firebase Console under Project Settings > Service Accounts.

**Other**
- `SESSION_COOKIE_SECRET` — a long random string used to sign session artifacts
- `PUBLIC_SITE_URL`, `PUBLIC_CONTACT_EMAIL` — used for links and contact info shown across the site

### Firebase Setup

Deploy the included Firestore and Storage rules and indexes before running the app against a real project:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Seeding the Database

To populate Firestore with the local flower and product catalog:

```bash
npm run seed
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Type-check the project with svelte-check |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run end-to-end tests with Playwright |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format the codebase with Prettier |
| `npm run seed` | Seed Firestore with the local catalog data |

## Deployment

Flora Fusion is configured for deployment on Vercel via `@sveltejs/adapter-vercel`. Connect the repository to a Vercel project and add the same environment variables listed above in the Vercel project settings.

## User Roles

- **Customer** — browse the catalog, submit flowers for preservation, place and track orders
- **Admin** — manage orders, products, flowers, and review customer submissions

## License

This project was developed as part of an academic course submission.