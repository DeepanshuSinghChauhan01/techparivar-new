import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-blue text-[#06090f] hover:bg-accent-blue-bright shadow-[0_0_0_1px_rgba(91,141,239,0.4),0_8px_24px_-8px_rgba(91,141,239,0.5)]",
  secondary:
    "bg-card text-text-primary border border-border-default hover:border-accent-blue/60 hover:bg-card-hover",
  ghost: "bg-transparent text-text-primary hover:bg-card",
  outline:
    "bg-transparent text-text-primary border border-border-default hover:border-accent-blue/60",
  accent:
    "bg-vibrant-orange text-white hover:bg-vibrant-orange/90 shadow-[0_0_0_1px_rgba(255,92,0,0.4),0_8px_24px_-8px_rgba(255,92,0,0.55)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium font-display transition-all duration-200 sm:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-blue";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  showArrow,
  href,
  ...rest
}: ButtonBaseProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
          {showArrow && <ArrowUpRight className="size-4" />}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
        {showArrow && <ArrowUpRight className="size-4" />}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
      {showArrow && <ArrowUpRight className="size-4" />}
    </button>
  );
}
