'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    Banknote, CheckCircle, Clock, XCircle, 
    ArrowUpRight, Landmark, Loader2, Search, Filter 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';

export default function AdminPayoutsPage() {
    const fetcher = useApi()
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const res = await fetcher('/api/admin/withdrawals');
  
            setRequests(res.data || []);
        } catch (err) {
            toast.error("Failed to load payout requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleApprove = async (id: string) => {
        if (!confirm("Confirm transfer to seller? This will move real funds via Paystack.")) return;
        
        setProcessingId(id);
        try {
            const res = await fetcher(`/api/admin/withdrawals/${id}/approve`, { method: 'POST' }); 
            const result = await res.json();
            if (result.success) {
                toast.success("Payout successful!");
                fetchRequests();
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Payout Management</h1>
                    <p className="text-gray-500">Review and process seller withdrawal requests.</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Banknote size={16} />
                    Connected to Paystack Live
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
                ) : requests.length === 0 ? (
                    <Card className="p-20 text-center text-gray-400 font-medium">No pending withdrawal requests.</Card>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id} className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Seller & Bank Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Landmark size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{req.seller.businessName}</h4>
                                        <p className="text-xs text-gray-400">{req.bankAccount.bankName} • {req.bankAccount.accountNumber}</p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                    <p className="text-2xl font-black text-emerald-600">${Number(req.amount).toLocaleString()}</p>
                                </div>

                                {/* Status & Date */}
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {req.status}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {req.status === 'pending' && (
                                        <Button 
                                            onClick={() => handleApprove(req.id)}
                                            disabled={processingId === req.id}
                                            className="bg-gray-900 hover:bg-black rounded-xl h-12 px-6 font-bold gap-2 shadow-lg"
                                        >
                                            {processingId === req.id ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
                                            Process Payout
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="p-2 text-gray-300 hover:text-red-500"><XCircle size={20}/></Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}