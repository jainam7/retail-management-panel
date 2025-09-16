import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { InventoryFilters } from "../types";

interface FiltersSectionProps {
  filters: InventoryFilters;
  onFiltersChange: (filters: Partial<InventoryFilters>) => void;
  onClearFilters: () => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  showAdvancedFilters,
  onToggleAdvancedFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Debounced search
    setTimeout(() => {
      onFiltersChange({ search: value });
    }, 300);
  };

  const categories = [
    "All Categories",
    "Beverages",
    "Snacks",
    "Electronics",
    "Clothing",
  ];
  const statuses = ["All Status", "Active", "Inactive", "Low Stock"];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters & Search</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAdvancedFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Filter size={16} />
            Show Advanced Filters
          </button>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <X size={16} />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onFiltersChange({ category: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Items per page */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue="10"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    onFiltersChange({
                      priceRange: [
                        Number(e.target.value),
                        filters.priceRange[1],
                      ],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    onFiltersChange({
                      priceRange: [
                        filters.priceRange[0],
                        Number(e.target.value),
                      ],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Stock Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.stockRange[0]}
                  onChange={(e) =>
                    onFiltersChange({
                      stockRange: [
                        Number(e.target.value),
                        filters.stockRange[1],
                      ],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.stockRange[1]}
                  onChange={(e) =>
                    onFiltersChange({
                      stockRange: [
                        filters.stockRange[0],
                        Number(e.target.value),
                      ],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
