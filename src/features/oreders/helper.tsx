import React from "react";
import {
  ClipboardList,
  CheckCircle,
  UtensilsCrossed,
  Truck,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "./types";

export function getStatusIcon(status: OrderStatus) {
  const iconClass = "w-4 h-4";

  switch (status) {
    case "PENDING":
      return <ClipboardList className={`${iconClass} text-yellow-600`} />;
    case "CONFIRMED":
      return <CheckCircle className={`${iconClass} text-blue-600`} />;
    case "PREPARING":
      return <UtensilsCrossed className={`${iconClass} text-orange-600`} />;
    case "OUT_FOR_DELIVERY":
      return <Truck className={`${iconClass} text-purple-600`} />;
    case "DELIVERED":
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case "CANCELLED":
      return <XCircle className={`${iconClass} text-red-600`} />;
  }
}
