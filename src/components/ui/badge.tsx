import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const badgeRootVariants = cva("inline-flex items-center gap-2 font-mono text-xs", {
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-accent-red text-sm",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

export interface BadgeRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "critical" | "warning" | "good" | "verdict";
}

export const BadgeRoot = forwardRef<HTMLDivElement, BadgeRootProps>(
  ({ className, variant = "good", children, ...props }, ref) => {
    return (
      <div className={badgeRootVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

BadgeRoot.displayName = "BadgeRoot";

const dotVariants = cva("rounded-full", {
  variants: {
    variant: {
      critical: "bg-accent-red h-2 w-2",
      warning: "bg-accent-amber h-2 w-2",
      good: "bg-accent-green h-2 w-2",
      verdict: "bg-accent-red h-2 w-2",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

export interface BadgeDotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "warning" | "good" | "verdict";
}

export const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(
  ({ className, variant = "good", ...props }, ref) => {
    return <span className={dotVariants({ variant, className })} ref={ref} {...props} />;
  }
);

BadgeDot.displayName = "BadgeDot";

export interface BadgeContentProps extends HTMLAttributes<HTMLSpanElement> {}

export const BadgeContent = forwardRef<HTMLSpanElement, BadgeContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span className={className} ref={ref} {...props}>
        {children}
      </span>
    );
  }
);

BadgeContent.displayName = "BadgeContent";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "critical" | "warning" | "good" | "verdict";
  showDot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "good", showDot = true, children, ...props }, ref) => {
    return (
      <div className={badgeRootVariants({ variant, className })} ref={ref} {...props}>
        {showDot && <span className={dotVariants({ variant })} />}
        <span>{children}</span>
      </div>
    );
  }
);

Badge.displayName = "Badge";
