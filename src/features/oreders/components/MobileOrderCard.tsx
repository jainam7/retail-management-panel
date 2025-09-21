// components/orders/MobileOrderCard.tsx
import React from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Order, OrderStatus } from "@/features/oreders/types";
import { statusColors } from "@/features/oreders/constant";
import { ActionMenu } from "./ActionMenu";
import { ClientDate } from "./ClientDate";

interface MobileOrderCardProps {
  order: Order;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  loadingOrderId: string | null;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

export function MobileOrderCard({
  order,
  openMenu,
  setOpenMenu,
  loadingOrderId,
  onStatusUpdate,
}: MobileOrderCardProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-mono font-semibold text-gray-900 mb-1">
            {order.id}
          </div>
          <div className="font-medium text-gray-800">{order.customer.name}</div>
          <div className="text-sm text-gray-500">{order.customer.email}</div>
        </div>
        <div className="action-menu relative">
          <button
            onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {loadingOrderId === order.id ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </button>
          {openMenu === order.id && (
            <ActionMenu
              order={order}
              onStatusUpdate={onStatusUpdate}
              onClose={() => setOpenMenu(null)}
            />
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Items:</span>
          <span className="text-gray-900">{order.items}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-gray-900">
            ${order.total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${
              statusColors[order.status]
            }`}
          >
            {order.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Agent:</span>
          <span className="text-gray-900">{order.deliveryAgent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <ClientDate date={order.date} />
        </div>
      </div>
    </div>
  );
}
