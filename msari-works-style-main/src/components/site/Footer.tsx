import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[color:var(--rose-tint)]/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="gold-divider mb-10" />
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-display text-xl">MSAARI Works</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Handcrafted bridal aari embroidery, designer sarees and bespoke pieces
              — created with quiet care in every stitch.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary">Products</Link></li>
              <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold">Reach us</h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +91 96001 64876</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@msaariworks.com</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Chennai, Tamil Nadu, IN</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" /> Mon – Sat · 10 AM – 8 PM</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold">Stay in touch</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Get quiet updates about new arrivals and bridal openings.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                Join
              </button>
            </form>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="rounded-full border border-border bg-white p-2 hover:text-primary"><Instagram className="h-4 w-4" /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="rounded-full border border-border bg-white p-2 hover:text-primary"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="gold-divider my-10" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MSAARI Works. Every piece, handcrafted with love.
        </p>
      </div>
    </footer>
  );
}