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

    const [activeModal, setActiveModal] = useState<{
        type: 'confirm' | 'review';
        orderId: string;
        order: any;
    } | null>(null);
    const [reviewRatings, setReviewRatings] = useState<Record<string, number>>({});
    const [reviewComments, setReviewComments] = useState<Record<string, string>>({});
    const [reviewAnons, setReviewAnons] = useState<Record<string, boolean>>({});
    const [reviewedItemIds, setReviewedItemIds] = useState<string[]>([]);
    const [submittingReviewId, setSubmittingReviewId] = useState<string | null>(null);

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

    const handleConfirmDelivery = async (orderId: string, order: any) => {
        setConfirmingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'PATCH' });
            const result = await res.json();
            if (result.success) {
                toast.success("Payment released to seller. Thank you!");
                fetchOrders(); // Refresh list

                // Transition to review view
                setActiveModal({ type: 'review', orderId, order });
            } else {
                toast.error(result.message || "Action failed");
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
                        onClick={() => window.location.href = '/marketplace'}
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

                                <div className={`flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-800'
                                    }`}>
                                    {order.status === 'delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
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
                                            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">DESTINATION</span>
                                            <div className="flex items-start gap-2 pt-1">
                                                <MapPin size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold text-zinc-700 leading-relaxed font-mono uppercase">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {order.status !== 'delivered' && order.paymentStatus === 'escrow_held' ? (
                                            <div className="space-y-3.5">

                                                <button
                                                    onClick={() => setActiveModal({ type: 'confirm', orderId: order.id, order })}
                                                    disabled={confirmingId === order.id}
                                                    className="w-full h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center rounded-none transition-colors border border-green-800 disabled:opacity-50"
                                                >
                                                    Confirm Receipt of Cargo
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

            {/* Custom Modal Backdrop */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs select-none">
                    {/* Modal Content */}
                    <div className="bg-white border border-zinc-200 max-w-md w-full p-6 font-mono text-xs space-y-6 animate-in zoom-in duration-200">

                        {activeModal.type === 'confirm' && (
                            <>
                                <div className="text-center space-y-3">
                                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-700 rounded-none flex items-center justify-center mx-auto">
                                        <AlertCircle size={24} />
                                    </div>
                                    <h3 className="font-bold text-zinc-950 uppercase tracking-widest text-sm">CONFIRM CARGO DELIVERY?</h3>
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">ORDER ID: #{activeModal.orderId.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <p className="text-zinc-655 font-sans text-xs leading-relaxed text-center">
                                    By confirming, you verify that you have physically received and inspected the produce batches.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-11 rounded-none text-xs font-bold uppercase tracking-wider hover:border-zinc-400"
                                        onClick={() => setActiveModal(null)}
                                        disabled={confirmingId === activeModal.orderId}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        className="flex-1 h-11 rounded-none text-xs font-bold uppercase tracking-wider bg-green-700 hover:bg-green-800 text-white flex items-center justify-center"
                                        onClick={() => handleConfirmDelivery(activeModal.orderId, activeModal.order)}
                                        disabled={confirmingId === activeModal.orderId}
                                    >
                                        {confirmingId === activeModal.orderId ? (
                                            <Loader2 className="animate-spin text-white" size={14} />
                                        ) : (
                                            "CONFIRM"
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}

                        {activeModal.type === 'review' && (
                            <>
                                <div className="text-center space-y-3 pb-3 border-b border-zinc-150">
                                    <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-750 rounded-none flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="font-bold text-zinc-950 uppercase tracking-widest text-sm">CARGO RECEIPT COMPLETE</h3>
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">PLEASE WRITE A REVIEW ABOUT THIS ORDER</p>
                                </div>

                                <p className="text-zinc-650 font-sans text-xs leading-relaxed text-center">
                                    Help other buyers in the network by leaving a review for the crops/products in this batch.
                                </p>

                                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                                    {activeModal.order?.items?.map((item: any) => {
                                        const isReviewed = reviewedItemIds.includes(item.id);
                                        const productId = item.product?.id;
                                        const rating = reviewRatings[item.id] || 0;
                                        const comment = reviewComments[item.id] || '';
                                        const isAnon = reviewAnons[item.id] || false;

                                        return (
                                            <div key={item.id} className="border border-zinc-200 p-4 space-y-3 bg-zinc-50">
                                                <div className="flex gap-3 items-center">
                                                    <div className="relative w-8 h-8 rounded-none border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden">
                                                        <Image unoptimized fill src={item.productSnapshotImage || item.product?.primaryImage || '/placeholder.jpg'} alt="" className="object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-bold text-zinc-950 uppercase truncate text-[10px]">{item.productSnapshotTitle || item.product?.title}</h4>
                                                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">SUPPLIER: {item.seller?.businessName}</p>
                                                    </div>
                                                </div>

                                                {isReviewed ? (
                                                    <div className="text-center py-2 border border-dashed border-green-250 bg-green-50 text-green-800 font-bold text-[9px] uppercase tracking-widest">
                                                        ✓ REVIEW REGISTERED
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 pt-1 border-t border-zinc-200">
                                                        {/* Star Rating selector */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-zinc-450 uppercase text-[9px] tracking-wider">CROP QUALITY RATING</span>
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => setReviewRatings(prev => ({ ...prev, [item.id]: star }))}
                                                                        className="hover:scale-110 transition-transform cursor-pointer"
                                                                    >
                                                                        <span className={`text-sm ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'}`}>
                                                                            ★
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Comment Textarea */}
                                                        <textarea
                                                            placeholder="Add your verified crop review comment..."
                                                            rows={2}
                                                            value={comment}
                                                            onChange={(e) => setReviewComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                            className="w-full p-2 bg-white border border-zinc-250 rounded-none text-[11px] font-mono outline-none focus:border-green-600 resize-none text-zinc-900"
                                                        />

                                                        {/* Anonymous Checkbox */}
                                                        <div className="flex items-center justify-between">
                                                            <label className="flex items-center gap-1.5 cursor-pointer text-[9px] font-bold text-zinc-500 hover:text-zinc-800 select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAnon}
                                                                    onChange={(e) => setReviewAnons(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                                                    className="w-3.5 h-3.5 rounded-none border-zinc-300 text-green-700 accent-green-700 cursor-pointer"
                                                                />
                                                                SUBMIT ANONYMOUSLY
                                                            </label>

                                                            <Button
                                                                size="sm"
                                                                className="h-7 text-[9px] rounded-none px-3 font-bold uppercase tracking-wider bg-green-700 hover:bg-green-800 text-white"
                                                                disabled={rating === 0 || !comment.trim() || submittingReviewId === item.id}
                                                                onClick={async () => {
                                                                    setSubmittingReviewId(item.id);
                                                                    try {
                                                                        const res = await fetch(`/api/reviews/${productId}`, {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({
                                                                                rating,
                                                                                comment,
                                                                                isAnonymous: isAnon
                                                                            })
                                                                        });
                                                                        const data = await res.json();
                                                                        if (res.ok || data.success) {
                                                                            toast.success("Review successfully registered!");
                                                                            setReviewedItemIds(prev => [...prev, item.id]);
                                                                        } else {
                                                                            toast.error(data.message || "Failed to submit review");
                                                                        }
                                                                    } catch (err) {
                                                                        toast.error("Failed to submit review");
                                                                    } finally {
                                                                        setSubmittingReviewId(null);
                                                                    }
                                                                }}
                                                            >
                                                                {submittingReviewId === item.id ? "SUBMITTING..." : "SUBMIT REVIEW"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        fullWidth
                                        className="h-11 rounded-none border border-zinc-200 hover:bg-zinc-50 font-bold uppercase tracking-wider text-xs bg-white text-zinc-700"
                                        onClick={() => {
                                            setActiveModal(null);
                                            setReviewRatings({});
                                            setReviewComments({});
                                            setReviewAnons({});
                                            setReviewedItemIds([]);
                                        }}
                                    >
                                        CLOSE
                                    </Button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}