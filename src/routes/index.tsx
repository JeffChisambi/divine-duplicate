import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
import heroSvg from "@/assets/hero.svg";
import productsImg from "@/assets/products.jpg";
import giftsetImg from "@/assets/giftset.jpg";
import nail1Asset from "@/assets/gallery/nail1.png.asset.json";
import nail2Asset from "@/assets/gallery/nail2.png.asset.json";
import nail3Asset from "@/assets/gallery/nail3.png.asset.json";
import nail6Asset from "@/assets/gallery/nail6.png.asset.json";

const gallery = [
  { src: nail1Asset.url, title: "Bubblegum Square", tag: "Acrylic · Short", n: "01" },
  { src: nail2Asset.url, title: "Classic French", tag: "Gel-X · Square", n: "02" },
  { src: nail3Asset.url, title: "Onyx Tip", tag: "Acrylic · Long", n: "03" },
  { src: nail6Asset.url, title: "Almond French", tag: "Gel · Almond", n: "04" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olivia's Nails — Luxury Nail Studio in Kelvin, Sandton" },
      {
        name: "description",
        content:
          "Acrylic, Gel-X, Polygel, manicures & pedicures in an intimate Woodmead home studio. Book your appointment with Olivia's Nails.",
      },
      { property: "og:title", content: "Olivia's Nails — Luxury Nail Studio in Kelvin, Sandton" },
      {
        property: "og:description",
        content:
          "Professional nail care crafted with precision in our intimate Sandton studio.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

const services = [
  { n: "01", icon: "💅", title: "Acrylic Nails", desc: "Durable, long-lasting acrylic sets in any shape or length. Natural or dramatic." },
  { n: "02", icon: "🌷", title: "Rubber Base", desc: "A flexible, protective rubber base gel that strengthens natural nails with a flawless finish." },
  { n: "03", icon: "✨", title: "Polygel", desc: "A lightweight hybrid between acrylic and gel — buildable, odourless, and incredibly strong." },
  { n: "04", icon: "🌸", title: "Gel-X", desc: "Soft gel nail extensions that are gentle on natural nails. Perfect for added length." },
  { n: "05", icon: "🤍", title: "Manicure", desc: "A classic hand and nail treatment with shaping, cuticle care, and your choice of polish." },
  { n: "06", icon: "🌺", title: "Pedicure", desc: "A relaxing foot treatment with soak, exfoliation, nail shaping, and polish." },
];

const aboutPoints = [
  "Professional nail technician with 3+ years of experience",
  "Hygienic, sanitised tools for every client",
  "Personalised service — no rush, no crowds",
  "Convenient, private studio in Kelvin, Woodmead, Sandton",
  "Trusted by hundreds of clients across Johannesburg",
];

function Index() {
  const sage = "oklch(0.75 0.025 180)";
  const sageSoft = "oklch(0.94 0.015 180)";
  const blue = "oklch(0.5 0.14 250)";

  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.service || !form.date) {
      toast.error("Please fill in the required fields.");
      return;
    }
    toast.success("Booking request sent! Olivia will confirm via WhatsApp shortly.");
    setForm({ firstName: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)" }} className="min-h-screen bg-white text-foreground">
      {/* Hero */}
      <section id="home" className="relative overflow-hidden" style={{ backgroundColor: sage }}>
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-7 text-white">
          <a href="#home" style={{ fontFamily: "var(--font-serif)" }} className="text-xl tracking-wide">
            Olivia's Nails
          </a>
          <ul className="hidden md:flex gap-10 text-[11px] font-medium tracking-[0.2em]">
            <li><a href="#home">HOME</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#gallery">GALLERY</a></li>
            <li><a href="#book">BOOK</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
          <div className="flex gap-5 items-center">
            <Search className="w-5 h-5" strokeWidth={1.5} />
            <a
              href="#book"
              className="hidden sm:inline-flex items-center rounded-full border border-white/80 px-4 py-1.5 text-[11px] tracking-[0.18em] hover:bg-white hover:text-foreground transition"
            >
              BOOK NOW
            </a>
          </div>
        </nav>

        <div className="relative px-6 md:px-10 pb-16">
          <h1
            className="absolute top-0 left-0 right-0 text-white pointer-events-none leading-[0.9] tracking-tight z-10"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(70px, 13vw, 210px)",
              paddingLeft: "8vw",
            }}
          >
            <span className="block">Your Nails,</span>
            <span className="block text-right pr-[8vw]">Perfected.</span>
          </h1>

          <div className="relative z-0 flex justify-center pt-8">
            <img
              src={heroSvg}
              alt="Elegant manicured hand with floral nail art"
              className="w-full max-w-3xl h-auto"
            />
          </div>

          {/* Tagline block */}
          <div className="relative md:absolute md:left-10 md:bottom-24 max-w-xs text-white z-20 mt-8 md:mt-0">
            <p className="text-[10px] tracking-[0.2em] opacity-90 mb-4">
              ✦ LUXURY NAIL STUDIO · KELVIN, WOODMEAD
            </p>
            <h2
              style={{ fontFamily: "var(--font-serif)", fontSize: 38, lineHeight: 1.05 }}
              className="font-light tracking-wide"
            >
              TIMELESS<br />NAILS,<br />PERFECTED
            </h2>
            <p className="mt-5 text-sm leading-relaxed opacity-95 max-w-[260px]">
              Professional acrylic, gel, and nail art crafted with precision in our intimate Sandton studio.
            </p>
            <a
              href="#book"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/80 px-5 py-2.5 text-xs tracking-wider hover:bg-white hover:text-foreground transition"
            >
              Book Appointment <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <p className="mt-5 text-[11px] opacity-90 tracking-wide">
              5.0 ★ · 8 reviews &nbsp;|&nbsp; Est. 2021 · 3+ yrs
            </p>
          </div>

          {/* Featured service card */}
          <div className="relative md:absolute md:right-10 md:bottom-10 w-full md:w-[300px] z-20 mt-10 md:mt-0">
            <div className="bg-white rounded-sm overflow-hidden shadow-sm">
              <img
                src={giftsetImg}
                alt="Signature Gel-X nail set"
                width={768}
                height={512}
                loading="lazy"
                className="w-full h-44 object-cover"
              />
            </div>
            <div className="mt-3 text-white">
              <div className="flex justify-between items-baseline text-sm">
                <span>Signature Gel-X Set</span>
                <span>R450</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed opacity-90">
                Soft gel extensions, shaped and finished with a custom design — our most-loved service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 md:px-10 py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="md:sticky md:top-10">
            <h2
              style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 44, lineHeight: 1.05 }}
              className="font-light tracking-wide"
            >
              BEAUTIFUL<br />NAILS START<br />HERE
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-foreground/80 max-w-xs">
              Discover a curated menu of nail services designed to strengthen, shape, and elevate. From everyday classics to statement extensions, each set is crafted with care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <article
                key={s.n}
                className="p-6 bg-white border transition hover:shadow-md"
                style={{ borderColor: sageSoft }}
              >
                <div
                  style={{ fontFamily: "var(--font-serif)", color: sage }}
                  className="text-sm tracking-widest"
                >
                  {s.n}
                </div>
                <div className="text-3xl mt-3" aria-hidden>{s.icon}</div>
                <h3
                  style={{ fontFamily: "var(--font-serif)", color: blue }}
                  className="text-xl mt-3 font-light"
                >
                  {s.title}
                </h3>
                <div className="h-px my-3" style={{ backgroundColor: sageSoft }} />
                <p className="text-xs leading-relaxed text-foreground/75">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 md:px-10 py-20" style={{ backgroundColor: sageSoft }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img
            src={productsImg}
            alt="Inside Olivia's home nail studio"
            width={1536}
            height={576}
            loading="lazy"
            className="w-full h-auto rounded-sm object-cover aspect-[4/3]"
          />
          <div>
            <p className="text-[10px] tracking-[0.2em] mb-4" style={{ color: sage }}>
              ✦ ABOUT US
            </p>
            <h2
              style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 44, lineHeight: 1.05 }}
              className="font-light tracking-wide"
            >
              Nails done right,<br />at home.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-foreground/80 max-w-md">
              Olivia's Nails has been serving Johannesburg since 2021. Based in Kelvin, Woodmead, we are a home studio built on precision, hygiene, and a genuine love for beautiful nails.
            </p>
            <ul className="mt-6 space-y-3">
              {aboutPoints.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-foreground/80">
                  <span style={{ color: sage }}>✦</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery — artistic staggered showcase */}
      <section id="gallery" className="relative overflow-hidden px-6 md:px-10 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="text-[10px] tracking-[0.2em] mb-4" style={{ color: sage }}>
                ✦ THE GALLERY
              </p>
              <h2
                style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 56, lineHeight: 0.95 }}
                className="font-light tracking-wide"
              >
                A study in<br />
                <span className="italic" style={{ color: sage }}>finesse.</span>
              </h2>
            </div>
            <p className="text-sm text-foreground/70 max-w-sm leading-relaxed">
              An evolving archive of recent sets — each one shaped by hand, finished with intention. Hover to bring a piece into focus.
            </p>
          </div>

          {/* Staggered tilted gallery */}
          <div className="gallery-stage">
            {gallery.map((g, i) => (
              <figure
                key={g.n}
                className={`gallery-card g-${i}`}
                style={{ ['--delay' as string]: `${i * 0.15}s` }}
              >
                <div className="gallery-frame">
                  <img src={g.src} alt={g.title} loading="lazy" />
                  <div className="gallery-veil" />
                  <span className="gallery-num" style={{ fontFamily: "var(--font-serif)" }}>{g.n}</span>
                </div>
                <figcaption>
                  <span style={{ fontFamily: "var(--font-serif)", color: blue }} className="block text-lg">
                    {g.title}
                  </span>
                  <span className="block text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: sage }}>
                    {g.tag}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-6 text-[10px] tracking-[0.3em] uppercase" style={{ color: sage }}>
            <span className="h-px w-12" style={{ backgroundColor: sage }} />
            <span>Hand-finished in Sandton</span>
            <span className="h-px w-12" style={{ backgroundColor: sage }} />
          </div>
        </div>

        <style>{`
          .gallery-stage {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 1.5rem;
            min-height: 640px;
            perspective: 1400px;
          }
          .gallery-card {
            position: relative;
            transition: transform .9s cubic-bezier(.2,.8,.2,1), z-index 0s;
            transform-style: preserve-3d;
            animation: floatY 7s ease-in-out infinite;
            animation-delay: var(--delay);
            will-change: transform;
          }
          .gallery-card.g-0 { grid-column: 1 / span 5; transform: rotate(-6deg) translateY(20px); }
          .gallery-card.g-1 { grid-column: 6 / span 4; transform: rotate(4deg) translateY(-30px); margin-top: 3rem; }
          .gallery-card.g-2 { grid-column: 1 / span 4; transform: rotate(3deg) translateY(0); margin-top: -2rem; }
          .gallery-card.g-3 { grid-column: 5 / span 7; transform: rotate(-3deg) translateY(10px); }
          @media (max-width: 768px) {
            .gallery-stage { display: flex; flex-direction: column; gap: 3rem; min-height: 0; }
            .gallery-card, .gallery-card.g-0, .gallery-card.g-1, .gallery-card.g-2, .gallery-card.g-3 {
              grid-column: auto; margin: 0; transform: rotate(-3deg);
            }
            .gallery-card:nth-child(even) { transform: rotate(3deg); align-self: flex-end; width: 85%; }
            .gallery-card:nth-child(odd) { width: 85%; }
          }
          .gallery-frame {
            position: relative;
            overflow: hidden;
            background: ${sageSoft};
            box-shadow: 0 20px 50px -25px rgba(0,0,0,.35), 0 4px 12px -6px rgba(0,0,0,.15);
            aspect-ratio: 4 / 5;
          }
          .gallery-card.g-1 .gallery-frame { aspect-ratio: 3 / 4; }
          .gallery-card.g-3 .gallery-frame { aspect-ratio: 16 / 10; }
          .gallery-frame img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 1.2s cubic-bezier(.2,.8,.2,1), filter .8s ease;
            filter: saturate(.92) contrast(1.02);
          }
          .gallery-veil {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,.35));
            opacity: .7; transition: opacity .6s ease;
            pointer-events: none;
          }
          .gallery-num {
            position: absolute; top: 1rem; left: 1.1rem;
            color: white; font-size: 13px; letter-spacing: .25em;
            mix-blend-mode: difference; opacity: .85;
          }
          .gallery-card figcaption {
            position: absolute; left: 1.25rem; bottom: -2.75rem;
            opacity: 0; transform: translateY(-6px);
            transition: opacity .5s ease, transform .5s ease;
          }
          .gallery-card:hover {
            transform: rotate(0deg) translateY(-12px) scale(1.04);
            z-index: 20;
            animation-play-state: paused;
          }
          .gallery-card:hover .gallery-frame img { transform: scale(1.08); filter: saturate(1.08) contrast(1.04); }
          .gallery-card:hover .gallery-veil { opacity: .25; }
          .gallery-card:hover figcaption { opacity: 1; transform: translateY(0); }
          @keyframes floatY {
            0%, 100% { translate: 0 0; }
            50% { translate: 0 -10px; }
          }
          @media (prefers-reduced-motion: reduce) {
            .gallery-card { animation: none; }
          }
        `}</style>
      </section>



      {/* Booking */}
      <section id="book" className="px-6 md:px-10 py-20" style={{ backgroundColor: sage }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-[10px] tracking-[0.2em] mb-4 opacity-90">✦ RESERVATIONS</p>
          <h2
            style={{ fontFamily: "var(--font-serif)", fontSize: 48, lineHeight: 1.05 }}
            className="font-light tracking-wide"
          >
            Book an Appointment
          </h2>
          <p className="mt-4 text-sm opacity-90 max-w-xl mx-auto">
            Select a date to see available times. We will confirm via WhatsApp or email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-3xl mx-auto bg-white rounded-sm p-8 md:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="First Name *">
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Your name"
                className="form-input"
              />
            </Field>
            <Field label="Phone *">
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+27 ..."
                className="form-input"
              />
            </Field>
            <Field label="Email (optional)">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="form-input"
              />
            </Field>
            <Field label="Service *">
              <select
                required
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="form-input bg-white"
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred Date *">
              <div className="relative">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="form-input pr-10"
                />
                <CalendarDays className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
              </div>
            </Field>
            <Field label="Available Times *">
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                disabled={!form.date}
                className="form-input bg-white disabled:opacity-60"
              >
                <option value="">
                  {form.date ? "Select a time" : "Select a date above to see available slots."}
                </option>
                {form.date && ["09:00", "11:00", "13:00", "15:00", "17:00"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Notes (optional)">
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="E.g. nail shape, length, design ideas..."
                  className="form-input resize-none"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: blue }}
            className="mt-8 w-full inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-white text-xs tracking-[0.18em] hover:opacity-90 transition"
          >
            SEND BOOKING REQUEST <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <style>{`
          .form-input {
            width: 100%;
            border: 1px solid ${sageSoft};
            border-radius: 2px;
            padding: 0.65rem 0.85rem;
            font-size: 0.875rem;
            font-family: var(--font-sans);
            color: var(--color-foreground);
            background-color: white;
            outline: none;
            transition: border-color .15s;
          }
          .form-input:focus { border-color: ${sage}; }
        `}</style>
      </section>

      {/* Contact / Footer */}
      <section id="contact" className="px-6 md:px-10 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] mb-3" style={{ color: sage }}>✦ FIND US</p>
          <h2
            style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 40, lineHeight: 1.05 }}
            className="font-light tracking-wide"
          >
            Get in Touch
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-xl mb-3">Address</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                6 Westway, Kelvin, Woodmead<br />
                Sandton, Johannesburg, 2054
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-xl mb-3">Phone & WhatsApp</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                +27 78 038 9060<br />
                <a
                  href="https://wa.me/27780389060"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: blue }}
                  className="underline-offset-4 hover:underline"
                >
                  Message on WhatsApp →
                </a>
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-xl mb-3">Opening Hours</h3>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li className="flex justify-between"><span>Mon – Fri</span><span>By appointment</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>By appointment</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
          </div>

          <div className="h-px mt-16 mb-6" style={{ backgroundColor: sageSoft }} />
          <p className="text-xs text-foreground/60 text-center">
            © 2026 Olivia's Nails · Kelvin, Woodmead, Sandton
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.15em] uppercase text-foreground/70 mb-2">{label}</span>
      {children}
    </label>
  );
}
