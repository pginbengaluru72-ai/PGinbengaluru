# HSRPG Architecture & AI Agent Instruction Manual

> **AI INSTRUCTION:** If you are an AI reading this file, you are now the maintainer of the HSRPG platform. Read this entire document before writing any code. Do NOT assume this is a standard Next.js template. We use a highly customized, ultra-premium architecture heavily reliant on Cloudflare.

## 1. Tech Stack & Infrastructure
- **Frontend Framework:** Next.js 16 (App Router) with React 19.
- **Backend Framework:** Hono (running on Cloudflare Pages Functions).
- **Database:** Cloudflare D1 (Serverless SQLite) accessed via `drizzle-orm`.
- **Media Storage:** Cloudflare R2 object storage (for property images/KYC).
- **Styling:** Tailwind CSS v4, Framer Motion (for all animations), Recharts (for analytics).
- **Deployment:** Cloudflare Pages (via `@cloudflare/next-on-pages`).

## 2. Project Directory Structure
```
/app             -> Next.js 16 Frontend (Client Components). Divided into /superadmin, /owner, /tenant, and /search.
/backend         -> Cloudflare Workers backend.
  /src/db        -> schema.ts (Drizzle DB Schema).
  /src/routes    -> Hono API Routers (auth.ts, owner.ts, tenant.ts, superadmin.ts).
  /src/index.ts  -> Hono Entry Point.
/components      -> Reusable UI (Shadcn/Base-UI).
/lib             -> Shared utilities, including apiClient.ts for frontend-backend communication.
```

## 3. Database Architecture (`backend/src/db/schema.ts`)
We use Cloudflare D1. Migrations are handled by Drizzle.
- `users`: Core authentication. Contains `role` (`SUPER_ADMIN`, `OWNER`, `CUSTOMER`).
- `owner_profiles` & `customer_profiles`: Extended user data.
- `properties`: The core entity. Status flow: `DRAFT` -> `SUBMITTED` -> `VERIFIED` -> `PUBLISHED` -> `REJECTED`. 
- `rooms` & `beds`: Inventory management. Beds are linked to `tenantId`.
- `complaints`: Maintenance tickets raised by tenants, resolved by owners.
- `platform_settings`: Used for global features like broadcasting messages to dashboards.

## 4. API & Authentication Flow
- **Middleware First:** Every secure route relies on `requireAuth()` and `requireRole(ROLE)` inside `backend/src/lib/middleware.ts`. Do not bypass this.
- **Client Fetching:** The frontend MUST use `lib/apiClient.ts` to fetch data. Never use raw `fetch` in components, as `apiClient.ts` handles generic error trapping and credentials tracking.
- **Tokens:** We use cookie-based custom session tokens (`staysure_session`), manually hashed via WebCrypto API.

## 5. Strict Design System (UI/UX)
If the user asks you to build a new feature or page, you MUST adhere to the following aesthetic rules:
1. **Ultra-Premium Only:** Avoid plain colors. Use soft gradients, deep shadows, and `backdrop-blur` (glassmorphism) on cards.
2. **Micro-Animations:** Use `framer-motion` for page transitions (`<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>`) and hover effects.
3. **No Placeholders:** If a feature requires an image, generate a high-quality demonstration image rather than a gray box.
4. **Data Visualization:** Use `recharts` for ANY analytical data representation. Never output raw static numbers if a chart can tell a better story.
5. **Icons:** Use `lucide-react` for iconography.

## 6. How to Deploy or Test
- Run locally: `npm run dev` (though Cloudflare backend endpoints might require Wrangler simulation if making DB changes).
- Pushing to the `main` branch on GitHub automatically triggers a Cloudflare Pages deployment. Wait for CI to finish.
- Note: This project does not use a `package-lock.json` in git (deleted to fix a CI error). If you add packages, just run `npm install` locally, but don't commit the lockfile unless the environment is perfectly synced.
