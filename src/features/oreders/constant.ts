import { OrderStatus, Order } from "./types";

export const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  PREPARING: "bg-orange-100 text-orange-700 border-orange-200",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: { name: "John Doe", email: "john@example.com" },
    items: "1 item(s) Premium Coffee Beans",
    total: 53.98,
    status: "CONFIRMED",
    deliveryAgent: "Agent-001",
    date: "2024-01-15T16:00:00",
  },
  {
    id: "ORD-002",
    customer: { name: "Jane Smith", email: "jane@example.com" },
    items: "1 item(s) Organic Green Tea",
    total: 19.98,
    status: "OUT_FOR_DELIVERY",
    deliveryAgent: "Agent-002",
    date: "2024-01-15T14:45:00",
  },
  {
    id: "ORD-003",
    customer: { name: "Bob Johnson", email: "bob@example.com" },
    items: "2 item(s) Wireless Headphones",
    total: 299.96,
    status: "DELIVERED",
    deliveryAgent: "Agent-003",
    date: "2024-01-14T10:30:00",
  },
];
