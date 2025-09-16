"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // helper for conditional classes
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";

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

  const handleSignOut = () => {
    // Clear auth data (localStorage/session or Redux store)
    localStorage.removeItem("auth");
    // Redirect to login
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 bg-white border-r p-4 flex flex-col">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold">Retailer Panel</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          JS
        </div>
        <div>
          <p className="text-sm font-semibold">Jainam Shah</p>
          <p className="text-xs text-gray-500">Reliance</p>
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
                  href={href}
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

      {/* Sign Out Button */}
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
