// data.ts

import { Agent, Delivery } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "AG-001",
    name: "Mike Johnson",
    phone: "+1-555-0201",
    active: true,
    currentOrders: 2,
    status: "Available",
  },
  {
    id: "AG-002",
    name: "Sarah Wilson",
    phone: "+1-555-0202",
    active: true,
    currentOrders: 1,
    status: "Available",
  },
  {
    id: "AG-003",
    name: "David Brown",
    phone: "+1-555-0203",
    active: true,
    currentOrders: 0,
    status: "Busy",
  },
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: "ORD-001",
    orderId: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, City, State 12345",
      phone: "+1-555-1234",
    },
    value: 53.98,
    itemCount: 1,
    status: "PENDING_ASSIGNMENT",
    agentId: null,
    eta: "2025-09-18T14:30:00.000Z",
    route: ["Warehouse", "Customer Address"],
    createdAt: "2025-09-16T08:00:00.000Z",
  },
  {
    id: "ORD-002",
    orderId: "ORD-002",
    customer: {
      name: "Jane Smith",
      address: "456 Oak Ave, City, State 12345",
      phone: "+1-555-0124",
    },
    value: 89.5,
    itemCount: 2,
    status: "OUT_FOR_DELIVERY",
    agentId: "AG-002",
    agentName: "Agent-002",
    eta: "2025-09-16T21:30:00.000Z",
    route: ["Warehouse", "Hub", "Customer Address"],
    createdAt: "2025-09-15T12:12:00.000Z",
  },
];
