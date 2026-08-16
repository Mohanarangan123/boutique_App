
-- =========================================
-- ROLES
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-assign admin role to designated email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'mohanarangan2004@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- =========================================
-- CATEGORIES
-- =========================================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  abbr text NOT NULL UNIQUE, -- e.g. BR, HB, DS, KC, CO, AW  (used in Product ID)
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PRODUCTS
-- =========================================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL UNIQUE, -- e.g. MW-BR-001, auto-generated
  title text NOT NULL,
  description text,
  fabric_type text,
  embroidery_type text,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  images text[] NOT NULL DEFAULT '{}', -- storage paths in product-images bucket
  display_order int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_category_idx ON public.products(category_id);
CREATE INDEX products_featured_idx ON public.products(is_featured) WHERE is_featured;
CREATE INDEX products_created_idx ON public.products(created_at DESC);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Product ID auto-generator: MW-{ABBR}-{NNN}
CREATE OR REPLACE FUNCTION public.generate_product_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  cat_abbr text;
  next_num int;
BEGIN
  IF NEW.product_id IS NOT NULL AND NEW.product_id <> '' THEN
    RETURN NEW;
  END IF;

  SELECT abbr INTO cat_abbr FROM public.categories WHERE id = NEW.category_id;
  IF cat_abbr IS NULL THEN
    RAISE EXCEPTION 'Invalid category_id';
  END IF;

  SELECT COALESCE(
    MAX((regexp_match(product_id, '^MW-' || cat_abbr || '-(\d+)$'))[1]::int),
    0
  ) + 1
  INTO next_num
  FROM public.products
  WHERE product_id LIKE 'MW-' || cat_abbr || '-%';

  NEW.product_id := 'MW-' || cat_abbr || '-' || LPAD(next_num::text, 3, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_generate_product_id
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.generate_product_id();

-- =========================================
-- SEED CATEGORIES
-- =========================================
INSERT INTO public.categories (name, slug, abbr, description, display_order) VALUES
  ('All Works',        'all-works',        'AW', 'A curated view of every MSAARI Works creation.', 1),
  ('Bridal Works',     'bridal-works',     'BR', 'Signature bridal aari embroidery.', 2),
  ('Heavy Bridal',     'heavy-bridal',     'HB', 'Grand, richly embellished bridal couture.', 3),
  ('Designer Sarees',  'designer-sarees',  'DS', 'Handcrafted designer sarees for every occasion.', 4),
  ('Kids Collection',  'kids-collection',  'KC', 'Delicate embroidery for little celebrations.', 5),
  ('Custom Orders',    'custom-orders',    'CO', 'Bespoke pieces designed with you.', 6);

-- =========================================
-- STORAGE POLICIES for product-images bucket
-- =========================================
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone signed-in or anon can read product image records"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');
