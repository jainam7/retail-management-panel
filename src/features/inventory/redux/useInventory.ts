import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setProducts,
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  setFilters,
  setPagination,
  setLoading,
  setAddProductModalOpen,
  setSelectedProduct,
  setSorting,
  applyFilters,
} from "./inventorySlices";
import { Product, InventoryFilters, PaginationState } from "../types";

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    sku: "COF-001",
    category: "Beverages",
    price: 24.99,
    costPrice: 15.99,
    salePrice: 22.99,
    stock: 45,
    lowStockThreshold: 10,
    images: ["/api/placeholder/200/200"],
    description: "High-quality arabica coffee beans",
    tags: ["coffee", "premium", "arabica"],
    isActive: true,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    id: "2",
    name: "Organic Green Tea",
    sku: "TEA-002",
    category: "Beverages",
    price: 18.5,
    costPrice: 12.0,
    stock: 5,
    lowStockThreshold: 8,
    images: ["/api/placeholder/200/200"],
    description: "Premium organic green tea leaves",
    tags: ["tea", "organic", "green"],
    isActive: true,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    id: "3",
    name: "Chocolate Cookies",
    sku: "COK-003",
    category: "Snacks",
    price: 12.99,
    costPrice: 8.99,
    stock: 25,
    lowStockThreshold: 5,
    images: ["/api/placeholder/200/200"],
    description: "Delicious chocolate chip cookies",
    tags: ["cookies", "chocolate", "sweet"],
    isActive: true,
    createdAt: new Date("2024-09-14"),
    updatedAt: new Date("2024-09-14"),
  },
];

export const useInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state: RootState) => state.inventory);

  const initializeProducts = useCallback(() => {
    dispatch(setLoading(true));
    // Simulate API call
    setTimeout(() => {
      dispatch(setProducts(mockProducts));
      dispatch(applyFilters());
      dispatch(setLoading(false));
    }, 500);
  }, [dispatch]);

  const addProduct = useCallback(
    (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch(addProductAction(newProduct));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const updateProduct = useCallback(
    (product: Product) => {
      const updatedProduct = {
        ...product,
        updatedAt: new Date(),
      };
      dispatch(updateProductAction(updatedProduct));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      dispatch(deleteProductAction(id));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters: Partial<InventoryFilters>) => {
      dispatch(setFilters(filters));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const updatePagination = useCallback(
    (pagination: Partial<PaginationState>) => {
      dispatch(setPagination(pagination));
    },
    [dispatch]
  );

  const updateSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      dispatch(setSorting({ sortBy, sortOrder }));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const openAddProductModal = useCallback(() => {
    dispatch(setAddProductModalOpen(true));
  }, [dispatch]);

  const closeAddProductModal = useCallback(() => {
    dispatch(setAddProductModalOpen(false));
    dispatch(setSelectedProduct(null));
  }, [dispatch]);

  const selectProduct = useCallback(
    (product: Product | null) => {
      dispatch(setSelectedProduct(product));
    },
    [dispatch]
  );

  const exportToCSV = useCallback(() => {
    const csvContent = [
      ["Name", "SKU", "Category", "Price", "Stock", "Status"],
      ...inventory.filteredProducts.map(
        (product: {
          name: any;
          sku: any;
          category: any;
          price: { toString: () => any };
          stock: { toString: () => any };
          isActive: any;
        }) => [
          product.name,
          product.sku,
          product.category,
          product.price.toString(),
          product.stock.toString(),
          product.isActive ? "Active" : "Inactive",
        ]
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }, [inventory.filteredProducts]);

  useEffect(() => {
    if (inventory.products.length === 0) {
      initializeProducts();
    }
  }, [initializeProducts, inventory.products.length]);

  return {
    ...inventory,
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
    initializeProducts,
  };
};
