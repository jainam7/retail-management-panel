"use client";

import React, { useState } from "react";
import { useInventory } from "@/features/inventory/redux/useInventory";
import { Product } from "@/features/inventory/types";
import InventoryHeader from "@/features/inventory/component/InventoryHeader";
import LowStockAlert from "@/features/inventory/component/LowStockAlert";
import FiltersSection from "@/features/inventory/component/FiltersSection";
import ProductsTable from "@/features/inventory/component/ProductsTable";
import Pagination from "@/features/inventory/component/Pagination";
import AddProductModal from "@/features/inventory/component/AddProductModal";
import DeleteConfirmModal from "@/features/inventory/component/DeleteConfirmModal";
import { Download } from "lucide-react";

const InventoryPage: React.FC = () => {
  const {
    products,
    filteredProducts,
    filters,
    pagination,
    loading,
    error,
    isAddProductModalOpen,
    selectedProduct,
    sortBy,
    sortOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    updatePagination,
    updateSorting,
    openAddProductModal,
    closeAddProductModal,
    selectProduct,
    exportToCSV,
  } = useInventory();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSort = (column: string) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    updateSorting(column, newSortOrder);
  };

  const handleEdit = (product: Product) => {
    selectProduct(product);
    openAddProductModal();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleRestock = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const updatedProduct = {
        ...product,
        stock: product.stock + 50, // Add 50 units
        updatedAt: new Date(),
      };
      updateProduct(updatedProduct);
    }
  };

  const clearAllFilters = () => {
    updateFilters({
      search: "",
      category: "",
      status: "",
      priceRange: [0, 1000],
      stockRange: [0, 100],
    });
  };

  const totalPages = Math.ceil(filteredProducts.length / pagination.limit);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Inventory
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4">
            <span className="text-gray-500">🏠</span>
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-400">${">"}</span>
            <span className="font-medium text-gray-900">Inventory</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <InventoryHeader onAddProduct={openAddProductModal} />

        {/* Low Stock Alert */}
        <LowStockAlert products={products} onRestock={handleRestock} />

        {/* Filters */}
        <FiltersSection
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearAllFilters}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={() =>
            setShowAdvancedFilters(!showAdvancedFilters)
          }
        />

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            <Download size={16} />
            Export to CSV
          </button>
        </div>

        {/* Products Table */}
        {/* <ProductsTable
          products={filteredProducts}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
        /> */}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => updatePagination({ page })}
          onItemsPerPageChange={(limit) => updatePagination({ limit, page: 1 })}
        />

        {/* Modals */}
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={closeAddProductModal}
          onSubmit={selectedProduct ? updateProduct : addProduct}
          editingProduct={selectedProduct}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          productName={productToDelete?.name || ""}
        />
      </div>
    </div>
  );
};

export default InventoryPage;
