"use client";

import React from "react";
import { useBuyer } from "@/context/BuyerContext";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { X, Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const router = useRouter();
  const { cart, setCurrentView, setCart } = useBuyer();

  // Compute total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  /**
   * Update quantity or remove item if quantity <= 0
   * TS Fix: Use functional update and proper CartItem typing
   */
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    router.push("/dashboard/buyer/checkout");
  };

  const handleBackToShop = () => {
    setCurrentView("home");
    router.push("/dashboard/buyer");
  };

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button onClick={handleBackToShop}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">
        Shopping Cart ({cart.length} items)
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id} className="flex gap-4 p-4">
              {/* Image Container - Fixed with position relative */}
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  fill
                  src={item.product?.image}
                  className="object-cover"
                  alt={item.product.title}
                  sizes="96px"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.product.vendor}</p>
                  </div>
                  <button
                    onClick={() => updateQuantity(item.product.id, -item.quantity)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 px-3 hover:bg-gray-50 text-gray-600 border-r border-gray-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 px-3 hover:bg-gray-50 text-gray-600 border-l border-gray-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary Sticky Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping estimate</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax estimate (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Order Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>

            <div className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-green-600" /> 
              Secure Encrypted Payment
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;