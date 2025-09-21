"use client";

import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BusinessTab({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    businessName: user?.businessName || "",
    businessAddress: user?.businessAddress || "",
    businessPhone: user?.businessPhone || "",
    businessCategory: user?.businessCategory || "Retail",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      authData.user = { ...authData.user, ...formData };
      localStorage.setItem("auth", JSON.stringify(authData));
      setIsSaving(false);
      alert("Business info updated successfully!");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Business Information
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your business details and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label
              htmlFor="businessName"
              className="text-sm font-medium text-gray-700"
            >
              Business Name
            </Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Business Address */}
          <div className="space-y-2">
            <Label
              htmlFor="businessAddress"
              className="text-sm font-medium text-gray-700"
            >
              Business Address
            </Label>
            <Textarea
              id="businessAddress"
              placeholder="Enter your business address"
              value={formData.businessAddress}
              onChange={(e) =>
                setFormData({ ...formData, businessAddress: e.target.value })
              }
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Phone and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Business Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="businessPhone"
                className="text-sm font-medium text-gray-700"
              >
                Business Phone
              </Label>
              <Input
                id="businessPhone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.businessPhone}
                onChange={(e) =>
                  setFormData({ ...formData, businessPhone: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Business Category */}
            <div className="space-y-2">
              <Label
                htmlFor="businessCategory"
                className="text-sm font-medium text-gray-700"
              >
                Business Category
              </Label>
              <Select
                value={formData.businessCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessCategory: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Wholesale">Wholesale</SelectItem>
                  <SelectItem value="Fashion & Apparel">
                    Fashion & Apparel
                  </SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Food & Beverage">
                    Food & Beverage
                  </SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
