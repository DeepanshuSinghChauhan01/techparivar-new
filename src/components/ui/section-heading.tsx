import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border-default bg-card px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-accent-teal",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-accent-teal" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem]",
          align === "center" && "max-w-2xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg",
            align === "center" && "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
