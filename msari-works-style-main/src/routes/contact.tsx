import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MSAARI Works" },
      { name: "description", content: "Reach the MSAARI Works atelier on WhatsApp, phone or email." },
      { property: "og:title", content: "Contact MSAARI Works" },
      { property: "og:description", content: "Book a consultation or ask about a custom design." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const text = `Hi MSAARI Works,\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-gold">Say hello</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Let's design something beautiful.</h1>
          <p className="mt-4 text-muted-foreground">Send us a message on WhatsApp — we reply personally, usually within a few hours.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Phone className="h-4 w-4" /></span> +91 96001 64876</li>
            <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Mail className="h-4 w-4" /></span> hello@msaariworks.com</li>
            <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></span> Chennai, Tamil Nadu</li>
            <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Clock className="h-4 w-4" /></span> Mon – Sat · 10 AM – 8 PM</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 soft-shadow sm:p-8">
          <h2 className="font-display text-2xl">Send an enquiry</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fill this out and continue on WhatsApp.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Your name">
              <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </Field>
            <Field label="Email">
              <input type="email" required maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
            </Field>
            <Field label="Tell us about your piece">
              <textarea rows={5} required maxLength={800} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" />
            </Field>
            <WhatsAppButton freeText={text} label="Continue on WhatsApp" fullWidth />
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="h-3 w-3" /> Your message stays on your device until you tap send.</p>
          </form>
        </div>
      </section>
      <style>{`.input{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:#fff;padding:.7rem 1rem;font-size:.9rem;outline:none;transition:box-shadow .2s;}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab, var(--color-primary) 20%, transparent)}`}</style>
    </SiteLayout>
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