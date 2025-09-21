"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SecurityTab() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Password changed successfully!");
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  const passwordFields = [
    {
      key: "currentPassword",
      label: "Current Password",
      placeholder: "Enter your current password",
    },
    {
      key: "newPassword",
      label: "New Password",
      placeholder: "Enter your new password",
    },
    {
      key: "confirmPassword",
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Security Settings
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your password and security preferences
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6">
          {passwordFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label
                htmlFor={field.key}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </Label>
              <div className="relative">
                <Input
                  id={field.key}
                  type={
                    showPassword[field.key as keyof typeof showPassword]
                      ? "text"
                      : "password"
                  }
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field.key]: !prev[field.key as keyof typeof prev],
                    }))
                  }
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {showPassword[field.key as keyof typeof showPassword] ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Password Requirements */}
        {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Password Requirements:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character</li>
          </ul>
        </div> */}

        {/* Save Button */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
          <Button
            onClick={handleChangePassword}
            // disabled={
            //   isSaving ||
            //   !formData.currentPassword ||
            //   !formData.newPassword ||
            //   !formData.confirmPassword
            // }
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Changing Password..." : "Change Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
