## Goal
Reuse the existing Porcelain Skin layout, typography, and color system (sage hero + blue accent + serif/sans pair) and rewrite the content for **Olivia's Nails**, a luxury home nail studio in Kelvin, Woodmead, Sandton. Add the missing sections (Services, About, Booking, Contact) in the same visual style.

## Content mapping (hero — keep current layout exactly)
- Nav brand: `Olivia's Nails` (left), links: HOME, SERVICES, ABOUT, BOOK, CONTACT (right). Keep search/bag icons or swap bag for a small "Book Now" pill — keep icon set to preserve layout.
- Oversized serif headline: `Your Nails` / `Perfected.` (mirrors "orcelain / Skin" two-line split).
- Hero image: keep existing `hero.svg` (no asset changes — user said keep design/style).
- Left tagline block:
  - Eyebrow above (small caps): `✦ LUXURY NAIL STUDIO · KELVIN, WOODMEAD`
  - Heading: `TIMELESS / NAILS, / PERFECTED`
  - Body: "Professional acrylic, gel, and nail art crafted with precision in our intimate Sandton studio."
  - Button: `Book Appointment →`
- Right product card → becomes a featured service / signature card:
  - Image: reuse `giftset.jpg` (existing asset — keep style)
  - Title: `Signature Gel-X Set` · price `R450`
  - Copy: "Soft gel extensions, shaped and finished with a custom design — our most-loved service."
- Add small trust line under tagline: `5.0 ★ · 8 reviews   |   Est. 2021 · 3+ yrs`

## New sections (added below, matching existing style)

### 1. Services — replaces/extends current "Radiant Skin Starts Here" section
- Keep the same 1fr_2fr grid + blue serif heading on the left.
- Left heading: `BEAUTIFUL / NAILS START / HERE` (blue, serif, same size).
- Left body: shortened version of current services intro.
- Right side: replace the single `productsImg` with a **6-card grid** (3×2 on desktop, 2-col tablet, 1-col mobile) — numbered 01–06 like the source content:
  - 01 Acrylic Nails · 02 Rubber Base · 03 Polygel · 04 Gel-X · 05 Manicure · 06 Pedicure
  - Each card: number (small serif, sage), emoji (large), title (serif), 1-line description, thin sage divider. White background, minimal borders, generous padding to match the airy hero feel.

### 2. About — `id="about"`
- Two-column like the second section. Left: small `productsImg` reused as a soft brand image (or a simple sage-tinted block) inside a rounded card. Right: serif heading `Nails done right, / at home.` in brand blue, paragraph, then a 5-item bulleted list using `✦` markers (sage) matching the eyebrow style.

### 3. Booking — full-width sage band echoing the hero color
- Centered serif heading: `Book an Appointment`
- Subtitle: "Select a date to see available times. We'll confirm via WhatsApp or email."
- White card containing the form (grid 2-col on desktop):
  - First Name *, Phone *, Email (optional), Service * (select with the 6 services), Preferred Date * (native `date` input), Available Times * (placeholder text "Select a date above…"), Notes (textarea full-width).
  - Submit button styled like the hero's outlined pill but solid blue: `Send Booking Request →`
- No backend: pure client form, on submit show a toast (sonner already in project) — no Lovable Cloud needed.

### 4. Contact / Footer — white background
- Heading `Get in Touch` (blue serif, smaller).
- 3-column grid:
  - **Address** — 6 Westway, Kelvin, Woodmead, Sandton, Johannesburg, 2054
  - **Phone & WhatsApp** — +27 78 038 9060 with "Message on WhatsApp" link (`https://wa.me/27780389060`)
  - **Opening Hours** — Mon–Fri / Sat: By appointment · Sun: Closed
- Thin sage divider above a small bottom row: `© 2026 Olivia's Nails · Kelvin, Woodmead`.

## Style guardrails (do not change)
- Keep: sage hero background, blue serif accents, Cormorant Garamond + Inter, oversized split serif headline, white product card on hero, asymmetric grid in section 2, current spacing scale.
- No new color tokens beyond what's in `styles.css` (sage + brand-blue). Cards reuse white + sage border.
- No new image generation — reuse `hero.svg`, `giftset.jpg`, `products.jpg`.

## SEO
- Update `head()` in `src/routes/index.tsx`:
  - title: `Olivia's Nails — Luxury Nail Studio in Kelvin, Sandton`
  - description: "Acrylic, Gel-X, Polygel, manicures & pedicures in an intimate Woodmead home studio. Book your appointment with Olivia's Nails."
  - Add og:title / og:description matching.
- Single H1 stays the hero "Your Nails, Perfected." All section titles become H2.

## Files touched
- `src/routes/index.tsx` — rewrite content + add Services grid, About, Booking form, Contact sections; add anchor IDs for nav links.
- No CSS, asset, or route additions needed.

## Out of scope
- No real booking backend (form is a stub with toast).
- No new images, no logo design changes.
- No new routes — single-page anchored layout, consistent with current structure.
