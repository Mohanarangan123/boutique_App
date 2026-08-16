import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { productByIdQuery, useImageUrls } from "@/lib/products";

export const Route = createFileRoute("/products/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — MSAARI Works` },
      { name: "description", content: `Details for MSAARI Works design ${params.id}.` },
      { property: "og:title", content: `${params.id} — MSAARI Works` },
      { property: "og:description", content: "Handcrafted design detail." },
    ],
  }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productByIdQuery(params.id));
    if (!data) throw notFound();
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(productByIdQuery(id));
  const [idx, setIdx] = useState(0);
  const { data: urls } = useImageUrls(product?.images);
  if (!product) return null;
  const cover = urls?.[idx];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to collection
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-[color:var(--rose-tint)] to-white soft-shadow">
              {cover ? (
                <img src={cover} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center font-display text-6xl text-primary/30">MW</div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-widest">{product.product_id}</span>
            </div>
            {urls && urls.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {urls.map((u, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={"aspect-square overflow-hidden rounded-xl border " + (i === idx ? "border-primary ring-2 ring-primary/30" : "border-border")}>
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" /> {product.category.name}
              </span>
            )}
            <h1 className="mt-3 font-display text-4xl leading-tight">{product.title}</h1>
            <p className="mt-4 whitespace-pre-line text-muted-foreground">{product.description ?? "A one-of-a-kind piece from the MSAARI Works atelier."}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-white/60 p-5 text-sm">
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Product ID</dt><dd className="mt-1 font-medium">{product.product_id}</dd></div>
              {product.fabric_type && <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Fabric</dt><dd className="mt-1 font-medium">{product.fabric_type}</dd></div>}
              {product.embroidery_type && <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Embroidery</dt><dd className="mt-1 font-medium">{product.embroidery_type}</dd></div>}
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Craft</dt><dd className="mt-1 font-medium">Fully handmade</dd></div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton
                productId={product.product_id}
                productName={product.title}
                category={product.category?.name}
                label="Enquire on WhatsApp"
              />
              <WhatsAppButton
                variant="ghost"
                label="Ask for pricing"
                freeText={`Hi MSAARI Works, could you share the pricing for ${product.product_id} - ${product.title}?`}
              />
            </div>

            <p className="mt-6 text-xs text-muted-foreground">Pricing on request. Delivery timelines depend on customisation and travel dates.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}