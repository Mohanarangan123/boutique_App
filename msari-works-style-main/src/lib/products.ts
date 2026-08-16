import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  abbr: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  product_id: string;
  title: string;
  description: string | null;
  fabric_type: string | null;
  embroidery_type: string | null;
  category_id: string;
  images: string[];
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    } catch (error) {
      console.warn('[Products] Failed to fetch categories:', error);
      return [];
    }
  },
});

export const productsQuery = (opts: { categorySlug?: string; featured?: boolean; limit?: number } = {}) =>
  queryOptions({
    queryKey: ["products", opts],
    queryFn: async (): Promise<Product[]> => {
      try {
        let q = supabase
          .from("products")
          .select("*, category:categories(*)")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (opts.featured) q = q.eq("is_featured", true);
        if (opts.limit) q = q.limit(opts.limit);
        const { data, error } = await q;
        if (error) throw error;
        let rows = (data ?? []) as Product[];
        if (opts.categorySlug && opts.categorySlug !== "all-works") {
          rows = rows.filter((r) => r.category?.slug === opts.categorySlug);
        }
        return rows;
      } catch (error) {
        console.warn('[Products] Failed to fetch products:', error);
        return [];
      }
    },
  });

export const productByIdQuery = (productId: string) =>
  queryOptions({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product | null> => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .eq("product_id", productId)
          .maybeSingle();
        if (error) throw error;
        return data as Product | null;
      } catch (error) {
        console.warn('[Products] Failed to fetch product:', error);
        return null;
      }
    },
  });

// Cache signed URLs per storage path.
const urlCache = new Map<string, { url: string; exp: number }>();

export async function resolveImageUrls(paths: string[]): Promise<string[]> {
  if (!paths || paths.length === 0) return [];
  const now = Date.now();
  const missing = paths.filter((p) => {
    const c = urlCache.get(p);
    return !c || c.exp < now + 60_000;
  });
  if (missing.length > 0) {
    const { data } = await supabase.storage
      .from("product-images")
      .createSignedUrls(missing, 60 * 60 * 24 * 7);
    (data ?? []).forEach((d, i) => {
      const p = missing[i];
      if (d.signedUrl && p) {
        urlCache.set(p, { url: d.signedUrl, exp: now + 60 * 60 * 24 * 6 * 1000 });
      }
    });
  }
  return paths.map((p) => urlCache.get(p)?.url ?? "");
}

export function useImageUrls(paths: string[] | undefined) {
  return useQuery({
    queryKey: ["image-urls", paths],
    queryFn: () => resolveImageUrls(paths ?? []),
    enabled: !!paths && paths.length > 0,
    staleTime: 60 * 60 * 1000,
  });
}

// Admin mutations
export interface ProductInput {
  title: string;
  description?: string;
  fabric_type?: string;
  embroidery_type?: string;
  category_id: string;
  images: string[];
  display_order?: number;
  is_featured?: boolean;
}

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput & { id?: string }) => {
      const payload = { ...input };
      if (input.id) {
        const { id: _id, ...rest } = payload;
        const { data, error } = await supabase.from("products").update(rest).eq("id", input.id).select().single();
        if (error) throw error;
        return data;
      }
      // product_id is filled by the DB trigger; send an empty string to satisfy the generated type.
      const { data, error } = await supabase
        .from("products")
        .insert({ ...payload, product_id: "" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; slug: string; abbr: string }) => {
      const { data, error } = await supabase.from("categories").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}