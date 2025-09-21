/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { X, Upload, Plus, Minus } from "lucide-react";
import { Product } from "../types";
import Link from "next/link";

interface AddProductModalProps {
  onSubmit: (product: Product) => void;
  editingProduct?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  onSubmit,
  editingProduct,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

  const [formData, setFormData] = useState<ProductFormData>({
    name: editingProduct?.name || "",
    sku: editingProduct?.sku || "",
    category: editingProduct?.category || "",
    price: editingProduct?.price || 0,
    costPrice: editingProduct?.costPrice || 0,
    salePrice: editingProduct?.salePrice,
    stock: editingProduct?.stock || 0,
    lowStockThreshold: editingProduct?.lowStockThreshold || 10,
    images: editingProduct?.images || [],
    description: editingProduct?.description || "",
    tags: editingProduct?.tags || [],
    isActive: editingProduct?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const steps = [
    { title: "Basic Info", subtitle: "Product details and category" },
    { title: "Pricing & Stock", subtitle: "Price and inventory information" },
    { title: "Media & Tags", subtitle: "Images and product tags" },
    { title: "Advanced Settings", subtitle: "Additional configuration" },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.category.trim())
          newErrors.category = "Category is required";
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        break;
      case 2:
        if (formData.price <= 0)
          newErrors.price = "Price must be greater than 0";
        if (formData.costPrice <= 0)
          newErrors.costPrice = "Cost price must be greater than 0";
        if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
        if (formData.lowStockThreshold < 0)
          newErrors.lowStockThreshold = "Threshold cannot be negative";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const product: Product = {
        ...formData,
        id: editingProduct?.id ?? crypto.randomUUID(), // or however you generate IDs
        createdAt: editingProduct?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      onSubmit(product);

      setCurrentStep(1);
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: 0,
        costPrice: 0,
        salePrice: undefined,
        stock: 0,
        lowStockThreshold: 10,
        images: [],
        description: "",
        tags: [],
        isActive: true,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls].slice(0, 5),
      }));
    }
  };

  const addTag = () => {
    const input = document.getElementById("tagInput") as HTMLInputElement;
    if (input.value.trim() && !formData.tags.includes(input.value.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, input.value.trim()],
      }));
      input.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-4xl mx-auto">
      <div className="rounded-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Step {currentStep} of 4: {steps[currentStep - 1].subtitle}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      index + 1 <= currentStep
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ml-8 ${
                      index + 1 < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter SKU"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        costPrice: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.costPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.costPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Threshold *
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lowStockThreshold: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  />
                  {errors.lowStockThreshold && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lowStockThreshold}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images (Max 5)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop images here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="tagInput"
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tag and press Add"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Minus size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Product Status</h3>
                  <p className="text-sm text-gray-500">
                    Make product visible to customers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Product Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{formData.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      ${formData.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{formData.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        formData.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            <Link href={{ pathname: "/inventory" }}>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </Link>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
