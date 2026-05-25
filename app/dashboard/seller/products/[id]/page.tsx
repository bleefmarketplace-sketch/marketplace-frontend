"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Star,
  Leaf,
  Loader2,
  AlertCircle,
  Edit3,
  BarChart3,
  TrendingUp,
  Package,
  Trash2,
  CheckCircle2,
  Archive,
  ShoppingBag,
  X
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import ProductModal from "@/components/SellerComponents/ProductModal";
import { useApi } from "@/hooks/useApi";

const SellerProductPerformancePage = () => {
  const fetcher = useApi();
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await fetcher(`/api/products/${id}`);
      setProduct(res);
      setActiveImage(res.primaryImage);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleToggleStatus = async () => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    setLoading(true);
    try {
      await fetcher(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      toast.success(`Product status updated to ${newStatus}`);
      await fetchProduct();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs">
        <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Telemetry...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full border border-zinc-200 bg-white p-8 md:p-12 text-center space-y-6 font-mono text-xs animate-in fade-in duration-300">
        <AlertCircle size={40} className="text-red-650 mx-auto" />
        <div className="space-y-1">
          <span className="px-2 py-0.5 text-[9px] font-mono bg-red-50 text-red-800 border border-red-200 font-bold uppercase tracking-widest">
            REGISTRY FAILED
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 pt-2">Product Not Found</h1>
          <p className="text-zinc-500 text-[10px] pt-1">The specified produce lot could not be loaded from active silo databases.</p>
        </div>
        <div className="pt-2">
          <Button onClick={() => router.back()} className="rounded-none h-10 px-6 font-bold uppercase tracking-wider">
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;

    try {
      await fetcher(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      router.push("/dashboard/seller/products");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const allImages = [product.primaryImage, ...(product.otherImages || [])];

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/seller/products')}
            className="flex items-center text-zinc-500 hover:text-zinc-950 transition-colors mb-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
          >
            <ChevronLeft size={14} className="mr-1" /> Back to Inventory
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950">{product.title}</h1>
            <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border ${
              product.status === 'published' 
                ? 'border-green-200 bg-green-50 text-green-800' 
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              {product.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-none h-8 text-[10px]" onClick={() => setIsEditModalOpen(true)}>
            <Edit3 size={14} className="mr-1.5" /> Edit Product
          </Button>
          <Button 
            onClick={handleToggleStatus} 
            variant={product.status === 'published' ? 'outline' : 'primary'}
            className="rounded-none h-8 text-[10px] uppercase font-bold tracking-wider"
          >
            {product.status === 'published' ? (
              <><Archive size={14} className="mr-1.5"/> Unpublish Listing</>
            ) : (
              <><CheckCircle2 size={14} className="mr-1.5"/> Publish</>
            )}
          </Button>
        </div>
      </div>

      {/* PERFORMANCE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<TrendingUp className="text-green-700" />} label="Total Revenue" value={`₦${(Number(product.price) * (product.totalSales || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <MetricCard icon={<ShoppingBag className="text-zinc-650" />} label="Items Sold" value={(product.totalSales || 0).toLocaleString()} />
        <MetricCard icon={<Package className={product.stock < 10 ? "text-red-650" : "text-green-700"} />} label="Stock Level" value={`${product.stock} units`} />
        <MetricCard icon={<Star className="text-amber-500" />} label="Rating Index" value={`${product.averageRating || '0.0'} (${product.reviewCount})`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT: VISUALS & DESCRIPTION */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden border border-zinc-200 rounded-none bg-white shadow-none">
            <div className="relative aspect-video w-full bg-zinc-50 border-b border-zinc-150">
              <Image src={activeImage || "/placeholder.png"} alt="Product" fill className="object-cover" unoptimized />
            </div>
            <div className="p-3.5 flex gap-2 overflow-x-auto select-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 rounded-none overflow-hidden border flex-shrink-0 cursor-pointer ${activeImage === img ? 'border-green-700' : 'border-zinc-250'}`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-3.5 pb-2 border-b border-zinc-100">Batch Specifications</h3>
            <p className="text-zinc-650 leading-relaxed font-sans text-xs">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {Object.entries(product.attributes || {}).map(([key, value]) => (
                <div key={key} className="border-b border-zinc-150 pb-2">
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">{key}</p>
                  <p className="text-xs font-bold text-zinc-900 mt-0.5">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: INSIGHTS & ACTIONS */}
        <div className="space-y-4">
          <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-3.5 pb-2 border-b border-zinc-100 flex items-center gap-2">
              <BarChart3 size={15} className="text-green-700 animate-pulse" /> Telemetry Insights
            </h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Visibility Status</span>
                <span className="font-bold text-green-700 uppercase tracking-widest text-[9px] px-1.5 py-0.5 bg-green-50 border border-green-200">Optimized</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Organic Status</span>
                <span className="flex items-center gap-1 font-bold text-zinc-950 uppercase tracking-wider">
                  {product.isOrganic ? <Leaf size={12} className="text-green-700" /> : <AlertCircle size={12} className="text-zinc-400" />}
                  {product.isOrganic ? 'Certified Organic' : 'Non-organic'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Storage Terminal</span>
                <span className="font-bold flex items-center gap-1 text-zinc-950 uppercase tracking-wider"><MapPin size={12} /> {product.location}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-red-200 bg-red-50/20 rounded-none shadow-none space-y-3">
            <h3 className="font-bold text-red-800 uppercase tracking-wider">Danger command Zone</h3>
            <p className="text-[10px] text-red-700 leading-normal">Archiving this batch will remove listing visibility from marketplace searches immediately.</p>
            <Button variant="ghost" className="w-full text-red-650 hover:bg-red-50/60 border border-red-200 rounded-none text-[10px] uppercase font-bold tracking-wider py-2" onClick={() => handleDeleteProduct(product.id)}>
              <Trash2 size={14} className="mr-1.5" /> Archive Permanently
            </Button>
          </Card>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (payload) => {
            await fetcher(`/api/products/${product.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            fetchProduct();
            setIsEditModalOpen(false);
          }}
          initialData={product}
        />
      )}
    </div>
  );
};

// --- Helper Component for Stats ---
const MetricCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <Card className="p-4 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
    <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 text-zinc-800 rounded-none flex items-center justify-center shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-base font-black text-zinc-950 font-mono leading-none truncate">{value}</p>
    </div>
  </Card>
);

export default SellerProductPerformancePage;