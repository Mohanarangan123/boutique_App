import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

const productByRowIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
  });

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(productByRowIdQuery(id));
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Not found.</p>;
  return <ProductForm product={data} />;
}