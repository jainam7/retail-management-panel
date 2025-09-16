export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryFilters {
  search: string;
  category: string;
  status: string;
  priceRange: [number, number];
  stockRange: [number, number];
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
