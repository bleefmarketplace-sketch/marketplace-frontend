'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
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

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;
    if (!dispute) return <div className="text-center py-20">Dispute not found.</div>;

    const isActive = !['closed', 'resolved_refunded', 'resolved_released'].includes(dispute.status);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6 pb-20">
            {/* Header / Status Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-gray-900">Case: {dispute.reason}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                dispute.status === 'escalated' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {dispute.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Order Reference: #{dispute.order.id.slice(0,8)}</p>
                    </div>
                </div>

                {isActive && dispute.status !== 'escalated' && (
                    <Button variant="outline" size="sm" onClick={handleEscalate} className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold">
                        Escalate to Support
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT: CHAT INTERFACE (Col 8) --- */}
                <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14}/> Negotiation Timeline
                        </span>
                        <span className="text-[10px] text-gray-400">Escrow amount is safely locked</span>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('/chat-bg.png')] bg-repeat">
                        {dispute.messages.map((msg: any) => {
                            const isMe = msg.sender.id === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-2xl shadow-sm ${
                                            isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.message}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold px-1">
                                            {isMe ? 'You' : msg.sender.fullName} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Admin Resolution Note (If closed) */}
                        {!isActive && dispute.adminResolutionNote && (
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
                                <Gavel className="mx-auto text-blue-500 mb-2" />
                                <h4 className="font-black text-blue-900 text-sm uppercase">Final Admin Resolution</h4>
                                <p className="text-blue-700 text-sm mt-2 italic">&quot;{dispute.adminResolutionNote}&quot;</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    {isActive && (
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center gap-3">
                            <button type="button" className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl">
                                <Paperclip size={20} />
                            </button>
                            <input 
                                className="flex-1 bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 ring-emerald-500 transition-all"
                                placeholder="Write your response to settle the case..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button type="submit" disabled={sending} className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-emerald-600">
                                {sending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
                            </Button>
                        </form>
                    )}
                </div>

                {/* --- RIGHT: SIDEBAR (Col 4) --- */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Frozen Escrow Card */}
                    <Card className="p-6 bg-gray-900 text-white border-none rounded-[2rem] shadow-xl overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-emerald-400 mb-4">
                                <ShieldAlert size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Escrow Frozen</span>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">Locked Funds</p>
                            <h2 className="text-3xl font-black">₦{Number(dispute.order.totalAmount).toLocaleString()}</h2>
                            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                                Funds will remain locked until a resolution is reached between both parties or by Admin intervention.
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-[80px]" />
                    </Card>

                    {/* Order Summary Card */}
                    <Card className="p-6 rounded-[2rem] border-gray-100 bg-white">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package size={18} className="text-emerald-500" /> Order Details
                        </h3>
                        <div className="space-y-4">
                            {dispute.order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 border relative overflow-hidden shrink-0">
                                        <Image unoptimized fill src={item.productSnapshotImage} alt="" className="object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{item.productSnapshotTitle}</p>
                                        <p className="text-[10px] text-gray-500">{item.quantity} Unit(s) • ₦{item.priceAtPurchase}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Buyer</span>
                                <span className="text-xs font-bold text-gray-900">{dispute.buyer.fullName}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Dispute Info */}
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="text-amber-600 shrink-0" size={20} />
                        <div>
                            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Dispute Policy</h5>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                Sellers have 48 hours to respond to a new dispute. If no agreement is found, either party can Escalate to Bleefy Support for a final verdict.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}