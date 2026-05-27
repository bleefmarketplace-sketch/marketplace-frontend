'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { 
  ShoppingBag, Trash2, Minus, Plus, ArrowRight, 
  ShieldCheck, ArrowLeft, Truck, AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Marketplace/Footer';

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [liveStocks, setLiveStocks] = useState<Record<string, number>>({});
    const [checkingStock, setCheckingStock] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch live stocks on mount & when items changes
    useEffect(() => {
        if (mounted && items.length > 0) {
            const fetchLiveStocks = async () => {
                setCheckingStock(true);
                try {
                    const stocks: Record<string, number> = {};
                    await Promise.all(
                        items.map(async (item) => {
                            try {
                                const res = await fetch(`/api/marketplace/${item.slug}`);
                                if (res.ok) {
                                    const data = await res.json();
                                    const productData = data.data || data;
                                    if (productData && typeof productData.stock === 'number') {
                                        stocks[item.id] = productData.stock;
                                    }
                                }
                            } catch (e) {
                                console.error("Error fetching live stock for", item.title, e);
                            }
                        })
                    );
                    setLiveStocks(stocks);
                } catch (err) {
                    console.error("Live stock check failed:", err);
                } finally {
                    setCheckingStock(false);
                }
            };
            fetchLiveStocks();
        }
    }, [mounted, items]);

    // Automatically check all items on mount
    useEffect(() => {
        if (items.length > 0 && selectedItemIds.length === 0) {
            setSelectedItemIds(items.map(i => i.id));
        }
    }, [items, selectedItemIds.length]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-mono text-xs">
                <div className="text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-green-700 border-t-transparent animate-spin mx-auto"></div>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest">SYNCHRONIZING CART SYSTEM...</span>
                </div>
            </div>
        );
    }

    const toggleItemSelection = (id: string) => {
        setSelectedItemIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItemIds.length === items.length) {
            setSelectedItemIds([]);
        } else {
            setSelectedItemIds(items.map(i => i.id));
        }
    };

    const selectedItems = items.filter(item => selectedItemIds.includes(item.id));
    const getSelectedSubtotal = () => {
        return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };
    const getVatAmount = () => getSelectedSubtotal() * 0.075;
    const getGrandTotal = () => getSelectedSubtotal() * 1.075;

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to proceed to checkout");
            return;
        }

        setCheckingStock(true);
        let stockError = false;

        try {
            await Promise.all(
                selectedItems.map(async (item) => {
                    const res = await fetch(`/api/marketplace/${item.slug}`);
                    if (res.ok) {
                        const data = await res.json();
                        const productData = data.data || data;
                        if (productData && typeof productData.stock === 'number') {
                            if (item.quantity > productData.stock) {
                                stockError = true;
                                updateQuantity(item.id, productData.stock);
                                toast.error(`"${item.title}" stock updated. Only ${productData.stock} units available.`);
                            }
                        }
                    }
                })
            );
        } catch (e) {
            console.error("Error doing live stock check:", e);
        } finally {
            setCheckingStock(false);
        }

        if (stockError) {
            return;
        }

        router.push("/marketplace/checkout");
    };

    // Group items by seller
    const groupedItems = items.reduce((acc: Record<string, typeof items>, item) => {
        const sellerName = item.seller?.companyName || 'Verified Supplier';
        if (!acc[sellerName]) acc[sellerName] = [];
        acc[sellerName].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-mono flex flex-col antialiased">
            <LandingPagesNav />

            <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
                {/* Header breadcrumb & info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => router.push('/marketplace')}
                            className="flex items-center gap-1.5 text-zinc-450 hover:text-zinc-950 text-[10px] font-bold uppercase tracking-widest mb-2 border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-350 cursor-pointer transition-colors"
                        >
                            <ArrowLeft size={14} strokeWidth={2.5} /> <span>BACK TO CATALOGUE</span>
                        </button>
                        <h1 className="text-xl font-black text-zinc-950 uppercase tracking-wider flex items-center gap-3">
                            <span className="border border-green-700 bg-green-50 p-1 text-green-700">
                                <ShoppingBag size={20} />
                            </span>
                            SECURED SHOPPING CART
                        </h1>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm("ARE YOU SURE YOU WANT TO EMPTY YOUR CART?")) {
                                    clearCart();
                                    setSelectedItemIds([]);
                                    toast.info("Cart cleared successfully");
                                }
                            }}
                            className="text-[10px] font-bold text-red-650 hover:text-red-800 hover:bg-red-50 border border-red-200 px-3 py-2 cursor-pointer transition-colors"
                        >
                            CLEAR ALL ITEMS
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    /* EMPTY CART STATE */
                    <div className="text-center py-24 border border-dashed border-zinc-300 bg-white rounded-none p-8 max-w-lg mx-auto">
                        <div className="bg-zinc-50 border border-zinc-200 w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-6 text-zinc-400">
                            <ShoppingBag size={28} />
                        </div>
                        <h2 className="text-sm font-black text-zinc-950 uppercase tracking-widest mb-2">YOUR BASKET IS EMPTY</h2>
                        <p className="text-zinc-500 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
                            You have no crops or farm inputs selected. Browse our verified agricultural catalogues to start ordering.
                        </p>
                        <Button 
                            className="border border-green-700 text-green-800 bg-white hover:bg-zinc-50 rounded-none font-bold uppercase tracking-wider cursor-pointer py-3 px-6 text-xs inline-flex items-center gap-2"
                            onClick={() => router.push('/marketplace')}
                        >
                            BROWSE CROPS & PRODUCERS <ArrowRight size={14} />
                        </Button>
                    </div>
                ) : (
                    /* MAIN CART INTERFACE */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* LEFT COLUMN: PRODUCT LISTING */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Multiselect Control Bar */}
                            <div className="bg-white border border-zinc-200 p-4 rounded-none flex justify-between items-center select-none text-xs">
                                <label className="flex items-center gap-3 cursor-pointer font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950">
                                    <input
                                        type="checkbox"
                                        checked={selectedItemIds.length === items.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded-none border-zinc-300 text-green-700 focus:ring-green-550 accent-green-700 cursor-pointer"
                                    />
                                    SELECT ALL PRODUCTS ({items.length})
                                </label>
                                <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] bg-zinc-50 px-2 py-0.5 border border-zinc-200">
                                    {selectedItemIds.length} SELECTED
                                </span>
                            </div>

                            {/* Grouped Cart Items */}
                            {Object.entries(groupedItems).map(([seller, sellerItems]) => (
                                <div key={seller} className="bg-white border border-zinc-200 p-6 rounded-none space-y-4">
                                    {/* Seller Header */}
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                        <h3 className="font-bold text-zinc-900 flex items-center gap-2 text-xs">
                                            <Truck size={14} className="text-green-700" /> FARM PRODUCER: {seller.toUpperCase()}
                                        </h3>
                                        <span className="text-[9px] bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                                            100% ESCROW ASSURED
                                        </span>
                                    </div>

                                    {/* Items Under This Seller */}
                                    <div className="divide-y divide-zinc-100">
                                        {sellerItems.map((item) => {
                                            const isSelected = selectedItemIds.includes(item.id);
                                            const maxStock = liveStocks[item.id] ?? item.stock ?? 999;
                                            const isNearStockLimit = maxStock > 0 && maxStock <= 10;

                                            return (
                                                <div 
                                                    key={item.id} 
                                                    className={`py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-opacity duration-200 ${
                                                        !isSelected ? 'opacity-60' : ''
                                                    }`}
                                                >
                                                    {/* Selection Box & Product Thumbnail */}
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleItemSelection(item.id)}
                                                            className="w-4 h-4 rounded-none border-zinc-350 text-green-700 focus:ring-green-550 accent-green-700 cursor-pointer"
                                                        />
                                                        <div className="relative w-16 h-16 rounded-none border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
                                                            <Image unoptimized fill src={item.primaryImage} alt={item.title} className="object-cover" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs font-bold text-zinc-950 uppercase truncate max-w-[200px] sm:max-w-[280px]">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">
                                                                UNIT COST: ₦{item.price.toLocaleString()}
                                                            </p>
                                                            
                                                            {/* Stock Badge */}
                                                            {maxStock !== undefined && (
                                                                <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase px-1.5 py-0.5 mt-1 border ${
                                                                    isNearStockLimit 
                                                                        ? 'text-amber-700 bg-amber-50 border-amber-200' 
                                                                        : 'text-zinc-500 bg-zinc-50 border-zinc-200'
                                                                }`}>
                                                                    {isNearStockLimit && <AlertTriangle size={8} />}
                                                                    {maxStock} UNITS REMAINING
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity Selector & Item Total */}
                                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                                                        <div className="flex items-center border border-zinc-300 bg-white">
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                                disabled={checkingStock}
                                                                className="px-2 py-1.5 hover:text-green-700 hover:bg-zinc-50 disabled:opacity-50 transition-all border-r border-zinc-200 cursor-pointer"
                                                                title="Decrease Quantity"
                                                            >
                                                                <Minus size={10} strokeWidth={2.5}/>
                                                            </button>
                                                            <span className="px-3 text-[11px] font-black text-center w-8">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    if (item.quantity >= maxStock) {
                                                                        toast.error(`Only ${maxStock} units of this item are available in stock.`);
                                                                        return;
                                                                    }
                                                                    updateQuantity(item.id, item.quantity + 1);
                                                                }}
                                                                disabled={checkingStock}
                                                                className="px-2 py-1.5 hover:text-green-700 hover:bg-zinc-50 disabled:opacity-50 transition-all border-l border-zinc-200 cursor-pointer"
                                                                title="Increase Quantity"
                                                            >
                                                                <Plus size={10} strokeWidth={2.5}/>
                                                            </button>
                                                        </div>

                                                        <div className="text-right min-w-[90px]">
                                                            <span className="font-black text-zinc-950 text-xs block">
                                                                ₦{(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        <button 
                                                            onClick={() => {
                                                                removeItem(item.id);
                                                                toast.info("Item removed from cart");
                                                            }}
                                                            className="text-zinc-350 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 p-1.5 rounded-none transition-all cursor-pointer"
                                                            title="Remove Item"
                                                        >
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT COLUMN: SUMMARY PANEL */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-none text-zinc-450 shadow-none">
                                <h3 className="text-zinc-50 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-850 pb-3 mb-6">
                                    TRANSACTION BILLING OVERVIEW
                                </h3>

                                <div className="space-y-4 mb-6 text-xs">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>SELECTED SUBTOTAL</span>
                                        <span className="font-bold text-zinc-50">₦{getSelectedSubtotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>GOVERNMENT VAT (7.5%)</span>
                                        <span className="font-bold text-zinc-50">₦{getVatAmount().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>FREIGHT SHIPPING</span>
                                        <span className="font-bold text-green-550 uppercase tracking-tight">CALCULATED NEXT</span>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs">
                                        <span className="font-bold text-zinc-50 uppercase tracking-wider">GRAND TOTAL</span>
                                        <span className="text-md font-black text-green-400">₦{getGrandTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button
                                        fullWidth
                                        size="lg"
                                        className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 cursor-pointer"
                                        onClick={handleCheckout}
                                        disabled={checkingStock || selectedItems.length === 0}
                                    >
                                        {checkingStock ? "VALIDATING STOCK..." : <>PROCEED TO SECURE CHECKOUT <ArrowRight size={14} /></>}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        fullWidth
                                        className="w-full py-3 text-xs font-bold uppercase tracking-wider rounded-none border border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 cursor-pointer"
                                        onClick={() => router.push('/marketplace')}
                                    >
                                        CONTINUE SHOPPING
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-wider pt-3 border-t border-zinc-850">
                                        <ShieldCheck size={14} className="text-green-700 shrink-0" /> 
                                        <span>100% ESCROW PROTECTED GATEWAY</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
