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
    const fetcher = useApi();
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchSales = async () => {
        try {
            const res = await fetcher('/api/seller/sales');
            setSales(res.data || []);
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
            await fetcher(`/api/seller/sales/${orderItemId}/ship`, {
                method: 'PATCH',
            });
            toast.success("Package marked as shipped!");
            fetchSales();
        } catch (e) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs">
            <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Ledger...</span>
        </div>
    );

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
            
            {/* Page Header */}
            <div className="border border-zinc-200 bg-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                    SALES REGISTER
                  </span>
                  <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Incoming Escrow Orders</h1>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Track cargo routes, buyer identities, and fullfilment cycles. Payments are unlocked upon buyer confirmation.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
                    <div className="bg-white border border-zinc-200 px-3 py-1.5 rounded-none flex items-center gap-2 shadow-none font-bold uppercase tracking-wider text-[10px] w-full md:w-auto justify-center">
                        <Package className="text-green-700" size={14} />
                        <span>{sales.length} Bound Sales</span>
                    </div>
                </div>
            </div>

            {sales.length === 0 ? (
                <div className="bg-white rounded-none p-12 md:p-20 text-center border border-dashed border-zinc-250 font-mono">
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-none flex items-center justify-center mx-auto mb-4">
                        <Package className="text-zinc-300" size={22} />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">No Orders Registered</h3>
                    <p className="text-zinc-400 max-w-xs mx-auto text-[10px] mt-1 leading-relaxed">Once buyers commit collateral funds to your produce catalog, the escrow telemetry logs will bind records here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sales.map((sale) => {
                        const earnings = Number(sale.priceAtPurchase) * sale.quantity;
                        const isShipped = sale.fulfillmentStatus === 'shipped';
                        const isPaid = sale.order.paymentStatus === 'released' || sale.order.paymentStatus === 'escrow_held';

                        return (
                            <Card key={sale.id} className="p-0 overflow-hidden border border-zinc-200 rounded-none shadow-none bg-white">
                                {sale.product ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-12">

                                        {/* Column 1: Product & Status */}
                                        <div className="lg:col-span-3 p-5 border-b lg:border-b-0 lg:border-r border-zinc-150">
                                            <div className="flex items-center gap-2 mb-4 leading-none select-none">
                                                <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border ${
                                                    isShipped 
                                                      ? 'border-green-200 bg-green-50 text-green-800' 
                                                      : 'border-amber-200 bg-amber-50 text-amber-800'
                                                }`}>
                                                    {sale.fulfillmentStatus}
                                                </span>
                                                <span className="text-[9px] text-zinc-400 font-bold tracking-widest">ID: #{sale.id.slice(0, 8).toUpperCase()}</span>
                                            </div>

                                            <div className="flex gap-3.5 lg:flex-col">
                                                <div className="relative w-16 h-16 lg:w-full lg:h-28 rounded-none overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                                                    <Image unoptimized fill src={sale.productSnapshotImage}
                                                        alt={sale.productSnapshotTitle} className="object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wide truncate lg:whitespace-normal lg:line-clamp-2 leading-tight">{sale.productSnapshotTitle}</h4>
                                                    <p className="text-[10px] text-green-700 font-bold mt-1.5 tracking-wider font-mono">Lot size: {sale.quantity} Units</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 2: Logistics & Buyer */}
                                        <div className="lg:col-span-5 p-5 bg-zinc-50/45 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-150">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-2 leading-none">Discharge Silo / Destination</p>
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="w-7 h-7 border border-zinc-200 rounded-none bg-white flex items-center justify-center shrink-0">
                                                            <MapPin size={13} className="text-green-755" />
                                                        </div>
                                                        <p className="text-[10px] text-zinc-700 font-bold leading-normal pt-0.5">
                                                            {sale.order.shippingAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-1">
                                                    <div>
                                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 leading-none">Customer ID</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 border border-green-200 rounded-none bg-green-50 flex items-center justify-center text-[9px] font-bold text-green-700 shrink-0">
                                                                {sale.order.buyer.fullName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-zinc-800 truncate uppercase tracking-wider">{sale.order.buyer.fullName}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 leading-none">Registry Date</p>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-800">
                                                            <Calendar size={12} className="text-zinc-400" />
                                                            <span>{new Date(sale.order.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 3: Payout Info */}
                                        <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-zinc-150 flex flex-col justify-center text-center lg:text-left">
                                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1 leading-none">Collateral Payout</p>
                                            <p className="text-xl font-black text-zinc-950 font-mono tracking-tight pt-1">₦{earnings.toLocaleString()}</p>

                                            <div className="mt-3 leading-none select-none">
                                                {sale.order.paymentStatus === 'escrow_held' ? (
                                                    <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border border-blue-200 bg-blue-50 text-blue-800 tracking-wider">
                                                        IN ESCROW HOLD
                                                    </span>
                                                ) : sale.order.paymentStatus === 'released' ? (
                                                    <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border border-green-200 bg-green-50 text-green-800 tracking-wider">
                                                        RELEASED TO WALLET
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border border-zinc-200 bg-zinc-50 text-zinc-500 tracking-wider">
                                                        {sale.order.paymentStatus.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column 4: Actions */}
                                        <div className="lg:col-span-2 p-5 flex items-center justify-center bg-white">
                                            {!isShipped ? (
                                                <Button
                                                    onClick={() => handleMarkShipped(sale.id)}
                                                    disabled={updatingId === sale.id || !isPaid}
                                                    className="w-full h-10 rounded-none bg-green-700 hover:bg-green-800 border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                                                >
                                                    {updatingId === sale.id ? <Loader2 className="animate-spin text-white" size={12} /> : <Truck size={12} />}
                                                    <span>Mark Shipped</span>
                                                </Button>
                                            ) : (
                                                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-none w-full select-none">
                                                    <CheckCircle className="text-green-755 mx-auto mb-1 animate-pulse" size={15} />
                                                    <p className="text-[8px] font-bold text-green-800 uppercase leading-snug tracking-wider">Shipped & Locked Until Delivery</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 p-5 opacity-60 font-mono">
                                        <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-none flex items-center justify-center shrink-0">
                                            <Package size={18} className="text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-zinc-500 italic uppercase tracking-wider">Produce Removed from active lists</h4>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Archived Escrow Record</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}