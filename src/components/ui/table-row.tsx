import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const tableRowRootVariants = cva("flex items-center w-full border-b border-border-primary", {
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
      sm: "w-10",
      default: "w-10",
      lg: "w-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface TableRowRankProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
}

export const TableRowRank = forwardRef<HTMLSpanElement, TableRowRankProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    return (
      <span className={rankCellVariants({ size, className })} ref={ref} {...props}>
        <span className="font-mono text-[13px] text-text-tertiary">{children}</span>
      </span>
    );
  }
);

TableRowRank.displayName = "TableRowRank";

const scoreCellVariants = cva("", {
  variants: {
    size: {
      sm: "w-14",
      default: "w-15",
      lg: "w-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const scoreColorVariants = cva("", {
  variants: {
    scoreVariant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
    },
  },
  defaultVariants: {
    scoreVariant: "good",
  },
});

export interface TableRowScoreProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
  variant?: "good" | "warning" | "critical";
}

export const TableRowScore = forwardRef<HTMLSpanElement, TableRowScoreProps>(
  ({ className, size = "default", variant = "good", children, ...props }, ref) => {
    return (
      <span className={scoreCellVariants({ size, className })} ref={ref} {...props}>
        <span
          className={`font-mono text-[13px] font-bold ${scoreColorVariants({ scoreVariant: variant })}`}
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

export const TableRowCode = forwardRef<HTMLSpanElement, TableRowCodeProps>(
  ({ className, truncate = true, children, ...props }, ref) => {
    return (
      <span className={codeCellVariants({ truncate, className })} ref={ref} {...props}>
        <span className="font-mono text-xs text-text-secondary">{children}</span>
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
        <span className="font-mono text-xs text-text-tertiary">{children}</span>
      </span>
    );
  }
);

TableRowLang.displayName = "TableRowLang";

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rank";
  rank?: string;
  score?: string | number;
  scoreVariant?: "good" | "warning" | "critical";
  codePreview?: string;
  language?: string;
  size?: "sm" | "default" | "lg";
  truncate?: boolean;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  (
    {
      className,
      variant = "rank",
      rank = "#1",
      score,
      scoreVariant = "good",
      codePreview,
      language = "javascript",
      size = "default",
      truncate = true,
      ...props
    },
    ref
  ) => {
    return (
      <div className={tableRowRootVariants({ variant, className })} ref={ref} {...props}>
        <TableRowRank size={size}>{rank}</TableRowRank>
        <TableRowScore size={size} variant={scoreVariant}>
          {score}
        </TableRowScore>
        <TableRowCode truncate={truncate}>{codePreview}</TableRowCode>
        <TableRowLang size={size}>{language}</TableRowLang>
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
