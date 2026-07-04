export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  country: string;
  rating: number;
  hasVideo?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "TechParivar didn't just rebuild our site — they rebuilt how we think about conversion. Every recommendation came with data behind it.",
    author: "Sarah Chen",
    role: "Founder",
    company: "Lumina Skincare",
    country: "United States",
    rating: 5,
    hasVideo: true,
  },
  {
    quote:
      "We needed a team that understood enterprise commerce, not just Shopify themes. TechParivar delivered exactly that, on time and on budget.",
    author: "James Whitfield",
    role: "VP Ecommerce",
    company: "Vantage Electronics",
    country: "United Kingdom",
    rating: 5,
    hasVideo: true,
  },
  {
    quote:
      "Our new site finally feels as premium as our product. The team understood luxury retail, not just ecommerce checklists.",
    author: "Layla Haddad",
    role: "Creative Director",
    company: "Aura Jewels",
    country: "United Arab Emirates",
    rating: 5,
  },
  {
    quote:
      "Last Black Friday nearly broke our business. This year, with TechParivar, it was our best sales day ever — without a single outage.",
    author: "Michael Torres",
    role: "COO",
    company: "Northfield Home",
    country: "Canada",
    rating: 5,
  },
  {
    quote:
      "Communication was the difference. We always knew what was happening, what was next, and why — no black box, no surprises.",
    author: "Priya Nair",
    role: "Head of Growth",
    company: "Everline Wellness",
    country: "Australia",
    rating: 5,
  },
  {
    quote:
      "TechParivar understood both the global Shopify playbook and what actually works for Indian shoppers. That combination is rare.",
    author: "Arjun Mehta",
    role: "Founder",
    company: "Stellar Apparel Co.",
    country: "India",
    rating: 5,
    hasVideo: true,
  },
];
