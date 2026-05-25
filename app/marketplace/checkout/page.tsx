'use client';
import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { MapPin, ShieldCheck, Truck, ChevronLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import OrderSuccessModal from '@/components/Marketplace/SuccessModal';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Marketplace/Footer';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave'>('paystack');

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
                shippingAddress: address,
                paymentMethod: paymentMethod
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (res.status === 401) {
                toast.info("Please login to complete your order");
                router.push("/auth/login?redirect=/marketplace/checkout");
                return;
            }

            const data = await res.json();

            if (res.ok && data.order?.id) {
                setPlacedOrderId(data.order.id);

                if (data.authorization_url) {
                    toast.info("Redirecting to secure payment...");
                    clearCart();
                    window.location.href = data.authorization_url;
                } else {
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

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col antialiased">
            <LandingPagesNav />
            <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
                
                {/* Return breadcrumb */}
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-1.5 text-zinc-450 hover:text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-widest mb-8 border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-350 cursor-pointer transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={2.5} /> <span>RETURN TO BASKET</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT FORM & SHIPPING DECK */}
                    <div className="lg:col-span-8 space-y-4">
                        
                        {/* Delivery Info */}
                        <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-none font-mono text-xs">
                            <h2 className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
                                <MapPin size={13} className="text-green-700" /> DELIVERY INFORMATION
                            </h2>
                            <textarea
                                className="w-full p-4 bg-zinc-50 border border-zinc-250 rounded-none text-xs outline-none focus:border-green-600 transition-colors font-mono text-zinc-900 placeholder-zinc-400"
                                placeholder="Enter your full delivery address (Street, City, State, Country)..."
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Items Section Grouped by Seller */}
                        {Object.entries(groupedItems).map(([seller, sellerItems]: any) => (
                            <div key={seller} className="bg-white border border-zinc-200 p-6 rounded-none shadow-none font-mono text-xs">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                                    <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                                        <Truck size={14} className="text-green-750" /> PACKAGE FROM: {seller.toUpperCase()}
                                    </h3>
                                    <span className="text-[9px] bg-zinc-50 text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                                        STANDARD SHIPPING
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {sellerItems.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="relative w-12 h-12 rounded-none border border-zinc-200 bg-zinc-50 flex-shrink-0">
                                                <Image unoptimized fill src={item.primaryImage} alt="" className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-zinc-950 uppercase truncate">{item.title}</h4>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase block mt-0.5">QTY: {item.quantity} UNITS</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-zinc-950">₦{(item.price * item.quantity).toLocaleString()}</p>
                                                <p className="text-[9px] text-zinc-400 font-bold">₦{item.price.toLocaleString()} PER UNIT</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Payment Selection Box */}
                        <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-none font-mono text-xs">
                            <h2 className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
                                <CreditCard size={13} className="text-green-700" /> SECURE GATEWAY TRANSACTION METHOD
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                
                                {/* Paystack */}
                                <button 
                                    onClick={() => setPaymentMethod('paystack')}
                                    className={`p-5 rounded-none border-2 transition-colors flex flex-col items-center gap-3 cursor-pointer select-none ${
                                        paymentMethod === 'paystack' 
                                        ? 'border-green-600 bg-green-50/50' 
                                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 bg-white border border-zinc-200 rounded-none flex items-center justify-center font-black text-blue-600 text-sm">
                                        P
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${paymentMethod === 'paystack' ? 'text-green-800' : 'text-zinc-400'}`}>
                                        PAYSTACK SYSTEM
                                    </span>
                                </button>

                                {/* Flutterwave */}
                                <button 
                                    onClick={() => setPaymentMethod('flutterwave')}
                                    className={`p-5 rounded-none border-2 transition-colors flex flex-col items-center gap-3 cursor-pointer select-none ${
                                        paymentMethod === 'flutterwave' 
                                        ? 'border-green-600 bg-green-50/50' 
                                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 bg-white border border-zinc-200 rounded-none flex items-center justify-center font-black text-orange-500 text-sm">
                                        F
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${paymentMethod === 'flutterwave' ? 'text-green-800' : 'text-zinc-400'}`}>
                                        FLUTTERWAVE GATE
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECURE CHECKOUT SUMMARY */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-none text-zinc-450 shadow-none font-mono text-xs">
                            
                            <h3 className="text-zinc-50 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-850 pb-3 mb-6">
                                TRANSACTION RECORD SUMMARY
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-zinc-400">
                                    <span>SUBTOTAL VALUE</span>
                                    <span className="font-bold text-zinc-50">₦{getTotalPrice().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>GOVT VAT (7.5%)</span>
                                    <span className="font-bold text-zinc-50">₦{(getTotalPrice() * 0.075).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>EST. FREIGHT LOGISTICS</span>
                                    <span className="font-bold text-green-600 uppercase tracking-tight">CALCULATED LATER</span>
                                </div>
                                <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                                    <span className="font-bold text-zinc-50">GRAND TOTAL</span>
                                    <span className="text-md font-black text-green-500">₦{(getTotalPrice() * 1.075).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Button
                                    fullWidth
                                    size="lg"
                                    className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? "PROCESSING TRANSIT..." : "PLACE SECURE ORDER NOW"}
                                </Button>

                                <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider pt-2">
                                    <ShieldCheck size={13} className="text-green-700" /> SECURED VIA {paymentMethod.toUpperCase()} NETWORK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            
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