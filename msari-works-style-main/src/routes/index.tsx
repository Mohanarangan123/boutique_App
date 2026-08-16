import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Award, Scissors, Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { categoriesQuery, productsQuery } from "@/lib/products";
import heroImage from "@/assets/hero-bride.jpg";
import aboutImage from "@/assets/about-craft.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MSAARI Works — Handcrafted Bridal Aari & Designer Sarees" },
      { name: "description", content: "Luxury designer boutique for custom sarees and bridal aari embroidery. Explore one-of-a-kind pieces from MSAARI Works." },
      { property: "og:title", content: "MSAARI Works — Handcrafted Bridal Aari & Designer Sarees" },
      { property: "og:description", content: "Custom sarees and bridal blouse embroidery, made with quiet care in every stitch." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(productsQuery({ featured: true, limit: 8 }));
  },
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedProducts />
      <AboutStrip />
      <Process />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[color:var(--rose-tint)]/60 via-background to-background" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3 w-3" /> ISO Certified · Since 2018
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Bridal aari embroidery, <span className="italic text-primary">woven with care.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            MSAARI Works crafts couture bridal blouses and designer sarees for the
            moments you'll remember forever. Every stitch is placed by hand.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground soft-shadow transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Explore collection <ArrowRight className="h-4 w-4" />
            </Link>
            <WhatsAppButton variant="ghost" label="Book a consultation" freeText="Hi MSAARI Works, I'd like to book a bridal consultation." />
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "500+", v: "Brides styled" },
              { k: "7 yrs", v: "of craft" },
              { k: "100%", v: "Handmade" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl text-primary">{s.k}</dt>
                <dd className="text-xs uppercase tracking-widest text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative animate-in fade-in zoom-in-95 duration-700">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/20 via-gold/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-3 soft-shadow">
            <img src={heroImage} alt="Bride wearing intricate aari embroidered blouse" className="h-[520px] w-full rounded-[2rem] object-cover" />
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/60 bg-white/85 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold"><Award className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Signature service</p>
                  <p className="font-display text-lg">Bespoke bridal blouse fitting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { icon: Award, label: "ISO 9001 certified boutique" },
    { icon: Scissors, label: "Handstitched aari & zardosi" },
    { icon: Heart, label: "One-to-one bridal styling" },
  ];
  return (
    <section className="border-y border-border bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 sm:grid-cols-3">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 text-sm text-foreground/80">
            <i.icon className="h-4 w-4 text-gold" />
            <span>{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader eyebrow="The atelier" title="Explore by collection" subtitle="From heirloom bridal to modern drape — find what speaks to you." />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            to="/products"
            search={{ c: c.slug } as any}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 soft-shadow transition-all hover:-translate-y-1"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[color:var(--rose-tint)] to-white opacity-60" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-gold">{c.abbr}</span>
            <h3 className="mt-2 font-display text-2xl">{c.name}</h3>
            {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
              View pieces <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { data: products } = useSuspenseQuery(productsQuery({ featured: true, limit: 8 }));
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow="New arrivals" title="Featured designs" subtitle="Freshly finished pieces from the atelier." />
        <Link to="/products" className="text-sm font-medium text-primary hover:underline">View all →</Link>
      </div>
      {products.length === 0 ? (
        <EmptyState message="New pieces are being photographed. Message us on WhatsApp to preview." />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

function AboutStrip() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold/20 to-primary/10 blur-2xl" />
        <img src={aboutImage} alt="Close-up of hand embroidery in progress" className="rounded-[2rem] object-cover soft-shadow" />
      </div>
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold">Our story</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">A quieter kind of luxury.</h2>
        <p className="mt-4 text-muted-foreground">
          MSAARI Works began with a single embroidery frame and a passion for
          heirloom aari stitching. Today, our atelier styles brides across India
          — pairing traditional techniques with restrained, modern silhouettes.
        </p>
        <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
          Read our story <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Consultation", d: "Share your vision — silhouette, palette, occasion." },
    { n: "02", t: "Design & sketch", d: "We propose motifs, fabrics and threadwork." },
    { n: "03", t: "Handcraft", d: "Master artisans embroider frame by frame." },
    { n: "04", t: "Fitting & finish", d: "Precision fitting; delivered ready to wear." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader eyebrow="How it works" title="From first stitch to final drape" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-3xl border border-border bg-card p-6 soft-shadow">
            <span className="font-display text-3xl text-gold">{s.n}</span>
            <h3 className="mt-3 font-display text-xl">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-[color:var(--gold)] p-10 text-primary-foreground soft-shadow sm:p-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Ready to design your piece?</h2>
            <p className="mt-3 max-w-lg text-white/85">
              Share your inspiration on WhatsApp. We reply personally within a few hours.
            </p>
          </div>
          <WhatsAppButton variant="gold" label="Chat on WhatsApp" freeText="Hi MSAARI Works, I'd like to start a custom design." />
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold">{eyebrow}</span>}
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-border bg-white/60 p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
