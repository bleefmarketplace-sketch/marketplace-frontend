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
    <div className="space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for tractors, seeds, livestock, precision tools..."
              icon={<Search size={16} />}
              className="rounded-none border-zinc-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            className="px-3 rounded-none"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-none border border-zinc-200 shadow-none animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider">Operational Filters</h3>
              <button
                onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setShowFilters(false);
                }}
                className="text-[10px] text-red-650 hover:underline uppercase font-bold"
              >
                Reset All
              </button>
            </div>
            <div className="max-w-xs">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1 block">Price Range (₦)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border border-zinc-250 bg-white font-mono py-1 px-2 text-xs focus:border-green-600 focus:outline-none rounded-none"
                  value={priceRange.min}
                  onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span className="text-zinc-400">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border border-zinc-250 bg-white font-mono py-1 px-2 text-xs focus:border-green-600 focus:outline-none rounded-none"
                  value={priceRange.max}
                  onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <section className="border border-zinc-200 bg-white p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider">Browse by Category</h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-green-700 text-xs font-bold flex items-center gap-1 hover:underline uppercase tracking-wide"
            >
              Clear Filter <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {[{ name: 'All', icon: '🌿' }, ...CATEGORIES].map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={idx}
                className="group flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className={`w-14 h-14 rounded-none flex items-center justify-center text-xl border transition-colors ${
                  isSelected
                    ? 'bg-green-50 border-green-700 text-green-800 font-bold'
                    : 'bg-white border-zinc-200 hover:border-zinc-350'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-bold text-center uppercase tracking-wide ${isSelected ? 'text-green-800' : 'text-zinc-500'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider">
            {searchQuery
              ? `Results for "${searchQuery}" (${total})`
              : selectedCategory !== 'All'
              ? `${selectedCategory} Products`
              : 'Featured Marketplace Lots'}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 border border-zinc-200 bg-white">
            <Loader2 className="animate-spin text-green-700" size={24} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-none border border-zinc-200 font-mono">
            <Search className="mx-auto h-8 w-8 text-zinc-300 mb-3" />
            <h3 className="font-bold text-zinc-500 uppercase tracking-wider text-xs">No batches found</h3>
            <p className="text-[10px] text-zinc-400 mt-1">Refine your category filters or adjust search string terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => {
              const isLiked = wishlist.some(w => w.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-none border border-zinc-200 overflow-hidden hover:bg-zinc-50/40 cursor-pointer transition-colors group flex flex-col justify-between"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-4/3 border-b border-zinc-150 bg-zinc-50">
                    <Image
                      fill
                      src={product.primaryImage || '/placeholder.png'}
                      alt={product.title}
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      className="absolute top-2 right-2 p-1 bg-white border border-zinc-200 rounded-none shadow-none z-10"
                      onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                    >
                      <Heart
                        size={14}
                        className={isLiked ? 'text-red-650 fill-red-650' : 'text-zinc-400'}
                      />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="sm"
                        className="w-full rounded-none"
                        onClick={e => handleAddToCart(e, product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h3 className="font-bold text-xs text-zinc-900 truncate uppercase tracking-wider">{product.title}</h3>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-sans">
                      <MapPin size={11} className="text-zinc-400" /> {product.location}
                    </div>
                    {product.averageRating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-800">{product.averageRating.toFixed(1)}</span>
                        <span className="text-[9px] text-zinc-400 font-bold">({product.reviewCount})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-zinc-100">
                      <div className="font-bold text-green-700 font-mono text-xs">
                        ₦{Number(product.price).toLocaleString()}
                      </div>
                      {product.isOrganic && (
                        <span className="text-[8px] bg-green-50 text-green-800 px-1.5 py-0.5 rounded-none border border-green-200 font-bold font-mono uppercase tracking-widest">
                          Organic
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Verified Vendors Section */}
      <section className="bg-zinc-50 rounded-none p-5 border border-zinc-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider">Secured & Verified Agri-Vendors</h2>
          <Button variant="outline" className="rounded-none text-[10px] py-1 px-3" onClick={() => router.push('/dashboard/buyer/vendors')}>
            View Registered Directory
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {['GreenEarth Co.', 'Happy Farms', 'SeedGen'].map(vendor => (
            <div key={vendor} className="bg-white p-3 border border-zinc-200 rounded-none flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-none border border-green-200 bg-green-50 flex items-center justify-center font-bold text-green-700 text-sm">
                {vendor[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold flex items-center gap-1 text-xs truncate uppercase tracking-wider text-zinc-900">
                  {vendor} <ShieldCheck size={13} className="text-green-700 shrink-0" />
                </h4>
                <div className="flex gap-0.5 mt-0.5">
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