'use client';
import React, { use, useEffect, useState } from 'react';
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

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Purchases</h1>
                    <p className="text-gray-500 text-sm font-medium">Track your produce shipments and manage escrow.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Escrow Protected</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-2 border-gray-100">
                    <Package className="mx-auto text-gray-200 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-400">No orders found yet.</h3>
                    <Button variant="ghost" className="mt-4 text-emerald-600 font-bold" onClick={() => window.location.href='/marketplace'}>Start Shopping</Button>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow p-0">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order ID</p>
                                        <p className="text-xs font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date Placed</p>
                                        <p className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Amount</p>
                                        <p className="text-xs font-black text-emerald-600">${order.totalAmount}</p>
                                    </div>
                                </div>
                                
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {order.status === 'delivered' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                    {order.status}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                                    <Image unoptimized fill src={item.product.primaryImage} alt="" className="object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.title}</h4>
                                                    <p className="text-xs text-gray-500">{item.quantity} Unit(s) • ${item.priceAtPurchase}/unit</p>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Farmer: {item.seller?.businessName || 'Verified Farm'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Box */}
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start gap-3 mb-4">
                                                <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Shipping To:</span>
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {order.status !== 'delivered' && order.paymentStatus === 'escrow_held' ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl">
                                                    <AlertCircle size={16} />
                                                    Funds are held securely in escrow
                                                </div>
                                                <Button 
                                                    fullWidth 
                                                    onClick={() => handleConfirmDelivery(order.id)}
                                                    disabled={confirmingId === order.id}
                                                    className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl shadow-lg shadow-emerald-100 font-bold"
                                                >
                                                    {confirmingId === order.id ? <Loader2 className="animate-spin" /> : "Confirm Receipt of Goods"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest">
                                                {order.paymentStatus === 'unpaid' ? "Awaiting Payment Verification" : "Transaction Completed"}
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