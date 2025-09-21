"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, RotateCcw, Save, Edit3, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
  isActive: boolean;
  isFeatured: boolean;
  onSale: boolean;
  lastUpdated: string;
}

interface EditProductPageProps {
  product?: Product;
  onBack?: () => void;
  onSave?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onRestore?: (product: Product) => void;
}

export default function EditProductPage({
  product: initialProduct,
  onSave,
  onDuplicate,
  onRestore,
}: EditProductPageProps) {
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      id: "SAMPLE-001",
      name: "Sample Product",
      sku: "SAMPLE-001",
      category: "Electronics",
      brand: "",
      description:
        "This is a sample product for demonstration purposes. It showcases all the features of the update form.",
      price: 99.99,
      stock: 50,
      status: "Active",
      isActive: true,
      isFeatured: false,
      onSale: false,
      lastUpdated: "15/01/2024",
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof Product, value: unknown) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave?.(product);
    }, 1000);
  };

  const handleReset = () => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}

        {/* Product Info Card */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-gray-600" />
                <div>
                  <CardTitle className="text-lg">
                    Update Product: {product.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Update product details and configuration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate?.(product)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore?.(product)}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {product.stock}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {product.status}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{product.lastUpdated}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Card>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 h-auto">
              <TabsTrigger value="basic" className="py-3">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="pricing" className="py-3">
                Pricing & Stock
              </TabsTrigger>
              <TabsTrigger value="media" className="py-3">
                Media & Tags
              </TabsTrigger>
              <TabsTrigger value="advanced" className="py-3">
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-sm font-medium">
                    Product Name *
                  </Label>
                  <Input
                    id="productName"
                    value={product.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    value={product.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter SKU"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </Label>
                  <Select
                    value={product.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={product.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter product description"
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">
                      Active Product
                    </Label>
                    <p className="text-xs text-gray-600">
                      Enable this product for sale
                    </p>
                  </div>
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">
                      Featured Product
                    </Label>
                    <p className="text-xs text-gray-600">
                      Show this product in featured section
                    </p>
                  </div>
                  <Switch
                    checked={product.isFeatured}
                    onCheckedChange={(checked) =>
                      handleInputChange("isFeatured", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">On Sale</Label>
                    <p className="text-xs text-gray-600">
                      Mark this product as on sale
                    </p>
                  </div>
                  <Switch
                    checked={product.onSale}
                    onCheckedChange={(checked) =>
                      handleInputChange("onSale", checked)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pricing & Stock Tab */}
            <TabsContent value="pricing" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Pricing & Stock Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleInputChange("price", parseFloat(e.target.value))
                      }
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        handleInputChange("stock", parseInt(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Media & Tags Tab */}
            <TabsContent value="media" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Media & Tags
                </h3>
                <p className="text-gray-600">
                  Upload product images and manage tags here.
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-500">
                    Media upload functionality coming soon
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Advanced Settings
                </h3>
                <p className="text-gray-600">
                  Advanced product configuration options.
                </p>
                <div className="border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-500 text-center">
                    Advanced settings coming soon
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="border-t bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Link href={{ pathname: "/inventory" }}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
