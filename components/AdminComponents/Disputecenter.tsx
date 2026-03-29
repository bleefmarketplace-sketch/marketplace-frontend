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
import { useRouter } from 'next/navigation'; // Corrected for App Router
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
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Gavel className="text-emerald-600" /> Resolution Center
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Mediating between buyers and sellers to ensure marketplace integrity.</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                    <button 
                        onClick={() => setFilter('escalated')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filter === 'escalated' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}
                    >
                        ESCALATED ({disputes.filter(d => d.status === 'escalated').length})
                    </button>
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filter === 'all' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}
                    >
                        ALL CASES
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT: DISPUTE LIST (Col 7) --- */}
                <div className="lg:col-span-7 space-y-4">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
                    ): filteredDisputes.length === 0 ? (
                        <>
                        <Card className="p-20 text-center border-2 border-dashed border-gray-100 bg-white rounded-[2.5rem]">
                            <CheckCircle size={48} className="mx-auto text-emerald-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">All Clear</h3>
                            <p className="text-gray-400 text-sm">No cases currently require admin intervention.</p>
                        </Card>
                        { filteredDisputes.map((d) => (
                            <div 
                                key={d.id} 
                                onClick={() => setSelectedDispute(d)}
                                className={`cursor-pointer transition-all ${selectedDispute?.id === d.id ? 'scale-[1.02]' : ''}`}
                            >
                                <Card className={`p-6 border-none ring-1 transition-all rounded-[2rem] ${
                                    selectedDispute?.id === d.id ? 'ring-emerald-500 bg-emerald-50/20 shadow-xl shadow-emerald-100' : 'ring-gray-100 hover:ring-gray-300 bg-white'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                d.status === 'escalated' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {d.status}
                                            </span>
                                            <span className="text-[10px] text-gray-300 font-mono">#{d.id.slice(0,8)}</span>
                                        </div>
                                        <p className="font-black text-gray-900">${Number(d?.order.totalAmount ?? 0).toLocaleString()}</p>
                                    </div>

                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{d.reason}</h4>
                                    
                                    <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                                        <div className="flex items-center gap-1"><Clock size={14}/> {new Date(d.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1"><ShieldAlert size={14} className="text-amber-500"/> Escrow Held</div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">B</div>
                                            <span className="text-xs font-bold text-gray-700">{d?.buyer.fullName ?? 'Unknown Buyer'}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300" />
                                    </div>
                                </Card>
                            </div>
                        ))}
                        </>

                    ) : (
                        filteredDisputes.map((d) => (
                            <div 
                                key={d.id} 
                                onClick={() => setSelectedDispute(d)}
                                className={`cursor-pointer transition-all ${selectedDispute?.id === d.id ? 'scale-[1.02]' : ''}`}
                            >
                                <Card className={`p-6 border-none ring-1 transition-all rounded-[2rem] ${
                                    selectedDispute?.id === d.id ? 'ring-emerald-500 bg-emerald-50/20 shadow-xl shadow-emerald-100' : 'ring-gray-100 hover:ring-gray-300 bg-white'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                d.status === 'escalated' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {d.status}
                                            </span>
                                            <span className="text-[10px] text-gray-300 font-mono">#{d.id.slice(0,8)}</span>
                                        </div>
                                        <p className="font-black text-gray-900">${Number(d.order.totalAmount).toLocaleString()}</p>
                                    </div>

                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{d.reason}</h4>
                                    
                                    <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                                        <div className="flex items-center gap-1"><Clock size={14}/> {new Date(d.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1"><ShieldAlert size={14} className="text-amber-500"/> Escrow Held</div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">B</div>
                                            <span className="text-xs font-bold text-gray-700">{d.buyer.fullName}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300" />
                                    </div>
                                </Card>
                            </div>
                        ))
                    )}
                </div>

                {/* --- RIGHT: ACTION PANEL (Col 5) --- */}
                <div className="lg:col-span-5">
                    {selectedDispute ? (
                        <div className="sticky top-24 space-y-6">
                            <Card className="p-8 border-none ring-1 ring-gray-100 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Case Evidence</h3>
                                    <button 
                                        onClick={() => router.push(`/dashboard/disputes/${selectedDispute.id}`)}
                                        className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2"
                                    >
                                        <MessageSquare size={14}/> OPEN FULL CHAT
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complaint</label>
                                        <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                                            "{selectedDispute.messages?.[0]?.message || 'No statement provided.'}"
                                        </p>
                                    </div>

                                    {/* Order Snapshot */}
                                    <div className="p-4 bg-gray-900 rounded-2xl text-white">
                                        <p className="text-[9px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Disputed Items</p>
                                        <div className="space-y-3">
                                            {selectedDispute.order.items?.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-white/10 relative overflow-hidden">
                                                        <Image unoptimized fill src={item.productSnapshotImage || '/placeholder.png'} alt="" className="object-cover" />
                                                    </div>
                                                    <p className="text-xs font-medium truncate flex-1">{item.productSnapshotTitle}</p>
                                                    <p className="text-xs font-black text-emerald-400">₦{item.priceAtPurchase}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                                        <div className="flex items-start gap-3">
                                            <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                                <b>Resolution Rule:</b> Releasing funds moves the escrow to the Seller. Refunding returns the full subtotal to the Buyer.
                                            </p>
                                        </div>
                                    </div>

                                    {/* VERDICT BUTTONS */}
                                    {selectedDispute.status === 'escalated' ? (
                                        <div className="grid gap-3 pt-4">
                                            <Button 
                                                disabled={processing}
                                                onClick={() => handleAdminResolve(selectedDispute.id, 'release')}
                                                className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-black text-sm uppercase tracking-widest"
                                            >
                                                {processing ? <Loader2 className="animate-spin" /> : 'Release to Seller'}
                                            </Button>
                                            <Button 
                                                disabled={processing}
                                                variant="outline"
                                                onClick={() => handleAdminResolve(selectedDispute.id, 'refund')}
                                                className="h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-sm uppercase tracking-widest"
                                            >
                                                {processing ? <Loader2 className="animate-spin" /> : 'Full Refund to Buyer'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed text-center">
                                            <CheckCircle className="text-emerald-500 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Case Resolved</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-12 text-center h-[500px] flex flex-col items-center justify-center text-gray-400">
                            <AlertTriangle size={48} className="mb-4 opacity-20" />
                            <h3 className="font-bold">No Case Selected</h3>
                            <p className="text-sm max-w-[200px] mx-auto">Select a case from the list to view the file and issue a verdict.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDisputeCenter;