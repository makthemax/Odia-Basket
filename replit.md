# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (Bhubaneswar Greens e-commerce app)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Project: Bhubaneswar Greens

A localized organic vegetable delivery e-commerce app for Bhubaneswar, Odisha.

### Features
- Product catalog with regional Odia vegetable names and Odia script display
- Category filtering, search, featured products
- Cart management (client-side React context)
- Checkout with Bhubaneswar localities, COD/UPI/Card payment
- Order creation and tracking with status stepper
- Store summary stats and delivery area info

### Architecture (Microservice-ready)
- **Frontend**: `artifacts/bhubaneswar-greens/` — React + Vite at `/`
- **API Server**: `artifacts/api-server/` — Express 5 at `/api`
- **DB Schema**: `lib/db/src/schema/` — categories, products, orders tables
- **API Spec**: `lib/api-spec/openapi.yaml` — OpenAPI contract first
- **API Client**: `lib/api-client-react/` — generated React Query hooks

### API Routes
- `GET /api/categories` — list all categories
- `GET /api/products` — list products (with categoryId/search/featured filters)
- `GET /api/products/featured` — featured products
- `GET /api/products/:id` — product detail
- `GET /api/orders?phone=` — list orders by phone
- `POST /api/orders` — create order
- `GET /api/orders/:id` — order detail/tracking
- `PATCH /api/orders/:id/status` — update order status
- `GET /api/stats/summary` — store summary stats

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
