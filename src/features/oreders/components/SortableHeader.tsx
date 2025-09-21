// components/orders/SortableHeader.tsx
import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  column: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export function SortableHeader({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
}: SortableHeaderProps) {
  return (
    <th
      className="px-6 py-3 text-left font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-4 h-4 ${
            sortBy === column ? "text-gray-900" : "text-gray-400"
          }`}
        />
      </div>
    </th>
  );
}
