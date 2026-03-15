import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const tableRowRootVariants = cva("flex items-start w-full border border-border-primary", {
  variants: {
    variant: {
      default: "",
      rank: "py-4 px-5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TableRowRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rank";
}

export const TableRowRoot = forwardRef<HTMLDivElement, TableRowRootProps>(
  ({ className, variant = "rank", children, ...props }, ref) => {
    return (
      <div className={tableRowRootVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

TableRowRoot.displayName = "TableRowRoot";

const rankCellVariants = cva("", {
  variants: {
    size: {
      sm: "w-[40px]",
      default: "w-[50px]",
      lg: "w-[60px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface TableRowRankProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "gold";
}

const rankColorVariants = cva("", {
  variants: {
    variant: {
      default: "text-text-secondary",
      gold: "text-accent-amber",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const TableRowRank = forwardRef<HTMLSpanElement, TableRowRankProps>(
  ({ className, size = "default", variant = "default", children, ...props }, ref) => {
    return (
      <span className={rankCellVariants({ size, className })} ref={ref} {...props}>
        <span className={`pt-0.5 font-mono text-[12px] ${rankColorVariants({ variant })}`}>
          {children}
        </span>
      </span>
    );
  }
);

TableRowRank.displayName = "TableRowRank";

const scoreCellVariants = cva("", {
  variants: {
    size: {
      sm: "w-[60px]",
      default: "w-[70px]",
      lg: "w-[80px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const scoreColorVariants = cva("text-accent-red", {
  variants: {
    scoreVariant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
    },
  },
  defaultVariants: {
    scoreVariant: "critical",
  },
});

export interface TableRowScoreProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
  variant?: "good" | "warning" | "critical";
}

export const TableRowScore = forwardRef<HTMLSpanElement, TableRowScoreProps>(
  ({ className, size = "default", variant = "critical", children, ...props }, ref) => {
    return (
      <span className={scoreCellVariants({ size, className })} ref={ref} {...props}>
        <span
          className={`pt-0.5 font-mono text-[12px] font-bold ${scoreColorVariants({ scoreVariant: variant })}`}
        >
          {children}
        </span>
      </span>
    );
  }
);

TableRowScore.displayName = "TableRowScore";

const codeCellVariants = cva("flex-1", {
  variants: {
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  defaultVariants: {
    truncate: true,
  },
});

export interface TableRowCodeProps extends HTMLAttributes<HTMLSpanElement> {
  truncate?: boolean;
}

export interface TableRowCodeLineProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "comment";
}

const codeLineColorVariants = cva("", {
  variants: {
    variant: {
      default: "text-text-primary",
      comment: "text-[#8B8B8B]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const TableRowCodeLine = forwardRef<HTMLSpanElement, TableRowCodeLineProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span className={codeLineColorVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </span>
    );
  }
);

TableRowCodeLine.displayName = "TableRowCodeLine";

export const TableRowCode = forwardRef<HTMLSpanElement, TableRowCodeProps>(
  ({ className, truncate = true, children, ...props }, ref) => {
    const content = Array.isArray(children) ? children : [children];
    return (
      <span className={codeCellVariants({ truncate, className })} ref={ref} {...props}>
        <span className="flex flex-col gap-3">
          {content.map((child, idx) => {
            const isReactElement = typeof child === "object" && child !== null && "type" in child;
            const contentKey = isReactElement
              ? `react-${idx}`
              : `static-${String(child)
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .slice(0, 8)}`;
            return (
              <span
                key={contentKey}
                className={`whitespace-pre ${isReactElement ? "" : "text-text-primary"}`}
              >
                <span className="font-mono text-[12px]">{child}</span>
              </span>
            );
          })}
        </span>
      </span>
    );
  }
);

TableRowCode.displayName = "TableRowCode";

const langCellVariants = cva("", {
  variants: {
    size: {
      sm: "w-20",
      default: "w-[100px]",
      lg: "w-28",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface TableRowLangProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
}

export const TableRowLang = forwardRef<HTMLSpanElement, TableRowLangProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    return (
      <span className={langCellVariants({ size, className })} ref={ref} {...props}>
        <span className="pt-0.5 font-mono text-[12px] text-text-secondary">{children}</span>
      </span>
    );
  }
);

TableRowLang.displayName = "TableRowLang";

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rank";
  size?: "sm" | "default" | "lg";
  truncate?: boolean;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, variant = "rank", size = "default", truncate = true, children, ...props }, ref) => {
    return (
      <div className={tableRowRootVariants({ variant, className })} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

TableRow.displayName = "TableRow";

export interface TableHeaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const tableHeaderCellVariants = cva("text-text-tertiary font-mono", {
  variants: {
    size: {
      sm: "text-[11px]",
      default: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center h-10 px-5 border-b border-border-primary bg-bg-surface ${className || ""}`}
        {...props}
      >
        <span className={rankCellVariants({ size })}>
          <span className={tableHeaderCellVariants({ size })}>rank</span>
        </span>
        <span className={scoreCellVariants({ size })}>
          <span className={tableHeaderCellVariants({ size })}>score</span>
        </span>
        <span className="flex-1">
          <span className={tableHeaderCellVariants({ size })}>code preview</span>
        </span>
        <span className={langCellVariants({ size })}>
          <span className={tableHeaderCellVariants({ size })}>lang</span>
        </span>
      </div>
    );
  }
);

TableHeader.displayName = "TableHeader";
