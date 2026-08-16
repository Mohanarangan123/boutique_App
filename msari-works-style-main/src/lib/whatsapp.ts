// WhatsApp inquiry URL builder for MSAARI Works.
// Never mutate the phone number in code; it is a business contact.
const PHONE = "919600164876"; // +91 96001 64876

export interface WhatsAppInquiry {
  productId?: string;
  productName?: string;
  category?: string;
  pageUrl?: string;
  freeText?: string;
}

export function buildWhatsAppUrl(inquiry: WhatsAppInquiry = {}): string {
  const lines: string[] = ["Hi MSAARI Works,", ""];
  if (inquiry.freeText) {
    lines.push(inquiry.freeText);
  } else {
    lines.push("I am interested in the following design:", "");
    if (inquiry.productId) lines.push(`Product ID: ${inquiry.productId}`);
    if (inquiry.productName) lines.push(`Product Name: ${inquiry.productName}`);
    if (inquiry.category) lines.push(`Category: ${inquiry.category}`);
    if (inquiry.pageUrl) lines.push(`Page Link: ${inquiry.pageUrl}`);
    lines.push("", "Please share more details.");
  }
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${PHONE}?text=${text}`;
}

export function currentPageUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}