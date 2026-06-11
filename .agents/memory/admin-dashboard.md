---
name: Admin dashboard architecture
description: Key decisions for Olivia's Nails admin booking dashboard — auth, DB, routes, and booking form integration.
---

## Auth approach
- bcryptjs (cost 12) for password hashing — pure JS, no native addon needed
- Random session tokens (crypto.randomUUID) stored in `sessions` table — 24h expiry
- Token passed as parameter to all admin server functions (stored in localStorage client-side)
- Rate limiting: 5 login attempts / 15 min per username — in-memory Map (resets on server restart)

## Default admin account
- Username: `admin`, password from env var `ADMIN_PASSWORD` (default: `admin123`)
- Seeded only if no admin exists — runs on first `initDb()` call

## DB (PostgreSQL)
- Connection via `DATABASE_URL` env var (Replit-provisioned)
- Tables: `admins`, `sessions`, `bookings`
- Lazy init: `initDb()` called at top of every server function handler
- `src/lib/db.ts` exports `getPool()`, `query<T>()`, `initDb()`, `BookingRow`, `AdminRow`, `BookingStatus`

## Server functions
- `src/server/auth.ts` — loginAdmin, validateSession, logoutAdmin, changePassword
- `src/server/bookings.ts` — createBooking (public), getBookings, updateBookingStatus, deleteBooking, getBookingStats, getBookingsByDate, getBookingsForDay

## Admin routes (all under /admin/*)
- `src/routes/admin/route.tsx` — pass-through layout (Outlet only)
- `src/routes/admin/login.tsx` — standalone branded login page (no sidebar)
- `src/routes/admin/index.tsx` — dashboard with 6 stat cards + recent bookings
- `src/routes/admin/bookings.tsx` — full table with search/filter/sort/CRUD/pagination
- `src/routes/admin/calendar.tsx` — month calendar + day-detail panel
- `src/routes/admin/settings.tsx` — change password form + security notes
- `src/components/admin/AdminShell.tsx` — sidebar layout + auth guard (validates session on mount)

## Booking form integration
- `src/routes/index.tsx` imports `createBooking` from `../server/bookings`
- On submit: opens WhatsApp URL AND calls createBooking() fire-and-forget (non-blocking)

**Why localStorage for token:** Simpler than cookie management in TanStack Start/Vinxi; acceptable for a single-admin small business tool.
