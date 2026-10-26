/**
 * Shared shape for managed-service sections (E-commerce Services,
 * Performance Marketing). Each section keeps its own content file but uses
 * these types so the shared components in src/components/service-pages can
 * render either one.
 *
 * `ServiceIconName` values are keys of the explicit icon map in
 * src/components/service-pages/service-icon.tsx (not the whole lucide
 * barrel), so adding a new icon means adding it there too.
 */

export type ServiceIconName =
  // E-commerce Services
  | "UserCog"
  | "Megaphone"
  | "MonitorSmartphone"
  | "Rocket"
  | "ChartPie"
  | "ShieldCheck"
  | "LayoutList"
  | "Boxes"
  | "RotateCcw"
  | "Headset"
  | "Store"
  | "Target"
  | "BadgePercent"
  | "ImagePlus"
  | "CodeXml"
  | "Workflow"
  | "TrendingUp"
  | "Goal"
  | "SearchCheck"
  | "Truck"
  | "Receipt"
  | "ClipboardList"
  | "ChartLine"
  // Performance Marketing
  | "ChartNoAxesCombined"
  | "Smartphone"
  | "Search"
  | "Clapperboard"
  | "Activity"
  | "UserPlus"
  | "SlidersHorizontal"
  | "ShoppingBag"
  | "PhoneCall";

export interface ManagedService {
  slug: string;
  name: string;
  icon: ServiceIconName;
  /** One-line card description. */
  summary: string;
  /** Detail-page hero / meta description. */
  description: string;
  /** What our team actually does day to day on this engagement. */
  scope: string[];
  /** What the client receives. */
  deliverables: string[];
  /** KPIs this service is measured against — what we track, not promised results. */
  kpis?: string[];
  platforms?: string[];
  idealFor: string;
  /** Other service slugs in the same section to cross-link. */
  related: string[];
  /** Existing /services/[slug] pages that pair well with this one. */
  relatedCoreServices?: string[];
}

export interface ServiceFaq {
  question: string;
  answer: string;
}
