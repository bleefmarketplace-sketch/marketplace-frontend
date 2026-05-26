"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Edit2, Plus, Search, Trash2, Loader2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import ProductModal from "@/components/SellerComponents/ProductModal";
import { Product } from "@/components/types";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { SellerSetupGuard } from "@/components/SellerComponents/SellerSetupGuard";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { user } = useAuth();
  const fetcher = useApi();

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const lastFetchedRef = useRef<string>("");

  /* ---------------- FETCH WITH PAGINATION & SEARCH ---------------- */
  const fetchProducts = useCallback(async (force = false) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const queryKey = `${page}_${searchTerm}`;
    if (!force && lastFetchedRef.current === queryKey) return;
    lastFetchedRef.current = queryKey;

    setLoading(true);
    try {
      const url = `/api/products/seller-products?limit=${ITEMS_PER_PAGE}&offset=${offset}&search=${searchTerm}`;

      const res = await fetcher(url);
      const { data } = res;
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
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchProducts, user?.hasCreatedStore, searchTerm, page]);

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

      await fetchProducts(true);
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      throw err;
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

  return (
    <SellerSetupGuard>
      <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
        
        {/* Flat Command Controller Block */}
        <div className="border border-zinc-200 bg-white p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
              INVENTORY TELEMETRY
            </span>
            <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Active Produce Stocks</h1>
            <p className="text-zinc-500 text-[10px] mt-0.5">Manage batch codes, category tags, price details, and active cargo loads.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input
                type="text"
                placeholder="Filter stock entries..."
                className="pl-9 pr-4 py-1.5 border border-zinc-250 bg-white font-mono text-xs w-full focus:border-green-600 focus:outline-none rounded-none"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <Button 
              className="rounded-none h-8 text-[10px] uppercase font-bold tracking-wider" 
              onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            >
              <Plus size={14} className="mr-1.5" /> Add Product Batch
            </Button>
          </div>
        </div>

        {/* Flat Stock Table Container */}
        <Card noPadding className="overflow-hidden border border-zinc-200 rounded-none shadow-none bg-white">
          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 font-mono">
                <Loader2 className="animate-spin text-green-700 mb-2" size={24} />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Database...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] text-zinc-400 font-mono font-bold uppercase bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Product Batch</th>
                    <th className="px-5 py-3.5 font-bold">Category</th>
                    <th className="px-5 py-3.5 font-bold">Price Index</th>
                    <th className="px-5 py-3.5 font-bold">Stock Capacity</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        No active products found inside your command registry.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="bg-white hover:bg-zinc-50/40 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 shrink-0 border border-zinc-200 rounded-none bg-zinc-50 overflow-hidden">
                              <Image
                                src={product.primaryImage || "/placeholder.png"}
                                fill
                                className="object-cover"
                                alt={product.title}
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-zinc-950 uppercase tracking-wide truncate max-w-[200px]">{product.title}</span>
                              <span className="text-[9px] text-zinc-400 font-bold tracking-widest mt-0.5">ID: {product.id.split("-")[0].toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-zinc-650 uppercase tracking-wider font-bold">
                          <div className="flex flex-col">
                            <span>{product.category?.name || 'Uncategorized'}</span>
                            {product.subCategory && (
                              <span className="text-[9px] text-zinc-400 font-bold tracking-widest mt-0.5">
                                › {product.subCategory.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-zinc-950 font-mono">
                          ₦{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
                              <span className={`w-1.5 h-1.5 rounded-none ${product.stock < 10 ? "bg-red-650 animate-pulse" : "bg-green-600"}`}></span>
                              {product.stock} Units
                            </div>
                            <div>
                              <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border ${
                                product.status === "published" 
                                  ? "border-green-200 bg-green-50 text-green-800" 
                                  : "border-amber-200 bg-amber-50 text-amber-800"
                              }`}>
                                {product.status}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Link
                              className="p-1.5 border border-zinc-200 rounded-none text-zinc-450 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                              href={`/marketplace/${product.slug}`}
                              title="Preview on Marketplace"
                            >
                              <Eye size={13} />
                            </Link>
                            <button
                              title="Edit Product Details"
                              className="p-1.5 border border-zinc-200 rounded-none text-zinc-450 hover:text-green-700 hover:bg-green-50/60 transition-colors cursor-pointer"
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              title="Archive Product"
                              className="p-1.5 border border-zinc-200 rounded-none text-zinc-450 hover:text-red-650 hover:bg-red-50 transition-colors cursor-pointer"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={13} />
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
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between font-mono text-[9px] text-zinc-400 font-bold uppercase select-none">
                <p className="tracking-widest">
                  Showing {products.length} of {total} batch entries
                </p>
                <div className="flex gap-1.5 items-center">
                  <Button
                    variant="outline"
                    className="rounded-none h-7 px-2.5"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft size={12} />
                  </Button>
                  <div className="flex items-center px-3 text-zinc-800 font-bold text-xs">Page {page}</div>
                  <Button
                    variant="outline"
                    className="rounded-none h-7 px-2.5"
                    disabled={page * ITEMS_PER_PAGE >= total}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight size={12} />
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