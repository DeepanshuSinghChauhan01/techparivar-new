import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

// Not needed for initial render — it only shows after a mouse-leave/scroll-depth
// trigger, so it's code-split into its own chunk instead of shipping with the
// main layout bundle on every page load. (`ssr: false` isn't available for
// next/dynamic in a Server Component like this layout — the component starts
// closed either way, so SSR-ing its initial `null` output is harmless.)
const ExitIntentCapture = dynamic(() =>
  import("@/components/sections/exit-intent-capture").then((m) => m.ExitIntentCapture)
);

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ExitIntentCapture />
    </>
  );
}
