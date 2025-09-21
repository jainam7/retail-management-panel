"use client";

import React, { useMemo, useState, useEffect } from "react";
import { UserCheck, Truck, Clock, User } from "lucide-react";
import { DeliveryMobileCard } from "@/features/deliveries/components/DeliveryMobileCard";
import { DeliveryTableRow } from "@/features/deliveries/components/DeliveryTableRow";
import { Modal } from "@/features/deliveries/components/Modal";
import { StatsCard } from "@/features/deliveries/components/StatsCard";
import { AgentCard } from "@/features/deliveries/components/AgentCard";
import { PendingOrderCard } from "@/features/deliveries/components/PendingOrderCard";
import { AGENTS, INITIAL_DELIVERIES } from "@/features/deliveries/data";
import { Agent, Delivery, DeliveryStatus } from "@/features/deliveries/types";

export default function DeliveriesPage() {
  // deliveries + agents state
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [agents] = useState<Agent[]>(AGENTS);
  const [isMobile, setIsMobile] = useState(false);

  // Action UI states
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [loadingDeliveryId, setLoadingDeliveryId] = useState<string | null>(
    null
  );

  // Modal states
  const [detailsModalFor, setDetailsModalFor] = useState<Delivery | null>(null);

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
      if (
        openActionMenu &&
        !(event.target as Element).closest(".action-menu")
      ) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openActionMenu]);

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
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Delivery Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage delivery assignments and track orders
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatsCard
              icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />}
              value={stats.pendingAssignment}
              label="Pending Assignment"
              bgColor="bg-white"
              borderColor="border-l-4 border-orange-500"
            />
            <StatsCard
              icon={<Truck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />}
              value={stats.outForDelivery}
              label="Out for Delivery"
              bgColor="bg-white"
              borderColor="border-l-4 border-purple-500"
            />
            <StatsCard
              icon={
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              }
              value={stats.availableAgents}
              label="Available Agents"
              bgColor="bg-white"
              borderColor="border-l-4 border-green-500"
            />
            <StatsCard
              icon={<User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />}
              value={stats.totalAgents}
              label="Total Agents"
              bgColor="bg-white"
              borderColor="border-l-4 border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery Agents Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6 lg:mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery Agents
              </h2>
              <p className="text-sm text-gray-600">
                Available delivery personnel
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Needing Delivery Assignment */}
      {pendingDeliveries.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mb-6 lg:mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Orders Needing Delivery Assignment
                </h2>
                <p className="text-sm text-gray-600">
                  {pendingDeliveries.length} orders ready for delivery
                  assignment
                </p>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {pendingDeliveries.map((delivery) => (
                  <PendingOrderCard
                    key={delivery.id}
                    delivery={delivery}
                    agents={agents}
                    onAssignAgent={handleAssignAgent}
                    loading={loadingDeliveryId === delivery.id}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Out for Delivery */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders Out for Delivery
              </h2>
              <p className="text-sm text-gray-600">
                {outForDeliveryItems.length} orders currently being delivered
              </p>
            </div>

            {outForDeliveryItems.length > 0 ? (
              isMobile ? (
                <div className="divide-y divide-gray-200">
                  {outForDeliveryItems.map((delivery) => (
                    <DeliveryMobileCard
                      key={delivery.id}
                      delivery={delivery}
                      openActionMenu={openActionMenu}
                      setOpenActionMenu={setOpenActionMenu}
                      loadingDeliveryId={loadingDeliveryId}
                      onMarkDelivered={handleMarkDelivered}
                      onMarkFailed={handleMarkFailed}
                      onViewDetails={() => setDetailsModalFor(delivery)}
                    />
                  ))}
                </div>
              ) : (
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
                        <DeliveryTableRow
                          key={delivery.id}
                          delivery={delivery}
                          openActionMenu={openActionMenu}
                          setOpenActionMenu={setOpenActionMenu}
                          loadingDeliveryId={loadingDeliveryId}
                          onMarkDelivered={handleMarkDelivered}
                          onMarkFailed={handleMarkFailed}
                          onViewDetails={() => setDetailsModalFor(delivery)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No orders currently out for delivery</p>
              </div>
            )}
          </div>
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
