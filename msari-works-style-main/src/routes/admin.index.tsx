import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Plus, Trash2, Pencil, Star } from "lucide-react";
import { productsQuery, useDeleteProduct, useImageUrls } from "@/lib/products";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: products, isLoading } = useQuery(productsQuery({}));
  const items = products ?? [];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Catalogue</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} design{items.length === 1 ? "" : "s"} in the atelier.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-white/70 p-14 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No products yet. Add your first design.</p>
          <Link to="/admin/products/new" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Add product</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/60 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Design</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => <Row key={p.id} product={p} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ product }: { product: Product }) {
  const del = useDeleteProduct();
  const { data: urls } = useImageUrls(product.images);
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            {urls?.[0] ? <img src={urls[0]} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{product.title}</p>
            {product.is_featured && <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-gold"><Star className="h-3 w-3" /> Featured</span>}
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{product.category?.name ?? "—"}</td>
      <td className="px-4 py-3 font-mono text-xs">{product.product_id}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <Link to="/admin/products/$id" params={{ id: product.id }} className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-primary">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => { if (confirm(`Delete ${product.title}?`)) del.mutate(product.id); }}
            className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}