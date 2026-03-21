'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
    Package, MapPin, Phone, Mail, Truck,
    CheckCircle, Clock, Loader2, Calendar,
    ExternalLink, AlertCircle, User,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';

export default function SellerOrdersPage() {
    const fetcher = useApi()
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchSales = async () => {
        try {
            const res = await fetcher('/api/seller/sales');

           
            setSales(res || []);
        } catch (err) {
            toast.error("Failed to load incoming orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSales(); }, []);

    const handleMarkShipped = async (orderItemId: string) => {
        setUpdatingId(orderItemId);
        try {
            const res = await fetcher(`/api/seller/sales/${orderItemId}/ship`, {
                method: 'PATCH',
            });

            toast.success("Package marked as shipped!");
            fetchSales(); // Refresh the list

        } catch (e) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Incoming Orders</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">
                        Track and fulfill your produce sales. Payments are released upon buyer confirmation.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                        <Package className="text-emerald-500" size={18} />
                        <span className="text-sm font-bold">{sales.length} Total Sales</span>
                    </div>
                </div>
            </div>

            {sales.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="text-gray-200" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-400 max-w-xs mx-auto text-sm">Once customers purchase your produce, they will appear here for fulfillment.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {sales.map((sale) => {
                        const earnings = Number(sale.priceAtPurchase) * sale.quantity;
                        const isShipped = sale.fulfillmentStatus === 'shipped';
                        const isPaid = sale.order.paymentStatus === 'released' || sale.order.paymentStatus === 'escrow_held';

                        return (

                            <Card key={sale.id} className="p-0 overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                {
                                    sale.product ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-12">

                                            {/* Column 1: Product & Status */}
                                            <div className="lg:col-span-3 p-6 border-r border-gray-50">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isShipped ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {sale.fulfillmentStatus}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300 font-mono">#{sale.id.slice(0, 8)}</span>
                                                </div>

                                                <div className="flex gap-4 lg:flex-col">
                                                    <div className="relative w-20 h-20 lg:w-full lg:h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                                        <Image unoptimized fill   src={sale.productSnapshotImage} 
            alt={sale.productSnapshotTitle} className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">{sale.productSnapshotTitle}</h4>
                                                        <p className="text-xs text-emerald-600 font-black mt-1">{sale.quantity} </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 2: Logistics & Buyer */}
                                            <div className="lg:col-span-5 p-6 bg-gray-50/30 flex flex-col justify-between">
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Delivery Address</p>
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                                                <MapPin size={16} className="text-emerald-500" />
                                                            </div>
                                                            <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                                                                {sale.order.shippingAddress}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Customer</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                                                                    {sale.order.buyer.fullName.charAt(0)}
                                                                </div>
                                                                <span className="text-xs font-bold text-gray-800 truncate">{sale.order.buyer.fullName}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Date Ordered</p>
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                                                <Calendar size={14} className="text-gray-400" />
                                                                {new Date(sale.order.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 3: Payout Info */}
                                            <div className="lg:col-span-2 p-6 border-l border-gray-50 flex flex-col justify-center text-center lg:text-left">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Your Payout</p>
                                                <p className="text-3xl font-black text-gray-900 tracking-tighter">${earnings.toLocaleString()}</p>

                                                <div className="mt-4 space-y-2">
                                                    {sale.order.paymentStatus === 'escrow_held' ? (
                                                        <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold justify-center lg:justify-start">
                                                            <ShieldCheck size={12} /> IN ESCROW
                                                        </div>
                                                    ) : sale.order.paymentStatus === 'released' ? (
                                                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold justify-center lg:justify-start">
                                                            <CheckCircle size={12} /> PAID TO WALLET
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold justify-center lg:justify-start">
                                                            <Clock size={12} /> {sale.order.paymentStatus.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Column 4: Actions */}
                                            <div className="lg:col-span-2 p-6 flex items-center justify-center border-l border-gray-50 bg-white">
                                                {!isShipped ? (
                                                    <Button
                                                        onClick={() => handleMarkShipped(sale.id)}
                                                        disabled={updatingId === sale.id || !isPaid}
                                                        className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-bold gap-2 text-sm"
                                                    >
                                                        {updatingId === sale.id ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
                                                        Mark Shipped
                                                    </Button>
                                                ) : (
                                                    <div className="text-center p-4 bg-emerald-50 rounded-2xl w-full border border-emerald-100">
                                                        <CheckCircle className="text-emerald-500 mx-auto mb-1" size={20} />
                                                        <p className="text-[10px] font-black text-emerald-700 uppercase leading-tight">Shipped & Pending Confirmation</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 opacity-60">
                                            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                                <Package size={20} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 italic">Product Removed from Store</h4>
                                                <p className="text-[10px] text-gray-400">Archived Record</p>
                                            </div>
                                        </div>
                                    )
                                }

                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}