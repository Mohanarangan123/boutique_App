import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { SectionHeader } from "./index";
import aboutImage from "@/assets/about-craft.jpg";
import { Award, Heart, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MSAARI Works" },
      { name: "description", content: "The story, atelier and artisans behind MSAARI Works." },
      { property: "og:title", content: "About MSAARI Works" },
      { property: "og:description", content: "A quieter kind of luxury — handcrafted bridal aari and designer sarees." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-gold">Since 2018</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Threadwork with a signature.</h1>
          <p className="mt-5 text-muted-foreground">
            MSAARI Works is a small, ISO-certified atelier dedicated to bridal aari
            embroidery, zardosi and couture drape. Every commission is an intimate
            collaboration between the wearer, our designers and our master artisans.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppButton label="Book a visit" freeText="Hi MSAARI Works, I'd like to visit the atelier." />
          </div>
        </div>
        <img src={aboutImage} alt="Aari embroidery on a wooden frame" className="rounded-[2rem] object-cover soft-shadow" />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <SectionHeader eyebrow="What we stand for" title="Our values" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Heart, t: "Handmade always", d: "Every stitch is placed by a human hand." },
            { i: Sparkles, t: "Restrained luxury", d: "Considered motifs; no clutter." },
            { i: Users, t: "Intimate service", d: "One studio, one designer, one client at a time." },
            { i: Award, t: "Quality certified", d: "ISO 9001 processes end-to-end." },
          ].map((v) => (
            <div key={v.t} className="rounded-3xl border border-border bg-card p-6 soft-shadow">
              <v.i className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-display text-lg">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}