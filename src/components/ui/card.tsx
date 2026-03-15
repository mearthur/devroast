import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const cardRootVariants = cva(
  "border border-border-primary p-5 flex flex-col gap-3 bg-transparent",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default";
}

export const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        className={cardRootVariants({ variant, className })}
        ref={ref}
        style={{ width: 480 }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardRoot.displayName = "CardRoot";

const cardTitleVariants = cva("font-mono text-sm text-text-primary", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "default";
}

export const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <p className={cardTitleVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </p>
    );
  }
);

CardTitle.displayName = "CardTitle";

const cardDescVariants = cva(
  "font-['IBM_Plex_Mono'] text-xs text-text-secondary leading-6 w-full",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "default";
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <p className={cardDescVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";
