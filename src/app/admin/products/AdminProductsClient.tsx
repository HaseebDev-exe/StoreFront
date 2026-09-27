"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import type { Product } from "@/db/schema";

interface AdminProductsClientProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Footwear",
  "Sports",
  "Home & Kitchen",
  "Other",
];

type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  stock: "",
  imageUrl: "",
};

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [productModal, setProductModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setFormData(emptyForm);
    setFormErrors({});
    setProductModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      imageUrl: product.imageUrl,
    });
    setFormErrors({});
    setProductModal(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      errors.price = "Valid price required";
    if (!formData.category) errors.category = "Category is required";
    if (
      formData.stock === "" ||
      isNaN(Number(formData.stock)) ||
      Number(formData.stock) < 0
    )
      errors.stock = "Valid stock (≥ 0) required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const data = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price).toFixed(2),
          category: formData.category,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl.trim(),
        };

        if (selectedProduct) {
          await updateProduct(selectedProduct.id, data);
          setProducts((prev) =>
            prev.map((p) =>
              p.id === selectedProduct.id
                ? {
                    ...p,
                    ...data,
                    price: data.price,
                  }
                : p,
            ),
          );
          toast.success("Product updated successfully!");
        } else {
          await createProduct(data);
          // Refetch would be ideal; for now show success
          toast.success("Product created! Refresh to see it.");
          // Optimistic update
          setProducts((prev) => [
            {
              id: Date.now(),
              ...data,
              createdAt: new Date(),
            },
            ...prev,
          ]);
        }
        setProductModal(false);
      } catch {
        toast.error("Failed to save product");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    startTransition(async () => {
      try {
        await deleteProduct(selectedProduct.id);
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
        toast.success("Product deleted successfully!");
        setDeleteModal(false);
      } catch {
        toast.error("Failed to delete product");
      }
    });
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm">
            Manage your product catalog ({products.length} total)
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-9"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-4 w-4 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1 md:hidden">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="info">{product.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          product.stock === 0
                            ? "destructive"
                            : product.stock <= 10
                              ? "warning"
                              : "success"
                        }
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 10
                            ? `${product.stock} left`
                            : `${product.stock} in stock`}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create/Edit Modal */}
      <Dialog open={productModal} onOpenChange={setProductModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? "Update the product details below."
                : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-1.5 block text-slate-700">Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Product name"
                className={formErrors.name ? "border-red-400" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block text-slate-700">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-slate-700">Price ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className={formErrors.price ? "border-red-400" : ""}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                )}
              </div>
              <div>
                <Label className="mb-1.5 block text-slate-700">Stock *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, stock: e.target.value }))
                  }
                  placeholder="0"
                  className={formErrors.stock ? "border-red-400" : ""}
                />
                {formErrors.stock && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block text-slate-700">Category *</Label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-1.5 block text-slate-700">Image URL</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() =>
                      setFormData((p) => ({ ...p, imageUrl: "" }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setProductModal(false)}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {selectedProduct ? "Update" : "Create"} Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedProduct?.name}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
