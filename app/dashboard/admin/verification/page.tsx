'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    ShieldCheck, MapPin, User, Wheat, 
    Calendar, CheckCircle, XCircle, Loader2,
    Info, Phone, Mail, Box
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

export default function VerificationQueuePage() {
    const fetcher = useApi();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadQueue = useCallback(async () => {
        try {
            const res = await fetcher('/api/admin/verify/verify-queue'); 
            setQueue(res?.data);
        } catch (e) { toast.error("Failed to load queue"); }
        finally { setLoading(false); }
    }, [fetcher]);

    useEffect(() => { loadQueue(); }, [loadQueue]);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await fetcher(`/api/admin/verify/${id}`, { method: 'PATCH' });
            toast.success("Seller verified successfully!");
            loadQueue();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
    const reason = window.prompt("Please provide a reason for rejection (this will be emailed to the user):");
    
    if (!reason) return; // Don't proceed if they cancel or leave empty

    setProcessingId(id);
    try {
        await fetcher(`/api/admin/verify/${id}/reject`, { 
            method: 'PATCH',
            body: JSON.stringify({ reason }) 
        });
        toast.warn("User rejected and notified.");
        loadQueue();
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setProcessingId(null);
    }
};

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    Verification Queue <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-lg">{queue.length} Pending</span>
                </h1>
                <p className="text-gray-500 text-sm font-medium mt-1">
                    Review farm details and approve sellers to grant marketplace access.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
            ) : queue.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
                    <ShieldCheck className="mx-auto text-gray-100 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-400">The queue is empty!</h3>
                    <p className="text-gray-400 text-sm">All sellers have been processed.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {queue.map((user) => (
                        <Card key={user.id} className="p-0 overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="grid md:grid-cols-12">
                                
                                {/* Seller Basics */}
                                <div className="md:col-span-4 p-8 border-r border-gray-50 bg-gray-50/30">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-xl">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">{user.fullName}</h4>
                                            <p className="text-xs text-gray-500 font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Mail size={14} className="text-gray-400" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Phone size={14} className="text-gray-400" /> {user.phoneNumber}
                                        </div>
                                    </div>
                                </div>

                                {/* Farm Details */}
                                <div className="md:col-span-5 p-8 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Wheat size={12} className="text-emerald-500" /> Farm Documentation
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Farm Name</p>
                                            <p className="text-sm font-bold text-gray-800">{user.farmName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Land Size</p>
                                            <p className="text-sm font-bold text-gray-800">{user.farmSize ? `${user.farmSize} Hectares` : 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Operating Location</p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                                <MapPin size={14} className="text-emerald-500" /> {user.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-3 p-8 flex flex-col justify-center gap-3 border-l border-gray-50 bg-white">
                                    
                                    <Button 
                                        onClick={() => handleApprove(user.id)}
                                        disabled={processingId === user.id}
                                        className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-bold gap-2"
                                    >
                                        {processingId === user.id ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                                        Approve Seller
                                    </Button>
                                    <Button 
                                      onClick={() => handleReject(user.id)}
                                        disabled={processingId === user.id}
                                        variant="outline"
                                        className="h-12 rounded-2xl border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 font-bold gap-2"
                                    >
                                        {processingId === user.id ? <Loader2 className="animate-spin" /> : <XCircle size={18} />}
                                         Reject
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}