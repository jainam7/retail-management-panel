"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Truck,
  TrendingUp,
  Plus,
  Eye,
  Settings,
  Users,
} from "lucide-react";

// KPI data with trend indicators
const kpis = [
  {
    title: "Total Orders",
    value: "1,247",
    change: "+2.5% from last month",
    positive: true,
    icon: ShoppingCart,
  },
  {
    title: "Monthly Income",
    value: "$45,670.5",
    change: "+8.3% from last month",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Active Products",
    value: "156",
    change: "-2 from last month",
    positive: false,
    icon: Package,
  },
  {
    title: "Pending Deliveries",
    value: "23",
    change: "+5 from last month",
    positive: false,
    icon: Truck,
  },
];

// Revenue trend data
const revenueData = [
  { month: "Jan", revenue: 35000 },
  { month: "Feb", revenue: 42000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 45000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 48000 },
];

// Order status distribution
const orderStatusData = [
  { name: "PENDING", value: 15, color: "#f59e0b" },
  { name: "CONFIRMED", value: 45, color: "#3b82f6" },
  { name: "PREPARING", value: 12, color: "#8b5cf6" },
  { name: "OUT FOR DELIVERY", value: 23, color: "#f97316" },
  { name: "DELIVERED", value: 1165, color: "#10b981" },
  { name: "CANCELLED", value: 8, color: "#ef4444" },
];

// Recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    date: "Jan 15, 2024 08:50",
    status: "CONFIRMED",
    amount: "$53.98",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "Jan 15, 2024 08:45",
    status: "OUT FOR DELIVERY",
    amount: "$18.98",
  },
];

// Top selling products
const topProducts = [
  {
    name: "Premium Coffee Beans",
    code: "COF-001",
    sales: 156,
    revenue: "$24.99",
  },
  { name: "Organic Green Tea", code: "TEA-002", sales: 98, revenue: "$18.5" },
  {
    name: "Wireless Headphones",
    code: "ELL-003",
    sales: 67,
    revenue: "$199.99",
  },
];

// Quick actions
const quickActions = [
  { name: "Add New Product", icon: Plus },
  { name: "View All Orders", icon: Eye },
  { name: "Manage Deliveries", icon: Settings },
  { name: "View Customers", icon: Users },
];

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    "OUT FOR DELIVERY": "bg-orange-100 text-orange-800",
    PREPARING: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setUser(parsed.user);
      } catch (err) {
        console.error("Invalid auth data", err);
      }
    }
  }, []);
  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-blue-100 text-sm lg:text-base">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <Card
              key={idx}
              className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.value}
                </div>
                <p
                  className={`text-xs ${
                    kpi.positive ? "text-green-600" : "text-red-600"
                  } flex items-center gap-1`}
                >
                  <TrendingUp
                    className={`h-3 w-3 ${kpi.positive ? "" : "rotate-180"}`}
                  />
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Trend & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </CardTitle>
            <p className="text-sm text-gray-500">
              Monthly revenue for the past 6 months
            </p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Revenue chart will be implemented with recharts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Order Status Distribution
            </CardTitle>
            <p className="text-sm text-gray-500">
              Current order status breakdown
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderStatusData.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {status.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {status.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Orders
              </CardTitle>
              <p className="text-sm text-gray-500">
                Latest orders from your customers
              </p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              <Eye className="h-4 w-4" />
              View All
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="space-y-1 sm:space-y-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {order.id}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="text-lg font-bold text-gray-900">
                    {order.amount}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <IconComponent className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.name}
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Selling Products
          </CardTitle>
          <p className="text-sm text-gray-500">
            Your best performing products this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">{product.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {product.sales} sales
                  </p>
                  <p className="text-sm text-gray-500">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
