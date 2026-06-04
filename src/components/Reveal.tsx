import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & { delay?: number; children: ReactNode };

export function Reveal({ delay = 0, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, type: "spring", stiffness: 120, damping: 18 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span ref={ref}>
      {inView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Counter to={to} duration={duration} />
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
}

function Counter({ to, duration }: { to: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      onUpdate={(latest) => {
        if (ref.current && typeof latest.opacity === "number") {
          ref.current.textContent = String(Math.round((latest.opacity as number) * to));
        }
      }}
      animate={{ opacity: 1 }}
      transition={{ duration }}
    >
      {to}
    </motion.span>
  );
}