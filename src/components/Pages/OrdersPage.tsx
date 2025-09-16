"use client";

import React, { useState } from "react";
import {
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  XCircle,
  CheckCircle,
  Truck,
  UtensilsCrossed,
  ClipboardList,
  Loader2,
} from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

interface Order {
  id: string;
  customer: { name: string; email: string };
  items: string;
  total: number;
  status: OrderStatus;
  deliveryAgent: string;
  date: string;
}

const mockOrders: Order[] = [
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
];

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// Workflow order
const workflow: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function getNextStatus(status: OrderStatus): OrderStatus | null {
  const workflow: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];
  const idx = workflow.indexOf(status);
  if (idx !== -1 && idx < workflow.length - 1) {
    return workflow[idx + 1];
  }
  return null;
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return <ClipboardList size={16} className="text-yellow-600" />;
    case "CONFIRMED":
      return <CheckCircle size={16} className="text-blue-600" />;
    case "PREPARING":
      return <UtensilsCrossed size={16} className="text-orange-600" />;
    case "OUT_FOR_DELIVERY":
      return <Truck size={16} className="text-purple-600" />;
    case "DELIVERED":
      return <CheckCircle size={16} className="text-green-600" />;
    case "CANCELLED":
      return <XCircle size={16} className="text-red-600" />;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  // NEW: advanced filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null); // NEW: for action menu

  // Filtering logic
  const filteredOrders = orders.filter((o) => {
    if (filter && o.status !== filter) return false;

    if (
      searchQuery &&
      !(
        o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return false;

    if (dateFrom && new Date(o.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(o.date) > new Date(dateTo)) return false;

    if (amountMin && o.total < parseFloat(amountMin)) return false;
    if (amountMax && o.total > parseFloat(amountMax)) return false;

    return true;
  });

  // Sorting logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valA: any = a[sortBy as keyof Order];
    let valB: any = b[sortBy as keyof Order];

    if (sortBy === "customer") {
      valA = a.customer.name.toLowerCase();
      valB = b.customer.name.toLowerCase();
    }
    if (sortBy === "date") {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // NEW: Action handlers
  const handleNextStatus = (order: Order) => {
    const idx = workflow.indexOf(order.status);
    if (idx >= 0 && idx < workflow.length - 1) {
      const nextStatus = workflow[idx + 1];
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
      );
    }
    setOpenMenu(null);
  };

  const handleCancelOrder = (order: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "CANCELLED" } : o))
    );
    setOpenMenu(null);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
    preparing: orders.filter((o) => o.status === "PREPARING").length,
    outForDelivery: orders.filter((o) => o.status === "OUT_FOR_DELIVERY")
      .length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Orders Management
        </h1>
        <p className="text-gray-600">
          View and manage customer orders with status and details
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 px-6 lg:px-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard
          label="Pending"
          value={stats.pending}
          color="text-yellow-600"
        />
        <StatCard
          label="Confirmed"
          value={stats.confirmed}
          color="text-blue-600"
        />
        <StatCard
          label="Preparing"
          value={stats.preparing}
          color="text-orange-600"
        />
        <StatCard
          label="Out for Delivery"
          value={stats.outForDelivery}
          color="text-purple-600"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          color="text-green-600"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          color="text-red-600"
        />
      </div>

      {/* Filters */}
      {/* <div className="max-w-7xl mx-auto mt-10 px-6 lg:px-6">
        <div className="bg-white p-5 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search by customer/order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderStatus | "")}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="Min Amount"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div> */}

      {/* Filters */}
      <div className="max-w-7xl mx-auto mt-10 px-6 lg:px-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Filters & Search</h3>

          {/* Top Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as OrderStatus | "")}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />{" "}
              {showAdvanced ? "Hide Filters" : "More Filters"}
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={amountMin}
                  onChange={(e) => setAmountMin(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={amountMax}
                  onChange={(e) => setAmountMax(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto mt-8 px-6 lg:px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-gray-800">
              Orders ({sortedOrders.length})
            </h2>
            <p className="text-sm text-gray-500">
              Showing {sortedOrders.length} of {orders.length} orders
            </p>
          </div>

          <div className="overflow-x-auto relative">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <SortableHeader
                    label="Order ID"
                    column="id"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Customer"
                    column="customer"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3">Items</th>
                  <SortableHeader
                    label="Total"
                    column="total"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Delivery Agent</th>
                  <SortableHeader
                    label="Date"
                    column="date"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 relative"
                  >
                    <td className="px-6 py-4 font-mono font-semibold">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.items}</td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.deliveryAgent}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.date).toLocaleString()}
                    </td>
                    {/* <td className="px-6 py-4 text-right relative">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        onClick={() =>
                          setOpenMenu(openMenu === order.id ? null : order.id)
                        }
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      
                      {openMenu === order.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                            View Details
                          </button>
                          {order.status !== "DELIVERED" &&
                            order.status !== "CANCELLED" && (
                              <button
                                onClick={() => handleNextStatus(order)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                Move to Next Status
                              </button>
                            )}
                          {order.status !== "DELIVERED" && (
                            <button
                              onClick={() => handleCancelOrder(order)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      )}
                    </td> */}
                    <td className="px-6 py-4 text-right relative">
                      <div className="relative inline-block text-left fixed">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === order.id ? null : order.id)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          {loadingOrderId === order.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-blue-600"
                            />
                          ) : (
                            <MoreHorizontal size={16} />
                          )}
                        </button>

                        {openMenu === order.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border">
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50">
                              <Eye size={16} /> View Details
                            </button>

                            {/* Next status only if applicable */}
                            {getNextStatus(order.status) && (
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                                onClick={() => {
                                  setLoadingOrderId(order.id);
                                  setTimeout(() => {
                                    setOrders((prev) =>
                                      prev.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              status: getNextStatus(
                                                order.status
                                              )!,
                                            }
                                          : o
                                      )
                                    );
                                    setLoadingOrderId(null);
                                    setOpenMenu(null);
                                  }, 1200); // simulate API delay
                                }}
                              >
                                {loadingOrderId === order.id ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin text-blue-600"
                                  />
                                ) : (
                                  getStatusIcon(getNextStatus(order.status)!)
                                )}
                                {getNextStatus(order.status)}
                              </button>
                            )}

                            {/* Cancel */}
                            {order.status !== "CANCELLED" &&
                              order.status !== "DELIVERED" && (
                                <button
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setLoadingOrderId(order.id);
                                    setTimeout(() => {
                                      setOrders((prev) =>
                                        prev.map((o) =>
                                          o.id === order.id
                                            ? { ...o, status: "CANCELLED" }
                                            : o
                                        )
                                      );
                                      setLoadingOrderId(null);
                                      setOpenMenu(null);
                                    }, 1200);
                                  }}
                                >
                                  {loadingOrderId === order.id ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin text-red-600"
                                    />
                                  ) : (
                                    <XCircle size={16} />
                                  )}{" "}
                                  Cancel Order
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm text-center">
      <div className={`text-2xl font-bold ${color || "text-gray-800"}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function SortableHeader({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  column: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (col: string) => void;
}) {
  return (
    <th
      className="px-6 py-3 cursor-pointer select-none"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={14}
          className={sortBy === column ? "text-gray-900" : "text-gray-400"}
        />
      </div>
    </th>
  );
}
