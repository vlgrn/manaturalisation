import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  variant?: "light" | "dark" | "auto";
}

/** Square favicon mark — italic "a" with accent stroke on brand gradient */
export function LogoFavicon({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center overflow-hidden relative",
        className
      )}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        {/* Italic "a" in Instrument Serif style — hand-crafted */}
        <text
          x="32"
          y="48"
          textAnchor="middle"
          fontFamily="var(--font-instrument), 'Instrument Serif', Georgia, serif"
          fontStyle="italic"
          fontSize="46"
          fill="white"
        >
          a
        </text>
        {/* Accent underline stroke — like a pen flourish */}
        <path
          d="M 14,54 C 22,52 40,50 52,54"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

/** Wordmark logo — Instrument Serif: "ad" dark + italic "minds" in brand purple */
export function Logo({ size = "md", href = "/", className, variant = "auto" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-[22px]",
    lg: "text-3xl",
  };

  const content = (
    <span
      className={clsx("tracking-[-0.01em] italic", sizes[size], className)}
      style={{ fontFamily: "var(--font-instrument)" }}
    >
      <span style={{ color: variant === "dark" ? "white" : "black" }}>ad</span>
      <span className="text-indigo-600">minds</span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
