# Bhubaneswar Greens — Session Log

A running record of decisions made, features built, and issues resolved across sessions.

---

## Session 1 — Project Bootstrap
**Goal:** Build "Bhubaneswar Greens" — a BigBasket-style organic vegetable delivery app for Bhubaneswar, Odisha.

### Built
- pnpm monorepo: React+Vite frontend, Express 5 API, PostgreSQL + Drizzle ORM, OpenAPI-first codegen via Orval
- Product catalog with Odia script names, category filtering, search, featured products
- Cart (client-side React context), checkout with Bhubaneswar localities
- GreensPay payment gateway UI (COD / UPI / Card)
- Order creation and tracking with status stepper
- WhatsApp FAB (wa.me/917205203478)
- Tour overlay (auto-shows on first visit, re-triggerable via "How it works")
- Store summary stats and delivery area info

### Design decisions
- Saffron-orange primary, leafy-green secondary color scheme
- All API routes under `/api`, frontend at `/`
- OpenAPI spec is the single source of truth; never hand-write API types

---

## Session 2 — Organic Variants Feature
**Goal:** Add certified organic versions of every product as a toggle on product cards.

### Schema changes
- Added `is_coming_soon boolean` to products table
- Added `is_organic boolean` and `parent_product_id integer` to products table
- Pushed schema to dev DB (`pnpm --filter @workspace/db run push`)
- Seeded 30 organic variants (IDs 32–61) via INSERT…SELECT with 18% price premium, `is_organic=true`, `parent_product_id` linking to the regular product

### API changes
- `GET /api/products` and `/api/products/featured` now filter `is_organic=false` by default (organic variants are not shown as top-level products)
- Added `embedOrganicVariants()` helper: fetches organic rows for the current product list in one extra query, attaches `organicVariant: { id, price, isComingSoon }` to each regular product
- `GET /api/products/:id` embeds the organic variant for regular products; returns `organicVariant: null` for organic products themselves
- Added `normalizeProduct()` helper to cast Drizzle's `numeric` price string to `Number` before Zod validation (prevents `NaN` in arithmetic)

### OpenAPI / codegen
- Added `OrganicVariant` schema: `{ id: integer, price: number, isComingSoon: boolean }`
- Added `isOrganic`, `parentProductId` (nullable), `organicVariant` (nullable ref) to `Product` schema
- Marked `parentProductId` as `nullable: true` — regular products have `null` there; missed this initially, caused a Zod 500 on all product list endpoints
- Re-ran codegen after each spec change (`pnpm --filter @workspace/api-spec run codegen`)

### Frontend changes
- `home.tsx`, `products.tsx`, `product-detail.tsx` — ProductCard and detail page now have organic toggle
  - Toggle switches product ID, price, name, and `isComingSoon` state to the organic variant
  - Card turns green-tinted when organic is active
  - Animated "Why Organic?" benefits panel on detail page
  - Buttons change to "ADD ORGANIC" / "Add Organic" when active
- `product-detail.tsx` — added green contextual banner when visiting an organic product URL directly (e.g. `/products/32`), with a "View Regular →" link back to `parentProductId`

### Bugs fixed in this session
| Bug | Root cause | Fix |
|-----|-----------|-----|
| 500 on all product routes | `parentProductId: null` failed Zod (spec said `integer`, not nullable) | Added `nullable: true` to OpenAPI spec, re-ran codegen |
| Cart showed fake savings on organic items | Organic `cartProduct` spread inherited parent's `discountPercent` | Added `discountPercent: 0` to organic cartProduct in `products.tsx` and `product-detail.tsx` |
| Organic product URL (`/products/32`) was a dead-end | No context or navigation shown for `isOrganic=true` products | Added "certified organic variant" banner with "View Regular →" link |

### Lessons learned
- **Design nullable columns upfront.** Adding `parentProductId` as non-nullable in the spec when the data model clearly allows null caused an immediate production-style Zod crash across every endpoint. One correct spec line from the start would have prevented it.
- **Self-referential rows in one table vs. a separate `organic_variants` table.** Using the products table with a flag works but leaks through every layer (API filters, Zod schemas, frontend toggle logic). A dedicated table would be cleaner for future expansion.
- **Parallelism is free.** Running independent tool calls in parallel reduces wall-clock time without increasing token cost. What costs more: vague requests, mid-feature direction changes, and retrofitting decisions that weren't made upfront.

---

*Append a new `## Session N` block at the start of each new working session.*
