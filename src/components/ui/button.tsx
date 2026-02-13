import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-poppins text-sm font-medium transition-all hover:cursor-pointer disabled:text-disabled-secondary disabled:pointer-events-none focus:ring-ring/30 focus:ring-primary/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:border-ring focus:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-foreground disabled:bg-disabled-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_0_0_2px_var(--color-secondary-foreground)] hover:bg-secondary-hover hover:text-background disabled:bg-disabled-primary disabled:shadow-[inset_0_0_0_2px_var(--color-disabled-secondary)]",
        tertiary:
          "hover:bg-tertiary text-tertiary-foreground hover:text-tertiary-hover-foreground focus:ring-0",
      },
      size: {
        default:
          "h-8 gap-1.5 px-6 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
      iconOnly: {
        true: "px-3 py-3",
        false: "px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      iconOnly: false,
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  leftClasses?: string;
  rightClasses?: string;
}

function Button({
  className,
  variant,
  size = "default",
  iconOnly,
  asChild = false,
  leftIcon: LeftIcon,
  leftClasses,
  rightClasses,
  rightIcon: RightIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const strokeWidth = 3;
  return (
    <Comp
      data-slot="button"
      data-size={size}
      className={cn(buttonVariants({ variant, iconOnly, className }))}
      {...props}
    >
      {LeftIcon && (
        <LeftIcon strokeWidth={strokeWidth} className={leftClasses} />
      )}
      {children}
      {RightIcon && (
        <RightIcon strokeWidth={strokeWidth} className={rightClasses} />
      )}
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
