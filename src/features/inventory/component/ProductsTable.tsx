import React from "react";
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Product } from "../types";
import Link from "next/link";

interface ProductsTableProps {
  products: Product[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: any) => void;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  loading,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.lowStockThreshold) {
      return { label: "low", className: "bg-orange-100 text-orange-800" };
    }
    return { label: "good", className: "bg-green-100 text-green-800" };
  };

  const SortableHeader: React.FC<{
    column: string;
    children: React.ReactNode;
  }> = ({ column, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === column &&
          (sortOrder === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-medium">Products ({products.length})</h3>
        <p className="text-sm text-gray-500 mt-1">
          Showing {startIndex + 1} of {products.length} products
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader column="name">Product</SortableHeader>
              <SortableHeader column="sku">SKU</SortableHeader>
              <SortableHeader column="category">Category</SortableHeader>
              <SortableHeader column="price">Price</SortableHeader>
              <SortableHeader column="stock">Stock</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader column="updatedAt">Last Updated</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-lg">📦</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.className}`}
                      >
                        {product.stock} {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Link
                          href={{ pathname: `/inventory/edit/${product.id}` }}
                        >
                          <button
                            // onClick={() => onEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => onDelete(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr
                data-slot="table-row"
                className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
              >
                <td
                  data-slot="table-cell"
                  className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-center py-8 text-gray-500"
                  colSpan={8}
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
