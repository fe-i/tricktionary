import { forwardRef } from "react";
import { cn } from "~/utils/cn";
import { UnderlineHover } from "./underline-hover";
import NextLink from "next/link";

export type linkVariantTypes = "underlineOnHover" | "getBolder" | "blank";

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  variant?: linkVariantTypes;
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (
    { children, className = "", variant = "underlineOnHover", ...linkProps },
    ref,
  ) => {
    if (variant === "underlineOnHover") {
      return (
        <UnderlineHover>
          <NextLink
            className={cn("text-text transition-all", className)}
            {...linkProps}
            ref={ref}
          >
            {children}
          </NextLink>
        </UnderlineHover>
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
