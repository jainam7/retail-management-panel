"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Route } from "next";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Deliveries", href: "/deliveries", icon: Truck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    businessName?: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setUser(parsed.user);
      } catch (err) {
        console.error("Failed to parse auth data", err);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("auth");
    router.push("/login");
  };

  if (!mounted) {
    // Render placeholder to avoid hydration mismatch
    return (
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r p-4 flex flex-col z-10">
        <div className="mb-6 px-2">
          <h1 className="text-lg font-bold">Retailer Panel</h1>
        </div>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-gray-400">Loading...</p>
            <p className="text-xs text-gray-300">...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r p-4 flex flex-col z-10">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold">Retailer Panel</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <p className="text-sm font-semibold">{user?.name || "Guest User"}</p>
          <p className="text-xs text-gray-500">
            {user?.businessName || "No Business"}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={name}>
                <Link
                  href={{ pathname: href }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="text-red-600">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
