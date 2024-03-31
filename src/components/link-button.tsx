import Link from "next/link";
import { buttonVariants, type buttonVariantTypes } from "./button";
import { cn } from "~/utils/cn";

const LinkButton: React.FC<
  React.PropsWithChildren<{
    href: string;
    external?: boolean;
    variant?: buttonVariantTypes;
  }>
> = ({ href, variant = "primary", external = false, children }) => {
  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      className={cn(
        "rounded px-4 py-2 transition-all hover:scale-[1.02] hover:brightness-[0.98] active:scale-100 active:brightness-105",
        buttonVariants[variant],
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
