// components/orders/StatCard.tsx
import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

export function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-sm text-center border border-gray-100">
      <div
        className={`text-lg sm:text-xl lg:text-2xl font-bold ${
          color || "text-gray-800"
        }`}
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}
