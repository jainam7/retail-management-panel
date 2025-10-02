"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { useEffect, useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("auth");
    dispatch(logout()); // ✅ reset Redux state
    router.push("/login");
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) {
    return (
      <>
        {/* Mobile Header Placeholder */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
          <h1 className="text-lg font-bold">Retailer Panel</h1>
          <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
        </div>

        {/* Desktop Sidebar Placeholder */}
        <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r z-10">
          <div className="h-full p-4 flex flex-col">
            <div className="mb-6 px-2">
              <h1 className="text-lg font-bold">Retailer Panel</h1>
            </div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-gray-400">
                  Loading...
                </p>
                <p className="text-xs text-gray-300">...</p>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold">Retailer Panel</h1>
        <button
          id="mobile-menu-button"
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Mobile Sidebar */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full p-4 flex flex-col">
          <SidebarContent
            user={user}
            pathname={pathname}
            handleSignOut={handleSignOut}
          />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r z-10">
        <div className="h-full p-4 flex flex-col">
          <SidebarContent
            user={user}
            pathname={pathname}
            handleSignOut={handleSignOut}
          />
        </div>
      </aside>

      {/* Spacer for mobile content */}
      <div className="lg:hidden h-16" />
    </>
  );
}

// Extracted sidebar content to avoid duplication
function SidebarContent({
  user,
  pathname,
  handleSignOut,
}: {
  user: { name: string; businessName?: string } | null;
  pathname: string;
  handleSignOut: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold">Retailer Panel</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">
            {user?.name || "Guest User"}
          </p>
          <p className="text-xs text-gray-500 truncate">
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
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-600 truncate">Sign Out</span>
        </button>
      </div>
    </>
  );
}
