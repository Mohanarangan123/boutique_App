import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, PackagePlus, LogOut, Home } from "lucide-react";
import { useIsAdmin, useSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — MSAARI Works" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading } = useSession();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", replace: true });
  }, [session, loading, navigate]);

  if (loading || !session || adminLoading) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account doesn't have admin access. Sign in with the atelier owner account.</p>
          <button onClick={async () => { await supabase.auth.signOut(); router.invalidate(); navigate({ to: "/auth" }); }} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-dvh bg-[color:var(--rose-tint)]/30">
      <header className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/admin" className="font-display text-lg">MSAARI · Admin</Link>
          <nav className="hidden items-center gap-2 md:flex">
            <AdminLink to="/admin" icon={LayoutDashboard}>Dashboard</AdminLink>
            <AdminLink to="/admin/products/new" icon={PackagePlus}>New product</AdminLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary sm:inline-flex"><Home className="h-3 w-3" /> Site</Link>
            <button onClick={signOut} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  );
}

function AdminLink({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/70 hover:bg-accent hover:text-primary" activeProps={{ className: "bg-primary/10 text-primary" }} activeOptions={{ exact: true }}>
      <Icon className="h-3.5 w-3.5" /> {children}
    </Link>
  );
}