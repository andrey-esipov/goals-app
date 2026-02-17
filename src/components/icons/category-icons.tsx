"use client";

import { motion } from "framer-motion";

export function HealthIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
    >
      {/* Heart with pulse line */}
      <path
        d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulse line */}
      <path
        d="M5 12H8L10 9L12 15L14 11L16 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function CareerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Rising bars */}
      <rect
        x="3"
        y="14"
        width="4"
        height="7"
        rx="1"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="10"
        y="9"
        width="4"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="17"
        y="4"
        width="4"
        height="17"
        rx="1"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="3"
        y="14"
        width="4"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="9"
        width="4"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="17"
        y="4"
        width="4"
        height="17"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Arrow */}
      <path
        d="M5 12L12 6L19 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
        opacity="0.5"
      />
    </svg>
  );
}

export function FinanceIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Coin stack */}
      <ellipse
        cx="12"
        cy="17"
        rx="7"
        ry="3"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="12"
        cy="17"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="13"
        rx="7"
        ry="3"
        fill="currentColor"
        opacity="0.15"
      />
      <ellipse
        cx="12"
        cy="13"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse cx="12" cy="9" rx="7" ry="3" fill="currentColor" opacity="0.2" />
      <ellipse
        cx="12"
        cy="9"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Sparkle */}
      <path
        d="M19 4L19.5 5.5L21 6L19.5 6.5L19 8L18.5 6.5L17 6L18.5 5.5L19 4Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

export function PersonalIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Star constellation */}
      <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="14" r="1.5" fill="currentColor" opacity="0.2" />
      <circle cx="6" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="14" r="1.5" fill="currentColor" opacity="0.2" />
      <circle cx="18" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="19" r="1" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="1.5" />
      {/* Connecting lines */}
      <path
        d="M12 10L6 14M12 10L18 14M6 14L12 19M18 14L12 19"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function RelationshipsIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Interlinked rings */}
      <circle
        cx="9"
        cy="12"
        r="5"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="15"
        cy="12"
        r="5"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Overlap highlight */}
      <path
        d="M12 8.35C13.18 9.3 14 10.56 14 12C14 13.44 13.18 14.7 12 15.65C10.82 14.7 10 13.44 10 12C10 10.56 10.82 9.3 12 8.35Z"
        fill="currentColor"
        opacity="0.25"
      />
    </svg>
  );
}

export function LearningIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Open book with glow */}
      <path
        d="M2 4C2 4 5 3 8 3C11 3 12 4.5 12 4.5C12 4.5 13 3 16 3C19 3 22 4 22 4V19C22 19 19 18 16 18C13 18 12 19.5 12 19.5C12 19.5 11 18 8 18C5 18 2 19 2 19V4Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M12 4.5V19.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 4C2 4 5 3 8 3C11 3 12 4.5 12 4.5V19.5C12 19.5 11 18 8 18C5 18 2 19 2 19V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 4C22 4 19 3 16 3C13 3 12 4.5 12 4.5V19.5C12 19.5 13 18 16 18C19 18 22 19 22 19V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glow lines */}
      <path
        d="M5 8H9M5 11H9M15 8H19M15 11H19"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "heart-pulse": HealthIcon,
  briefcase: CareerIcon,
  wallet: FinanceIcon,
  user: PersonalIcon,
  users: RelationshipsIcon,
  "book-open": LearningIcon,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[icon];
  if (!Icon) return null;
  return <Icon className={className} />;
}
