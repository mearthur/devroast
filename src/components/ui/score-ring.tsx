"use client";

import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const scoreRingRootVariants = cva("relative inline-flex items-center justify-center", {
  variants: {
    size: {
      default: "h-[180px] w-[180px]",
      sm: "h-[120px] w-[120px]",
      lg: "h-[240px] w-[240px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ScoreRingRootProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
}

export const ScoreRingRoot = forwardRef<HTMLDivElement, ScoreRingRootProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    return (
      <div className={scoreRingRootVariants({ size, className })} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

ScoreRingRoot.displayName = "ScoreRingRoot";

const scoreColorVariants = cva("font-mono text-5xl font-bold leading-none", {
  variants: {
    scoreVariant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
    },
  },
});

export interface ScoreRingValueProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "warning" | "good";
}

export const ScoreRingValue = forwardRef<HTMLSpanElement, ScoreRingValueProps>(
  ({ className, variant = "good", children, ...props }, ref) => {
    return (
      <span
        className={`${scoreColorVariants({ scoreVariant: variant })} ${className || ""}`}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ScoreRingValue.displayName = "ScoreRingValue";

export interface ScoreRingMaxProps extends HTMLAttributes<HTMLSpanElement> {}

export const ScoreRingMax = forwardRef<HTMLSpanElement, ScoreRingMaxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        className={`font-mono text-base text-text-tertiary ${className || ""}`}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ScoreRingMax.displayName = "ScoreRingMax";

export interface ScoreRingSvgProps extends HTMLAttributes<SVGSVGElement> {
  size?: "default" | "sm" | "lg";
}

export const ScoreRingSvg = forwardRef<SVGSVGElement, ScoreRingSvgProps>(
  ({ className, size = "default", ...props }, ref) => {
    const svgSize = size === "sm" ? 120 : size === "lg" ? 240 : 180;

    return (
      <svg
        ref={ref}
        className={`absolute inset-0 -rotate-90 ${className || ""}`}
        width={svgSize}
        height={svgSize}
        viewBox="0 0 180 180"
        role="img"
        {...props}
      >
        <title>Score Ring</title>
        <circle
          cx="90"
          cy="90"
          r={88}
          fill="none"
          className="stroke-border-primary"
          strokeWidth={4}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="35%" stopColor="var(--color-accent-amber)" />
            <stop offset="36%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
);

ScoreRingSvg.displayName = "ScoreRingSvg";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
  size?: "default" | "sm" | "lg";
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, size = "default", ...props }, ref) => {
    const getScoreVariant = () => {
      if (score <= 3) return "critical";
      if (score <= 6) return "warning";
      return "good";
    };

    const percentage = (score / maxScore) * 100;
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const strokeWidth = 4;
    const scoreVariant = getScoreVariant();

    return (
      <div className={scoreRingRootVariants({ size, className })} ref={ref} {...props}>
        <svg
          className="absolute inset-0 -rotate-90"
          width={size === "sm" ? 120 : size === "lg" ? 240 : 180}
          height={size === "sm" ? 120 : size === "lg" ? 240 : 180}
          viewBox="0 0 180 180"
          role="img"
          aria-label={`Score ${score} out of ${maxScore}`}
        >
          <title>Score Ring</title>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            className="stroke-border-primary"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-green)" />
              <stop offset="35%" stopColor="var(--color-accent-amber)" />
              <stop offset="36%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-center">
          <span className={scoreColorVariants({ scoreVariant })}>{score.toFixed(1)}</span>
          <span className="font-mono text-base text-text-tertiary">/{maxScore}</span>
        </div>
      </div>
    );
  }
);

ScoreRing.displayName = "ScoreRing";
