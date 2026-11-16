"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Appear-from-darkness effect when the element scrolls into view
 * (the same idea as VisibleWrapper on hammerill.com).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition duration-700 ease-out print:opacity-100 print:filter-none print:translate-y-0",
        visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
