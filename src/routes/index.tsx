import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, ShoppingBag } from "lucide-react";
import heroSvg from "@/assets/hero.svg";
import productsImg from "@/assets/products.jpg";
import giftsetImg from "@/assets/giftset.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Porcelain Skin — Timeless Beauty, Perfected" },
      { name: "description", content: "Luxurious, porcelain-inspired skincare to cleanse, nourish, and rejuvenate." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  const sage = "oklch(0.75 0.025 180)";
  const blue = "oklch(0.5 0.14 250)";

  return (
    <div style={{ fontFamily: "var(--font-sans)" }} className="min-h-screen bg-white text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: sage }}>
        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between px-10 py-7 text-white">
          <div className="w-24" />
          <ul className="flex gap-10 text-[11px] font-medium tracking-[0.2em]">
            <li><a href="#">HOME</a></li>
            <li><a href="#">SHOP</a></li>
            <li><a href="#">ABOUT</a></li>
            <li><a href="#">BLOG</a></li>
            <li><a href="#">CONTACT</a></li>
          </ul>
          <div className="flex gap-5 w-24 justify-end">
            <Search className="w-5 h-5" strokeWidth={1.5} />
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative px-10 pb-16">
          <h1
            className="absolute top-0 left-0 right-0 text-white pointer-events-none leading-[0.9] tracking-tight z-10"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(80px, 14vw, 220px)",
              paddingLeft: "8vw",
            }}
          >
            <span className="block">orcelain</span>
            <span className="block text-right pr-[8vw]">Skin</span>
          </h1>

          <div className="relative z-0 flex justify-center pt-8">
            <img
              src={heroSvg}
              alt="Woman with porcelain skin and blue floral body art"
              className="w-full max-w-3xl h-auto"
            />
          </div>

          {/* Tagline block */}
          <div className="absolute left-10 bottom-24 max-w-xs text-white z-20">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 38, lineHeight: 1.05 }} className="font-light tracking-wide">
              TIMELESS<br />BEAUTY,<br />PERFECTED
            </h2>
            <p className="mt-5 text-sm leading-relaxed opacity-95 max-w-[260px]">
              Elevating your skincare routine with luxurious, porcelain-inspired products.
            </p>
            <button className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/80 px-5 py-2.5 text-xs tracking-wider hover:bg-white hover:text-foreground transition">
              Explore Collection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product card */}
          <div className="absolute right-10 bottom-10 w-[300px] z-20">
            <div className="bg-white rounded-sm overflow-hidden shadow-sm">
              <img src={giftsetImg} alt="Porcelain Skin Gift Set" width={768} height={512} loading="lazy" className="w-full h-44 object-cover" />
            </div>
            <div className="mt-3 text-white">
              <div className="flex justify-between items-baseline text-sm">
                <span>Porcelain Skin Gift Set</span>
                <span>$120.00</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed opacity-90">
                A premium skincare collection in a beautifully designed box, featuring our top products for a luxurious skincare experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second section */}
      <section className="px-10 py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <h2
              style={{ fontFamily: "var(--font-serif)", color: blue, fontSize: 44, lineHeight: 1.05 }}
              className="font-light tracking-wide"
            >
              RADIANT<br />SKIN STARTS<br />HERE
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-foreground/80 max-w-xs">
              Discover our luxurious skincare collection designed to cleanse, nourish, and rejuvenate your face. From brightening cleansers to revitalizing eye creams, each product is crafted for flawless, porcelain-like skin.
            </p>
          </div>
          <div>
            <img src={productsImg} alt="Skincare products on stone pedestals" width={1536} height={576} loading="lazy" className="w-full h-auto rounded-sm" />
          </div>
        </div>
      </section>
    </div>
  );
}
