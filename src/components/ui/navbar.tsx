import { cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const navbarVariants = cva("flex items-center border-b border-border-primary w-full", {
  variants: {
    variant: {
      default: "bg-bg-page",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const logoTextVariants = cva("font-mono", {
  variants: {
    part: {
      prompt: "text-accent-green text-xl font-bold",
      name: "text-text-primary text-lg font-medium",
    },
  },
});

const linkVariants = cva("font-mono text-sm transition-colors", {
  variants: {
    active: {
      true: "text-text-primary",
      false: "text-text-secondary",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default";
}

export interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <nav
        className={navbarVariants({ variant, className })}
        ref={ref}
        style={{ height: 56, padding: "0 40px" }}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

export function NavbarLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className={logoTextVariants({ part: "prompt" })}>{">"}</span>
      <span className={logoTextVariants({ part: "name" })}>devroast</span>
    </div>
  );
}

export function NavbarLink({ href, children, active = false }: NavbarLinkProps) {
  return (
    <a href={href} className={linkVariants({ active })}>
      {children}
    </a>
  );
}

export function NavbarSpacer() {
  return <div className="h-1 flex-1" />;
}
