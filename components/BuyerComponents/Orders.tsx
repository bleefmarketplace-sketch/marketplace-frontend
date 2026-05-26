'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    Package, Truck, CheckCircle2, Clock, 
    ChevronRight, MapPin, ShieldCheck, AlertCircle, Loader2 
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';

export default function BuyerOrdersPage() {
    const fetcher = useApi();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [disputeForm, setDisputeForm] = useState({ reason: '', description: '' });

    const handleRaiseDispute = async (orderId: string) => {
        try {
            await fetcher(`/api/orders/${orderId}/dispute`, {
                method: 'POST',
                body: JSON.stringify(disputeForm)
            });
            toast.success("Dispute opened. Bleefy Admin will review your case.");
            setIsDisputeOpen(false);
        } catch (e) { toast.error("Failed to open dispute"); }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders/my-orders');
            const result = await res.json();
            setOrders(result.data || []);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleConfirmDelivery = async (orderId: string) => {
        if (!confirm("Have you physically received and inspected this produce? This will release payment to the farmer.")) return;
        
        setConfirmingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'PATCH' });
            const result = await res.json();
            if (result.success) {
                toast.success("Payment released to seller. Thank you!");
                fetchOrders(); // Refresh list
            }
        } catch (err) {
            toast.error("Action failed");
        } finally {
            setConfirmingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 font-mono text-xs">
                <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
                <span>HYDRATING ESCROW LEDGERS...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 font-mono text-zinc-900 text-xs antialiased">
            
            {/* Header */}
            <div className="border border-zinc-200 bg-white p-5 select-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                            ESCROW TRANSACTION SERVICE LEDGER
                        </span>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2 flex items-center gap-2">
                            <Package className="text-green-700" size={20} /> My Purchases
                        </h1>
                        <p className="text-zinc-500 text-[10px] mt-0.5">
                            Track active produce shipments, verify escrow status, and release farmer payouts upon safe coordinates arrival.
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-800 px-3 py-1.5 border border-green-200 flex items-center gap-2 w-fit">
                        <ShieldCheck size={14} className="text-green-700" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Escrow Protected</span>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white shadow-none">
                    <Package className="mx-auto text-zinc-300 mb-4" size={40} />
                    <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">
                        NO ACTIVE PURCHASE RECORDS FOUND
                    </h3>
                    <button 
                        onClick={() => window.location.href='/marketplace'}
                        className="mt-6 h-9 px-6 border border-green-700 bg-green-50 hover:bg-green-100 text-green-800 font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors"
                    >
                        Browse Produce Catalog
                    </button>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-0 overflow-hidden bg-white border border-zinc-200 rounded-none shadow-none flex flex-col hover:-translate-y-0.5 transition-all duration-200">
                            {/* Order Header */}
                            <div className="bg-zinc-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 select-none">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">ORDER REFERENCE ID</p>
                                        <p className="text-[10px] font-bold text-zinc-950 mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">TIMESTAMP COMMITTED</p>
                                        <p className="text-[10px] font-bold text-zinc-950 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">TOTAL ESCROW AMOUNT</p>
                                        <p className="text-[10px] font-extrabold text-green-700 mt-0.5">₦{Number(order.totalAmount).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-bold uppercase tracking-widest ${
                                    order.status === 'delivered' ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-800'
                                }`}>
                                    {order.status === 'delivered' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                    {order.status}
                                </div>
                            </div>

                            {/* Order Items & shipping layout */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    
                                    {/* Left Column: Items */}
                                    <div className="lg:col-span-7 space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4 border border-zinc-150 bg-white p-4">
                                                <div className="relative w-14 h-14 border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden">
                                                    <Image unoptimized fill src={item.productSnapshotImage || item.product.primaryImage || '/placeholder.jpg'} alt="" className="object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <span className="px-1.5 py-0.5 text-[7px] font-bold bg-zinc-100 border border-zinc-200 text-zinc-650 tracking-widest uppercase">
                                                        PRODUCE BATCH
                                                    </span>
                                                    <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider truncate mt-1">{item.productSnapshotTitle || item.product.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5 text-[9px] font-bold text-zinc-400 font-mono">
                                                        <span>{item.quantity} UNIT(S)</span>
                                                        <span>•</span>
                                                        <span>₦{Number(item.priceAtPurchase).toLocaleString()} / UNIT</span>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-green-700 uppercase mt-2">
                                                        Farmer Store: {item.seller?.businessName || 'Verified Cooperative Storefront'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Column: Actions & Delivery */}
                                    <div className="lg:col-span-5 bg-zinc-50/50 border border-zinc-200 p-5 flex flex-col justify-between space-y-4">
                                        <div className="space-y-1 select-none">
                                            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">DESTINATION COORDINATES</span>
                                            <div className="flex items-start gap-2 pt-1">
                                                <MapPin size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold text-zinc-700 leading-relaxed font-mono uppercase">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {order.status !== 'delivered' && order.paymentStatus === 'escrow_held' ? (
                                            <div className="space-y-3.5">
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-250 p-2.5">
                                                    <AlertCircle size={14} className="text-amber-700 shrink-0" />
                                                    FUNDS HELD SECURELY IN ESCROW CONTRACT
                                                </div>
                                                <button 
                                                    onClick={() => handleConfirmDelivery(order.id)}
                                                    disabled={confirmingId === order.id}
                                                    className="w-full h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center rounded-none transition-colors border border-green-800 disabled:opacity-50"
                                                >
                                                    {confirmingId === order.id ? <Loader2 className="animate-spin text-white" size={14} /> : "Confirm Receipt of Cargo"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center p-3 border border-dashed border-zinc-250 text-zinc-450 font-bold text-[9px] uppercase tracking-widest select-none bg-white">
                                                {order.paymentStatus === 'unpaid' ? "Awaiting Payment Verification" : "Escrow Contract Settled & Paid"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}