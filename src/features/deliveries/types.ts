// types.ts

export type DeliveryStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED";

export interface Delivery {
  id: string;
  orderId: string;
  customer: {
    name: string;
    email?: string;
    address: string;
    phone?: string;
  };
  value: number;
  itemCount: number;
  status: DeliveryStatus;
  agentId?: string | null;
  agentName?: string;
  eta: string;
  route: string[];
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  phone?: string;
  active: boolean;
  currentOrders: number;
  status: "Available" | "Busy";
}

export interface DeliveryStats {
  pendingAssignment: number;
  outForDelivery: number;
  availableAgents: number;
  totalAgents: number;
}

export interface ActionMenuProps {
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  loadingDeliveryId: string | null;
  onMarkDelivered: (id: string) => void;
  onMarkFailed: (id: string) => void;
  onViewDetails: (delivery: Delivery) => void;
}

export const STATUS_STYLES: Record<DeliveryStatus, string> = {
  PENDING_ASSIGNMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
};
