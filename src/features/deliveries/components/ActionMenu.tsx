"use client";

import React from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Delivery } from "../types";

interface ActionMenuProps {
  delivery: Delivery;
  onMarkDelivered: (id: string) => void;
  onMarkFailed: (id: string) => void;
  onViewDetails: () => void;
  onClose: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  delivery,
  onMarkDelivered,
  onMarkFailed,
  onViewDetails,
  onClose,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200 py-1">
      <button
        onClick={() => {
          onViewDetails();
          onClose();
        }}
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Eye className="w-4 h-4" />
        View Route
      </button>
      <button
        onClick={() => onMarkDelivered(delivery.id)}
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        Mark Delivered
      </button>
      <button
        onClick={() => onMarkFailed(delivery.id)}
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
      >
        <XCircle className="w-4 h-4" />
        Failed Delivery
      </button>
    </div>
  );
};
