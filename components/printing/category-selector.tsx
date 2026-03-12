"use client";

import { PrintingCategory } from "@/lib/types/printing";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: PrintingCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelect,
  isLoading = false,
}: CategorySelectorProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-medium text-slate-500">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
        <p className="text-sm font-medium text-slate-500">No categories available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "min-w-0 rounded-2xl border p-3 text-left transition-all sm:p-4",
              isSelected
                ? "border-brand-500 bg-brand-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-brand-400"
            )}
          >
            <p className="text-base sm:text-lg">{category.icon}</p>
            <p className="mt-2 break-words text-sm font-semibold text-slate-900">{category.label}</p>
            <p className="mt-1 text-xs text-slate-500">{category.items.length} available items</p>
          </button>
        );
      })}
    </div>
  );
}
