import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import {
    Star, MapPin, Filter, Package, Plus, X, Search, AlertCircle, Loader2
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';
import { useTracking } from '@/hooks/useTracking';

export const Marketplace = () => {
    const { trackEvent } = useTracking();

    // --- STATE ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { addItem } = useCartStore();

    // Search Debounce State
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sortBy: 'newest',
        minPrice: '',
        maxPrice: '',
    });

    // --- LOGIC: DEBOUNCE SEARCH ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchTerm }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // --- LOGIC: FETCHING ---
    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasMore(true);
        setOffset(0);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('limit', '20');
            params.append('offset', '0');

            const response = await fetch(`/api/marketplace?${params.toString()}`);
            const data = await response.json();

            if (data.success === false) throw new Error(data.message);

            const items = Array.isArray(data) ? data : data.products || [];
            setProducts(items);
            if (items.length < 20) {
                setHasMore(false);
            }
            setOffset(items.length);
        } catch (err: any) {
            setError(err.message || "Failed to connect to server");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchMoreProducts = useCallback(async () => {
        if (loading || loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('limit', '20');
            params.append('offset', offset.toString());

            const response = await fetch(`/api/marketplace?${params.toString()}`);
            const data = await response.json();

            if (data.success === false) throw new Error(data.message);

            const items = Array.isArray(data) ? data : data.products || [];
            if (items.length > 0) {
                setProducts(prev => [...prev, ...items]);
                setOffset(prev => prev + items.length);
            }
            if (items.length < 20) {
                setHasMore(false);
            }
        } catch (err: any) {
            console.error("Failed to load more products:", err);
            toast.error("Failed to load next product batch.");
        } finally {
            setLoadingMore(false);
        }
    }, [filters, offset, hasMore, loading, loadingMore]);

    useEffect(() => {
        fetchInitialProducts();
    }, [fetchInitialProducts]);

    // --- LOGIC: INFINITE SCROLL OBSERVER ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasMore && !loading && !loadingMore) {
                fetchMoreProducts();
            }
        }, { threshold: 0.1 });

        const target = document.getElementById('infinite-scroll-sentinel');
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [hasMore, loading, loadingMore, fetchMoreProducts]);

    const handleOpenProduct = (product: Product) => {
        trackEvent('click', product.id, { category: product.categoryId });
        window.open(`/marketplace/${product.slug}`, '_blank');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            search: '',
            category: '',
            sortBy: 'newest',
            minPrice: '',
            maxPrice: '',
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col antialiased">
            <main className="max-w-7xl mx-auto px-4 py-8 w-full">

                {/* Real-time Integrated Search Input bar (AgriTerminal Parity) */}
                <div className="border border-zinc-200 bg-white p-4 mb-6 shadow-none">
                    <div className="flex items-center bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 font-mono text-xs">
                        <Search className="w-4 h-4 text-zinc-400 mr-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter farm-fresh produce, fertilizer complex batches, agronomy tutorials, precision drone inputs..."
                            className="bg-transparent border-0 focus:outline-none w-full text-zinc-900 placeholder-zinc-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">

                    {/* --- SIDEBAR --- */}
                    <aside className="w-full md:w-64 shrink-0 font-mono text-xs">
                        <div className="space-y-4">

                            {/* Category Filter */}
                            <div className="border border-zinc-200 bg-white p-4">
                                <div className="flex items-center justify-between mb-4 border-b border-zinc-150 pb-2">
                                    <h3 className="font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2 text-[10px]">
                                        <Filter size={13} className="text-green-700" /> CATEGORIES
                                    </h3>
                                    {filters.category && (
                                        <button
                                            onClick={() => setFilters(f => ({ ...f, category: '' }))}
                                            className="text-[9px] text-red-600 font-black uppercase hover:underline cursor-pointer"
                                        >
                                            CLEAR
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {CATEGORIES.map((cat) => {
                                        const isActive = filters.category === cat.name;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() => setFilters(f => ({ ...f, category: cat.name }))}
                                                className={`w-full text-left uppercase font-bold tracking-tight py-2 px-3 flex items-center transition-all rounded-none border cursor-pointer ${isActive
                                                        ? "border-green-600 bg-green-50 text-green-800 shadow-none font-extrabold"
                                                        : "border-transparent text-zinc-650 hover:text-zinc-950 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                <span className="mr-2.5 text-xs">{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="border border-zinc-200 bg-white p-4">
                                <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px] border-b border-zinc-150 pb-2 mb-3">
                                    PRICE RANGE ($)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="MIN"
                                        className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-250 rounded-none text-xs outline-none focus:border-green-600 font-mono text-zinc-900"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                                    />
                                    <span className="text-zinc-300">-</span>
                                    <input
                                        type="number"
                                        placeholder="MAX"
                                        className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-250 rounded-none text-xs outline-none focus:border-green-600 font-mono text-zinc-900"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                fullWidth
                                size="sm"
                                onClick={clearFilters}
                                className="text-zinc-450 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-none font-bold uppercase tracking-wider cursor-pointer"
                            >
                                RESET ALL FILTERS
                            </Button>
                        </div>
                    </aside>

                    {/* --- PRODUCT GRID --- */}
                    <section className="flex-1 flex flex-col justify-between">

                        {/* Sort & Info Header */}
                        <div className="bg-white border border-zinc-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs shadow-none">
                            <p className="font-bold text-zinc-500 uppercase tracking-tight">
                                SHOWING <span className="text-zinc-950 font-black">{products.length}</span> PRODUCTS
                                {filters.search && (
                                    <span> FOR &quot;<span className="text-green-700 font-extrabold">{filters.search}</span>&quot;</span>
                                )}
                            </p>
                            <div className="flex items-center space-x-2 bg-zinc-50 border border-zinc-200 px-2.5 py-1">
                                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">SORT:</span>
                                <select
                                    className="bg-transparent border-0 font-bold focus:outline-none text-[11px] text-zinc-900 cursor-pointer"
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                >
                                    <option value="newest">NEWEST ARRIVALS</option>
                                    <option value="price_asc">PRICE: LOW TO HIGH</option>
                                    <option value="price_desc">PRICE: HIGH TO LOW</option>
                                    <option value="rating">TOP RATED</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="h-72 bg-white border border-zinc-150 animate-pulse rounded-none" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-16 text-center bg-white border border-dashed border-zinc-250 font-mono rounded-none">
                                <div className="bg-red-50 w-12 h-12 border border-red-150 flex items-center justify-center mx-auto mb-4 text-red-650">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-950 uppercase">SEARCH MATRIX FAILED</h3>
                                <p className="text-zinc-500 text-xs font-sans mt-1.5 mb-5">{error}</p>
                                <Button onClick={fetchInitialProducts} size="sm">RETRY QUERY</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-left">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleOpenProduct(product)}
                                        className="group bg-white rounded-none border border-zinc-200 hover:border-zinc-350 transition-all cursor-pointer flex flex-col relative"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-square bg-zinc-50 overflow-hidden border-b border-zinc-200">
                                            <Image
                                                fill
                                                unoptimized
                                                src={product.primaryImage || '/placeholder-product.jpg'}
                                                alt={product.title}
                                                className="object-cover group-hover:scale-101 transition-transform duration-300"
                                            />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addItem(product, 1);
                                                    toast.success('Added to cart!');
                                                }}
                                                className="absolute bottom-2.5 right-2.5 bg-white border border-zinc-200 p-2 rounded-none hover:bg-green-700 hover:text-white transition-colors cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-3 flex flex-col flex-1 justify-between gap-3">
                                            <div>
                                                <h3 className="text-xs font-bold text-zinc-950 line-clamp-2 leading-tight uppercase group-hover:text-green-750 transition-colors">
                                                    {product.title}
                                                </h3>
                                            </div>

                                            <div className="space-y-2 pt-1 border-t border-zinc-100 bg-zinc-50/20">
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-[10px] text-zinc-400 font-bold">$</span>
                                                    <span className="text-md font-black text-zinc-950">{product.price}</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-bold uppercase">
                                                    <div className="flex items-center gap-0.5 bg-amber-50 text-amber-705 px-1.5 py-0.5 border border-amber-200 rounded-none">
                                                        <Star size={9} className="fill-amber-600 text-amber-600" />
                                                        {product.averageRating}
                                                    </div>
                                                    <span className="text-zinc-450 font-mono">
                                                        {product.reviewCount || 0} SOLD
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-semibold truncate">
                                                    <MapPin size={9} className="text-zinc-400" />
                                                    <span className="truncate">{product.location.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sentinel for Infinite Scroll */}
                        <div id="infinite-scroll-sentinel" className="h-4 w-full" />

                        {loadingMore && (
                            <div className="mt-4 border border-zinc-200 bg-white p-4 flex items-center justify-center gap-3 font-mono text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse select-none">
                                <Loader2 className="animate-spin text-green-700" size={13} />
                                <span>Hydrating Produce Grid [Offset: {offset}]...</span>
                            </div>
                        )}

                        {!hasMore && products.length > 0 && (
                            <div className="mt-6 py-3 text-center border-t border-zinc-200 font-mono text-[9px] text-zinc-400 uppercase tracking-widest select-none">
                                ● Terminal Stream Completed. All classified products loaded.
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && products.length === 0 && !error && (
                            <div className="text-center py-20 bg-white border border-dashed border-zinc-250 font-mono rounded-none">
                                <Package size={36} className="mx-auto text-zinc-300 mb-3" />
                                <h3 className="font-bold text-zinc-900 uppercase text-xs">NO ASSETS COMPLY WITH QUERY</h3>
                                <p className="text-zinc-500 text-[11px] font-sans mt-1">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};