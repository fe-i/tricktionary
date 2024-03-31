import { cn } from "~/utils/cn";

const UnderlineHover: React.FC<
  React.PropsWithChildren<{
    variant?: "ltol" | "ltor";
    thin?: boolean;
    disabled?: boolean;
  }>
> = ({ variant = "ltor", thin = false, disabled = false, children }) => {
  return (
    <div
      className={cn(
        "relative",
        "after:bg-text after:absolute after:bottom-0 after:left-0 after:w-full after:scale-x-0 after:transition-transform",
        !disabled &&
          "hover:after:origin-left hover:after:scale-x-100 group-hover/box:after:origin-left group-hover/box:after:scale-x-100",
        thin ? "after:h-[1px]" : "after:h-[2px]",
        variant === "ltol" ? "after:origin-left" : "after:origin-right",
      )}
    >
      {children}
    </div>
  );
};

export default UnderlineHover;
