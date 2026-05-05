# GEMINI.md — ContentFlow Client Dashboard

> **For AI agents:** Read this entire file before writing a single line of code.
> Also read `AGENTS.md` in this repo — Next.js 16 has breaking changes from what you know.

---

## What Is This App?

**ContentFlow** is a full-stack SaaS client dashboard for a content writing business. Clients log in to:

- View and manage content orders (blog posts, web copy, social media, etc.)
- Create new orders via a multi-step guided form
- Track order progress through a defined status workflow
- Message their assigned writers per order
- View analytics on spend, volume, and delivery rates
- Manage account settings, billing, team members, and API keys

**Current phase:** Phase 2 complete (UI shell + interactive local data). Supabase auth/database has not yet been integrated.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16.2.4** (App Router) | See `AGENTS.md` — breaking changes from v14/v15 |
| Styling | **Tailwind CSS v4** | `@import "tailwindcss"` syntax; `@theme {}` for tokens |
| Language | **TypeScript** | Strict mode |
| Icons | **Lucide React** | Already installed |
| Font | **Plus Jakarta Sans** | Loaded via `<link>` tag in `layout.tsx` (NOT next/font — breaks offline build) |
| State | React `useState` / `useMemo` (local) | Zustand planned for Phase 3 |
| Forms | Raw `useState` for now | React Hook Form + Zod planned for Phase 3 |
| Auth/DB | **Supabase** | **NOT yet integrated — planned Phase 3** |
| Deployment | **Netlify** | `netlify.toml` not yet created |
| Package manager | **npm** | |

---

## Project Structure

```
client-dashboard/
├── AGENTS.md                          ← Next.js agent rules (READ FIRST)
├── GEMINI.md                          ← This file
├── src/
│   ├── app/
│   │   ├── globals.css                ← Design system: CSS vars, animations, base styles
│   │   ├── layout.tsx                 ← Root layout: font <link> tags, suppressHydrationWarning on both <html> and <body>
│   │   ├── page.tsx                   ← Redirects / → /dashboard
│   │   └── dashboard/
│   │       ├── layout.tsx             ← Dashboard shell: <Sidebar> + <Topbar> + <main>
│   │       ├── page.tsx               ← Dashboard home (stats, charts, timeline, order list)
│   │       ├── orders/
│   │       │   ├── page.tsx           ← Order list with search, filter, sort
│   │       │   ├── new/page.tsx       ← 4-step new order form
│   │       │   └── [id]/page.tsx      ← Order detail: status timeline, deliverables, approve/revise
│   │       ├── messages/page.tsx      ← Thread inbox + chat panel
│   │       ├── analytics/page.tsx     ← KPIs, bar chart, content mix, status grid
│   │       ├── billing/page.tsx       ← Plan card, payment method, invoice history
│   │       ├── team/page.tsx          ← Member list, roles, invite
│   │       └── settings/
│   │           ├── layout.tsx         ← Settings tab nav (Profile / Notifications / Preferences / API Keys)
│   │           ├── page.tsx           ← Profile editor
│   │           ├── notifications/     ← Toggle switches per notification type
│   │           ├── preferences/       ← Default tone, word count, priority, theme
│   │           └── api-keys/          ← Create, reveal, copy, delete API keys
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx            ← White sidebar, teal accents, section labels, hover effects
│   │       └── Topbar.tsx             ← Sticky topbar, search bar, mobile drawer
│   └── lib/
│       └── mock-data.ts               ← All mock data + helper types + utility functions
├── package.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Design System

### Colours (Teal/Green — Sequence.io-inspired)

```
Brand primary:  #0f766e  (teal-700)
Brand mid:      #0d9488  (teal-600)
Brand light:    #14b8a6  (teal-500)
Brand-50:       #f0fdfa
Brand-100:      #ccfbf1

Canvas bg:      #f8fafc  (slate-50)
Card bg:        #ffffff
Border:         #e2e8f0  (slate-200)

Success:        #10b981  (emerald-500)
Warning:        #f59e0b  (amber-500)
Danger:         #f43f5e  (rose-500)
Info:           #3b82f6  (blue-500)
```

> **Do NOT use purple/violet as the primary brand colour.** The user explicitly requested teal/green.

### Typography

- Font: **Plus Jakarta Sans** — loaded via `<link>` tag in `src/app/layout.tsx`
- Do NOT switch to `next/font/google` — it fetches fonts at build time and fails without internet access.

### Tailwind v4 Rules

- Token declarations go inside `@theme {}` in `globals.css`
- Use `@layer base {}` for body/html styles and scrollbar overrides
- **Do NOT use `@apply` inside `@layer components {}`** — it causes runtime CSS failures with pseudo-elements in this environment
- All component styling must be done with **direct Tailwind classes in JSX**
- Animations go as raw `@keyframes` at the bottom of `globals.css` with a plain class selector (e.g. `.animate-fade-in`)

### Sidebar Rules

- Background: `bg-white` with `border-r border-slate-100` (NOT dark)
- Active nav item: `bg-teal-50 text-teal-800 font-semibold`
- Inactive nav item: `text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-0.5`
- Icon active: `text-teal-600`
- Icon hover: `group-hover:text-teal-500 group-hover:scale-110`
- Use `group` on the `<Link>` and `group-hover:` on the `<Icon>` for coordinated effects
- Section labels: `text-[10px] font-bold uppercase tracking-widest text-slate-400`
- Project dots: colored `<span>` with `box-shadow: 0 0 5px {color}80` for glow

---

## Data Layer (Phase 2 — Mock Only)

All data lives in `src/lib/mock-data.ts`. Key exports:

```typescript
ORDERS: Order[]           // 8 mock orders across all statuses
MESSAGES: Message[]       // 5 messages across 3 order threads
INVOICES: Invoice[]       // 4 invoices (paid/pending)
MONTHLY_SPEND: { month, amount }[]  // 6 months of spend data
CURRENT_USER                        // name: 'Pascal Attama', email: 'Attamapascalpedro@gmail.com'

// Helpers
getOrderById(id)
getOrderStats()
STATUS_LABELS: Record<OrderStatus, string>
STATUS_COLORS: Record<OrderStatus, string>  // Tailwind classes for badges
```

### Order Status Flow

```
new → in_progress → pending_review → revision → completed → archived
```

### Content Types

`Blog Post` | `Web Copy` | `Social Media` | `Email Sequence` | `Case Study` | `Whitepaper` | `Product Description`

---

## Known Issues & Gotchas

### Hydration Error (Grammarly Extension)
Both `<html>` and `<body>` tags in `src/app/layout.tsx` have `suppressHydrationWarning` applied. This suppresses mismatches caused by browser extensions (Grammarly, etc.) injecting attributes. **Do not remove these.**

### @apply in @layer components
As noted above, `@apply` with `::before`/`::after` pseudo-elements inside `@layer components {}` in Tailwind v4 does not generate reliable CSS. Symptom: nav items render as plain text with scattered icons. **Solution: always use direct Tailwind classes in JSX.**

### next/font/google
Disabled. It fetches fonts at build time from Google's CDN, which fails in offline/restricted environments. Fonts are loaded via `<link rel="stylesheet">` in `src/app/layout.tsx` instead.

### Dynamic params in Next.js 16
`params` in dynamic routes is now a **Promise** — must be `await`-ed:
```typescript
// ✅ Correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
// ❌ Wrong (Next.js 14 style)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params.id; // breaks in Next.js 16
}
```

---

## Phases — Current Status

| Phase | Description | Status |
|---|---|---|
| **1** | UI Shell — all pages built with mock data | ✅ Complete |
| **2** | Interactive — routing, filters, forms, search all working | ✅ Complete |
| **3** | Supabase — auth, database, RLS, real-time | ✅ Complete |
| **4** | Landing Page | ✅ Complete |
| **5** | Production hardening, security audit, Netlify deploy | ✅ Complete |

### Phase 3 Progress
- ✅ Supabase project connected (`wmjoezsjxtxtddrxpflt`)
- ✅ `.env.local` with JWT anon + service role keys
- ✅ `src/lib/supabase/client.ts` (browser), `server.ts` (SSR), `middleware.ts`
- ✅ `src/middleware.ts` — guards `/dashboard/*`, redirects to `/login`
- ✅ `/login` and `/signup` pages live
- ✅ Sign-out button on sidebar
- ✅ `supabase/schema.sql` — run this in Supabase SQL Editor
- ✅ New Order form — inserts real row into `orders` table
- ✅ Orders list — fetches live from Supabase with search/filter/sort
- ✅ Order detail page — fetches single order from DB by UUID
- ✅ Dashboard home — fetches real stats from DB (async Server Component)
- ✅ Settings page — reads/updates `profiles` table
- ✅ Messages page — Realtime subscription + send messages
- ✅ Analytics page — live order counts, content mix, status breakdown
- ✅ Billing page — fetches invoices + plan from DB

---

## Phase 3 — What Needs To Be Done (Supabase)

When starting Phase 3, follow this order:

1. **Install Supabase client:**
   ```bash
   npm i @supabase/supabase-js @supabase/ssr
   ```

2. **Create env file** — copy `.env.local.example` to `.env.local`, fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=   # server-side only, never expose to client
   ```

3. **Create Supabase client helpers:**
   - `src/lib/supabase/client.ts` — browser client (`createBrowserClient`)
   - `src/lib/supabase/server.ts` — server client (`createServerClient` with cookies)
   - `src/lib/supabase/middleware.ts` — session refresh helper

4. **Add Next.js middleware** at `src/middleware.ts`:
   - Refresh session on every request
   - Redirect unauthenticated users from `/dashboard/*` to `/login`
   - Redirect authenticated users away from `/login` and `/signup`

5. **Create auth pages:**
   - `src/app/(auth)/login/page.tsx`
   - `src/app/(auth)/signup/page.tsx`
   - `src/app/(auth)/layout.tsx` — centered layout, no sidebar

6. **Create DB schema** in Supabase dashboard or via migration files:
   - `users` (extends Supabase auth.users via trigger)
   - `orders`
   - `messages`
   - `invoices`
   - `activity_log`

7. **Enable Row-Level Security** on every table. Pattern:
   ```sql
   CREATE POLICY "Users can only see their own orders"
   ON orders FOR ALL USING (auth.uid() = user_id);
   ```

8. **Replace mock data** with Supabase queries in Server Components.

9. **Enable Realtime** for `messages` table — update `MessagesPage` to subscribe to new messages.

---

## Phase 4 — Landing Page

- Lives at `src/app/(marketing)/page.tsx` with its own `layout.tsx` (no sidebar/topbar)
- Sections: Hero → Features → Pricing → Testimonials → FAQ → Footer
- Must link to `/login` and `/signup`
- Use Framer Motion for scroll reveals (install: `npm i framer-motion`)

---

## Phase 5 — Netlify Deployment

Create `netlify.toml` in the root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Install the plugin:
```bash
npm i -D @netlify/plugin-nextjs
```

Set all env vars in the Netlify dashboard under **Site > Environment Variables**.

---

## Running Locally

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (validates everything compiles)
npm run lint     # ESLint check
```

---

## Key Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| Teal/green brand colour | User explicitly requested; inspired by Sequence.io reference screenshot |
| White sidebar (not dark) | Dark sidebar had rendering issues with custom CSS; white matches Sequence.io aesthetic |
| No `@apply` in component layer | Tailwind v4 bug with pseudo-elements causes scattered layout |
| `suppressHydrationWarning` on `<body>` | Grammarly extension injects attrs, causing React hydration mismatch |
| `<link>` for Google Fonts | `next/font/google` fetches at build time — fails without network access |
| Mock data in one file | Clean separation; easy to swap for Supabase calls in Phase 3 |
| `params` as Promise | Next.js 16 App Router requirement; breaks if accessed synchronously |
