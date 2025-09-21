import React, { useState } from "react";
import { User } from "lucide-react";

import { Agent } from "../types";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <span className="font-medium text-gray-900 truncate">
            {agent.name}
          </span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
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
