import { cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent-green text-[#0A0A0A] hover:brightness-110",
        outline: "border border-border-primary text-text-primary hover:bg-border-primary",
        link: "border border-border-primary text-text-secondary hover:bg-border-primary hover:text-text-primary",
      },
      size: {
        default: "py-[10px] px-6 text-[13px] font-medium",
        sm: "py-2 px-4 text-xs",
        lg: "py-3 px-8 text-base font-medium",
        icon: "p-2.5",
        outline: "py-2 px-4 text-xs font-normal",
        link: "py-1.5 px-3 text-xs font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariant = "default" | "outline" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "outline" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";
