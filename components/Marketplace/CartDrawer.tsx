'use client';
import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
                <ShoppingBag className="text-emerald-600" />
                <h2 className="text-xl font-black text-gray-900">Your Basket</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <p className="text-gray-500 font-medium">Your basket is empty</p>
              <Button variant="ghost" className="mt-4 text-emerald-600" onClick={onClose}>Start Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border flex-shrink-0">
                  <Image unoptimized fill src={item.primaryImage} alt={item.title} className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">{item.seller?.companyName || 'Verified Farm'}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-full"><Minus size={12}/></button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-full"><Plus size={12}/></button>
                    </div>
                    <span className="font-black text-emerald-600">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 self-start p-1"><Trash2 size={16}/></button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Estimated Total</span>
              <span className="text-2xl font-black text-gray-900">${getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-bold">Shipping and taxes calculated at checkout</p>
            <Button onClick={() => router.push("/marketplace/checkout")} fullWidth size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg shadow-emerald-100 gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};