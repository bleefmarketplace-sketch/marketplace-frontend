'use client';
import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { MapPin, ShieldCheck, Truck, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import OrderSuccessModal from '@/components/Marketplace/SuccessModal';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState('');

    // Group items by seller for AliExpress style layout
    const groupedItems = items.reduce((acc: any, item) => {
        const sellerName = item.seller?.companyName || 'Verified Supplier';
        if (!acc[sellerName]) acc[sellerName] = [];
        acc[sellerName].push(item);
        return acc;
    }, {});

    const handlePlaceOrder = async () => {
        if (!address.trim()) return toast.error("Please enter your shipping address");

        setLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                shippingAddress: address
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            // Handle Unauthorized
            if (res.status === 401) {
                toast.info("Please login to complete your order");
                router.push("/auth/login?redirect=/checkout");
                return;
            }

            const data = await res.json();

            // FIX: The ID is inside data.order.id based on your console log
            if (res.ok && data.order?.id) {
                setPlacedOrderId(data.order.id);

                // LOGIC: If there is a payment URL, redirect the user immediately
                if (data.authorization_url) {
                    toast.info("Redirecting to secure payment...");

                    // Clear cart before leaving so they don't see it if they click "back"
                    clearCart();

                    // Redirect to Paystack
                    window.location.href = data.authorization_url;
                } else {
                    // Fallback for orders that don't require immediate payment
                    setShowSuccessModal(true);
                }
            } else {
                throw new Error(data.message || "Something went wrong");
            }
        } catch (err: any) {
            console.error("Order Error:", err);
            toast.error(err.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

   /*  if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Your basket is empty</p>
                <Button onClick={() => router.push('/marketplace')}>Go to Marketplace</Button>
            </div>
        );
    }
 */
    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                    <ChevronLeft size={20} /> <span className="text-sm font-bold">Return to Basket</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: FORM & ITEMS */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Shipping Section */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="text-emerald-600" /> Delivery Information
                            </h2>
                            <textarea
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-500 transition-all text-sm outline-none"
                                placeholder="Enter your full delivery address (Street, City, State, Country)..."
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Items Section Grouped by Seller */}
                        {Object.entries(groupedItems).map(([seller, sellerItems]: any) => (
                            <div key={seller} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Truck size={18} className="text-blue-500" /> Package from {seller}
                                    </h3>
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">STANDARD SHIPPING</span>
                                </div>
                                <div className="space-y-6">
                                    {sellerItems.map((item: any) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                <Image unoptimized fill src={item.primaryImage} alt="" className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity} units</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400">${item.price} per unit</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                            <h3 className="text-xl font-bold mb-8">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="font-bold text-white">₦{getTotalPrice().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span className="text-sm">Est. Logistics</span>
                                    <span className="font-bold text-emerald-400">Calculated later</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-black text-emerald-400">₦{getTotalPrice().toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    fullWidth
                                    size="lg"
                                    className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl h-16 text-lg font-bold shadow-lg shadow-emerald-900/20"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Place Order Now"}
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">
                                    <ShieldCheck size={14} className="text-emerald-500" /> Payment secured by Bleefy
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
            <OrderSuccessModal
                isOpen={showSuccessModal}
                orderId={placedOrderId}
                onClose={() => {
                    setShowSuccessModal(false);
                    clearCart();
                    router.push('/marketplace');
                }}
            />
        </div>
    );
}