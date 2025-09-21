// components/orders/DesktopOrderRow.tsx
import React from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Order, OrderStatus } from "@/features/oreders/types";
import { statusColors } from "@/features/oreders/constant";
import { getStatusIcon } from "@/features/oreders/helper";
import { ActionMenu } from "./ActionMenu";
import { ClientDate } from "./ClientDate";

interface DesktopOrderRowProps {
  order: Order;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  loadingOrderId: string | null;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

export function DesktopOrderRow({
  order,
  openMenu,
  setOpenMenu,
  loadingOrderId,
  onStatusUpdate,
}: DesktopOrderRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-mono font-semibold text-gray-900">
        {order.id}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{order.customer.name}</div>
        <div className="text-sm text-gray-500">{order.customer.email}</div>
      </td>
      <td className="px-6 py-4 text-gray-600">{order.items}</td>
      <td className="px-6 py-4 font-semibold text-gray-900">
        ${order.total.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
            statusColors[order.status]
          }`}
        >
          {getStatusIcon(order.status)}
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">{order.deliveryAgent}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <ClientDate date={order.date} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="action-menu relative inline-block">
          <button
            onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {loadingOrderId === order.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <MoreHorizontal className="w-4 h-4" />
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
      </td>
    </tr>
  );
}
