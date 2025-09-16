import React from "react";
import { AlertTriangle } from "lucide-react";
import { Product } from "../types";

interface LowStockAlertProps {
  products: Product[];
  onRestock: (productId: string) => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({
  products,
  onRestock,
}) => {
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.lowStockThreshold
  );

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-yellow-800 font-medium">Low Stock Alert</h3>
          <p className="text-yellow-700 text-sm mt-1">
            {lowStockProducts.length} product(s) are running low on stock
          </p>
          <div className="mt-3 space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white p-3 rounded border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded ml-2">
                      {product.stock} left
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRestock(product.id)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
