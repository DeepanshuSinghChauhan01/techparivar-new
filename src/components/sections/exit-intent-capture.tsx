"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tp_exit_intent_shown";

export function ExitIntentCapture() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const hasShown = useRef(false);

  const trigger = useCallback(() => {
    if (hasShown.current) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    hasShown.current = true;
    setOpen(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    // Fallback for mobile: trigger near end of a long scroll session after a delay
    const timer = setTimeout(() => {
      const scrolledDeep = window.scrollY > document.body.scrollHeight * 0.6;
      if (scrolledDeep) trigger();
    }, 45000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, [trigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "exit_intent", email }),
    }).catch((err) => console.error("Exit-intent lead submission failed:", err));
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="surface-card relative w-full max-w-md rounded-2xl p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-text-muted hover:bg-card-hover hover:text-text-primary"
            >
              <X className="size-4" />
            </button>

            {sent ? (
              <div className="py-4 text-center">
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  Check your inbox
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  We&rsquo;re sending your free audit checklist now — and we&rsquo;ll follow up with
                  a personal review within one business day.
                </p>
              </div>
            ) : (
              <>
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                  <FileSearch className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-text-primary">
                  Before you go — get a free Shopify audit
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  We&rsquo;ll review your store&rsquo;s speed, conversion funnel, and SEO health
                  and send back a prioritized action list. No call required.
                </p>
                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    placeholder="you@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-blue"
                  />
                  <Button variant="primary" size="md" className="w-full" showArrow>
                    Send me the audit
                  </Button>
                </form>
                <p className="mt-3 text-center text-xs text-text-muted">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
