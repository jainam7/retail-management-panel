"use client";

import React from "react";
import { Loader2, MoreHorizontal, MapPin } from "lucide-react";
import { ClientDate } from "@/features/deliveries/components/ClientDate";
import { Delivery } from "../types";
import { ActionMenu } from "./ActionMenu";

interface DeliveryMobileCardProps {
  delivery: Delivery;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  loadingDeliveryId: string | null;
  onMarkDelivered: (id: string) => void;
  onMarkFailed: (id: string) => void;
  onViewDetails: () => void;
}

export const DeliveryMobileCard: React.FC<DeliveryMobileCardProps> = ({
  delivery,
  openActionMenu,
  setOpenActionMenu,
  loadingDeliveryId,
  onMarkDelivered,
  onMarkFailed,
  onViewDetails,
}) => {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-mono font-semibold text-gray-900 mb-1">
            {delivery.orderId}
          </div>
          <div className="font-medium text-gray-800">
            {delivery.customer.name}
          </div>
          {delivery.customer.phone && (
            <div className="text-sm text-gray-500">
              {delivery.customer.phone}
            </div>
          )}
        </div>
        <div className="action-menu relative">
          <button
            onClick={() =>
              setOpenActionMenu(
                openActionMenu === delivery.id ? null : delivery.id
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {loadingDeliveryId === delivery.id ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
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
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-600">{delivery.customer.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Agent:</span>
          <span className="text-gray-900">
            {delivery.agentName || delivery.agentId || "Unassigned"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">ETA:</span>
          <ClientDate date={delivery.eta} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            {delivery.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    </div>
  );
};
