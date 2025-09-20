"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

export default function BusinessTab({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    businessName: user?.businessName || "",
    businessAddress: user?.businessAddress || "",
    businessPhone: user?.businessPhone || "",
    businessCategory: user?.businessCategory || "Retail",
  });

  const handleSave = () => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    authData.user = { ...authData.user, ...formData };
    localStorage.setItem("auth", JSON.stringify(authData));
    alert("Business info updated successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <Building2 className="h-5 w-5" /> Business Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Manage your business details and preferences
      </p>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Business Address"
          value={formData.businessAddress}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Business Phone"
            value={formData.businessPhone}
            onChange={(e) =>
              setFormData({ ...formData, businessPhone: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <select
            value={formData.businessCategory}
            onChange={(e) =>
              setFormData({ ...formData, businessCategory: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Fashion & Apparel">Fashion & Apparel</option>
            <option value="Service">Service</option>
          </select>
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
