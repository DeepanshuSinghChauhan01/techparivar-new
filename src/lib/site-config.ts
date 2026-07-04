export const siteConfig = {
  name: "TechParivar",
  legalName: "TechParivar Commerce Pvt. Ltd.",
  tagline: "Shopify Plus development partner for ambitious D2C brands",
  description:
    "TechParivar is a Shopify and Shopify Plus development agency helping D2C and ecommerce brands across the US, UK, Canada, Australia, UAE, and India build, migrate, and scale high-performing stores.",
  url: "https://www.techparivar.com",
  email: "support@techparivar.com",
  phone: "+918384877543",
  whatsapp: "+918384877543",
  calendlyUrl: "https://calendly.com/techparivar/consultation",
  social: {
    linkedin: "https://www.linkedin.com/company/techparivar",
    twitter: "https://twitter.com/techparivar",
    instagram: "https://www.instagram.com/techparivar",
    youtube: "https://www.youtube.com/@techparivar",
  },
  offices: [
    { city: "Gurugram", country: "India", isHQ: true },
    { city: "Austin", country: "United States", isHQ: false },
    { city: "London", country: "United Kingdom", isHQ: false },
  ],
  markets: [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "IN", name: "India" },
  ],
} as const;

export const navLinks = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Shopify Store Development", href: "/services/shopify-development" },
      { label: "Shopify Plus Services", href: "/services/shopify-plus" },
      { label: "Theme Customization", href: "/services/theme-customization" },
      { label: "Custom App Development", href: "/services/app-development" },
      { label: "Store Migration", href: "/services/migration" },
      { label: "CRO Optimization", href: "/services/cro" },
      { label: "Performance Optimization", href: "/services/performance" },
      { label: "Headless Commerce", href: "/services/headless-commerce" },
      { label: "Retainer Support", href: "/services/retainer-support" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Client Portal", href: "/login" },
] as const;

export const trustStats = [
  { value: 9, suffix: "+", label: "Years building on Shopify" },
  { value: 320, suffix: "+", label: "Stores launched & scaled" },
  { value: 98, suffix: "%", label: "Client satisfaction rate" },
  { value: 14, suffix: "", label: "Countries served" },
] as const;
