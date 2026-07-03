"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "border border-white/90 bg-gradient-to-b from-[#f6fbff] to-[#dbe7f6] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),6px_6px_12px_rgba(148,163,184,0.28),-4px_-4px_10px_rgba(255,255,255,0.95)] hover:brightness-[1.02]",
  secondary:
    "border border-white/90 bg-gradient-to-b from-[#ffffff] to-[#edf3fb] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),4px_4px_10px_rgba(148,163,184,0.22),-3px_-3px_8px_rgba(255,255,255,0.92)] hover:brightness-[1.01]",
  outline:
    "border border-slate-200 bg-[#f1f5fb] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(148,163,184,0.12)] hover:bg-[#e8eef8]",
  ghost: "text-slate-700 hover:bg-white/60",
  danger:
    "border border-red-200 bg-gradient-to-b from-[#ffe9e9] to-[#ffd7d7] text-red-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),5px_5px_11px_rgba(248,113,113,0.2),-4px_-4px_10px_rgba(255,255,255,0.95)] hover:brightness-[1.01]",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
