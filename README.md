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