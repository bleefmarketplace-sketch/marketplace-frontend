'use client';
import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-zinc-950/65 backdrop-blur-xs" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-zinc-200 shadow-none flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-200 font-mono text-xs">
            <div className="flex items-center gap-2.5">
                <div className="border border-green-700 bg-green-50 p-1.5 text-green-700 rounded-none shrink-0">
                    <ShoppingBag size={16} />
                </div>
                <h2 className="text-sm font-black text-zinc-950 uppercase tracking-wider">YOUR BASKET</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-none transition-colors cursor-pointer"
            >
              <X size={16}/>
            </button>
        </div>

        {/* Item deck */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-mono text-xs">
          {items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-250 bg-zinc-50 rounded-none p-6">
              <div className="bg-white border border-zinc-200 w-12 h-12 rounded-none flex items-center justify-center mx-auto mb-4 text-zinc-300">
                <ShoppingBag size={20} />
              </div>
              <p className="text-zinc-500 font-bold uppercase tracking-tight">YOUR BASKET IS EMPTY</p>
              <Button 
                variant="ghost" 
                className="mt-4 border border-green-700 text-green-800 bg-white hover:bg-zinc-50 rounded-none font-bold uppercase tracking-wider cursor-pointer py-1.5 px-4" 
                onClick={onClose}
              >
                START SHOPPING
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group items-center">
                <div className="relative w-16 h-16 rounded-none border border-zinc-200 overflow-hidden bg-zinc-50 flex-shrink-0">
                  <Image unoptimized fill src={item.primaryImage} alt={item.title} className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-950 uppercase truncate">{item.title}</h4>
                  <p className="text-[9px] text-zinc-450 uppercase font-bold tracking-wider mb-2 block">
                    SUPPLIER: { (item.seller?.companyName || 'Verified Farm').toUpperCase() }
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-zinc-300 bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          className="px-2 py-1 hover:text-green-700 transition-colors border-r border-zinc-200 cursor-pointer"
                        >
                          <Minus size={10} strokeWidth={2.5}/>
                        </button>
                        <span className="px-3 text-[11px] font-black text-center w-8">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="px-2 py-1 hover:text-green-700 transition-colors border-l border-zinc-200 cursor-pointer"
                        >
                          <Plus size={10} strokeWidth={2.5}/>
                        </button>
                    </div>
                    <span className="font-black text-zinc-950">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="text-zinc-300 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 p-1.5 rounded-none cursor-pointer self-start transition-all"
                  title="Remove Item"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between font-bold uppercase tracking-wider">
              <span className="text-zinc-500">ESTIMATED TOTAL</span>
              <span className="text-lg font-black text-zinc-950">₦{getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-zinc-400 text-center uppercase tracking-widest font-bold">
              SHIPPING AND TAXES ESTIMATED AT CHECKOUT
            </p>
            <Button 
              onClick={() => {
                onClose();
                router.push("/marketplace/checkout");
              }} 
              fullWidth 
              size="lg" 
              className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              PROCEED TO CHECKOUT <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};