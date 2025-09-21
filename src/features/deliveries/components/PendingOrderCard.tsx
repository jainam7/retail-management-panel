import React, { useState } from "react";
import { MapPin, Loader2, ChevronDown, ChevronUp } from "lucide-react";

import { Delivery, Agent } from "../types";

export function PendingOrderCard({
  delivery,
  agents,
  onAssignAgent,
  loading,
  isMobile,
}: {
  delivery: Delivery;
  agents: Agent[];
  onAssignAgent: (deliveryId: string, agentId: string) => void;
  loading: boolean;
  isMobile: boolean;
}) {
  const [showAgents, setShowAgents] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            CONFIRMED
          </span>
          <span className="font-medium text-gray-900">{delivery.orderId}</span>
        </div>
      </div>

      <div
        className={`grid gap-4 text-sm ${
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
        }`}
      >
        <div>
          <p className="font-medium text-gray-900">{delivery.customer.name}</p>
          <p className="text-gray-600">{delivery.customer.email}</p>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{delivery.customer.address}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">
            ${delivery.value.toFixed(2)}
          </p>
          <p className="text-gray-600">{delivery.itemCount} item(s)</p>
        </div>
        <AssignAgentDropdown
          delivery={delivery}
          agents={agents}
          onAssignAgent={onAssignAgent}
          loading={loading}
          showAgents={showAgents}
          onToggleAgents={setShowAgents}
        />
      </div>
    </div>
  );
}

function AssignAgentDropdown({
  delivery,
  agents,
  onAssignAgent,
  loading,
  showAgents,
  onToggleAgents,
}: {
  delivery: Delivery;
  agents: Agent[];
  onAssignAgent: (deliveryId: string, agentId: string) => void;
  loading: boolean;
  showAgents: boolean;
  onToggleAgents: (show: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600">Mike Johnson (2 orders)</p>
      </div>
      <div className="relative">
        <button
          onClick={() => onToggleAgents(!showAgents)}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Assign
              {showAgents ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </>
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
                    onToggleAgents(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="truncate">{agent.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    ({agent.currentOrders} orders)
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
