import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Star, MapPin, Phone, Clock, Sparkles } from "lucide-react";
import heroImg from "@/assets/nails-hero.jpg";
import portfolioImg from "@/assets/nails-portfolio.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olivia's Nails Spar — Luxury Nail Studio in Kelvin, Woodmead" },
      { name: "description", content: "Professional acrylic, gel, and nail art services in an intimate Sandton studio. Book your appointment with Olivia's Nails today." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

const services = [
  { n: "01", icon: "💅", title: "Acrylic Nails", desc: "Durable, long-lasting acrylic sets in any shape or length. Natural-looking or dramatic." },
  { n: "02", icon: "🌷", title: "Rubber Base", desc: "A flexible, protective rubber base gel that strengthens natural nails with a flawless finish." },
  { n: "03", icon: "✨", title: "Polygel", desc: "A lightweight hybrid between acrylic and gel — buildable, odourless, and incredibly strong." },
  { n: "04", icon: "🌸", title: "Gel X", desc: "Soft gel nail extensions that are gentle on natural nails. Perfect for added length and a natural feel." },
  { n: "05", icon: "🤍", title: "Manicure", desc: "A classic hand and nail treatment including shaping, cuticle care, and your choice of polish." },
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
  const blush = "oklch(0.95 0.025 10)";
  const rose = "oklch(0.55 0.18 5)";
  const ink = "oklch(0.22 0.02 320)";

  const [form, setForm] = useState({
    firstName: "", phone: "", email: "", service: "", date: "", time: "", notes: "",
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: ink }} className="min-h-screen bg-white">
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-30">
        <nav className="flex items-center justify-between px-8 md:px-12 py-6">
          <a href="#" style={{ fontFamily: "var(--font-serif)" }} className="text-xl tracking-wide" >
            Olivia's <em className="not-italic font-medium">Nails</em>
          </a>
          <ul className="hidden md:flex gap-9 text-[12px] font-medium tracking-[0.18em] uppercase">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#book" className="rounded-full px-5 py-2.5 text-xs tracking-wider text-white" style={{ backgroundColor: rose }}>
            Book Now
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-8 md:px-12" style={{ backgroundColor: blush }}>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase" style={{ color: rose }}>
              <Sparkles className="w-3.5 h-3.5" /> Luxury Nail Studio · Kelvin, Woodmead, Sandton
            </div>
            <h1
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(56px, 8vw, 120px)", lineHeight: 0.95 }}
              className="mt-6 font-light tracking-tight"
            >
              Your Nails,<br />
              <em style={{ color: rose }}>Perfected.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm md:text-base leading-relaxed opacity-80">
              Professional acrylic, gel, and nail art services in our intimate studio. Every design is crafted with precision, care, and an eye for beauty. From minimalist elegance to bold statements, we create nails that make you feel confident.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-xs">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: rose }} />)}
                <span className="ml-1 font-medium">5.0 · 8 reviews</span>
              </div>
              <span className="opacity-60">Est. 2021 · 3+ Years of Expertise</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-white" style={{ backgroundColor: rose }}>
                Book an Appointment <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm border" style={{ borderColor: rose, color: rose }}>
                View Our Services
              </a>
            </div>
          </div>

          <div className="relative">
            <img src={heroImg} alt="Elegant manicured nails" width={1024} height={1280} className="w-full h-auto rounded-2xl shadow-xl object-cover" />
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="px-8 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-4xl md:text-5xl font-light">Portfolio Showcase</h2>
            <span className="text-xs tracking-widest uppercase opacity-60">Recent Work</span>
          </div>
          <img src={portfolioImg} alt="Nail art portfolio: pink gradient, ombre, French, hot pink" width={1536} height={1024} loading="lazy" className="w-full h-auto rounded-2xl" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3 text-xs opacity-70">
            <span>Elegant pink & white gradient</span>
            <span>Soft ombre design</span>
            <span>Pink & white sparkle</span>
            <span>Classic French manicure</span>
            <span>Black & white ombre</span>
            <span>Hot pink gradient</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-8 md:px-12 py-24" style={{ backgroundColor: blush }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: rose }}>What We Offer</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl md:text-6xl font-light">Our Services</h2>
            <p className="mt-5 max-w-xl mx-auto text-sm opacity-75">
              From natural enhancements to bold statement nails — every service is done with care and precision.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-8 hover:shadow-lg transition">
                <div className="text-xs font-mono opacity-50">{s.n}</div>
                <div className="text-4xl mt-4">{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-serif)" }} className="mt-4 text-2xl font-medium">{s.title}</h3>
                <p className="mt-3 text-sm opacity-75 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 md:px-12 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img src={heroImg} alt="Studio nails" width={1024} height={1280} loading="lazy" className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
              <div style={{ fontFamily: "var(--font-serif)", color: rose }} className="text-5xl font-light">3+</div>
              <div className="text-[10px] tracking-[0.2em] uppercase mt-1 opacity-70">Years of Experience</div>
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: rose }}>About Us</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl font-light leading-[1.05]">
              Nails done right,<br /><em>at home.</em>
            </h2>
            <p className="mt-6 text-sm opacity-80 leading-relaxed max-w-md">
              Olivia's Nails Spar has been serving Johannesburg since 2021. Based in Kelvin, Woodmead, we are a home studio built on precision, hygiene, and a genuine love for beautiful nails.
            </p>
            <ul className="mt-7 space-y-3">
              {aboutPoints.map((p) => (
                <li key={p} className="flex gap-3 text-sm">
                  <span style={{ color: rose }}>✦</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="px-8 md:px-12 py-24" style={{ backgroundColor: blush }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl font-light">Book an Appointment</h2>
            <p className="mt-3 text-sm opacity-75">
              Select a date to see available times. We will confirm via WhatsApp or email.
            </p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="bg-white rounded-2xl p-8 md:p-10 grid md:grid-cols-2 gap-5"
          >
            <Field label="First Name *">
              <input required maxLength={60} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Your name" className="input" />
            </Field>
            <Field label="Phone *">
              <input required maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27 ..." className="input" />
            </Field>
            <Field label="Email (optional)">
              <input type="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input" />
            </Field>
            <Field label="Service *">
              <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                <option value="">Select a service</option>
                {services.map((s) => <option key={s.title}>{s.title}</option>)}
              </select>
            </Field>
            <Field label="Preferred Date *">
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
            </Field>
            <Field label="Available Times *">
              <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input" disabled={!form.date}>
                <option value="">{form.date ? "Select a time" : "Select a date above to see available slots."}</option>
                {form.date && ["09:00", "10:30", "12:00", "14:00", "15:30"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Notes (optional)">
                <textarea maxLength={500} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="E.g. nail shape, length, design ideas..." className="input resize-none" />
              </Field>
            </div>
            <button type="submit" className="md:col-span-2 rounded-full py-3.5 text-white text-sm tracking-wide" style={{ backgroundColor: rose }}>
              Send Booking Request
            </button>
          </form>
        </div>
        <style>{`
          .input { width:100%; border:1px solid oklch(0.9 0.01 320); border-radius:10px; padding:11px 14px; font-size:14px; background:white; outline:none; transition:border-color .15s; }
          .input:focus { border-color: ${rose}; }
        `}</style>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: rose }}>Find Us</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl font-light">Get in Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ContactCard icon={<MapPin className="w-5 h-5" style={{ color: rose }} />} title="Address">
              6 Westway, Kelvin, Woodmead<br />Sandton, Johannesburg, 2054
            </ContactCard>
            <ContactCard icon={<Phone className="w-5 h-5" style={{ color: rose }} />} title="Phone & WhatsApp">
              +27 78 038 9060
              <br />
              <a href="https://wa.me/27780389060" className="inline-block mt-2 text-xs underline" style={{ color: rose }}>Message on WhatsApp</a>
            </ContactCard>
            <ContactCard icon={<Clock className="w-5 h-5" style={{ color: rose }} />} title="Opening Hours">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="opacity-70">By appointment</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="opacity-70">By appointment</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="opacity-70">Closed</span></div>
              </div>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-12 py-10 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
          <div style={{ fontFamily: "var(--font-serif)" }} className="text-lg">Olivia's Nails Spar</div>
          <div className="opacity-70">© 2026 Olivia's Nails Spar. All rights reserved.</div>
          <ul className="flex gap-6 uppercase tracking-widest">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-2">{label}</span>
      {children}
    </label>
  );
}

function ContactCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-7">
      <div className="flex items-center gap-3 mb-3">{icon}<h3 className="font-medium">{title}</h3></div>
      <div className="text-sm opacity-80 leading-relaxed">{children}</div>
    </div>
  );
}
