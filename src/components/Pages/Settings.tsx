"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/features/settings/components/ProfileTab";
import BusinessTab from "@/features/settings/components/BusinessTab";
import SecurityTab from "@/features/settings/components/SecurityTab";
import NotificationsTab from "@/features/settings/components/NotificationTab";

export default function SettingsPage() {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-gray-600 mb-6">
        Manage your account and application preferences
      </p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted text-muted-foreground h-9 items-center justify-center rounded-lg p-[3px] grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>

        <TabsContent value="business">
          <BusinessTab user={user} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
