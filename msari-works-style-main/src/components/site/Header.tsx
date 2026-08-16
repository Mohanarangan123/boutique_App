import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const nav = [
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500",
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-[0_10px_30px_-24px_rgba(214,90,146,0.35)] border-b border-border"
          : "bg-white/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold leading-none">
              MSAARI Works
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-gold">
              <span className="inline-block h-1 w-1 rounded-full bg-gold" />
              ISO Certified Boutique
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-white/60 text-foreground/70 transition hover:bg-accent hover:text-primary sm:inline-flex"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
          </Link>
          <a
            href={buildWhatsAppUrl({ freeText: "Hi MSAARI Works, I'd love to know more about your work." })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
            aria-label="Message on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}