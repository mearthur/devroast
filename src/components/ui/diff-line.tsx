import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const diffLineRootVariants = cva("inline-flex font-mono text-sm w-full px-4 py-2 gap-2", {
  variants: {
    variant: {
      removed: "bg-diff-removed",
      added: "bg-diff-added",
      context: "",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export interface DiffLineRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "removed" | "added" | "context";
}

export const DiffLineRoot = forwardRef<HTMLDivElement, DiffLineRootProps>(
  ({ className, variant = "context", children, ...props }, ref) => {
    return (
      <div className={diffLineRootVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

DiffLineRoot.displayName = "DiffLineRoot";

const prefixVariants = cva("w-auto shrink-0", {
  variants: {
    variant: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export interface DiffLinePrefixProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "removed" | "added" | "context";
}

export const DiffLinePrefix = forwardRef<HTMLSpanElement, DiffLinePrefixProps>(
  ({ className, variant = "context", children, ...props }, ref) => {
    return (
      <span className={prefixVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </span>
    );
  }
);

DiffLinePrefix.displayName = "DiffLinePrefix";

const codeVariants = cva("", {
  variants: {
    variant: {
      removed: "text-text-secondary",
      added: "text-text-primary",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export interface DiffLineCodeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "removed" | "added" | "context";
}

export const DiffLineCode = forwardRef<HTMLSpanElement, DiffLineCodeProps>(
  ({ className, variant = "context", children, ...props }, ref) => {
    return (
      <span className={codeVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </span>
    );
  }
);

DiffLineCode.displayName = "DiffLineCode";

export interface DiffLineProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "removed" | "added" | "context";
  code: string;
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, variant = "context", code, ...props }, ref) => {
    const displayPrefix = variant === "context" ? " " : variant === "removed" ? "-" : "+";

    return (
      <div className={diffLineRootVariants({ variant, className })} ref={ref} {...props}>
        <span className={prefixVariants({ variant })}>{displayPrefix}</span>
        <span className={codeVariants({ variant })}>{code}</span>
      </div>
    );
  }
);

DiffLine.displayName = "DiffLine";
