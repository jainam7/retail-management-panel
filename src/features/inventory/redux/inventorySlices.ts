/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, InventoryFilters, PaginationState } from "../types";

interface InventoryState {
  products: Product[];
  filteredProducts: Product[];
  filters: InventoryFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  isAddProductModalOpen: boolean;
  selectedProduct: Product | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const initialState: InventoryState = {
  products: [],
  filteredProducts: [],
  filters: {
    search: "",
    category: "",
    status: "",
    priceRange: [0, 1000],
    stockRange: [0, 100],
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  error: null,
  isAddProductModalOpen: false,
  selectedProduct: null,
  sortBy: "name",
  sortOrder: "asc",
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.pagination.total = action.payload.length;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.filteredProducts.push(action.payload);
      state.pagination.total += 1;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        const filteredIndex = state.filteredProducts.findIndex(
          (p) => p.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredProducts[filteredIndex] = action.payload;
        }
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.filteredProducts = state.filteredProducts.filter(
        (p) => p.id !== action.payload
      );
      state.pagination.total -= 1;
    },
    setFilters: (state, action: PayloadAction<Partial<InventoryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAddProductModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddProductModalOpen = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: "asc" | "desc" }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Category filter
      if (
        state.filters.category &&
        state.filters.category !== "All Categories"
      ) {
        filtered = filtered.filter(
          (product) => product.category === state.filters.category
        );
      }

      // Status filter
      if (state.filters.status && state.filters.status !== "All Status") {
        filtered = filtered.filter((product) => {
          if (state.filters.status === "Active") return product.isActive;
          if (state.filters.status === "Inactive") return !product.isActive;
          if (state.filters.status === "Low Stock")
            return product.stock <= product.lowStockThreshold;
          return true;
        });
      }

      // Price range filter
      filtered = filtered.filter(
        (product) =>
          product.price >= state.filters.priceRange[0] &&
          product.price <= state.filters.priceRange[1]
      );

      // Stock range filter
      filtered = filtered.filter(
        (product) =>
          product.stock >= state.filters.stockRange[0] &&
          product.stock <= state.filters.stockRange[1]
      );

      // Sorting
      filtered.sort((a, b) => {
        let aValue: any = a[state.sortBy as keyof Product];
        let bValue: any = b[state.sortBy as keyof Product];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (state.sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      state.filteredProducts = filtered;
      state.pagination.total = filtered.length;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  setPagination,
  setLoading,
  setError,
  setAddProductModalOpen,
  setSelectedProduct,
  setSorting,
  applyFilters,
} = inventorySlice.actions;

export default inventorySlice.reducer;
