"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Edit2, Plus, Search, Trash2, Loader2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import ProductModal from "@/components/SellerComponents/ProductModal";
import { Product } from "@/components/types"; // Ensure this type matches your new Entity
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { SellerSetupGuard } from "@/components/SellerComponents/SellerSetupGuard";
import { useAuth } from "@/context/AuthContext";


const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { user } = useAuth();
  const fetcher = useApi()

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /* ---------------- FETCH WITH PAGINATION & SEARCH ---------------- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const url = `/api/products/seller-products?limit=${ITEMS_PER_PAGE}&offset=${offset}&search=${searchTerm}`;

      const res = await fetcher(url);
      const { data } = res
      setProducts(data?.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, fetcher]);

  useEffect(() => {
    if (user?.hasCreatedStore) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts();
      }, 500); // Debounce search to save API calls
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchProducts, user, searchTerm, page]);

  /* ---------------- SAVE (CREATE OR UPDATE) ---------------- */
  const handleSave = async (payload: any) => {
    try {
      const isEditing = !!editingProduct;
      const url = isEditing
        ? `/api/products/${editingProduct.id}`
        : "/api/products";

      const method = isEditing ? "PATCH" : "POST";

      await fetcher(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });



      await fetchProducts(); // Refresh list
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      throw err; // Let the Modal handle the toast error
    }
  };

  /* ---------------- DELETE (ARCHIVE) ---------------- */
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;

    try {
      await fetcher(`/api/products/${id}`, { method: "DELETE" });

      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /* ---------------- FILTERING ---------------- */
  // const filteredProducts = products.filter((p) =>
  //   p.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <SellerSetupGuard>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}>
              <Plus size={18} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>

        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-500 mb-2" size={32} />

              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No products found in your inventory.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="bg-white hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12  shrink-0">
                              <Image
                                src={product.primaryImage || "/placeholder.png"}
                                fill
                                className="rounded-lg object-cover border border-gray-200"
                                alt={product.title}
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{product.title}</span>
                              <span className="text-xs text-gray-400">ID: {product.id.split("-")[0]}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">

                          {product.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₦{Number(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${product.stock < 10 ? "bg-red-500" : "bg-green-500"}`}></span>
                              {product.stock} units
                            </div>
                            <span className={`text-[10px] uppercase font-bold ${product.status === "published" ? 'text-green-600' : 'text-orange-500'}`}>
                              {product.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2   transition-opacity">
                            <Link
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              href={`/marketplace/${product.slug}`}
                             /*  href={`/dashboard/seller/products/${product.id}`} */
                              >
                              <Eye size={16} />
                            </Link>
                            <button
                              title="Edit Product"
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              title="Archive Product"
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {!loading && total > ITEMS_PER_PAGE && (
              <div className="p-6 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Showing {products.length} of {total} items
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="flex items-center px-4 text-sm font-bold">{page}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page * ITEMS_PER_PAGE >= total}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {isProductModalOpen && (
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            onSave={handleSave}
            initialData={editingProduct}
          />
        )}
      </div>
    </SellerSetupGuard>
  );
};

export default Page;