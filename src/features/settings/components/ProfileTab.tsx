"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function ProfileTab({ user }: { user: any }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

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
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    authData.user = { ...authData.user, ...formData };
    localStorage.setItem("auth", JSON.stringify(authData));
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <User className="h-5 w-5" /> Profile Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Update your personal information and contact details
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-black text-white rounded flex items-center gap-2"
      >
        💾 Save Changes
      </button>
    </div>
  );
}
