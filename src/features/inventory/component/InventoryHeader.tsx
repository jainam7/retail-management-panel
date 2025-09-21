import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

const InventoryHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your product inventory and stock levels
        </p>
      </div>
      <Link href={{ pathname: "/inventory/add" }}>
        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus size={16} />
          Add Product
        </button>
      </Link>
    </div>
  );
};

export default InventoryHeader;
