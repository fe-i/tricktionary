import { forwardRef } from "react";
import { cn } from "~/utils/cn";

export type buttonVariantTypes =
  | "primary"
  | "secondary"
  | "accent"
  | "gray"
  | "warning"
  | "danger"
  | "blank";

export const buttonVariants: {
  primary: string;
  secondary: string;
  accent: string;
  gray: string;
  warning: string;
  danger: string;
  blank: string;
} = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  gray: "bg-[#cfcfcf]",
  warning: "bg-warning",
  danger: "bg-danger text-white",
  blank: "bg-transparent",
};

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: buttonVariantTypes;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(
  (
    { children, disabled, className = "", variant = "primary", ...buttonProps },
    ref,
  ) => {
    return (
      <button
        className={cn(
          "rounded-lg px-4 py-2 transition-all duration-500 enabled:hover:scale-[1.02] enabled:hover:brightness-[0.98] enabled:active:scale-95 enabled:active:brightness-105",
          disabled ? buttonVariants.gray : buttonVariants[variant],
          disabled ? "cursor-not-allowed" : "",
          className,
        )}
        {...buttonProps}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
