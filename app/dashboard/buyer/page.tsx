'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Heart, MapPin, Search, ShieldCheck,
  SlidersHorizontal, Star, X, Loader2,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CATEGORIES } from '@/components/constants';
import { useBuyer } from '@/context/BuyerContext';
import { Product } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const { addItem } = useCartStore();

  const {
    wishlist,
    toggleWishlist,
  } = useBuyer();

  /* ------------------------------------------------------------------ */
  /* Local State — products now come from the real API                   */
  /* ------------------------------------------------------------------ */
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  /* ------------------------------------------------------------------ */
  /* Fetch products from API                                             */
  /* ------------------------------------------------------------------ */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      params.set('limit', '20');

      const res = await fetch(`/api/marketplace?${params.toString()}`);
      const data = await res.json();
      setProducts(data.data || data || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const delay = setTimeout(fetchProducts, 400);
    return () => clearTimeout(delay);
  }, [fetchProducts]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                            */
  /* ------------------------------------------------------------------ */
  const handleProductClick = (product: Product) => {
    router.push(`/marketplace/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.title} added to cart`);
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for tractors, seeds, livestock..."
              icon={<Search size={18} />}
              className="shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            className="px-3"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal size={18} />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">Filters</h3>
              <button
                onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setShowFilters(false);
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Reset All
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price Range (₦)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={priceRange.min}
                  onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={priceRange.max}
                  onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Browse by Category</h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Clear Filter <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {[{ name: 'All', icon: '🌿' }, ...CATEGORIES].map((cat, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl border transition-all ${
                selectedCategory === cat.name
                  ? 'bg-primary-600 border-primary-600 shadow-md'
                  : 'bg-white border-gray-100 hover:border-primary-500'
              }`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {searchQuery
              ? `Results for "${searchQuery}" (${total})`
              : selectedCategory !== 'All'
              ? `${selectedCategory} Products`
              : 'Featured Products'}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-500">No products found</h3>
            <p className="text-sm text-gray-400 mt-1">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const isLiked = wishlist.some(w => w.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg cursor-pointer transition-shadow group"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-4/3">
                    <Image
                      fill
                      src={product.primaryImage || '/placeholder.png'}
                      alt={product.title}
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full"
                      onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                    >
                      <Heart
                        size={16}
                        className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                      />
                    </button>
                    <Button
                      size="sm"
                      className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => handleAddToCart(e, product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{product.title}</h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {product.location}
                    </div>
                    {product.averageRating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-600">{product.averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      </div>
                    )}
                    <div className="font-bold text-emerald-600 mt-2 text-sm">
                      ₦{Number(product.price).toLocaleString()}
                    </div>
                    {product.isOrganic && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                        🌿 Organic
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Verified Vendors Banner */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Verified Vendors</h2>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/buyer/vendors')}>
            View All
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {['GreenEarth Co.', 'Happy Farms', 'SeedGen'].map(vendor => (
            <div key={vendor} className="bg-white p-4 rounded-xl flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                {vendor[0]}
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-1 text-sm">
                  {vendor} <ShieldCheck size={14} className="text-emerald-500" />
                </h4>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;