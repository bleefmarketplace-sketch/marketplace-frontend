'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    Gavel, MessageSquare, Clock, CheckCircle, 
    AlertCircle, ChevronRight, Loader2, Search
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function DisputeListPage() {
    const fetcher = useApi();
    const router = useRouter();
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const load = async () => {
        try {
            const res = await fetcher('/api/disputes');
            setDisputes(res?.data || []);
        } catch {
            toast.error('Failed to load disputes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = disputes.filter(d => 
        d.reason.toLowerCase().includes(search.toLowerCase()) ||
        d.order.id.includes(search)
    );

    if (loading) return (
        <div className="flex justify-center py-32 font-mono text-xs">
            <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
            <span>RETRIVING ESCROW DISPUTE FILES...</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-6 font-mono text-zinc-900 text-xs antialiased">
            {/* Header */}
            <div className="border border-zinc-200 bg-white p-5 select-none">
                <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                    DISPUTE RESOLUTION HUB
                </span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2 flex items-center gap-2">
                    <Gavel className="text-green-700" size={20} /> Escrow Dispute Center
                </h1>
                <p className="text-zinc-500 text-[10px] mt-0.5">Mediate active order escrow holds, negotiate settlements, or escalate claims.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="SEARCH CASE REASON OR ORDER REFERENCE ID..." 
                    className="w-full pl-9 pr-4 py-2.5 border border-zinc-250 rounded-none bg-white font-mono text-xs uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-green-700"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white select-none">
                    <Gavel className="mx-auto text-zinc-300 mb-4" size={40} />
                    <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">
                        {search ? 'NO CASES MATCH SEARCH PARAMETERS' : 'NO ACTIVE CASE RECORDS'}
                    </h3>
                    <p className="text-zinc-500 text-[10px] mt-2 max-w-xs mx-auto leading-relaxed">
                        {search ? 'Try adjusting your search criteria.' : 'Escrow contract releases are proceeding within optimal bounds.'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map(dispute => {
                        const isEscalated = dispute.status === 'escalated';
                        return (
                            <Card 
                                key={dispute.id} 
                                className="p-5 border border-zinc-200 bg-white rounded-none shadow-none hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col font-mono text-xs text-zinc-900"
                                onClick={() => router.push(`/account/disputes/${dispute.id}`)}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-none ${
                                            isEscalated 
                                                ? 'border-red-200 bg-red-50 text-red-800' 
                                                : 'border-amber-200 bg-amber-50 text-amber-800'
                                        }`}>
                                            <AlertCircle size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider truncate">
                                                {dispute.reason}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-zinc-400 font-mono">
                                                <span>ORDER #{dispute.order.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-zinc-300">•</span>
                                                <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 select-none">
                                        <div className="text-left sm:text-right">
                                            <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-none ${
                                                isEscalated 
                                                    ? 'border-red-200 bg-red-50 text-red-800 font-bold' 
                                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                                            }`}>
                                                {dispute.status.replace('_', ' ')}
                                            </span>
                                            <p className="text-[9px] text-zinc-450 uppercase tracking-widest mt-1.5 font-bold">
                                                ₦{Number(dispute.order.totalAmount).toLocaleString()} LOCKED
                                            </p>
                                        </div>
                                        <ChevronRight className="text-zinc-300 group-hover:text-green-700 transition-colors ml-auto sm:ml-0" size={16} />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
