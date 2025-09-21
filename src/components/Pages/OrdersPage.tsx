"use client";

import React, { useState, useEffect } from "react";
import { Filter, Search, Calendar, DollarSign } from "lucide-react";
import { OrderStatus, Order } from "@/features/oreders/types";
import { mockOrders } from "@/features/oreders/constant";

import { StatCard } from "@/features/oreders/components/StatCard";
import { MobileOrderCard } from "@/features/oreders/components/MobileOrderCard";
import { SortableHeader } from "@/features/oreders/components/SortableHeader";
import { DesktopOrderRow } from "@/features/oreders/components/DesktopOrderRow";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Advanced filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu && !(event.target as Element).closest(".action-menu")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

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

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setLoadingOrderId(orderId);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setLoadingOrderId(null);
      setOpenMenu(null);
    }, 1200);
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
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Orders Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage customer orders with status and details
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-6">
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
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Filters & Search
            </h3>

            {/* Main Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as OrderStatus | "")}
                className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white min-w-[140px]"
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
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showAdvanced ? "Hide Filters" : "More Filters"}
                </span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountMin}
                    onChange={(e) => setAmountMin(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="1000.00"
                    value={amountMax}
                    onChange={(e) => setAmountMax(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="font-semibold text-gray-800 text-lg">
                  Orders ({sortedOrders.length})
                </h2>
                <p className="text-sm text-gray-500">
                  Showing {sortedOrders.length} of {orders.length} orders
                </p>
              </div>
            </div>

            {/* Mobile Card View */}
            {isMobile ? (
              <div className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <MobileOrderCard
                    key={order.id}
                    order={order}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    loadingOrderId={loadingOrderId}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            ) : (
              /* Desktop Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
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
                      <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Items
                      </th>
                      <SortableHeader
                        label="Total"
                        column="total"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                      <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Agent
                      </th>
                      <SortableHeader
                        label="Date"
                        column="date"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                      <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedOrders.map((order) => (
                      <DesktopOrderRow
                        key={order.id}
                        order={order}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        loadingOrderId={loadingOrderId}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sortedOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No orders found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
