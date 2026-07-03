"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/90",
        "bg-gradient-to-b from-[#f8fbff] to-[#e4ecf8] shadow-[inset_0_1px_2px_rgba(148,163,184,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all outline-none",
        "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-[#d6f3ff] data-[state=checked]:to-[#b6e4ff]",
        "focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-gradient-to-b from-[#ffffff] to-[#e7eef9] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),2px_2px_6px_rgba(148,163,184,0.35)] ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitives.Root>
  );
}
