import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { productsQuery, useImageUrls } from "@/lib/products";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — MSAARI Works" },
      { name: "description", content: "A moodboard of recent bridal and saree commissions." },
      { property: "og:title", content: "MSAARI Works Gallery" },
      { property: "og:description", content: "Recent work from our atelier." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery({})),
  component: Gallery,
});

function Gallery() {
  const { data: products } = useSuspenseQuery(productsQuery({}));
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <span className="text-[10px] uppercase tracking-[0.24em] text-gold">Moodboard</span>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Recent work</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">A living collection of pieces from the atelier — tap any image to enquire.</p>
        {products.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border bg-white/60 p-14 text-center">
            <p className="text-sm text-muted-foreground">Gallery is being updated. Message us on WhatsApp for a private preview.</p>
            <div className="mt-5 flex justify-center"><WhatsAppButton label="Preview privately" freeText="Hi MSAARI Works, may I preview recent work?" /></div>
          </div>
        ) : (
          <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {products.map((p) => <GalleryTile key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function GalleryTile({ product }: { product: Product }) {
  const { data: urls } = useImageUrls(product.images);
  const url = urls?.[0];
  if (!url) return null;
  return (
    <a
      href={`https://wa.me/919600164876?text=${encodeURIComponent(`Hi MSAARI Works, I'm interested in ${product.product_id} - ${product.title}.`)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card soft-shadow transition hover:-translate-y-0.5"
    >
      <img src={url} alt={product.title} loading="lazy" className="w-full object-cover" />
      <div className="flex items-center justify-between p-3 text-xs">
        <span className="font-medium">{product.title}</span>
        <span className="text-gold">{product.product_id}</span>
      </div>
    </a>
  );
}