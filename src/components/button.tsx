import { forwardRef } from "react";
import { cn } from "~/utils/cn";

export type buttonVariantTypes = "primary" | "secondary" | "accent" | "gray";
export const buttonVariants: {
  primary: string;
  secondary: string;
  accent: string;
  gray: string;
} = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  gray: "bg-[#DDDDDD]",
};

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: buttonVariantTypes;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ children, className = "", variant = "primary", ...buttonProps }, ref) => {
  return (
    <button
      className={cn("rounded px-4 py-2", buttonVariants[variant], className)}
      {...buttonProps}
      ref={ref}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
