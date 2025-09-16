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
} from "recharts";
import { useMemo } from "react";

// Dummy KPI data
const kpis = [
  { title: "Total Orders", value: 1240 },
  { title: "Monthly Income", value: "₹4,52,000" },
  { title: "Active Products", value: 320 },
  { title: "Pending Deliveries", value: 48 },
];

// Revenue data
const revenueData = [
  { month: "Apr", revenue: 40000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 48000 },
  { month: "Jul", revenue: 60000 },
  { month: "Aug", revenue: 72000 },
  { month: "Sep", revenue: 68000 },
];

// Order distribution data
const distributionData = [
  { name: "Pending", value: 24 },
  { name: "Confirmed", value: 40 },
  { name: "Delivered", value: 80 },
  { name: "Cancelled", value: 10 },
];
const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#ef4444"];

// Top products
const topProducts = [
  { name: "Product A", sales: 120 },
  { name: "Product B", sales: 90 },
  { name: "Product C", sales: 75 },
];

// Recent activity
const recentActivity = [
  "Order #1023 confirmed",
  "Product C stock updated",
  "Order #1022 delivered",
  "New user registered",
];

export default function Dashboard() {
  const totalRevenue = useMemo(
    () => revenueData.reduce((sum, item) => sum + item.revenue, 0),
    []
  );

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue + Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Distribution */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topProducts.map((product, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.sales} sales</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentActivity.map((item, idx) => (
                <li key={idx} className="text-sm">
                  • {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
