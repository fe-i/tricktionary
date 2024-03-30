import { cn } from "~/utils/cn";

const Modal: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-modal absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-md px-8 py-7 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
