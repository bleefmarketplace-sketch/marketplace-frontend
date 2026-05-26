'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Send, Paperclip, AlertCircle, ShieldAlert, 
    Clock, CheckCircle, Gavel, Loader2, 
    ArrowLeft, Package, User, Image as ImageIcon
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function DisputeDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const fetcher = useApi();
    const { user } = useAuth();
    
    const [dispute, setDispute] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Dispute Data
    const loadDispute = async () => {
        try {
            const data = await fetcher(`/api/disputes/${id}`);
            setDispute(data);
        } catch (e) {
            toast.error("Failed to load dispute details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDispute(); }, [id]);

    // 2. Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [dispute?.messages]);

    // 3. Handlers
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSending(true);
        try {
            await fetcher(`/api/disputes/${id}/message`, {
                method: 'POST',
                body: JSON.stringify({ message })
            });
            setMessage('');
            loadDispute(); // Refresh chat
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSending(false);
        }
    };

    const handleEscalate = async () => {
        if (!confirm("Escalate to Bleefy Support? An admin will review the chat and make a final decision.")) return;
        try {
            await fetcher(`/api/disputes/${id}/escalate`, { method: 'PATCH' });
            toast.info("Dispute escalated to Admin");
            loadDispute();
        } catch (e: any) { toast.error(e.message); }
    };

    if (loading) return (
        <div className="flex justify-center py-20 font-mono text-xs text-zinc-900 bg-zinc-50">
            <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
            <span>HYDRATING DISPUTE CHANNELS...</span>
        </div>
    );
    if (!dispute) return <div className="text-center font-mono py-20 text-xs text-zinc-500">DISPUTE ARCHIVE RECORD NOT FOUND.</div>;

    const isActive = !['closed', 'resolved_refunded', 'resolved_released'].includes(dispute.status);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-4 font-mono text-zinc-900 text-xs antialiased pb-20">
            {/* Header / Status Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-zinc-200 rounded-none shadow-none select-none">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/account/disputes')} 
                        className="p-1 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-none transition-colors cursor-pointer"
                        title="Back"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold uppercase tracking-wider text-zinc-950">Case File: {dispute.reason}</h1>
                            <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-none ${
                                dispute.status === 'escalated' ? 'border-red-200 bg-red-50 text-red-800' : 'border-amber-200 bg-amber-50 text-amber-800'
                            }`}>
                                {dispute.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Order Ref: #{dispute.order.id.slice(0,8).toUpperCase()}</p>
                    </div>
                </div>

                {isActive && dispute.status !== 'escalated' && (
                    <button 
                        onClick={handleEscalate} 
                        className="bg-transparent hover:bg-red-50 border border-red-700 text-red-700 rounded-none h-10 px-5 font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors"
                    >
                        Escalate to Support
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* --- LEFT: CHAT INTERFACE (Col 8) --- */}
                <div className="lg:col-span-8 flex flex-col h-[600px] bg-white border border-zinc-200 rounded-none shadow-none overflow-hidden">
                    <div className="p-4 border-b border-zinc-155 bg-zinc-50 flex justify-between items-center text-[10px] font-bold select-none">
                        <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={12}/> Negotiation Timeline Log
                        </span>
                        <span className="text-zinc-400 uppercase tracking-widest font-mono">Contract escrow held active</span>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/30">
                        {dispute.messages.map((msg: any) => {
                            const isMe = msg.sender.id === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-none border text-xs leading-relaxed ${
                                            isMe 
                                                ? 'bg-green-50/50 border-green-200 text-green-950' 
                                                : 'bg-white border-zinc-200 text-zinc-900'
                                        }`}>
                                            <p>{msg.message}</p>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold text-zinc-400 mt-1 px-0.5 uppercase tracking-wider">
                                            {isMe ? 'YOU' : msg.sender.fullName.toUpperCase()} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Admin Resolution Note (If closed) */}
                        {!isActive && dispute.adminResolutionNote && (
                            <div className="bg-blue-50 border border-blue-200 p-5 rounded-none text-center font-mono select-none">
                                <Gavel className="mx-auto text-blue-700 mb-2" size={18} />
                                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">Final Arbitration Settlement</h4>
                                <p className="text-blue-700 text-xs mt-2 italic font-bold">" {dispute.adminResolutionNote} "</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    {isActive && (
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
                            <button 
                                type="button" 
                                className="p-2.5 text-zinc-400 border border-zinc-200 bg-zinc-50 rounded-none hover:bg-zinc-100 cursor-pointer flex items-center justify-center shrink-0 h-[38px] w-[38px]"
                                title="Attach File"
                            >
                                <Paperclip size={14} />
                            </button>
                            <input 
                                className="flex-1 bg-white p-3 border border-zinc-350 rounded-none text-xs font-mono outline-none focus:border-green-700 h-[38px]"
                                placeholder="WRITE NEGOTIATION RESPONSE..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button 
                                type="submit" 
                                disabled={sending} 
                                className="rounded-none h-[38px] w-10 p-0 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white shrink-0 cursor-pointer border border-green-850"
                            >
                                {sending ? <Loader2 className="animate-spin text-white" size={14}/> : <Send size={14} />}
                            </button>
                        </form>
                    )}
                </div>

                {/* --- RIGHT: SIDEBAR (Col 4) --- */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Frozen Escrow Card */}
                    <Card className="p-5 bg-zinc-950 text-white border border-zinc-800 rounded-none shadow-none overflow-hidden relative select-none">
                        <div className="relative z-10 font-mono">
                            <div className="inline-flex items-center gap-1.5 text-red-500 font-bold bg-red-950/40 border border-red-900/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider mb-4">
                                <ShieldAlert size={12} />
                                <span>Escrow Block Active</span>
                            </div>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Held Funds</p>
                            <h2 className="text-2xl font-bold font-mono tracking-tight text-white mt-1">₦{Number(dispute.order.totalAmount).toLocaleString()}</h2>
                            <p className="text-[9px] text-zinc-450 mt-4 leading-relaxed font-bold uppercase tracking-wider">
                                Transaction amount will remain frozen within escrow vaults until settlement confirmation is committed.
                            </p>
                        </div>
                    </Card>

                    {/* Order Summary Card */}
                    <Card className="p-5 rounded-none border border-zinc-200 bg-white">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2 select-none">
                            <Package size={15} className="text-green-700" /> Disputed Order Details
                        </h3>
                        <div className="space-y-4">
                            {dispute.order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 relative overflow-hidden shrink-0 rounded-none select-none">
                                        {(item.productSnapshotImage || item.product.primaryImage) && (
                                            <Image unoptimized fill src={item.productSnapshotImage || item.product.primaryImage} alt="" className="object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider truncate" title={item.productSnapshotTitle || item.product.title}>
                                            {item.productSnapshotTitle || item.product.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5 select-none">
                                            {item.quantity} UNIT(S) • ₦{Number(item.priceAtPurchase).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-150 text-[10px] font-bold select-none">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 uppercase tracking-widest">Buyer</span>
                                <span className="text-zinc-800 uppercase">{dispute.buyer.fullName}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Dispute Info */}
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-none flex items-start gap-3 text-[10px] font-mono select-none">
                        <AlertCircle className="text-amber-700 shrink-0 mt-0.5" size={14} />
                        <div>
                            <h5 className="font-bold uppercase tracking-wider text-amber-950 mb-1">Arbitration Terms</h5>
                            <p className="text-[9px] text-amber-800 leading-relaxed font-bold uppercase tracking-wider">
                                Sellers have 48 business hours to respond. Escalate if negotiation reaches checklock to issue an administrative audit check.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
