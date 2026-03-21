'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Plus, Leaf, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCartStore } from '@/store/useCartStore';
import { useTracking } from '@/hooks/useTracking';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Seller {
  id: string;
  businessName: string;
  isVerified: boolean;
  rating: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  primaryImage: string;
  location: string;
  averageRating: number;
  reviewCount: number;
  isOrganic: boolean;
  isVerifiedVendor: boolean;
  category?: Category;
  seller?: Seller;
}

interface DiscoveryFeedProps {
  title?: string;
  subtitle?: string;
  excludeProductId?: string;
  limit?: number;
}

export const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({
  title = 'Recommended for You',
  subtitle = 'Products based on your activity and trending items.',
  limit = 4,
  excludeProductId,
}) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { trackEvent } = useTracking();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDiscovery = async () => {
      try {
        const url = `/api/products/discovery?limit=${limit}${
          excludeProductId ? `&exclude=${excludeProductId}` : ''
        }`;

        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        setProducts(data?.data || []);
      } catch (error) {
        console.error('Discovery Feed Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiscovery();
  }, [limit, excludeProductId]);

  const handleProductClick = (product: Product) => {
    trackEvent('click', product.id, {
      category: product.category?.name,
      source: 'discovery_feed',
    });

    router.push(`/marketplace/product/${product.id}`);
  };

  const handleQuickAdd = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.stopPropagation();
    addItem(product, 1);

    trackEvent('cart_add', product.id, {
      category: product.category?.name,
    });

    toast.success(`${product.title} added to basket`);
  };

  if (loading) return <DiscoverySkeleton />;
  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
              <Image
              unoptimized
                src={product.primaryImage || '/placeholder.png'}
                alt={product.title}
                fill
                sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
                    <Leaf size={12} /> Organic
                  </span>
                )}

                {product.isVerifiedVendor && (
                  <span className="flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>

              {/* Quick Add */}
              <button
                onClick={(e) => handleQuickAdd(e, product)}
                className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-600 hover:text-white"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold uppercase">
                  {product.category?.name || 'General'}
                </span>

                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={14} fill="currentColor" />
                  {product.averageRating || 0}
                  <span className="text-gray-400 text-[11px]">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                {product.title}
              </h3>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  {product.location?.split(',')[0]}
                </div>
              </div>

              {/* Seller */}
              <div className="text-xs text-gray-400 pt-2 border-t">
                Sold by{' '}
                <span className="font-medium text-gray-600">
                  {product.seller?.businessName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DiscoverySkeleton = () => (
  <div className="py-16 animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-10" />
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-80" />
      ))}
    </div>
  </div>
);