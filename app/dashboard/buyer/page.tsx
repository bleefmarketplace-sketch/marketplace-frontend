"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { CATEGORIES } from "@/components/constants";
import { useBuyer } from "@/context/BuyerContext";
import { Product } from "@/components/types";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
  /* ------------------------------------------------------------------ */
  /* Context */
  /* ------------------------------------------------------------------ */

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist,
    toggleWishlist,
    addToCart,
    priceRange,
    setPriceRange,
    filteredProducts,
    activeTab,
    setActiveTab,
    setSelectedProduct,
    setCurrentView,
  } = useBuyer();

  /* ------------------------------------------------------------------ */
  /* Local UI State (NOT global) */
  /* ------------------------------------------------------------------ */

  const [showFilters, setShowFilters] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Handlers */
  /* ------------------------------------------------------------------ */

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("product");
    router.push(`/dashboard/buyer/product/${product.id}`);
  };

  const onChangeView = (view: string) => {
    setCurrentView(view);
  };

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --------------------------------------------------------------- */}
      {/* Search & Filters */}
      {/* --------------------------------------------------------------- */}

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for tractors, seeds, livestock..."
              icon={<Search size={18} />}
              className="shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant={showFilters ? "primary" : "secondary"}
            className="px-3"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={18} />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">Filters</h3>
              <button
                onClick={() => {
                  setPriceRange({ min: "", max: "" });
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setShowFilters(false);
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Price Range
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------- */}
      {/* Categories */}
      {/* --------------------------------------------------------------- */}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Browse by Category</h2>

          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Clear Filter <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {[{ name: "All", icon: "All" }, ...CATEGORIES].map((cat, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all ${
                  selectedCategory === cat.name
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white border-gray-100 hover:border-primary-500"
                }`}
              >
                {"icon" in cat ? cat.icon : "All"}
              </div>
              <span className="text-xs font-bold">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Products */}
      {/* --------------------------------------------------------------- */}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {searchQuery
              ? `Search Results (${filteredProducts.length})`
              : selectedCategory !== "All"
              ? `${selectedCategory} Products`
              : "Featured Products"}
          </h2>

          <div className="flex gap-2">
            {(["All", "Best Sellers", "New Arrivals"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  activeTab === tab
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3>No products found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isLiked = wishlist.some((w) => w.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-4/3">
                    <Image
                      fill
                      src={product.image}
                      alt={product.title}
                      className="object-cover"
                    />

                    <button
                      className="absolute top-2 left-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      <Heart
                        size={16}
                        className={
                          isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                        }
                      />
                    </button>

                    <Button
                      size="sm"
                      className="absolute bottom-2 left-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Quick Add
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold">{product.title}</h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> {product.location}
                    </div>
                    <div className="font-bold text-primary-600 mt-2">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Vendors */}
      {/* --------------------------------------------------------------- */}

      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Verified Vendors</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangeView("vendors")}
          >
            View All
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {["GreenEarth Co.", "Happy Farms", "SeedGen"].map((vendor) => (
            <div key={vendor} className="bg-white p-4 rounded-xl flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold">
                {vendor[0]}
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-1">
                  {vendor} <ShieldCheck size={14} />
                </h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
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
