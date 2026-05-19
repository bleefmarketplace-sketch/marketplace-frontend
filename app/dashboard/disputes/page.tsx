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

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Dispute Center</h1>
                    <p className="text-gray-500 text-sm">Resolution hub for order issues and escrow mediation</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by reason or order ID..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-2 rounded-[2.5rem]">
                    <Gavel className="mx-auto text-gray-200 mb-4" size={56} />
                    <h3 className="text-xl font-bold text-gray-400">
                        {search ? 'No disputes match your search' : 'No active disputes'}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                        {search ? 'Try a different search term.' : 'Everything is running smoothly with your orders.'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filtered.map(dispute => (
                        <Card 
                            key={dispute.id} 
                            className="p-6 cursor-pointer hover:shadow-md transition-shadow group border-gray-100"
                            onClick={() => router.push(`/dashboard/disputes/${dispute.id}`)}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        dispute.status === 'escalated' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        <AlertCircle size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{dispute.reason}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Order #{dispute.order.id.slice(0,8)}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {new Date(dispute.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="text-right hidden sm:block">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            dispute.status === 'escalated' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                            {dispute.status.replace('_', ' ')}
                                        </span>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                            ₦{Number(dispute.order.totalAmount).toLocaleString()} Locked
                                        </p>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors ml-auto sm:ml-0" size={20} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
