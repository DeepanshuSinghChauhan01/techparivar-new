import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-display ${className ?? ""}`}
      aria-label="TechParivar home"
    >
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-accent-blue">
        <span className="absolute inset-0 rounded-lg bg-accent-blue blur-[6px] opacity-50 transition-opacity group-hover:opacity-80" />
        <span className="relative font-display text-[15px] font-bold text-[#06090f]">
          <img
            src="/techparivarlogo.png"
            alt="TechParivar Logo"
            className="h-10 w-auto"
          />
        </span>
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-text-primary sm:text-[17px]">
        TechParivar
      </span>
    </Link>
  );
}
