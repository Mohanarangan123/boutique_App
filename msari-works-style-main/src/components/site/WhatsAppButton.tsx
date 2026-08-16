import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, currentPageUrl, type WhatsAppInquiry } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Props extends WhatsAppInquiry {
  className?: string;
  variant?: "solid" | "ghost" | "gold";
  label?: string;
  fullWidth?: boolean;
}

export function WhatsAppButton({ className, variant = "solid", label = "Enquire on WhatsApp", fullWidth, ...inquiry }: Props) {
  const href = buildWhatsAppUrl({ pageUrl: inquiry.pageUrl ?? currentPageUrl(), ...inquiry });
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 soft-shadow"
      : variant === "gold"
        ? "bg-gold text-white hover:brightness-105 soft-shadow"
        : "border border-border bg-white/70 text-foreground hover:bg-accent";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, styles, fullWidth && "w-full", className)}>
      <MessageCircle className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </a>
  );
}