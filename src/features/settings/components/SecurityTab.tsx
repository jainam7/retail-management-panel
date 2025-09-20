"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

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

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5" /> Security Settings
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Manage your password and security preferences
      </p>

      <div className="grid gap-4">
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
          <div className="relative" key={field}>
            <input
              type={
                showPassword[field as keyof typeof showPassword]
                  ? "text"
                  : "password"
              }
              placeholder={
                field === "currentPassword"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"
              }
              value={formData[field as keyof typeof formData]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  [field]: !prev[field as keyof typeof prev],
                }))
              }
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword[field as keyof typeof showPassword] ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleChangePassword}
        className="mt-4 px-4 py-2 bg-black text-white rounded flex items-center gap-2"
      >
        🔒 Change Password
      </button>
    </div>
  );
}
