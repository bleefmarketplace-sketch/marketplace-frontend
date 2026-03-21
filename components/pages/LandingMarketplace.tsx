import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import {
    Star, MapPin, Filter, Package, Plus, X
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
        }, 500); // Wait 500ms after typing stops

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // --- LOGIC: FETCHING ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('limit', '20');

            const response = await fetch(`/api/marketplace?${params.toString()}`);
            const data = await response.json();

            if (data.success === false) throw new Error(data.message);

            // Check if data is the array directly or inside a property
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch (err: any) {
            setError(err.message || "Failed to connect to server");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    const handleOpenProduct = (product: Product) => {

        console.log("Product clicked:", product);
        trackEvent('click', product.id, { category: product.categoryId });
        window.open(`/marketplace/${product.id}`, '_blank');
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
        <div className="min-h-screen bg-[#f4f4f4]">


            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* --- SIDEBAR --- */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-28 space-y-8">
                            {/* Category Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Filter size={16} /> Category
                                    </h3>
                                    {filters.category && (
                                        <button onClick={() => setFilters(f => ({ ...f, category: '' }))} className="text-[10px] text-red-500 font-bold underline">CLEAR</button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setFilters(f => ({ ...f, category: cat.name }))}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === cat.name
                                                ? 'bg-emerald-600 text-white font-bold shadow-md transform translate-x-1'
                                                : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                }`}
                                        >
                                            <span className="mr-2">{cat.icon}</span> {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-sm mb-4">Price Range ($)</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-xs outline-none focus:ring-1 ring-emerald-500"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                                    />
                                    <span className="text-gray-300">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-xs outline-none focus:ring-1 ring-emerald-500"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <Button variant="ghost" fullWidth size="sm" onClick={clearFilters} className="text-gray-400">
                                Reset All Filters
                            </Button>
                        </div>
                    </aside>

                    {/* --- PRODUCT GRID --- */}
                    <section className="flex-1">
                        {/* Sort & Info Header */}
                        <div className="bg-white p-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                                Showing <span className="text-gray-900 font-bold">{products.length}</span> results
                                {filters.search && <span> for &quot;<span className="text-emerald-600">{filters.search}</span>&quot;</span>}
                            </p>
                            <select
                                className="text-sm font-bold bg-gray-50 px-4 py-2 rounded-lg outline-none cursor-pointer"
                                value={filters.sortBy}
                                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="h-72 bg-white animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Search Failed</h3>
                                <p className="text-gray-500 mb-6">{error}</p>
                                <Button onClick={fetchProducts}>Try Again</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleOpenProduct(product)}
                                        className="group bg-white rounded-2xl overflow-hidden border border-transparent hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer flex flex-col relative"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                            <Image
                                                fill
                                                unoptimized
                                                src={product.primaryImage || '/placeholder-product.jpg'}
                                                alt={product.title}
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addItem(product, 1);
                                                    toast.success('Added to cart!');
                                                }}
                                                className="absolute bottom-2 right-2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-3 flex flex-col flex-1">
                                            <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                                                {product.title}
                                            </h3>

                                            <div className="mt-auto">
                                                <div className="flex items-baseline gap-1 mb-1">
                                                    <span className="text-xs font-bold text-emerald-600">$</span>
                                                    <span className="text-xl font-black text-emerald-600">{product.price}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                                                        <Star size={10} className="fill-amber-700" />
                                                        {product.averageRating}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {product.reviewCount || 0} sold
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                                                    <MapPin size={10} />
                                                    {product.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && products.length === 0 && !error && (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                <h3 className="text-lg font-bold">No items match your search</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};