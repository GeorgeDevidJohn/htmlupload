import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-white/90 bg-gradient-to-b from-[#f9fbff] to-[#ebf1fa] px-3 py-2 text-sm text-slate-700",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        "shadow-[inset_0_2px_4px_rgba(148,163,184,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
