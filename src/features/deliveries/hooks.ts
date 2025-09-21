// hooks.ts

import { useMemo, useState, useEffect } from "react";
import { Delivery, Agent, DeliveryStats } from "./types";

/**
 * Hook for calculating delivery statistics
 */
export function useDeliveryStats(
  deliveries: Delivery[],
  agents: Agent[]
): DeliveryStats {
  return useMemo(() => {
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
}

/**
 * Hook for responsive design detection
 */
export function useResponsive(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook for handling click outside events
 */
export function useClickOutside(
  isOpen: string | null,
  onClose: () => void,
  selector: string
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(selector)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, selector]);
}

/**
 * Hook for managing loading states
 */
export function useLoadingState() {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const setLoading = (id: string, loading: boolean) => {
    setLoadingItems((prev) => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const isLoading = (id: string) => loadingItems.has(id);

  return { setLoading, isLoading };
}
