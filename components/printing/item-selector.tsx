"use client";

import { PrintingItem } from "@/lib/types/printing";
import { cn } from "@/lib/utils";

interface ItemSelectorProps {
  items: PrintingItem[];
  selectedItemIds: string[];
  onToggle: (itemId: string) => void;
  isLoading?: boolean;
}

export function ItemSelector({
  items,
  selectedItemIds,
  onToggle,
  isLoading = false,
}: ItemSelectorProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-medium text-slate-500">Loading items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
        <p className="text-sm font-medium text-slate-500">No items found for this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isSelected = selectedItemIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              "w-full min-w-0 rounded-2xl border p-3 text-left transition-all sm:p-4",
              isSelected
                ? "border-brand-500 bg-brand-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-brand-400"
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-slate-900">
                  {item.icon} {item.name}
                </p>
                <p className="mt-1 break-words text-xs text-slate-600">{item.description}</p>
              </div>
              <span
                className={cn(
                  "mt-0.5 self-start rounded-full px-2 py-1 text-[10px] font-semibold sm:shrink-0",
                  isSelected ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"
                )}
              >
                {isSelected ? "Selected" : "Select"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
