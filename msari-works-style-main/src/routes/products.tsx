import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/products";

const searchSchema = z.object({ c: z.string().optional() });

export const Route = createFileRoute("/products")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Products — MSAARI Works" },
      { name: "description", content: "Browse bridal blouses, designer sarees and bespoke pieces from MSAARI Works." },
      { property: "og:title", content: "MSAARI Works Products" },
      { property: "og:description", content: "Handcrafted sarees and bridal aari embroidery." },
    ],
  }),
  loaderDeps: ({ search }) => ({ c: search.c }),
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(productsQuery({ categorySlug: deps.c }));
  },
  component: Products,
});

function Products() {
  const { c } = Route.useSearch();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery({ categorySlug: c }));
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <span className="text-[10px] uppercase tracking-[0.24em] text-gold">The collection</span>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">All designs</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Every piece is available for enquiry on WhatsApp.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterPill to="/products" search={{}} active={!c}>All</FilterPill>
          {categories.map((cat) => (
            <FilterPill key={cat.id} to="/products" search={{ c: cat.slug }} active={c === cat.slug}>
              {cat.name}
            </FilterPill>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border bg-white/60 p-14 text-center">
            <p className="text-sm text-muted-foreground">No pieces here yet — message us on WhatsApp for a private preview.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function FilterPill({ to, search, active, children }: { to: string; search: any; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      search={search}
      className={
        "rounded-full border px-4 py-1.5 text-xs font-medium transition " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-white/70 text-foreground/70 hover:border-primary/40 hover:text-primary")
      }
    >
      {children}
    </Link>
  );
}