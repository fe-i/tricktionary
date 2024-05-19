import { forwardRef } from "react";
import { cn } from "~/utils/cn";

const Modal = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ className = "", children }, ref) => (
  <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-background px-12 py-9 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  </div>
));
Modal.displayName = "Modal";

export default Modal;
