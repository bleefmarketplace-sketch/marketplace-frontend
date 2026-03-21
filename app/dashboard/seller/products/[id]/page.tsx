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
  ShoppingBag
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import ProductModal from "@/components/SellerComponents/ProductModal";
import { useApi } from "@/hooks/useApi";

const SellerProductPerformancePage = () => {
  const fetcher = useApi()
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
    // Determine the next status based on exact backend strings
    const newStatus = product.status === 'published' ? 'draft' : 'published';

    setLoading(true);
    try {
        // Send ONLY the status change to the backend
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
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />

      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Button onClick={() => router.back()} className="mt-4">Back to Inventory</Button>
      </div>
    );
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;

    try {
      await fetcher(`/api/products/${id}`, { method: "DELETE" });

      toast.success("Product deleted");
      router.push("/dashboard/seller/products")
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const allImages = [product.primaryImage, ...(product.otherImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => router.push('/dashboard/seller/products')}
            className="flex items-center text-gray-500 hover:text-black transition mb-2 text-sm"
          >
            <ChevronLeft size={16} /> Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
           <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
    product.status === 'published' 
    ? 'bg-emerald-100 text-emerald-700' 
    : 'bg-amber-100 text-amber-700'
}`}>
    {product.status}
</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setIsEditModalOpen(true)}>
            <Edit3 size={18} className="mr-2" /> Edit Product
          </Button>
        <Button 
    onClick={handleToggleStatus} 
    variant={product.status === 'published' ? 'outline' : 'primary'}
    className="rounded-xl h-12 px-6 font-bold"
>
    {product.status === 'published' ? (
        <><Archive size={18} className="mr-2"/> Unpublish Listing</>
    ) : (
        <><CheckCircle2 size={18} className="mr-2"/> Publish</>
    )}
</Button>
        </div>
      </div>

      {/* PERFORMANCE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<TrendingUp className="text-blue-600" />} label="Total Revenue" value={`$${(Number(product.price) * (product.totalSales || 0)).toFixed(2)}`} />
        <MetricCard icon={<ShoppingBag className="text-green-600" />} label="Items Sold" value={product.totalSales || 0} />
        <MetricCard icon={<Package className={product.stock < 10 ? "text-red-600" : "text-primary-600"} />} label="Stock Level" value={`${product.stock} units`} />
        <MetricCard icon={<Star className="text-orange-500" />} label="Rating" value={`${product.averageRating || '0.0'} (${product.reviewCount})`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: VISUALS & DESCRIPTION */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="relative aspect-video w-full bg-gray-100">
              <Image src={activeImage || "/placeholder.png"} alt="Product" fill className="object-cover" unoptimized />
            </div>
            <div className="p-4 flex gap-2 overflow-x-auto">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === img ? 'border-primary-600' : 'border-transparent'}`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {Object.entries(product.attributes || {}).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">{key}</p>
                  <p className="text-sm font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: INSIGHTS & ACTIONS */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-600" /> Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Visibility</span>
                <span className="font-bold text-green-600">High</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Organic Status</span>
                <span className="flex items-center gap-1 font-bold">
                  {product.isOrganic ? <Leaf size={14} className="text-green-600" /> : <X size={14} />}
                  {product.isOrganic ? 'Certified' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-bold flex items-center gap-1"><MapPin size={14} /> {product.location}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-100 bg-red-50/30">
            <h3 className="font-bold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-xs text-red-600 mb-4">Deleting this product will remove all associated data and cannot be undone.</p>
            <Button variant="ghost" className="w-full text-red-600 hover:bg-red-100" onClick={() => handleDeleteProduct(product.id)}>
              <Trash2 size={18} className="mr-2" /> Delete Permanently
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
            // Re-use your save logic here
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
  <Card className="p-5 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-gray-50">{icon}</div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </Card>
);

const X = ({ size }: { size: number }) => <span style={{ fontSize: size }}>✕</span>;

export default SellerProductPerformancePage;