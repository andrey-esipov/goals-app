"use client";

import * as React from "react";
import * as m from "motion/react-client";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function MotionPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
}

export function MotionStagger({
  children,
  className,
  staggerDelay = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function MotionItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "none";
}) {
  const yMap = { up: 24, down: -24, none: 0 };
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: yMap[direction], scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: EASE_OUT_EXPO },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function MotionReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </m.div>
  );
}
