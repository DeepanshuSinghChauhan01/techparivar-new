export const currentUser = {
  name: "Sarah Chen",
  firstName: "Sarah",
  role: "Founder & CEO",
  company: "Luxe Wear Global",
  email: "sarah@luxewear.co",
  avatarInitials: "SC",
  activeStore: "LUXE-SHOP",
  globalRank: "#2,401",
};

export const storeHealth = {
  performanceDelta: "12% better",
  summary:
    "Your Shopify store is performing 12% better than last month. We've detected high traffic from your recent email campaign.",
  metrics: [
    { key: "pageSpeed", label: "Page Speed", value: 96, max: 100, delta: "+1.2%", icon: "Gauge" },
    { key: "seoScore", label: "SEO Score", value: 92, max: 100, delta: "+0.8%", icon: "Search" },
    { key: "conversion", label: "Conversion", value: 3.8, unit: "% Rate", delta: "+3.1%", icon: "ShoppingCart" },
  ],
};

export const nextMeeting = {
  title: "Design Review",
  time: "2:00 PM – 3:00 PM EST",
  countdown: "IN 45 MINS",
  joinLabel: "Join Zoom Call",
};

export type ProjectSummary = {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  eta: string;
  ownerInitials: string;
  ownerColor: string;
};

export const currentProjects: ProjectSummary[] = [
  {
    id: "prj-2024-049",
    name: "Holiday Collection Launch",
    subtitle: "Active development sprints",
    progress: 75,
    eta: "ETA: Nov 12",
    ownerInitials: "AK",
    ownerColor: "bg-primary",
  },
  {
    id: "prj-2024-048",
    name: "Checkout Optimization",
    subtitle: "Active development sprints",
    progress: 42,
    eta: "ETA: Nov 28",
    ownerInitials: "SC",
    ownerColor: "bg-electric-blue",
  },
];

export const recentUpdates = [
  {
    icon: "FileText",
    title: "Updated Design_System_V2.fig",
    meta: "Modified by Alex K. • 2 hours ago",
  },
  {
    icon: "GitMerge",
    title: "Merged Pull Request #412",
    meta: "Fix: Checkout redirect loop • 5 hours ago",
  },
  {
    icon: "Image",
    title: "Hero_Banner_Draft.png uploaded",
    meta: "Uploaded by Design Team • Yesterday",
  },
];

export type SupportTicketPreview = {
  id: string;
  title: string;
  priority: "Urgent" | "Standard" | "Normal" | "High";
  updated: string;
};

export const openTicketsPreview: SupportTicketPreview[] = [
  { id: "TP-1082", title: "Checkout API Latency", priority: "Urgent", updated: "Last updated: 14m ago" },
  { id: "TP-1095", title: "Add Gift Wrap Option", priority: "Standard", updated: "Last updated: 3h ago" },
];

export const storeSpotlight = {
  label: "Store View",
  name: "Madison Ave Flagship",
  brand: "AURUM",
};

/* ---------------- Sidebar / Shell ---------------- */

export const portalNav = [
  { label: "Dashboard", href: "/portal/dashboard", icon: "LayoutDashboard" },
  { label: "Projects", href: "/portal/projects", icon: "FolderKanban" },
  { label: "Support", href: "/portal/support", icon: "LifeBuoy" },
  { label: "Meetings", href: "/portal/meetings", icon: "CalendarClock" },
  { label: "Files", href: "/portal/files", icon: "Folder" },
  { label: "Invoices", href: "/portal/invoices", icon: "FileSpreadsheet" },
  { label: "Knowledge Base", href: "/portal/knowledge-base", icon: "BookOpen" },
  { label: "Store Health", href: "/portal/store-health", icon: "ShieldCheck" },
  { label: "Team", href: "/portal/team", icon: "Users" },
];

/* ---------------- Project Details ---------------- */

export type Milestone = {
  key: string;
  title: string;
  status: "done" | "current" | "upcoming";
  meta: string;
};

export type ProjectTask = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  assigneeInitials: string;
  due: string;
  done: boolean;
};

export type SharedFile = {
  id: string;
  name: string;
  size: string;
  sharedMeta: string;
  type: "image" | "doc";
};

export type ProjectDetail = {
  id: string;
  code: string;
  status: string;
  name: string;
  description: string;
  stagingStatus: string;
  productionEta: string;
  milestones: Milestone[];
  overallHealth: string;
  healthProgress: number;
  tasks: ProjectTask[];
  totalTasks: number;
  sharedFiles: SharedFile[];
  uptime: string;
  latencyShift: string;
  performanceBars: number[];
};

export const projects: ProjectDetail[] = [
  {
    id: "prj-2024-048",
    code: "PRJ-2024-048",
    status: "In Progress",
    name: "Q4 Scale & Revenue Optimization",
    description:
      "Enterprise-level infrastructure scaling and dynamic revenue funnel optimization for the global marketplace rollout.",
    stagingStatus: "Live",
    productionEta: "T-Minus 2 Days",
    overallHealth: "Excellent",
    healthProgress: 88,
    uptime: "99.98%",
    latencyShift: "+4.2ms",
    performanceBars: [40, 55, 35, 80, 95, 45, 30],
    milestones: [
      { key: "discovery", title: "Discovery", status: "done", meta: "Completed Oct 12" },
      { key: "strategy", title: "Strategy", status: "done", meta: "Completed Oct 28" },
      { key: "design", title: "Design", status: "current", meta: "Current Phase • 85%" },
      { key: "development", title: "Development", status: "upcoming", meta: "Estimated Start Nov 15" },
    ],
    tasks: [
      { id: "t1", title: "Finalize Checkout flow design for mobile", priority: "High", assigneeInitials: "AK", due: "Nov 04", done: true },
      { id: "t2", title: "Optimize SVG assets for production build", priority: "Medium", assigneeInitials: "SC", due: "Nov 05", done: true },
      { id: "t3", title: "Review SEO schema markup for landing pages", priority: "Low", assigneeInitials: "MK", due: "Nov 08", done: false },
      { id: "t4", title: "API Documentation handoff to Frontend team", priority: "High", assigneeInitials: "SC", due: "Nov 04", done: true },
    ],
    totalTasks: 42,
    sharedFiles: [
      { id: "f1", name: "Checkout_Redesign_Final.fig", size: "24.5 MB", sharedMeta: "Shared 2h ago", type: "image" },
      { id: "f2", name: "Revenue_Projection_Q4.pdf", size: "1.2 MB", sharedMeta: "Shared yesterday", type: "doc" },
    ],
  },
  {
    id: "prj-2024-049",
    code: "PRJ-2024-049",
    status: "In Progress",
    name: "Holiday Collection Launch",
    description:
      "Seasonal storefront theming, bundle merchandising, and paid-traffic landing pages for the Q4 holiday push.",
    stagingStatus: "Live",
    productionEta: "T-Minus 9 Days",
    overallHealth: "Good",
    healthProgress: 75,
    uptime: "99.95%",
    latencyShift: "+2.1ms",
    performanceBars: [30, 60, 50, 70, 65, 55, 40],
    milestones: [
      { key: "discovery", title: "Discovery", status: "done", meta: "Completed Sep 30" },
      { key: "strategy", title: "Strategy", status: "done", meta: "Completed Oct 10" },
      { key: "design", title: "Design", status: "done", meta: "Completed Oct 22" },
      { key: "development", title: "Development", status: "current", meta: "Current Phase • 75%" },
    ],
    tasks: [
      { id: "t1", title: "Build holiday hero + collection banners", priority: "High", assigneeInitials: "AK", due: "Nov 10", done: true },
      { id: "t2", title: "Configure bundle discount logic", priority: "High", assigneeInitials: "SC", due: "Nov 11", done: false },
      { id: "t3", title: "QA gift-wrap upsell on cart drawer", priority: "Medium", assigneeInitials: "MK", due: "Nov 12", done: false },
    ],
    totalTasks: 18,
    sharedFiles: [
      { id: "f1", name: "Holiday_Hero_Draft.png", size: "8.1 MB", sharedMeta: "Shared 5h ago", type: "image" },
    ],
  },
];

/* ---------------- Support Tickets ---------------- */

export type Ticket = {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Normal";
  domain: string;
  assignee?: { name: string; initials: string };
  unassigned?: boolean;
  comments?: number;
  attachments?: number;
  updated?: string;
  progress?: number;
  status?: string;
};

export const ticketColumns: { key: string; title: string; dotColor: string; tickets: Ticket[] }[] = [
  {
    key: "todo",
    title: "To Do",
    dotColor: "bg-on-surface-variant",
    tickets: [
      {
        id: "TP-1082",
        title: "API Rate Limit exceeding during checkout sync",
        priority: "Urgent",
        domain: "store.luxury-goods.co",
        assignee: { name: "Arjun V.", initials: "AV" },
        comments: 12,
        attachments: 3,
      },
      {
        id: "TP-1095",
        title: "Implement Web3 wallet auth on mobile dashboard",
        priority: "High",
        domain: "app.techparivar.io",
        unassigned: true,
        updated: "2d ago",
      },
    ],
  },
  {
    key: "in-progress",
    title: "In Progress",
    dotColor: "bg-electric-blue",
    tickets: [
      {
        id: "TP-1044",
        title: "Database migration to AWS Aurora serverless",
        priority: "Normal",
        domain: "db.infrastructure.net",
        assignee: { name: "Liam K.", initials: "LK" },
        progress: 60,
      },
    ],
  },
  {
    key: "qa-review",
    title: "QA Review",
    dotColor: "bg-primary",
    tickets: [
      {
        id: "TP-1077",
        title: "Global search indexing latency issues",
        priority: "High",
        domain: "core-api.prod.cloud",
        assignee: { name: "Sarah M.", initials: "SM" },
        status: "Reviewing",
      },
    ],
  },
];

export const ticketTeamAvatars = ["AV", "LK", "SM", "MK"];

/* ---------------- Files / Invoices / Team ---------------- */

export type FileItem = {
  id: string;
  name: string;
  size: string;
  updated: string;
  type: "figma" | "pdf" | "image" | "code" | "sheet";
  project: string;
};

export const fileLibrary: FileItem[] = [
  { id: "fl1", name: "Design_System_V2.fig", size: "24.5 MB", updated: "2 hours ago", type: "figma", project: "Q4 Scale & Revenue Optimization" },
  { id: "fl2", name: "Revenue_Projection_Q4.pdf", size: "1.2 MB", updated: "Yesterday", type: "pdf", project: "Q4 Scale & Revenue Optimization" },
  { id: "fl3", name: "Hero_Banner_Draft.png", size: "8.1 MB", updated: "2 days ago", type: "image", project: "Holiday Collection Launch" },
  { id: "fl4", name: "Checkout_Redesign_Final.fig", size: "24.5 MB", updated: "3 days ago", type: "figma", project: "Q4 Scale & Revenue Optimization" },
  { id: "fl5", name: "Brand_Guidelines_2024.pdf", size: "4.6 MB", updated: "1 week ago", type: "pdf", project: "General" },
  { id: "fl6", name: "checkout-api-handoff.zip", size: "980 KB", updated: "1 week ago", type: "code", project: "Q4 Scale & Revenue Optimization" },
  { id: "fl7", name: "Holiday_SKU_Mapping.xlsx", size: "620 KB", updated: "2 weeks ago", type: "sheet", project: "Holiday Collection Launch" },
];

export type Invoice = {
  id: string;
  number: string;
  project: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  issued: string;
  due: string;
};

export const invoices: Invoice[] = [
  { id: "inv1", number: "INV-2024-081", project: "Q4 Scale & Revenue Optimization", amount: "$18,400.00", status: "Pending", issued: "Oct 28, 2024", due: "Nov 12, 2024" },
  { id: "inv2", number: "INV-2024-076", project: "Holiday Collection Launch", amount: "$9,200.00", status: "Paid", issued: "Oct 05, 2024", due: "Oct 20, 2024" },
  { id: "inv3", number: "INV-2024-070", project: "Checkout Optimization", amount: "$6,750.00", status: "Paid", issued: "Sep 14, 2024", due: "Sep 29, 2024" },
  { id: "inv4", number: "INV-2024-061", project: "Retainer — September", amount: "$3,000.00", status: "Overdue", issued: "Sep 01, 2024", due: "Sep 15, 2024" },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  online: boolean;
};

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Alex Kim", role: "Lead Engineer", initials: "AK", online: true },
  { id: "tm2", name: "Sarah Chen", role: "Solutions Architect", initials: "SC", online: true },
  { id: "tm3", name: "Maya Kapoor", role: "UX Designer", initials: "MK", online: false },
  { id: "tm4", name: "Liam King", role: "DevOps Engineer", initials: "LK", online: true },
  { id: "tm5", name: "Arjun Verma", role: "QA Engineer", initials: "AV", online: false },
];

/* ---------------- Meetings ---------------- */

export type Meeting = {
  id: string;
  title: string;
  type: "Design Review" | "Sprint Planning" | "Strategy Sync" | "QA Walkthrough";
  date: string;
  time: string;
  duration: string;
  attendees: { name: string; initials: string }[];
  joinUrl: string;
  status: "upcoming" | "past";
};

export const meetings: Meeting[] = [
  {
    id: "mt1",
    title: "Design Review — Checkout Redesign",
    type: "Design Review",
    date: "Today",
    time: "2:00 PM – 3:00 PM EST",
    duration: "60 min",
    attendees: [
      { name: "Alex Kim", initials: "AK" },
      { name: "Sarah Chen", initials: "SC" },
      { name: "Maya Kapoor", initials: "MK" },
    ],
    joinUrl: "#",
    status: "upcoming",
  },
  {
    id: "mt2",
    title: "Q4 Sprint Planning",
    type: "Sprint Planning",
    date: "Nov 06",
    time: "10:00 AM – 10:45 AM EST",
    duration: "45 min",
    attendees: [
      { name: "Alex Kim", initials: "AK" },
      { name: "Liam King", initials: "LK" },
    ],
    joinUrl: "#",
    status: "upcoming",
  },
  {
    id: "mt3",
    title: "Monthly Strategy Sync",
    type: "Strategy Sync",
    date: "Nov 10",
    time: "3:30 PM – 4:00 PM EST",
    duration: "30 min",
    attendees: [
      { name: "Sarah Chen", initials: "SC" },
      { name: "Arjun Verma", initials: "AV" },
    ],
    joinUrl: "#",
    status: "upcoming",
  },
  {
    id: "mt4",
    title: "Holiday Launch QA Walkthrough",
    type: "QA Walkthrough",
    date: "Oct 24",
    time: "1:00 PM – 1:30 PM EST",
    duration: "30 min",
    attendees: [
      { name: "Maya Kapoor", initials: "MK" },
      { name: "Arjun Verma", initials: "AV" },
    ],
    joinUrl: "#",
    status: "past",
  },
];

/* ---------------- Knowledge Base ---------------- */

export type KnowledgeArticle = {
  id: string;
  title: string;
  category: "Getting Started" | "Billing" | "Store Management" | "Support" | "Development";
  summary: string;
  readTime: string;
  updated: string;
};

export const knowledgeCategories = [
  "All",
  "Getting Started",
  "Store Management",
  "Billing",
  "Support",
  "Development",
] as const;

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb1",
    title: "Welcome to your TechParivar Client Portal",
    category: "Getting Started",
    summary: "A full tour of your dashboard, project workspace, and support tools.",
    readTime: "4 min read",
    updated: "Updated 2 weeks ago",
  },
  {
    id: "kb2",
    title: "How project milestones and health scores work",
    category: "Getting Started",
    summary: "Understand how we track Discovery → Strategy → Design → Development phases.",
    readTime: "3 min read",
    updated: "Updated 3 weeks ago",
  },
  {
    id: "kb3",
    title: "Requesting a theme or app change",
    category: "Store Management",
    summary: "Submit scoped change requests directly from the Support ticket board.",
    readTime: "2 min read",
    updated: "Updated 1 month ago",
  },
  {
    id: "kb4",
    title: "Understanding your Store Health metrics",
    category: "Store Management",
    summary: "What Page Speed, SEO Score, and Conversion Rate mean and how we improve them.",
    readTime: "5 min read",
    updated: "Updated 1 month ago",
  },
  {
    id: "kb5",
    title: "How invoicing and payment terms work",
    category: "Billing",
    summary: "Billing cycles, accepted payment methods, and how to download receipts.",
    readTime: "3 min read",
    updated: "Updated 2 months ago",
  },
  {
    id: "kb6",
    title: "Escalating an urgent production issue",
    category: "Support",
    summary: "When to use the Urgent priority flag and what response times to expect.",
    readTime: "2 min read",
    updated: "Updated 2 months ago",
  },
  {
    id: "kb7",
    title: "Connecting your staging and production environments",
    category: "Development",
    summary: "How our engineers manage staging URLs, environment variables, and go-lives.",
    readTime: "6 min read",
    updated: "Updated 3 months ago",
  },
  {
    id: "kb8",
    title: "Booking and rescheduling meetings",
    category: "Getting Started",
    summary: "Use the Meetings tab to book strategy syncs, reviews, and QA walkthroughs.",
    readTime: "2 min read",
    updated: "Updated 3 months ago",
  },
];

/* ---------------- Notifications ---------------- */

export type Notification = {
  id: string;
  icon: "GitMerge" | "MessageCircle" | "FileText" | "CalendarClock" | "ShieldCheck" | "Receipt";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    icon: "MessageCircle",
    title: "Sarah Chen commented on TP-1082",
    description: "\"Can we get an ETA on the checkout API latency fix?\"",
    time: "14m ago",
    read: false,
  },
  {
    id: "n2",
    icon: "GitMerge",
    title: "Pull Request #412 merged",
    description: "Fix: Checkout redirect loop — deployed to staging.",
    time: "5h ago",
    read: false,
  },
  {
    id: "n3",
    icon: "CalendarClock",
    title: "Meeting reminder",
    description: "Design Review starts in 45 minutes.",
    time: "Today",
    read: false,
  },
  {
    id: "n4",
    icon: "FileText",
    title: "New file shared",
    description: "Hero_Banner_Draft.png was uploaded to Holiday Collection Launch.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    icon: "Receipt",
    title: "Invoice INV-2024-081 issued",
    description: "$18,400.00 due Nov 12, 2024.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n6",
    icon: "ShieldCheck",
    title: "Store health check complete",
    description: "LUXE-SHOP scored 96/100 on this week's performance audit.",
    time: "5 days ago",
    read: true,
  },
];
