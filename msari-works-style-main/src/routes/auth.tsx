import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — MSAARI Works" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.invalidate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-br from-[color:var(--rose-tint)]/50 via-background to-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 soft-shadow">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-3xl">Atelier access</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the MSAARI Works catalogue.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-xs text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "First time? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}