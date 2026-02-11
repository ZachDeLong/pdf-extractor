import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border-default bg-bg-surface px-3.5 py-3 text-[0.95rem] italic text-text-primary placeholder:text-text-muted-light transition-all duration-200 focus:outline-none focus:border-accent-warm focus:ring-3 focus:ring-accent-warm/10",
        className
      )}
      {...props}
    />
  );
}
