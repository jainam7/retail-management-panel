"use client";

import { useState, useEffect } from "react";
import { User, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileTab({ user }: { user: any }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Sync when `user` changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      authData.user = { ...authData.user, ...formData };
      localStorage.setItem("auth", JSON.stringify(authData));
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Update your personal information and contact details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label
              htmlFor="emailAddress"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
            />
          </div>
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
