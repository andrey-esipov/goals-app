"use client";

import { CategoryBadge } from "@/components/category-badge";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string | null;
  onChange: (categoryId: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
          value === null
            ? "border-foreground bg-foreground text-background"
            : "text-muted-foreground hover:border-foreground/30 border-transparent"
        }`}
      >
        None
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`rounded-full transition-opacity ${
            value === cat.id
              ? "opacity-100 ring-2 ring-offset-1"
              : "opacity-60 hover:opacity-100"
          }`}
          style={{ ringColor: cat.color } as React.CSSProperties}
        >
          <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />
        </button>
      ))}
    </div>
  );
}
