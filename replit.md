# Olivia's Nails — Project Documentation

## Overview

Olivia's Nails is a full-stack luxury nail studio website for a home nail studio based in Kelvin, Woodmead, Sandton, South Africa. It is a single-page marketing site with an integrated booking form, a 3D gallery, and a password-protected admin dashboard for managing client bookings.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | TanStack Start (SSR) | 1.168.x |
| Frontend | React 19 | 19.x |
| Routing | TanStack Router | 1.x |
| Styling | Tailwind CSS v4 + custom CSS | 4.x |
| UI Primitives | shadcn/ui (Radix UI) | — |
| Icons | Lucide React | — |
| Fonts | Cormorant Garamond (serif), Inter (sans) | Google Fonts |
| Build Tool | Vite 7 | 7.x |
| Language | TypeScript | 5.x |
| Database | PostgreSQL (Replit-managed) | 15.x |
| Auth | bcryptjs password hashing + session tokens | — |
| Server Functions | TanStack Start `createServerFn` | — |
| Runtime | Node.js | 22.x |
| Package Manager | npm | — |

---

## Project Structure

```
olivias-nails/
├── public/
│   ├── gallery/               # 25 nail art photos (nail1–25, .jpg/.webp)
│   ├── heroshot.png           # Hero section card image
│   └── about.png              # About section image
├── src/
│   ├── assets/
│   │   ├── hero.svg           # Hero background illustration (SVG)
│   │   ├── products.jpg       # Products photo
│   │   └── giftset.jpg        # Gift set photo
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminShell.tsx # Shared admin sidebar + layout wrapper
│   │   └── ui/                # shadcn/ui component library (button, card, etc.)
│   ├── lib/
│   │   ├── db.server.ts       # PostgreSQL pool, schema auto-init, type exports
│   │   └── utils.ts           # Tailwind merge utility (cn)
│   ├── routes/
│   │   ├── __root.tsx         # App shell, head config, font links, Sonner toaster
│   │   ├── index.tsx          # Main public website (all sections in one file)
│   │   └── admin/
│   │       ├── route.tsx      # Admin layout route (auth guard)
│   │       ├── login.tsx      # Admin login page
│   │       ├── index.tsx      # Dashboard overview with booking stats
│   │       ├── bookings.tsx   # Bookings table with filter, status update, delete
│   │       ├── calendar.tsx   # Monthly calendar view of bookings
│   │       └── settings.tsx   # Change admin password
│   ├── server/
│   │   ├── auth.ts            # Login, logout, session validation, password change
│   │   └── bookings.ts        # Booking CRUD server functions
│   ├── entry-client.tsx       # Client-side hydration entry point
│   ├── start.ts               # TanStack Start middleware instance
│   ├── server.ts              # Nitro/Vite server entry point
│   ├── router.tsx             # TanStack Router instance
│   ├── routeTree.gen.ts       # Auto-generated route tree (do not edit manually)
│   └── styles.css             # Tailwind v4 config, CSS variables, global utilities
├── vite.config.ts             # Vite + TanStack Start plugin config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies and scripts
```

---

## Running the Project

```bash
npm run dev        # Start development server on port 5000
```

The app is served at `http://localhost:5000` in development. In the Replit environment, it is accessible via the preview pane.

---

## Public Website — Sections

The entire public-facing site lives in `src/routes/index.tsx` as a single-page application. Navigation is anchor-link based with smooth scrolling.

### Hero (`#home`)
- Full-bleed brand-coloured background (`oklch(0.56 0.11 5)` — dusty rose)
- Animated serif heading: "Your Nails, Perfected." staggered left/right on desktop, centred on mobile
- Hero SVG illustration of a manicured hand
- Hero card showing the signature Gel-X set with price
- Responsive: heading centres on mobile (`< 768px`), staggered on desktop

### Services (`#services`)
- Two-column layout: sticky left heading + CTA, right scrollable card grid
- 6 services: Acrylic, Rubber Base, Polygel, Gel-X, Manicure, Pedicure
- Top 2 cards: full-bleed photo + description (1 column on mobile, 2 on `sm+`)
- Bottom 4 cards: compact format (1 column on mobile, 2 on `sm+`, 4 on `md+`)
- Scroll-reveal animations (Reveal component, multiple variants)

### About (`#about`)
- Studio photo on left, about text + bullet points on right
- Key points: experience, hygiene, private studio, client base

### Gallery (`#gallery`)
- 3D coverflow carousel — 25 nail art images
- Clicking a side card rotates it to the centre position
- **Clicking the centre card opens the lightbox viewer**
- Dot navigation below the carousel
- Lightbox: full-screen dark overlay, white-framed photo, title + tag, counter, arrow navigation, keyboard support (`←` `→` `Escape`), click-outside-to-close

### Booking Form (`#book`)
- Fields: First Name, Phone, Email (optional), Service, Date, Time, Notes
- Spam protection: honeypot hidden field + 3-second time gate
- On submit: opens WhatsApp with a pre-filled booking message to `+27 78 038 9060`
- Simultaneously saves booking to the PostgreSQL database in the background (non-blocking)
- Toast notifications (Sonner) for success / validation errors

### Contact & Footer (`#contact`)
- Address: 6 Westway, Kelvin, Woodmead, Sandton, 2054
- Phone + WhatsApp link
- Opening hours
- Copyright footer

---

## Admin Dashboard

The admin dashboard is accessible at `/admin`. All admin routes are protected — unauthenticated visitors are redirected to `/admin/login`.

### Authentication Flow

1. User visits `/admin` or any sub-route
2. `route.tsx` checks the `session` cookie via `validateSession` server function
3. If no valid session → redirect to `/admin/login`
4. On login, `loginAdmin` verifies username (`admin`) and bcrypt-hashed password, creates a session token stored in the `sessions` table, sets a `session` HTTP-only cookie (7-day expiry)
5. On logout, session is deleted from the database and cookie is cleared

**Default credentials:**
- Username: `admin`
- Password: `admin123`

To change the default password, set the `ADMIN_PASSWORD` environment variable before the server starts, or use the Settings page inside the dashboard after logging in.

### Dashboard Pages

| Route | File | Purpose |
|---|---|---|
| `/admin/login` | `login.tsx` | Login form with show/hide password toggle |
| `/admin` | `index.tsx` | Overview: total, pending, confirmed, completed bookings; recent 5 bookings table |
| `/admin/bookings` | `bookings.tsx` | Full bookings table — filter by status/search, update status, delete |
| `/admin/calendar` | `calendar.tsx` | Monthly calendar view with bookings shown per day |
| `/admin/settings` | `settings.tsx` | Change admin password (requires current password) |

### Admin Shell (`AdminShell.tsx`)
All admin pages are wrapped in `AdminShell`, which renders:
- Left sidebar with navigation (Dashboard, Bookings, Calendar, Settings)
- Top bar showing the current page title + Logout button
- Main content area

---

## Database

### Connection

Managed via `src/lib/db.server.ts` using the `pg` (node-postgres) library.

```
DATABASE_URL=postgresql://postgres:password@helium/heliumdb?sslmode=disable
```

The pool initialises on first import. On startup, `initDb()` is called automatically to create tables and seed the default admin account if they don't exist.

### Schema

#### `admins`
```sql
CREATE TABLE admins (
  id        SERIAL PRIMARY KEY,
  username  TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,           -- bcrypt hash
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `sessions`
```sql
CREATE TABLE sessions (
  id         SERIAL PRIMARY KEY,
  token      TEXT UNIQUE NOT NULL,   -- random UUID
  admin_id   INTEGER REFERENCES admins(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `bookings`
```sql
CREATE TABLE bookings (
  id          SERIAL PRIMARY KEY,
  first_name  TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  service     TEXT NOT NULL,
  date        TEXT NOT NULL,          -- e.g. "2026-06-15"
  time        TEXT,                   -- e.g. "11:00"
  notes       TEXT,
  status      TEXT DEFAULT 'pending', -- pending | confirmed | completed | cancelled
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## Server Functions

TanStack Start server functions run on the server and are called from client components. They use the `.inputValidator()` API (required for v1.168.x).

### `src/server/auth.ts`

| Function | Input | Description |
|---|---|---|
| `loginAdmin` | `{ username, password }` | Verifies credentials, creates session, sets cookie |
| `logoutAdmin` | — | Deletes session from DB, clears cookie |
| `validateSession` | — | Reads `session` cookie, checks DB, returns admin or null |
| `changePassword` | `{ currentPassword, newPassword }` | Verifies current password, updates bcrypt hash |

### `src/server/bookings.ts`

| Function | Input | Description |
|---|---|---|
| `createBooking` | booking fields | Inserts a new booking row |
| `getBookings` | `{ status?, search?, limit?, offset? }` | Fetches filtered/paginated bookings |
| `getBookingStats` | — | Returns counts by status |
| `updateBookingStatus` | `{ id, status }` | Updates status of a single booking |
| `deleteBooking` | `{ id }` | Permanently deletes a booking |

---

## Design System

All brand colours are defined as CSS custom properties in `src/styles.css` and referenced inline in components using Tailwind's `oklch` colour syntax.

| Token | Value | Use |
|---|---|---|
| `sage` | `oklch(0.56 0.11 5)` | Primary brand colour (dusty rose) — buttons, accents, borders |
| `sageSoft` | `oklch(0.93 0.04 5)` | Light tint — card backgrounds, dividers |
| `blue` (deep) | `oklch(0.46 0.13 5)` | Dark headings, text, sidebar elements |

**Typography:**
- Headings: `Cormorant Garamond` (serif), weight 300–400, light and elegant
- Body: `Inter` (sans-serif), weight 300–500

**Animations:**
- All sections use the `Reveal` component (scroll-triggered entrance, IntersectionObserver)
- Hero: CSS keyframe animations (`hero-title-in`, `hero-image-in`, etc.)
- Gallery: CSS 3D perspective coverflow (`perspective: 1600px`, `transform-style: preserve-3d`)
- Lightbox: `lb-backdrop-in` (fade) + `lb-content-in` (scale + slide)
- Sidebar: CSS transition-based slide-in from right with staggered nav item animations

---

## Gallery Lightbox

Clicking the centre card in the gallery carousel opens a full-screen lightbox:

- **Backdrop**: `position: fixed; inset: 0; z-index: 1000` — black at 93% opacity with blur
- **Navigation**: left/right arrow buttons + keyboard arrow keys
- **Close**: X button (top-right) + `Escape` key + clicking the backdrop
- **Image frame**: white-bordered, drop-shadow, `object-fit: contain` within `72vh` max height
- **Metadata**: image number, title (serif), technique tag, `n / 25` counter
- **Body scroll**: locked while lightbox is open

---

## Booking Flow

```
User fills form
      ↓
Client-side validation (required fields)
      ↓
Spam check (honeypot + time gate)
      ↓
WhatsApp deep-link opens (wa.me/27780389060?text=...)
      ↓
createBooking() server fn called in background
      ↓
Booking saved to PostgreSQL with status "pending"
      ↓
Admin sees it in /admin/bookings
      ↓
Admin updates status → confirmed / completed / cancelled
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `ADMIN_PASSWORD` | No | `admin123` | Sets the admin dashboard password on first run |

---

## Key Conventions

- **Server-only code** uses the `.server.ts` suffix (e.g. `db.server.ts`, `config.server.ts`) to prevent client bundling
- **Server functions** must use `.inputValidator()` not `.validator()` in TanStack Start v1.168.x
- **All colours** use `oklch` format — do not use hex/rgb in new code
- **No `cd`** in shell commands — always run from project root
- The `routeTree.gen.ts` file is auto-generated by TanStack Router — never edit it manually; it regenerates on file save

---

## User Preferences

- Brand name: Olivia's Nails
- Location: 6 Westway, Kelvin, Woodmead, Sandton, Johannesburg, 2054
- WhatsApp: +27 78 038 9060
- Aesthetic: luxury, editorial, soft dusty-rose palette, serif typography
- Services: Acrylic, Rubber Base, Polygel, Gel-X, Manicure, Pedicure
