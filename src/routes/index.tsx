import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from "react";

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
        content: "Professional nail care crafted with precision in our intimate Sandton studio.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap",
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

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#book", label: "Book" },
  { href: "#contact", label: "Contact" },
];

/* ─────────────────────────────────────────
   Scroll Reveal — hook + wrapper component
───────────────────────────────────────── */

type RevealVariant = "up" | "left" | "right" | "scale" | "fade";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (ref.current) return;
    ref.current = node;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
  }, [threshold]);

  return { ref: setRef, inView };
}

function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 700,
  threshold = 0.12,
  className = "",
  style = {},
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView(threshold);

  const variantStyles: Record<RevealVariant, CSSProperties> = {
    up:    { transform: "translateY(40px)", opacity: 0 },
    left:  { transform: "translateX(-48px)", opacity: 0 },
    right: { transform: "translateX(48px)", opacity: 0 },
    scale: { transform: "scale(0.92)", opacity: 0 },
    fade:  { opacity: 0 },
  };

  const base: CSSProperties = {
    transition: `transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity ${duration * 0.85}ms ease ${delay}ms`,
    willChange: "transform, opacity",
    ...style,
  };

  const hidden: CSSProperties = { ...base, ...variantStyles[variant] };
  const visible: CSSProperties = { ...base, transform: "none", opacity: 1 };

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={inView ? visible : hidden}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────
   Main Page Component
───────────────────────────────────────── */

function Index() {
  const sage = "oklch(0.75 0.025 180)";
  const sageSoft = "oklch(0.94 0.015 180)";
  const blue = "oklch(0.5 0.14 250)";

  const [galleryIdx, setGalleryIdx] = useState(0);
  const nextG = () => setGalleryIdx((i) => (i + 1) % gallery.length);
  const prevG = () => setGalleryIdx((i) => (i - 1 + gallery.length) % gallery.length);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
    requestAnimationFrame(() => setMenuOpen(true));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setTimeout(() => setMenuVisible(false), 500);
  };

  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 72);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(y / total, 1) : 0;
      headerRef.current?.style.setProperty("--scroll-progress", String(progress));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    closeMenu();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const [form, setForm] = useState({
    firstName: "", phone: "", email: "", service: "", date: "", time: "", notes: "",
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
    <div style={{ fontFamily: "var(--font-sans)" }} className="min-h-screen bg-white text-foreground overflow-x-hidden">

      {/* ── Mobile Right Sidebar ── */}
      {menuVisible && (
        <>
          <div
            className={`mobile-backdrop${menuOpen ? " is-open" : ""}`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <aside className={`mobile-sidebar${menuOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="sidebar-accent-line" style={{ backgroundColor: sage }} />
            <div className="flex items-center justify-between px-7 pt-8 pb-6">
              <span style={{ fontFamily: "var(--font-serif)", color: sage }} className="text-[10px] tracking-[0.3em] uppercase">✦ Menu</span>
              <button type="button" onClick={closeMenu} className="sidebar-close-btn" aria-label="Close menu" style={{ borderColor: sageSoft, color: blue }}>
                <X strokeWidth={1.25} className="w-4 h-4" />
              </button>
            </div>
            <div className="px-7 pb-8">
              <p style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 32, lineHeight: 1.1 }} className={`font-light tracking-wide sidebar-brand${menuOpen ? " is-open" : ""}`}>
                Olivia's<br /><span className="italic" style={{ color: sage }}>Nails.</span>
              </p>
              <div className="mt-3 h-px sidebar-divider" style={{ backgroundColor: sageSoft }} />
            </div>
            <nav className="px-7 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`sidebar-nav-link${menuOpen ? " is-open" : ""}`}
                  style={{ animationDelay: menuOpen ? `${120 + i * 65}ms` : "0ms", fontFamily: "var(--font-serif)", color: blue }}>
                  <span className="sidebar-nav-num" style={{ color: sage }}>0{i + 1}</span>
                  <span className="sidebar-nav-text">{link.label}</span>
                  <span className="sidebar-nav-arrow" style={{ color: sage }}>→</span>
                </a>
              ))}
            </nav>
            <div className={`px-7 mt-10 sidebar-flourish${menuOpen ? " is-open" : ""}`}>
              <div className="h-px mb-6" style={{ backgroundColor: sageSoft }} />
              <p style={{ fontFamily: "var(--font-serif)", color: sage, fontSize: 13 }} className="italic leading-relaxed opacity-80">
                "Timeless nails, crafted<br />with intention."
              </p>
            </div>
            <div className={`px-7 mt-8 sidebar-cta${menuOpen ? " is-open" : ""}`}>
              <a href="#book" onClick={(e) => { e.preventDefault(); handleNavClick("#book"); }} className="sidebar-book-btn" style={{ backgroundColor: blue }}>
                Book Appointment <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className={`px-7 mt-6 sidebar-location${menuOpen ? " is-open" : ""}`}>
              <p className="text-[10px] tracking-[0.2em] opacity-60 uppercase" style={{ color: blue }}>✦ Kelvin, Woodmead · Sandton</p>
              <p className="text-[11px] mt-1 opacity-50" style={{ color: blue }}>+27 78 038 9060</p>
            </div>
            <div className="sidebar-bottom-decor" style={{ fontFamily: "var(--font-serif)", color: sageSoft }}>
              <span className="text-[80px] font-light leading-none select-none">✦</span>
            </div>
          </aside>
        </>
      )}

      {/* ── Sticky Header ── */}
      <header ref={headerRef} className={`sticky-header${scrolled ? " is-visible" : ""}`} style={{ borderBottomColor: sageSoft }}>
        <div className="sticky-header-inner">
          <a href="#home" style={{ fontFamily: "var(--font-serif)", color: blue }} className="text-xl tracking-wide transition-opacity hover:opacity-70">
            Olivia's Nails
          </a>

          <ul className="hidden md:flex gap-9 text-[11px] font-medium tracking-[0.2em]" style={{ color: blue }}>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="sticky-nav-link" style={{ color: blue }}>{l.label.toUpperCase()}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href="#book"
              className="hidden sm:inline-flex items-center rounded-full px-4 py-1.5 text-[11px] tracking-[0.18em] transition-all hover:opacity-80"
              style={{ border: `1px solid ${blue}`, color: blue }}
            >
              BOOK NOW
            </a>
            <button type="button" className="md:hidden sticky-ham-btn" onClick={openMenu} aria-label="Open navigation menu" aria-expanded={menuOpen}>
              <span className="sticky-ham-bar" style={{ backgroundColor: blue }} />
              <span className="sticky-ham-bar sticky-ham-bar--mid" style={{ backgroundColor: blue }} />
              <span className="sticky-ham-bar sticky-ham-bar--short" style={{ backgroundColor: blue }} />
            </button>
          </div>
        </div>
        <div className="sticky-header-progress" style={{ backgroundColor: sage }} />
      </header>

      {/* ── Hero ── */}
      <section id="home" className="relative overflow-hidden" style={{ backgroundColor: sage }}>
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-7 text-white">
          <a href="#home" style={{ fontFamily: "var(--font-serif)" }} className="text-xl tracking-wide">Olivia's Nails</a>
          <ul className="hidden md:flex gap-10 text-[11px] font-medium tracking-[0.2em]">
            <li><a href="#home">HOME</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#gallery">GALLERY</a></li>
            <li><a href="#book">BOOK</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
          <div className="flex gap-5 items-center">
            <a href="#book" className="hidden sm:inline-flex items-center rounded-full border border-white/80 px-4 py-1.5 text-[11px] tracking-[0.18em] hover:bg-white hover:text-foreground transition">
              BOOK NOW
            </a>
            <button type="button" className="md:hidden hamburger-btn" onClick={openMenu} aria-label="Open navigation menu" aria-expanded={menuOpen}>
              <span className="ham-bar" />
              <span className="ham-bar ham-bar--mid" />
              <span className="ham-bar ham-bar--short" />
            </button>
          </div>
        </nav>

        <div className="relative px-6 md:px-10 pb-16">
          <h1
            className="absolute top-0 left-0 right-0 text-white pointer-events-none leading-[0.9] tracking-tight z-10 hero-title-animate"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(70px, 13vw, 210px)", paddingLeft: "8vw" }}
          >
            <span className="block">Your Nails,</span>
            <span className="block text-right pr-[8vw]">Perfected.</span>
          </h1>

          <div className="relative z-0 flex justify-center pt-8 hero-image-animate">
            <img src={heroSvg} alt="Elegant manicured hand with floral nail art" className="w-full max-w-3xl h-auto" />
          </div>

          <div className="relative md:absolute md:left-10 md:bottom-24 max-w-xs text-white z-20 mt-8 md:mt-0 hero-tagline-animate">
            <p className="text-[10px] tracking-[0.2em] opacity-90 mb-4">✦ LUXURY NAIL STUDIO · KELVIN, WOODMEAD</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 38, lineHeight: 1.05 }} className="font-light tracking-wide">
              TIMELESS<br />NAILS,<br />PERFECTED
            </h2>
            <p className="mt-5 text-sm leading-relaxed opacity-95 max-w-[260px]">
              Professional acrylic, gel, and nail art crafted with precision in our intimate Sandton studio.
            </p>
            <a href="#book" className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/80 px-5 py-2.5 text-xs tracking-wider hover:bg-white hover:text-foreground transition">
              Book Appointment <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <p className="mt-5 text-[11px] opacity-90 tracking-wide">5.0 ★ · 8 reviews &nbsp;|&nbsp; Est. 2021 · 3+ yrs</p>
          </div>

          <div className="relative md:absolute md:right-10 md:bottom-10 w-full md:w-[300px] z-20 mt-10 md:mt-0 hero-card-animate">
            <div className="bg-white rounded-sm overflow-hidden shadow-sm">
              <img src={giftsetImg} alt="Signature Gel-X nail set" width={768} height={512} loading="lazy" className="w-full h-44 object-cover" />
            </div>
            <div className="mt-3 text-white">
              <div className="flex justify-between items-baseline text-sm">
                <span>Signature Gel-X Set</span><span>R450</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed opacity-90">
                Soft gel extensions, shaped and finished with a custom design — our most-loved service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="px-6 md:px-10 py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="md:sticky md:top-10">
            <Reveal variant="left" delay={0}>
              <p className="text-[10px] tracking-[0.2em] mb-4" style={{ color: sage }}>✦ SERVICES</p>
            </Reveal>
            <Reveal variant="left" delay={80}>
              <h2 style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 44, lineHeight: 1.05 }} className="font-light tracking-wide">
                BEAUTIFUL<br />NAILS START<br />HERE
              </h2>
            </Reveal>
            <Reveal variant="left" delay={180}>
              <p className="mt-6 text-sm leading-relaxed text-foreground/80 max-w-xs">
                Discover a curated menu of nail services designed to strengthen, shape, and elevate. From everyday classics to statement extensions, each set is crafted with care.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.n} variant="up" delay={i * 80} as="article"
                className="p-6 bg-white border transition hover:shadow-md"
                style={{ borderColor: sageSoft }}>
                <div style={{ fontFamily: "var(--font-serif)", color: sage }} className="text-sm tracking-widest">{s.n}</div>
                <div className="text-3xl mt-3" aria-hidden>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-serif)", color: blue }} className="text-xl mt-3 font-light">{s.title}</h3>
                <div className="h-px my-3" style={{ backgroundColor: sageSoft }} />
                <p className="text-xs leading-relaxed text-foreground/75">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="px-6 md:px-10 py-20" style={{ backgroundColor: sageSoft }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal variant="left" duration={900}>
            <img
              src={productsImg}
              alt="Inside Olivia's home nail studio"
              width={1536} height={576} loading="lazy"
              className="w-full h-auto rounded-sm object-cover aspect-[4/3]"
            />
          </Reveal>

          <div>
            <Reveal variant="right" delay={60}>
              <p className="text-[10px] tracking-[0.2em] mb-4" style={{ color: sage }}>✦ ABOUT US</p>
            </Reveal>
            <Reveal variant="right" delay={140}>
              <h2 style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 44, lineHeight: 1.05 }} className="font-light tracking-wide">
                Nails done right,<br />at home.
              </h2>
            </Reveal>
            <Reveal variant="right" delay={220}>
              <p className="mt-6 text-sm leading-relaxed text-foreground/80 max-w-md">
                Olivia's Nails has been serving Johannesburg since 2021. Based in Kelvin, Woodmead, we are a home studio built on precision, hygiene, and a genuine love for beautiful nails.
              </p>
            </Reveal>
            <ul className="mt-6 space-y-3">
              {aboutPoints.map((p, i) => (
                <Reveal key={p} variant="right" delay={300 + i * 70} as="li" className="flex gap-3 text-sm text-foreground/80">
                  <span style={{ color: sage }}>✦</span>
                  <span>{p}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" className="relative overflow-hidden px-6 md:px-10 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <Reveal variant="up" delay={0}>
                <p className="text-[10px] tracking-[0.2em] mb-4" style={{ color: sage }}>✦ THE GALLERY</p>
              </Reveal>
              <Reveal variant="up" delay={80}>
                <h2 style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 56, lineHeight: 0.95 }} className="font-light tracking-wide">
                  A study in<br />
                  <span className="italic" style={{ color: sage }}>finesse.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal variant="fade" delay={200}>
              <p className="text-sm text-foreground/70 max-w-sm leading-relaxed">
                An evolving archive of recent sets — each one shaped by hand, finished with intention. Hover to bring a piece into focus.
              </p>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={100} duration={900}>
            <div className="coverflow-stage">
              <button type="button" aria-label="Previous" onClick={prevG} className="cf-arrow cf-arrow-left">
                <ChevronLeft strokeWidth={1.25} />
              </button>

              <div className="coverflow-track">
                {gallery.map((g, i) => {
                  const n = gallery.length;
                  let offset = i - galleryIdx;
                  if (offset > n / 2) offset -= n;
                  if (offset < -n / 2) offset += n;
                  const abs = Math.abs(offset);
                  const isCenter = offset === 0;
                  const translateX = offset * 180;
                  const rotateY = offset * -28;
                  const scale = isCenter ? 1 : 0.78 - (abs - 1) * 0.08;
                  const translateZ = isCenter ? 150 : Math.max(0, 90 - abs * 55);
                  const opacity = abs > 2 ? 0 : 1;
                  return (
                    <figure
                      key={g.n}
                      className={`cf-card${isCenter ? " is-center" : ""}`}
                      style={{
                        transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
                        opacity, pointerEvents: abs > 1 ? "none" : "auto",
                      }}
                      onClick={() => !isCenter && setGalleryIdx(i)}
                    >
                      <div className="cf-frame">
                        <img src={g.src} alt={g.title} loading="lazy" />
                        <span className="cf-num" style={{ fontFamily: "var(--font-serif)" }}>{g.n}</span>
                      </div>
                    </figure>
                  );
                })}
              </div>

              <button type="button" aria-label="Next" onClick={nextG} className="cf-arrow cf-arrow-right">
                <ChevronRight strokeWidth={1.25} />
              </button>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={200}>
            <div className="mt-10 text-center">
              <span style={{ fontFamily: "var(--font-serif)", color: blue }} className="block italic text-2xl">
                {gallery[galleryIdx].title}
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase mt-2" style={{ color: sage }}>
                {gallery[galleryIdx].tag}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {gallery.map((g, i) => (
                <button key={g.n} type="button" aria-label={`Go to ${g.title}`} onClick={() => setGalleryIdx(i)} className="cf-dot"
                  style={{ backgroundColor: i === galleryIdx ? blue : sageSoft, width: i === galleryIdx ? 24 : 8 }} />
              ))}
            </div>
          </Reveal>
        </div>

        <style>{`
          .coverflow-stage { position:relative; display:flex; align-items:center; justify-content:center; min-height:520px; perspective:1600px; }
          .coverflow-track { position:relative; width:100%; height:500px; transform-style:preserve-3d; }
          .cf-card { position:absolute; top:50%; left:50%; width:clamp(220px,28vw,340px); margin:0; cursor:pointer; transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .6s ease; transform-origin:center center; will-change:transform; }
          .cf-frame { position:relative; background:white; padding:14px 14px 18px; box-shadow:0 30px 60px -25px rgba(0,0,0,.45),0 8px 20px -10px rgba(0,0,0,.2); border:1px solid ${sageSoft}; }
          .cf-frame::after { content:""; position:absolute; inset:0; box-shadow:inset 0 0 0 1px rgba(255,255,255,.6); pointer-events:none; }
          .cf-frame img { display:block; width:100%; aspect-ratio:4/5; object-fit:cover; filter:saturate(.92); transition:filter .6s ease; }
          .cf-card.is-center .cf-frame img { filter:saturate(1.05) contrast(1.03); }
          .cf-card.is-center .cf-frame { box-shadow:0 40px 80px -25px rgba(0,0,0,.55),0 12px 28px -10px rgba(0,0,0,.25); }
          .cf-num { position:absolute; top:22px; left:24px; color:white; font-size:12px; letter-spacing:.3em; mix-blend-mode:difference; opacity:.9; }
          .cf-arrow { position:absolute; top:50%; transform:translateY(-50%); z-index:200; width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; border-radius:9999px; border:1px solid ${sageSoft}; background:white; color:${blue}; transition:background .3s ease,color .3s ease,transform .3s ease; cursor:pointer; }
          .cf-arrow:hover { background:${blue}; color:white; transform:translateY(-50%) scale(1.05); }
          .cf-arrow-left { left:0; }
          .cf-arrow-right { right:0; }
          .cf-dot { height:8px; border-radius:9999px; border:0; cursor:pointer; transition:width .4s ease,background-color .4s ease; }
          @media (max-width:640px) { .coverflow-stage { min-height:440px; } .coverflow-track { height:420px; } .cf-card { width:62vw; } }
          @media (prefers-reduced-motion:reduce) { .cf-card { transition:opacity .3s ease; } }
        `}</style>
      </section>

      {/* ── Booking ── */}
      <section id="book" className="px-6 md:px-10 py-20" style={{ backgroundColor: sage }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <Reveal variant="up">
            <p className="text-[10px] tracking-[0.2em] mb-4 opacity-90">✦ RESERVATIONS</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, lineHeight: 1.05 }} className="font-light tracking-wide">
              Book an Appointment
            </h2>
            <p className="mt-4 text-sm opacity-90 max-w-xl mx-auto">
              Select a date to see available times. We will confirm via WhatsApp or email.
            </p>
          </Reveal>
        </div>

        <Reveal variant="up" delay={150} duration={800}>
          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-3xl mx-auto bg-white rounded-sm p-8 md:p-10 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="First Name *">
                <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Your name" className="form-input" />
              </Field>
              <Field label="Phone *">
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27 ..." className="form-input" />
              </Field>
              <Field label="Email (optional)">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="form-input" />
              </Field>
              <Field label="Service *">
                <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="form-input bg-white">
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
                </select>
              </Field>
              <Field label="Preferred Date *">
                <div className="relative">
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-input pr-10" />
                  <CalendarDays className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
              </Field>
              <Field label="Available Times *">
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} disabled={!form.date} className="form-input bg-white disabled:opacity-60">
                  <option value="">{form.date ? "Select a time" : "Select a date above to see available slots."}</option>
                  {form.date && ["09:00", "11:00", "13:00", "15:00", "17:00"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Notes (optional)">
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="E.g. nail shape, length, design ideas..." className="form-input resize-none" />
                </Field>
              </div>
            </div>
            <button type="submit" style={{ backgroundColor: blue }} className="mt-8 w-full inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-white text-xs tracking-[0.18em] hover:opacity-90 transition">
              SEND BOOKING REQUEST <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </Reveal>

        <style>{`
          .form-input { width:100%; border:1px solid ${sageSoft}; border-radius:2px; padding:0.65rem 0.85rem; font-size:0.875rem; font-family:var(--font-sans); color:var(--color-foreground); background-color:white; outline:none; transition:border-color .15s; }
          .form-input:focus { border-color:${sage}; }
        `}</style>
      </section>

      {/* ── Contact / Footer ── */}
      <section id="contact" className="px-6 md:px-10 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal variant="up">
            <p className="text-[10px] tracking-[0.2em] mb-3" style={{ color: sage }}>✦ FIND US</p>
            <h2 style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 40, lineHeight: 1.05 }} className="font-light tracking-wide">
              Get in Touch
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Address",
                content: <p className="text-sm text-foreground/80 leading-relaxed">6 Westway, Kelvin, Woodmead<br />Sandton, Johannesburg, 2054</p>,
              },
              {
                title: "Phone & WhatsApp",
                content: (
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    +27 78 038 9060<br />
                    <a href="https://wa.me/27780389060" target="_blank" rel="noreferrer" style={{ color: blue }} className="underline-offset-4 hover:underline">
                      Message on WhatsApp →
                    </a>
                  </p>
                ),
              },
              {
                title: "Opening Hours",
                content: (
                  <ul className="text-sm text-foreground/80 space-y-1">
                    <li className="flex justify-between"><span>Mon – Fri</span><span>By appointment</span></li>
                    <li className="flex justify-between"><span>Saturday</span><span>By appointment</span></li>
                    <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
                  </ul>
                ),
              },
            ].map((col, i) => (
              <Reveal key={col.title} variant="up" delay={i * 110}>
                <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-xl mb-3">{col.title}</h3>
                {col.content}
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade" delay={200}>
            <div className="h-px mt-16 mb-6" style={{ backgroundColor: sageSoft }} />
            <p className="text-xs text-foreground/60 text-center">© 2026 Olivia's Nails · Kelvin, Woodmead, Sandton</p>
          </Reveal>
        </div>
      </section>

      {/* ── Global styles ── */}
      <style>{`
        /* ── Hero entrance animations ── */
        @keyframes hero-title-in {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-image-in {
          from { opacity: 0; transform: scale(0.97) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes hero-tagline-in {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hero-card-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-title-animate   { animation: hero-title-in   0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-image-animate   { animation: hero-image-in   1.1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .hero-tagline-animate { animation: hero-tagline-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .hero-card-animate    { animation: hero-card-in    0.9s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

        /* ── Sticky header ── */
        .sticky-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 80;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(18px) saturate(1.6);
          -webkit-backdrop-filter: blur(18px) saturate(1.6);
          border-bottom: 1px solid;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.52s cubic-bezier(0.16,1,0.3,1), opacity 0.38s ease, box-shadow 0.35s ease;
          will-change: transform, opacity;
          box-shadow: 0 0 0 rgba(0,0,0,0);
        }
        .sticky-header.is-visible {
          transform: translateY(0);
          opacity: 1;
          box-shadow: 0 2px 28px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.04);
        }
        .sticky-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 62px;
        }
        @media (max-width: 767px) {
          .sticky-header-inner { padding: 0 1.25rem; }
        }
        .sticky-nav-link {
          position: relative;
          padding-bottom: 2px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
          text-decoration: none;
        }
        .sticky-nav-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -1px; right: 0;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .sticky-nav-link:hover { opacity: 1; }
        .sticky-nav-link:hover::after { transform: scaleX(1); }
        .sticky-header-progress {
          height: 2px;
          transform-origin: left;
          transform: scaleX(var(--scroll-progress, 0));
          transition: transform 0.05s linear;
          opacity: 0.7;
        }

        /* ── Sticky hamburger ── */
        .sticky-ham-btn { display:flex; flex-direction:column; gap:5px; padding:4px; background:transparent; border:none; cursor:pointer; }
        .sticky-ham-bar { display:block; width:22px; height:1.5px; border-radius:2px; transition:width 0.3s ease; }
        .sticky-ham-bar--mid { }
        .sticky-ham-bar--short { width:14px; }

        /* ── Hamburger ── */
        .hamburger-btn { display:flex; flex-direction:column; gap:5px; padding:4px; background:transparent; border:none; cursor:pointer; }
        .ham-bar { display:block; width:22px; height:1.5px; background:white; border-radius:2px; transition:transform 0.35s cubic-bezier(.4,0,.2,1),opacity 0.25s ease,width 0.3s ease; transform-origin:center; }
        .ham-bar--short { width:14px; }

        /* ── Backdrop ── */
        .mobile-backdrop { position:fixed; inset:0; z-index:90; background:rgba(30,40,55,.45); backdrop-filter:blur(3px); opacity:0; transition:opacity 0.45s cubic-bezier(.4,0,.2,1); }
        .mobile-backdrop.is-open { opacity:1; }

        /* ── Sidebar panel ── */
        .mobile-sidebar { position:fixed; top:0; right:0; bottom:0; z-index:100; width:min(320px,85vw); background:#fff; display:flex; flex-direction:column; overflow:hidden; transform:translateX(100%); transition:transform 0.5s cubic-bezier(.16,1,.3,1); box-shadow:-12px 0 60px rgba(0,0,0,.12),-2px 0 12px rgba(0,0,0,.06); }
        .mobile-sidebar.is-open { transform:translateX(0); }
        .sidebar-accent-line { height:3px; flex-shrink:0; transform-origin:left; animation:accent-grow 0.7s 0.3s cubic-bezier(.16,1,.3,1) both; }
        @keyframes accent-grow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        .sidebar-close-btn { width:36px; height:36px; border-radius:50%; border:1px solid; display:inline-flex; align-items:center; justify-content:center; background:transparent; cursor:pointer; transition:background 0.2s ease,color 0.2s ease,transform 0.3s ease; }
        .sidebar-close-btn:hover { background:oklch(0.5 0.14 250); color:white; border-color:oklch(0.5 0.14 250); transform:rotate(90deg); }
        .sidebar-brand { opacity:0; transform:translateY(14px); transition:opacity 0.55s 0.18s ease,transform 0.55s 0.18s cubic-bezier(.16,1,.3,1); }
        .sidebar-brand.is-open { opacity:1; transform:translateY(0); }
        .sidebar-divider { transform-origin:left; transform:scaleX(0); transition:transform 0.6s 0.28s cubic-bezier(.16,1,.3,1); }
        .mobile-sidebar.is-open .sidebar-divider { transform:scaleX(1); }
        .sidebar-nav-link { display:flex; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid oklch(0.94 0.015 180); text-decoration:none; opacity:0; transform:translateX(24px); transition:opacity 0.45s ease,transform 0.45s cubic-bezier(.16,1,.3,1),color 0.2s ease; }
        .sidebar-nav-link.is-open { opacity:1; transform:translateX(0); animation:nav-slide-in 0.45s cubic-bezier(.16,1,.3,1) both; }
        @keyframes nav-slide-in { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
        .sidebar-nav-link:hover .sidebar-nav-text { letter-spacing:0.08em; }
        .sidebar-nav-link:hover .sidebar-nav-arrow { transform:translateX(4px); }
        .sidebar-nav-num { font-size:10px; letter-spacing:0.2em; font-family:var(--font-serif); min-width:22px; opacity:0.7; }
        .sidebar-nav-text { font-size:22px; font-weight:300; letter-spacing:0.04em; flex:1; transition:letter-spacing 0.3s ease; }
        .sidebar-nav-arrow { font-size:15px; opacity:0.5; transition:transform 0.25s ease; }
        .sidebar-flourish { opacity:0; transition:opacity 0.5s 0.55s ease; }
        .sidebar-flourish.is-open { opacity:1; }
        .sidebar-cta { opacity:0; transform:translateY(10px); transition:opacity 0.45s 0.62s ease,transform 0.45s 0.62s cubic-bezier(.16,1,.3,1); }
        .sidebar-cta.is-open { opacity:1; transform:translateY(0); }
        .sidebar-book-btn { display:inline-flex; width:100%; align-items:center; justify-content:center; gap:10px; border-radius:9999px; padding:0.75rem 1.5rem; font-size:11px; letter-spacing:0.18em; color:white; text-decoration:none; transition:opacity 0.2s ease,transform 0.2s ease; }
        .sidebar-book-btn:hover { opacity:0.88; transform:scale(1.01); }
        .sidebar-location { opacity:0; transition:opacity 0.45s 0.7s ease; }
        .sidebar-location.is-open { opacity:1; }
        .sidebar-bottom-decor { position:absolute; bottom:-14px; right:18px; opacity:0.08; pointer-events:none; line-height:1; }

        @media (min-width:768px) {
          .mobile-sidebar, .mobile-backdrop, .hamburger-btn, .sticky-ham-btn { display:none !important; }
        }

        @media (prefers-reduced-motion:reduce) {
          .hero-title-animate, .hero-image-animate, .hero-tagline-animate, .hero-card-animate,
          .mobile-sidebar, .mobile-backdrop, .sidebar-nav-link, .sidebar-brand, .sidebar-cta,
          .sidebar-flourish, .sidebar-location, .sidebar-accent-line { transition:none !important; animation:none !important; }
        }
      `}</style>
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
