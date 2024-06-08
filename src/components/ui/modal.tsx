import { forwardRef } from "react";
import { cn } from "~/utils/cn";

const Modal = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ className = "", children }, ref) => (
  <div className="absolute left-0 top-0 flex min-h-screen w-screen items-center justify-center">
    <div
      ref={ref}
      className={cn(
        "w-[22rem] rounded-lg bg-modal px-10 py-6 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  </div>
));

Modal.displayName = "Modal";

export { Modal };
