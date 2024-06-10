import { forwardRef } from "react";
import { cn } from "~/utils/cn";
import NextLink from "next/link";

export type linkVariantTypes = "standard" | "getBolder";

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  variant?: linkVariantTypes;
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  ({ children, className = "", variant = "standard", ...linkProps }, ref) => {
    if (variant === "standard") {
      return (
        <NextLink
          className={cn(
            "text-blue-700 underline-offset-2 transition-all hover:underline",
            className,
          )}
          {...linkProps}
          ref={ref}
        >
          {children}
        </NextLink>
      );
    }

    return (
      <NextLink
        className={cn(
          "text-text transition-all",
          variant === "getBolder" ? "font-normal hover:font-semibold" : "",
          className,
        )}
        {...linkProps}
        ref={ref}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = "Link";

export { Link };
