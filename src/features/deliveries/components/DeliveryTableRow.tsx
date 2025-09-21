"use client";

import React from "react";
import { Loader2, MoreHorizontal, MapPin } from "lucide-react";
import { ClientDate } from "@/features/deliveries/components/ClientDate";
import { Delivery } from "../types";
import { ActionMenu } from "./ActionMenu";

interface DeliveryTableRowProps {
  delivery: Delivery;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  loadingDeliveryId: string | null;
  onMarkDelivered: (id: string) => void;
  onMarkFailed: (id: string) => void;
  onViewDetails: () => void;
}

export const DeliveryTableRow: React.FC<DeliveryTableRowProps> = ({
  delivery,
  openActionMenu,
  setOpenActionMenu,
  loadingDeliveryId,
  onMarkDelivered,
  onMarkFailed,
  onViewDetails,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {delivery.orderId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {delivery.customer.name}
        </div>
        {delivery.customer.phone && (
          <div className="text-sm text-gray-500">{delivery.customer.phone}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
          <span className="truncate">{delivery.customer.address}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {delivery.agentName || delivery.agentId || "Unassigned"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <ClientDate date={delivery.eta} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {delivery.status.replace(/_/g, " ")}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <div className="action-menu relative inline-block">
          <button
            onClick={() =>
              setOpenActionMenu(
                openActionMenu === delivery.id ? null : delivery.id
              )
            }
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {loadingDeliveryId === delivery.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <MoreHorizontal className="w-4 h-4" />
            )}
          </button>
          {openActionMenu === delivery.id && (
            <ActionMenu
              delivery={delivery}
              onMarkDelivered={onMarkDelivered}
              onMarkFailed={onMarkFailed}
              onViewDetails={onViewDetails}
              onClose={() => setOpenActionMenu(null)}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
