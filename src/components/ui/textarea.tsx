import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-white/90 bg-gradient-to-b from-[#f9fbff] to-[#ebf1fa] px-3 py-2 text-sm text-slate-700",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        "shadow-[inset_0_2px_5px_rgba(148,163,184,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
