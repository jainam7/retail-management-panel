// components/orders/ActionMenu.tsx
import React from "react";
import { Eye, XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/features/oreders/types";
import { getStatusIcon } from "@/features/oreders/helper";

interface ActionMenuProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onClose: () => void;
}

export function ActionMenu({
  order,
  onStatusUpdate,
  onClose,
}: ActionMenuProps) {
  const workflow: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  function getNextStatus(status: OrderStatus): OrderStatus | null {
    const idx = workflow.indexOf(status);
    if (idx !== -1 && idx < workflow.length - 1) {
      return workflow[idx + 1];
    }
    return null;
  }

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200 py-1">
      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <Eye className="w-4 h-4" />
        View Details
      </button>

      {nextStatus && (
        <button
          onClick={() => onStatusUpdate(order.id, nextStatus)}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {getStatusIcon(nextStatus)}
          Move to {nextStatus}
        </button>
      )}

      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
        <button
          onClick={() => onStatusUpdate(order.id, "CANCELLED")}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
        >
          <XCircle className="w-4 h-4" />
          Cancel Order
        </button>
      )}
    </div>
  );
}
