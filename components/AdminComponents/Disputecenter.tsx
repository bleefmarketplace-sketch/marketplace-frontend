'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Gavel, CheckCircle, ShieldAlert, Clock,
    MessageSquare, AlertTriangle, Loader2,
    ArrowRight, Info, Image as ImageIcon, XCircle
} from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type DisputeStatus = 'pending' | 'escalated' | 'resolved';

type DisputeItem = {
    id: string;
    productSnapshotImage?: string;
    productSnapshotTitle?: string;
    priceAtPurchase: number;
};

type DisputeOrder = {
    totalAmount: number;
    items?: DisputeItem[];
};

type DisputeMessage = {
    message: string;
};

type Dispute = {
    id: string;
    status: DisputeStatus;
    reason: string;
    createdAt: string;
    order: DisputeOrder;
    buyer: {
        fullName: string;
    };
    messages?: DisputeMessage[];
};

const AdminDisputeCenter = () => {
    const fetcher = useApi() as (url: string, options?: RequestInit) => Promise<{ data: Dispute[] }>;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'escalated'>('escalated');
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
    const [processing, setProcessing] = useState(false);

    // --- LOAD DATA ---
    const loadDisputes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetcher('/api/admin/disputes');
            const data = res.data || [];
            setDisputes(data);

            const escalated = data.find((d) => d.status === 'escalated');
            if (escalated) setSelectedDispute(escalated);
        } catch (e: any) {
            toast.error(e.message || "Failed to load cases");
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => { loadDisputes(); }, [loadDisputes]);

    // --- FILTERS ---
    const filteredDisputes = filter === 'escalated'
        ? disputes.filter(d => d.status === 'escalated')
        : disputes;

    // --- HANDLERS ---
    const handleAdminResolve = async (id: string, action: 'release' | 'refund') => {
        const note = window.prompt(`FINAL VERDICT: Enter the reason for choosing to ${action.toUpperCase()} (This will be shown to both parties):`);
        if (!note) return;

        setProcessing(true);
        try {
            await fetcher(`/api/admin/disputes/${id}/resolve`, {
                method: 'POST',
                body: JSON.stringify({ action, note })
            });
            toast.success(`Dispute resolved successfully: ${action.toUpperCase()}`);
            loadDisputes();
            setSelectedDispute(null);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-zinc-200 bg-white p-5">
                <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                        ARBITRATION PANEL
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2 flex items-center gap-2">
                        <Gavel size={18} className="text-green-700" /> Resolution Center
                    </h2>
                    <p className="text-zinc-500 text-[10px] mt-0.5">Mediating escrow claims and transaction logs to enforce system rules.</p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-none border border-zinc-200 w-fit select-none font-mono font-bold shrink-0">
                    <button
                        onClick={() => setFilter('escalated')}
                        className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer font-bold ${filter === 'escalated' ? 'bg-white border-zinc-250 text-green-805 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
                    >
                        ESCALATED ({disputes.filter(d => d.status === 'escalated').length})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer font-bold ${filter === 'all' ? 'bg-white border-zinc-250 text-green-850 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
                    >
                        ALL CASES
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* --- LEFT: DISPUTE LIST (Col 7) --- */}
                <div className="lg:col-span-7 space-y-4">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-green-700" size={32} /></div>
                    ) : filteredDisputes.length === 0 ? (
                        <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white">
                            <CheckCircle size={40} className="mx-auto text-green-700/30 mb-4" />
                            <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">ALL CLEAR</h3>
                            <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">No pending escrow disputes require administrative mediation.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredDisputes.map((d) => (
                                <div
                                    key={d.id}
                                    onClick={() => setSelectedDispute(d)}
                                    className="cursor-pointer"
                                >
                                    <Card className={`p-5 transition-colors rounded-none shadow-none border ${
                                        selectedDispute?.id === d.id 
                                            ? 'border-green-700 bg-green-50/15 border-l-4 border-l-green-700' 
                                            : 'border-zinc-200 hover:bg-zinc-50/60 bg-white'
                                    }`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-none ${
                                                    d.status === 'escalated' 
                                                        ? 'border-red-200 bg-red-50 text-red-800' 
                                                        : 'border-zinc-200 bg-zinc-50 text-zinc-650'
                                                }`}>
                                                    {d.status}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 font-mono">#{d.id.slice(0, 8)}</span>
                                            </div>
                                            <span className="font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5">
                                                ₦{Number(d.order.totalAmount ?? 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-2">{d.reason}</h4>

                                        <div className="flex items-center gap-4 text-[10px] font-mono font-bold mt-3 pt-3 border-t border-zinc-150">
                                            <div className="flex items-center gap-1 text-zinc-500"><Clock size={12} /> {new Date(d.createdAt).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-150 px-1.5 py-0.5"><ShieldAlert size={12} /> ESCROW HELD</div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-zinc-150 flex items-center justify-between text-[10px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border border-zinc-250 bg-zinc-50 flex items-center justify-center text-[9px] font-bold text-zinc-700">B</div>
                                                <span className="font-bold text-zinc-700 uppercase">{d?.buyer.fullName ?? 'Unknown Buyer'}</span>
                                            </div>
                                            <ArrowRight size={13} className="text-zinc-350" />
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- RIGHT: ACTION PANEL (Col 5) --- */}
                <div className="lg:col-span-5">
                    {selectedDispute ? (
                        <div className="sticky top-6 space-y-4">
                            <Card className="p-5 border border-zinc-200 shadow-none rounded-none bg-white">
                                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-150">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">Case Evidence</h3>
                                    <button
                                        onClick={() => router.push(`/dashboard/disputes/${selectedDispute.id}`)}
                                        className="text-[9px] font-bold tracking-wider text-green-800 border border-green-200 bg-green-50 px-3 py-1.5 rounded-none hover:bg-green-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <MessageSquare size={13} /> OPEN DISCUSSION
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Buyer Statement</label>
                                        <p className="mt-1 text-[10px] text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-200 p-4 rounded-none italic">
                                            "{selectedDispute.messages?.[0]?.message || 'No statement provided.'}"
                                        </p>
                                    </div>

                                    {/* Order Snapshot */}
                                    <div className="p-4 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-none font-mono text-[10px]">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Disputed Line Items</p>
                                        <div className="space-y-3">
                                            {selectedDispute.order.items?.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 border border-zinc-800 rounded-none relative overflow-hidden bg-zinc-900 shrink-0">
                                                        {item.productSnapshotImage && (
                                                            <Image unoptimized fill src={item.productSnapshotImage} alt="" className="object-cover" />
                                                        )}
                                                    </div>
                                                    <p className="font-bold uppercase truncate flex-1">{item.productSnapshotTitle}</p>
                                                    <p className="font-bold text-green-500">₦{Number(item.priceAtPurchase).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-none font-mono text-[10px]">
                                        <div className="flex items-start gap-2.5">
                                            <Info className="text-blue-700 shrink-0 mt-0.5" size={14} />
                                            <p className="leading-relaxed font-bold uppercase tracking-wider">
                                                Resolution Protocol: Releasing funds transfers escrow directly to the Seller. Refunding issues full contract reimbursement back to the Buyer.
                                            </p>
                                        </div>
                                    </div>

                                    {/* VERDICT BUTTONS */}
                                    {selectedDispute.status === 'escalated' ? (
                                        <div className="grid gap-2 pt-2">
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleAdminResolve(selectedDispute.id, 'release')}
                                                className="rounded-none h-11 w-full bg-green-700 hover:bg-green-800 border-green-700 text-white uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer shadow-none"
                                            >
                                                {processing ? <Loader2 className="animate-spin text-white" size={13} /> : 'Release to Seller'}
                                            </Button>
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleAdminResolve(selectedDispute.id, 'refund')}
                                                className="rounded-none h-11 w-full bg-transparent hover:bg-red-50 border border-red-700 text-red-700 uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer"
                                            >
                                                {processing ? <Loader2 className="animate-spin text-red-700" size={13} /> : 'Refund to Buyer'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-green-200 bg-green-50 text-green-800 rounded-none text-center font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5">
                                            <CheckCircle size={14} className="text-green-700" /> Case File Resolved
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="bg-white border border-zinc-200 border-dashed p-10 text-center h-80 flex flex-col items-center justify-center text-zinc-400 font-mono text-xs rounded-none">
                            <AlertTriangle size={32} className="mb-3 text-zinc-300" />
                            <h3 className="font-bold uppercase tracking-wider">No Case Selected</h3>
                            <p className="text-[10px] mt-1.5 leading-relaxed max-w-[200px] mx-auto text-zinc-500">
                                Select a file from the repository checklist to inspect logs and issue final arbitration.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDisputeCenter;