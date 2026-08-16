import { Link } from "@tanstack/react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useImageUrls } from "@/lib/products";
import { WhatsAppButton } from "./WhatsAppButton";

export function ProductCard({ product }: { product: Product }) {
  const [fav, setFav] = useState(false);
  const { data: urls } = useImageUrls(product.images);
  const cover = urls?.[0];
  return (
    <article className="group animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden rounded-3xl border border-border bg-card soft-shadow transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(214,90,146,0.35)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[color:var(--rose-tint)] to-[color:var(--muted)]">
        {cover ? (
          <img src={cover} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-4xl text-primary/40">MW</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[10px] font-medium tracking-widest text-foreground/80 shadow-sm">
          {product.product_id}
        </span>
        {product.category && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">
            {product.category.name}
          </span>
        )}
        <button
          onClick={() => setFav((v) => !v)}
          aria-label={fav ? "Remove favorite" : "Add favorite"}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground/70 shadow-sm transition hover:text-primary"
        >
          <Heart className={"h-4 w-4 " + (fav ? "fill-primary text-primary" : "")} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg leading-tight">{product.title}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link
            to="/products/$id"
            params={{ id: product.product_id }}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <WhatsAppButton
            variant="ghost"
            label="WhatsApp"
            productId={product.product_id}
            productName={product.title}
            category={product.category?.name}
            className="px-4 py-2 text-xs"
          />
        </div>
      </div>
    </article>
  );
}