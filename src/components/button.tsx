import { forwardRef } from "react";
import { cn } from "~/utils/cn";

export type buttonVariantTypes =
  | "primary"
  | "secondary"
  | "accent"
  | "gray"
  | "blank";
export const buttonVariants: {
  primary: string;
  secondary: string;
  accent: string;
  gray: string;
  blank: string;
} = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  gray: "bg-[#DDDDDD]",
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
          "rounded-lg px-4 py-2 transition-all enabled:hover:scale-[1.02] enabled:hover:brightness-[0.98] enabled:active:scale-100 enabled:active:brightness-105",
          disabled ? buttonVariants.gray : buttonVariants[variant],
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

export default Button;
