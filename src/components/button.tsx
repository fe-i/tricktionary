import { forwardRef } from "react";
import { cn } from "~/utils/cn";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "gray";
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ children, className = "", variant = "primary", ...buttonProps }, ref) => {
  const variants: {
    primary: string;
    secondary: string;
    accent: string;
    gray: string;
  } = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    gray: "bg-gray-[#DDDDDD]",
  };
  return (
    <button
      className={cn("rounded px-4 py-2", variants[variant], className)}
      {...buttonProps}
      ref={ref}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
