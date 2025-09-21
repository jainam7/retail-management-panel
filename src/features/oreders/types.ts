// types.ts
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  customer: { name: string; email: string };
  items: string;
  total: number;
  status: OrderStatus;
  deliveryAgent: string;
  date: string;
}
