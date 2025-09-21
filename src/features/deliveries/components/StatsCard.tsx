import React from "react";

export function StatsCard({
  icon,
  value,
  label,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={`${bgColor} ${borderColor} p-4 sm:p-6 rounded-lg shadow-sm`}
    >
      <div className="flex items-center">
        {icon}
        <div className="ml-3 sm:ml-4">
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            {value}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
