"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.section
      className={cn(
        "group rounded-xl text-center flex flex-col items-center justify-center",
        "px-14 py-16 w-full max-w-[620px] mx-auto",
        "bg-white border-dashed border-2 border-zinc-300",
        "transition-[border-color,background-color] duration-300",
        "hover:border-zinc-400 hover:bg-zinc-50/50",
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
    >
      {/* Single icon in a white card with shadow */}
      {icon && (
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-white border border-zinc-200 transition-all duration-300 group-hover:shadow-xl group-hover:border-zinc-300">
            {React.createElement(icon, {
              className: "w-6 h-6 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-700",
            })}
          </div>
        </div>
      )}

      {/* Title + description */}
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action button */}
      {action && (
        <motion.button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium px-4 py-2 border border-zinc-300 bg-white shadow-sm hover:shadow-md hover:bg-zinc-50 text-zinc-700 transition-all duration-200"
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.section>
  );
}
