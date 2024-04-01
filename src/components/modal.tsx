import { cn } from "~/utils/cn";

const Modal: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-background absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg px-12 py-9 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
