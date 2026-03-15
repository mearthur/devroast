"use client";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { useId, useState } from "react";
import { type InputHTMLAttributes, forwardRef } from "react";

const toggleContainerVariants = cva("inline-flex items-center", {
  variants: {},
  defaultVariants: {},
});

const toggleLabelVariants = cva("font-mono text-xs transition-colors cursor-pointer", {
  variants: {
    checked: {
      true: "text-accent-green",
      false: "text-text-secondary",
    },
  },
});

const toggleTrackVariants = cva(
  "relative inline-flex h-[22px] w-[40px] shrink-0 rounded-full p-[3px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page",
  {
    variants: {
      checked: {
        true: "bg-accent-green",
        false: "bg-border-primary",
      },
    },
  }
);

const toggleThumbVariants = cva(
  "h-[16px] w-[16px] rounded-full transition-transform pointer-events-none",
  {
    variants: {
      checked: {
        true: "bg-bg-page translate-x-[18px]",
        false: "bg-text-secondary translate-x-0",
      },
    },
  }
);

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  labelClassName?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    { className, label, labelClassName, defaultChecked, checked, onCheckedChange, id, ...props },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleCheckedChange = (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    const generatedId = useId();
    const toggleId = id || generatedId;

    return (
      <div className={toggleContainerVariants({ className })} style={{ gap: 12 }}>
        <SwitchPrimitives.Root
          className={toggleTrackVariants({ checked: isChecked })}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          id={toggleId}
        >
          <SwitchPrimitives.Thumb className={toggleThumbVariants({ checked: isChecked })} />
        </SwitchPrimitives.Root>
        {label && (
          <label
            htmlFor={toggleId}
            className={toggleLabelVariants({
              checked: isChecked,
              className: labelClassName,
            })}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={(e) => handleCheckedChange(e.target.checked)}
          {...props}
        />
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
