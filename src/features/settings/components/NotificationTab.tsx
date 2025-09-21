"use client";

import React, { useState } from "react";
import { Bell, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  lowStockAlerts: boolean;
  deliveryUpdates: boolean;
  marketingEmails: boolean;
}

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    orderUpdates: true,
    lowStockAlerts: true,
    deliveryUpdates: true,
    marketingEmails: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // You could show a success message here
    }, 1500);
  };

  const notificationItems = [
    {
      key: "emailNotifications" as keyof NotificationSettings,
      title: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "orderUpdates" as keyof NotificationSettings,
      title: "Order Updates",
      description: "Get notified about order status changes",
    },
    {
      key: "lowStockAlerts" as keyof NotificationSettings,
      title: "Low Stock Alerts",
      description: "Get notified when products are running low",
    },
    {
      key: "deliveryUpdates" as keyof NotificationSettings,
      title: "Delivery Updates",
      description: "Get notified about delivery status changes",
    },
    {
      key: "marketingEmails" as keyof NotificationSettings,
      title: "Marketing Emails",
      description: "Receive promotional emails and updates",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Section Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Notification Preferences
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Choose what notifications you want to receive
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6 lg:space-y-8">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={item.key}
                  className="text-base sm:text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {item.title}
                </Label>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {item.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  id={item.key}
                  checked={notifications[item.key]}
                  onCheckedChange={() => handleToggle(item.key)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
