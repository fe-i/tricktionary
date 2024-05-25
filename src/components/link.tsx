import { forwardRef } from "react";
import { cn } from "~/utils/cn";
import { UnderlineHover } from "./underline-hover";
import NextLink from "next/link";

export type linkVariantTypes =
  | "underlined"
  | "underlineOnHover"
  | "getBolder"
  | "blank";
export const linkVariants: {
  underlined: string;
  underlineOnHover: string;
  getBolder: string;
  blank: string;
} = {
  underlined: "underline",
  underlineOnHover: "",
  getBolder: "font-normal hover:font-semibold",
  blank: "",
};

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  variant?: linkVariantTypes;
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  ({ children, className = "", variant = "underlined", ...linkProps }, ref) => {
    if (variant === "underlineOnHover") {
      return (
        <UnderlineHover>
          <NextLink
            className={cn(
              "text-text transition-all",
              linkVariants[variant],
              className,
            )}
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
          linkVariants[variant],
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
