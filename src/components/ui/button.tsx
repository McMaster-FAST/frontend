import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-poppins text-md font-medium transition-all hover:cursor-pointer disabled:text-disabled-secondary disabled:pointer-events-none focus-visible:ring-ring/30 focus-visible:ring-primary/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-foreground disabled:bg-disabled-primary",
        secondary:

          "bg-secondary text-secondary-foreground shadow-[inset_0_0_0_2px_var(--color-secondary-foreground)] hover:bg-secondary-hover hover:text-background disabled:bg-disabled-primary disabled:shadow-[inset_0_0_0_2px_var(--color-disabled-secondary)]",
        tertiary:
          "hover:bg-tertiary text-tertiary-foreground hover:text-tertiary-hover-foreground focus-visible:ring-0"
      }
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconOnly?: boolean;
}

function Button({
  className,
  variant,
  asChild = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconOnly = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const strokeWidth = 3;
  return (
    <Comp
      data-slot="button"
      className={cn(
          iconOnly ? "p-3" : "px-6 py-3",
        buttonVariants({ variant, className })
      )}
      {...props}
    >
      {LeftIcon && <LeftIcon strokeWidth={strokeWidth} />}
      {children}
      {RightIcon && <RightIcon strokeWidth={strokeWidth} />}
      {variant === "tertiary" && (
        <ArrowRight
          className={!props.disabled ? "text-tertiary-hover-foreground" : ""}
          strokeWidth={strokeWidth}
        />
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
