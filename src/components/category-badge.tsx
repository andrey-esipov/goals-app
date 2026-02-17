import {
  HeartPulse,
  Briefcase,
  Wallet,
  User,
  Users,
  BookOpen,
  Tag,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-pulse": HeartPulse,
  briefcase: Briefcase,
  wallet: Wallet,
  user: User,
  users: Users,
  "book-open": BookOpen,
};

export function CategoryBadge({
  name,
  color,
  icon,
  size = "sm",
}: {
  name: string;
  color: string;
  icon: string;
  size?: "sm" | "md";
}) {
  const Icon = ICON_MAP[icon] || Tag;
  const sizeClasses =
    size === "md" ? "px-2.5 py-1 text-sm gap-1.5" : "px-2 py-0.5 text-xs gap-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <Icon className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
      {name}
    </span>
  );
}
