import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, useImageUrls, useSaveProduct, type Product } from "@/lib/products";

export function ProductForm({ product }: { product?: Product }) {
  const navigate = useNavigate();
  const save = useSaveProduct();
  const { data: categories } = useQuery(categoriesQuery);
  const [form, setForm] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    fabric_type: product?.fabric_type ?? "",
    embroidery_type: product?.embroidery_type ?? "",
    category_id: product?.category_id ?? "",
    images: product?.images ?? ([] as string[]),
    is_featured: product?.is_featured ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: urls } = useImageUrls(form.images);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const newPaths: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600" });
        if (error) throw error;
        newPaths.push(path);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...newPaths] }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(i: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.category_id) { setError("Select a category."); return; }
    try {
      await save.mutateAsync({ ...form, id: product?.id });
      navigate({ to: "/admin" });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="mt-3 font-display text-3xl">{product ? "Edit design" : "New design"}</h1>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 soft-shadow">
          <Field label="Title">
            <input required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </Field>
          <Field label="Description">
            <textarea rows={4} maxLength={1200} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fabric">
              <input maxLength={80} value={form.fabric_type} onChange={(e) => setForm({ ...form, fabric_type: e.target.value })} className="input" />
            </Field>
            <Field label="Embroidery">
              <input maxLength={80} value={form.embroidery_type} onChange={(e) => setForm({ ...form, embroidery_type: e.target.value })} className="input" />
            </Field>
          </div>
          <Field label="Category">
            <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
              <option value="">Choose…</option>
              {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Feature on homepage
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 soft-shadow">
            <h3 className="font-display text-lg">Images</h3>
            <p className="mt-1 text-xs text-muted-foreground">Upload up to 8 photos.</p>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-white/60 py-6 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Add photos"}
              <input type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
            </label>
            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {form.images.map((_, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                    {urls?.[i] && <img src={urls[i]} alt="" className="h-full w-full object-cover" />}
                    <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-destructive shadow"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button disabled={save.isPending} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {save.isPending ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>

      <style>{`.input{width:100%;border-radius:.9rem;border:1px solid var(--color-border);background:#fff;padding:.55rem .9rem;font-size:.9rem;outline:none;transition:box-shadow .2s;}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab, var(--color-primary) 20%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}