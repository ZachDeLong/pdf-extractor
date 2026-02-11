import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium italic transition-all duration-200 cursor-pointer disabled:cursor-default disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-warm text-white hover:bg-accent-warm-hover hover:-translate-y-px hover:shadow-lg hover:shadow-accent-warm/25 active:translate-y-0 active:scale-[0.99] active:shadow-none disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:bg-text-muted",
        ghost:
          "bg-bg-surface border border-border-default text-text-muted hover:border-accent-warm hover:text-accent-warm hover:-translate-y-px active:translate-y-0 active:scale-[0.99]",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        default: "px-4 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
