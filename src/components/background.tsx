import useWindowSize from "~/utils/use-window-size";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

const Background: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {new Array(10).fill(0).map((_, i) => (
        <Circle key={`circle-#${i}`} />
      ))}
    </div>
  );
};

export default Background;

const Circle: React.FC = () => {
  const { windowSize } = useWindowSize();
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(0);
  const [slope, setSlope] = useState(1);
  const diameter = useRef(100 + Math.random() * 200);

  const progress = useMotionValue(-1000);
  const y_val = useTransform(progress, (x) => (x - x0) * slope + y0);

  const dir = Math.random() < 0.5 ? -2000 : 2000;

  void animate(progress, dir, {
    duration: 2000,
  });

  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      const x = Math.random() * windowSize.width;
      const y = Math.random() * windowSize.height;
      setX0(x);
      setY0(y);
      progress.set(x);
      let m;
      do {
        m = Math.random() * 2 - 1;
      } while (
        !intersects(
          x,
          y,
          -m,
          windowSize as {
            width: number;
            height: number;
          },
        )
      );

      setSlope(m);
    }
  }, [windowSize, progress]);
  return (
    <motion.div
      style={{ x: progress, y: y_val, width: diameter.current }}
      suppressHydrationWarning
      className={cn(
        "absolute aspect-square rounded-full opacity-60",
        Math.random() < 1 / 3
          ? "bg-primary"
          : Math.random() < 0.5
            ? "bg-secondary"
            : "bg-accent",
      )}
    />
  );
};

const intersects = (
  x0: number,
  y0: number,
  m: number,
  windowSize: {
    width: number;
    height: number;
  },
) => {
  const left = windowSize.width / 6;
  const right = left * 5;
  const top = windowSize.height / 6;
  const bottom = top * 5;

  const y = (x: number) => m * (x - x0) + y0;
  const x = (y: number) => (y - y0) / m + x0;

  return (
    (bottom < y(left) && y(left) < top) ||
    (bottom < y(right) && y(right) < top) ||
    (left < x(bottom) && x(bottom) < right) ||
    (left < x(top) && x(top) < right)
  );
};
