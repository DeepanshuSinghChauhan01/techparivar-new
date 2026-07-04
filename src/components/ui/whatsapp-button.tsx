"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi TechParivar, I'd like to talk about a Shopify project."
  );
  const href = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with TechParivar on WhatsApp"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className="group fixed right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-3.5 text-[#06090f] shadow-[0_8px_30px_-6px_rgba(37,211,102,0.6)] transition-all duration-300 hover:gap-2.5 hover:pr-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
    >
      <MessageCircle className="size-5 shrink-0" strokeWidth={2.25} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}
