"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useBuyer } from "@/context/BuyerContext";
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const { selectedProduct, addToCart } = useBuyer();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  /**
   * Redirect safely AFTER render
   */
  useEffect(() => {
    if (!selectedProduct) {
      router.replace("/dashboard/buyer/marketplace");
    }
  }, [selectedProduct, router]);

  if (!selectedProduct) {
    return null; // prevent render flicker
  }

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary-600"
        onClick={() => router.replace("/dashboard/buyer/marketplace")}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Marketplace
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image
              fill
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer border border-transparent hover:border-primary-500"
              >
                <Image
                  fill
                  src={selectedProduct.image}
                  alt={`${selectedProduct.title} ${i}`}
                  className="object-cover opacity-80 hover:opacity-100"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                {selectedProduct.category.name}
              </span>

              {selectedProduct.stock < 5 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">
                  Low Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedProduct.title}
            </h1>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star size={16} fill="currentColor" />
                {selectedProduct.averageRating.toFixed(1)}
              </div>

              <span className="text-gray-400">|</span>
              <span className="text-gray-500">
                {selectedProduct.reviews.length} reviews
              </span>

              <span className="text-gray-400">|</span>
              <span className="text-gray-500">
                {selectedProduct.location}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="text-3xl font-bold text-primary-600">
                ${(selectedProduct.price * quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
              <button
                className="p-2 hover:bg-gray-50 text-gray-500"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center font-bold text-sm">
                {quantity}
              </span>

              <button
                className="p-2 hover:bg-gray-50 text-gray-500"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(selectedProduct.stock, q + 1)
                  )
                }
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {selectedProduct.description} This product is sourced directly
              from sustainable farms and verified for quality assurance.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <Truck className="text-blue-500" />
                <div>
                  <p className="font-bold text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-500">
                    2–3 business days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <ShieldCheck className="text-green-500" />
                <div>
                  <p className="font-bold text-sm">Quality Guarantee</p>
                  <p className="text-xs text-gray-500">
                    Verified Vendor
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <Button variant="secondary" className="flex-1">
              Message Vendor
            </Button>

            <Button
              className="flex-2"
              onClick={() =>
                addToCart({ ...selectedProduct, quantity })
              }
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
