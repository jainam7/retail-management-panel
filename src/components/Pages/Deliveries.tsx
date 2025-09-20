"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Loader2,
  MapPin,
  UserCheck,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Phone,
  Clock,
  User,
} from "lucide-react";

/**
 * Deliveries Management Page - Updated to match demo UI
 * - Clean layout with proper sections
 * - Agent management section
 * - Orders needing assignment
 * - Orders out for delivery table
 */

/* ----------------------------- Types & Data ---------------------------- */

type DeliveryStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED";

interface Delivery {
  id: string;
  orderId: string;
  customer: { name: string; email?: string; address: string; phone?: string };
  value: number;
  itemCount: number;
  status: DeliveryStatus;
  agentId?: string | null;
  agentName?: string;
  eta: string;
  route: string[];
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
  phone?: string;
  active: boolean;
  currentOrders: number;
  status: "Available" | "Busy";
}

/* Dummy agents matching demo */
const AGENTS: Agent[] = [
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

/* Dummy deliveries matching demo layout */
const INITIAL_DELIVERIES: Delivery[] = [
  // Pending assignment
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
  // Out for delivery
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

/* Status color map */
const STATUS_STYLES: Record<DeliveryStatus, string> = {
  PENDING_ASSIGNMENT: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

/* ----------------------------- Component ------------------------------- */

export default function DeliveriesPage() {
  // deliveries + agents state
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [agents] = useState<Agent[]>(AGENTS);

  // Action UI states
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [loadingDeliveryId, setLoadingDeliveryId] = useState<string | null>(
    null
  );

  // Modal states
  const [detailsModalFor, setDetailsModalFor] = useState<Delivery | null>(null);

  /* --------------------------- Stats calculations ----------------------- */
  const stats = useMemo(() => {
    const pendingAssignment = deliveries.filter(
      (d) => d.status === "PENDING_ASSIGNMENT"
    ).length;
    const outForDelivery = deliveries.filter(
      (d) => d.status === "OUT_FOR_DELIVERY"
    ).length;
    const availableAgents = agents.filter(
      (a) => a.status === "Available"
    ).length;
    const totalAgents = agents.length;

    return { pendingAssignment, outForDelivery, availableAgents, totalAgents };
  }, [deliveries, agents]);

  const pendingDeliveries = deliveries.filter(
    (d) => d.status === "PENDING_ASSIGNMENT"
  );
  const outForDeliveryItems = deliveries.filter(
    (d) => d.status === "OUT_FOR_DELIVERY"
  );

  /* --------------------------- Action handlers -------------------------- */

  const handleAssignAgent = (deliveryId: string, agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    setLoadingDeliveryId(deliveryId);
    setTimeout(() => {
      setDeliveries((prev) =>
        prev.map((x) =>
          x.id === deliveryId
            ? {
                ...x,
                agentId,
                agentName: agent?.name,
                status: "OUT_FOR_DELIVERY" as DeliveryStatus,
              }
            : x
        )
      );
      setLoadingDeliveryId(null);
      setOpenActionMenu(null);
    }, 700);
  };

  const handleMarkDelivered = (deliveryId: string) => {
    setLoadingDeliveryId(deliveryId);
    setTimeout(() => {
      setDeliveries((prev) =>
        prev.map((x) =>
          x.id === deliveryId
            ? { ...x, status: "DELIVERED" as DeliveryStatus }
            : x
        )
      );
      setLoadingDeliveryId(null);
      setOpenActionMenu(null);
    }, 800);
  };

  const handleMarkFailed = (deliveryId: string) => {
    setLoadingDeliveryId(deliveryId);
    setTimeout(() => {
      setDeliveries((prev) =>
        prev.map((x) =>
          x.id === deliveryId ? { ...x, status: "FAILED" as DeliveryStatus } : x
        )
      );
      setLoadingDeliveryId(null);
      setOpenActionMenu(null);
    }, 800);
  };

  /* ------------------------------- Rendering ---------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Management
        </h1>
        <p className="text-gray-600">
          Manage delivery assignments and track orders
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Clock className="w-8 h-8 text-orange-500" />}
          value={stats.pendingAssignment}
          label="Pending Assignment"
          bgColor="bg-white"
          borderColor="border-l-4 border-orange-500"
        />
        <StatsCard
          icon={<Truck className="w-8 h-8 text-purple-500" />}
          value={stats.outForDelivery}
          label="Out for Delivery"
          bgColor="bg-white"
          borderColor="border-l-4 border-purple-500"
        />
        <StatsCard
          icon={<UserCheck className="w-8 h-8 text-green-500" />}
          value={stats.availableAgents}
          label="Available Agents"
          bgColor="bg-white"
          borderColor="border-l-4 border-green-500"
        />
        <StatsCard
          icon={<User className="w-8 h-8 text-blue-500" />}
          value={stats.totalAgents}
          label="Total Agents"
          bgColor="bg-white"
          borderColor="border-l-4 border-blue-500"
        />
      </div>

      {/* Delivery Agents Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Agents
            </h2>
            <p className="text-sm text-gray-600">
              Available delivery personnel
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Needing Delivery Assignment */}
      {pendingDeliveries.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders Needing Delivery Assignment
              </h2>
              <p className="text-sm text-gray-600">
                {pendingDeliveries.length} orders ready for delivery assignment
              </p>
            </div>
            <div className="p-6">
              {pendingDeliveries.map((delivery) => (
                <PendingOrderCard
                  key={delivery.id}
                  delivery={delivery}
                  agents={agents}
                  onAssignAgent={handleAssignAgent}
                  loading={loadingDeliveryId === delivery.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Out for Delivery Table */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders Out for Delivery
            </h2>
            <p className="text-sm text-gray-600">
              {outForDeliveryItems.length} orders currently being delivered
            </p>
          </div>

          {outForDeliveryItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Delivery Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estimated Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {outForDeliveryItems.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {delivery.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.customer.name}
                        </div>
                        {delivery.customer.phone && (
                          <div className="text-sm text-gray-500">
                            {delivery.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          {delivery.customer.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.agentName || delivery.agentId || "Unassigned"}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(delivery.eta).toLocaleDateString()},{" "}
                        {new Date(delivery.eta).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ClientDate date={delivery.eta} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          OUT FOR DELIVERY
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() =>
                            setOpenActionMenu(
                              openActionMenu === delivery.id
                                ? null
                                : delivery.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          {loadingDeliveryId === delivery.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-blue-600"
                            />
                          ) : (
                            <MoreHorizontal size={16} />
                          )}
                        </button>

                        {openActionMenu === delivery.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                            <button
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setDetailsModalFor(delivery);
                                setOpenActionMenu(null);
                              }}
                            >
                              <Eye size={16} /> View Route
                            </button>
                            <button
                              onClick={() => handleMarkDelivered(delivery.id)}
                              disabled={loadingDeliveryId === delivery.id}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                              <CheckCircle size={16} /> Mark Delivered
                            </button>
                            <button
                              onClick={() => handleMarkFailed(delivery.id)}
                              disabled={loadingDeliveryId === delivery.id}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircle size={16} /> Failed Delivery
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No orders currently out for delivery</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalFor && (
        <Modal
          onClose={() => setDetailsModalFor(null)}
          title={`Order ${detailsModalFor.orderId} Details`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">
                Customer Information
              </h4>
              <p className="text-sm text-gray-600">
                {detailsModalFor.customer.name}
              </p>
              <p className="text-sm text-gray-600">
                {detailsModalFor.customer.address}
              </p>
              {detailsModalFor.customer.phone && (
                <p className="text-sm text-gray-600">
                  {detailsModalFor.customer.phone}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Order Details</h4>
              <p className="text-sm text-gray-600">
                Value: ${detailsModalFor.value.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Items: {detailsModalFor.itemCount}
              </p>
              <p className="text-sm text-gray-600">
                Status: {detailsModalFor.status}
              </p>
            </div>
            {detailsModalFor.agentName && (
              <div>
                <h4 className="font-medium text-gray-900">Assigned Agent</h4>
                <p className="text-sm text-gray-600">
                  {detailsModalFor.agentName}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------- Helper Components ------------------------ */

function StatsCard({
  icon,
  value,
  label,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`${bgColor} ${borderColor} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center">
        {icon}
        <div className="ml-4">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-medium text-gray-900">{agent.name}</span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            agent.status === "Available"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {agent.status}
        </span>
      </div>
      {agent.phone && (
        <p className="text-sm text-gray-600 mb-2">{agent.phone}</p>
      )}
      <p className="text-sm text-gray-600">
        Current Orders: {agent.currentOrders}
      </p>
    </div>
  );
}

function PendingOrderCard({
  delivery,
  agents,
  onAssignAgent,
  loading,
}: {
  delivery: Delivery;
  agents: Agent[];
  onAssignAgent: (deliveryId: string, agentId: string) => void;
  loading: boolean;
}) {
  const [showAgents, setShowAgents] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-3">
              CONFIRMED
            </span>
            <span className="font-medium text-gray-900">
              {delivery.orderId}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">
                {delivery.customer.name}
              </p>
              <p className="text-gray-600">{delivery.customer.email}</p>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {delivery.customer.address}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                ${delivery.value.toFixed(2)}
              </p>
              <p className="text-gray-600">{delivery.itemCount} item(s)</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Mike Johnson (2 orders)</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowAgents(!showAgents)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Assign"
                  )}
                </button>

                {showAgents && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                    {agents
                      .filter((a) => a.active)
                      .map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => {
                            onAssignAgent(delivery.id, agent.id);
                            setShowAgents(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{agent.name}</span>
                          <span className="text-xs text-gray-500">
                            ({agent.currentOrders} orders)
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function ClientDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState("");

  React.useEffect(() => {
    const d = new Date(date);
    setFormatted(
      `${d.toLocaleDateString()}, ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }, [date]);

  if (!formatted) return <span>--</span>; // fallback until hydrated
  return <span>{formatted}</span>;
}
