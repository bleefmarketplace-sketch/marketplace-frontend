'use client';

import React, { useState, useEffect } from 'react';
import { 
    LifeBuoy, MessageSquare, ChevronRight, 
    Search, Plus, Clock, CheckCircle2, 
    AlertCircle, ArrowLeft, Loader2, Send
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function SupportCenterPage() {
    const fetcher = useApi();
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Ticket State
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'general', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const loadTickets = async () => {
        try {
            const res = await fetcher('/api/support/tickets');
            setTickets(res.data || []);
        } catch (err) {
            console.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTickets(); }, []);

    const handleSubmitTicket = async () => {
        if (!newTicket.subject || !newTicket.message) return;
        setSubmitting(true);
        try {
            await fetcher('/api/support/tickets', {
                method: 'POST',
                body: JSON.stringify(newTicket)
            });
            toast.success("Ticket submitted! Our team will reach out soon.");
            setIsModalOpen(false);
            setNewTicket({ subject: '', category: 'general', message: '' });
            loadTickets();
        } catch (err: any) {
            toast.error(err.message || "Failed to submit ticket");
        } finally {
            setSubmitting(false);
        }
    };

    const faqs = [
        { q: "How do I access my courses?", a: "Go to your Library in the dashboard to see all purchased digital products." },
        { q: "What is the escrow system?", a: "Bleefy holds funds securely until you confirm delivery of physical goods." },
        { q: "How do I request a refund?", a: "Open a dispute from your Order details page within the 3-day protection window." }
    ];

    return (
        <div className="w-full min-h-screen bg-zinc-50 font-mono text-xs text-zinc-900 antialiased pb-20">
            {/* Header Area */}
            <div className="bg-zinc-950 text-zinc-300 border-b border-zinc-800 pt-12 pb-24 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-5">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 rounded-none font-bold uppercase tracking-wider text-[10px] transition-colors mx-auto cursor-pointer"
                    >
                        <ArrowLeft size={13} /> Back to Dashboard
                    </button>
                    
                    <div className="space-y-1">
                        <span className="px-2 py-0.5 text-[8px] font-mono bg-green-950 text-green-400 border border-green-900 font-bold uppercase tracking-widest">
                            SYSTEM TELEMETRY SUPPORT
                        </span>
                        <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-3">How can we help?</h1>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Search help articles or raise a support ticket file.</p>
                    </div>
                    
                    <div className="relative max-w-xl mx-auto mt-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH ARTICLES..." 
                            className="w-full h-11 pl-11 pr-4 bg-zinc-900 border border-zinc-800 rounded-none text-zinc-100 placeholder:text-zinc-650 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-green-700"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-12 space-y-10">
                {/* Fast Help Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    {faqs.map((faq, i) => (
                        <Card key={i} className="p-5 border border-zinc-200 bg-white rounded-none shadow-none hover:bg-zinc-50/60 transition-colors flex flex-col justify-between group cursor-pointer text-zinc-900">
                            <div>
                                <div className="w-10 h-10 border border-zinc-250 bg-zinc-50 text-green-700 rounded-none flex items-center justify-center mb-4 shrink-0">
                                    <LifeBuoy size={20} />
                                </div>
                                <h3 className="font-bold text-zinc-950 uppercase tracking-wider mb-2 leading-snug">{faq.q}</h3>
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-bold">{faq.a}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Tickets Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={16} className="text-green-700" /> Active Tickets
                        </h2>
                        <Button 
                            onClick={() => setIsModalOpen(true)} 
                            className="rounded-none h-10 px-4 bg-green-700 hover:bg-green-800 border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center cursor-pointer shadow-none"
                        >
                            <Plus size={14} className="mr-1.5" /> Open Ticket
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-green-700" size={32} />
                        </div>
                    ) : tickets.length === 0 ? (
                        <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white">
                            <div className="w-14 h-14 border border-zinc-200 bg-zinc-50 flex items-center justify-center mx-auto mb-4 text-zinc-300 rounded-none">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">NO ACTIVE TICKETS</h3>
                            <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">If you require system adjustments, launch a new support file above.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="p-4 border border-zinc-200 bg-white rounded-none shadow-none hover:bg-zinc-50/60 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 border rounded-none flex items-center justify-center shrink-0 ${
                                            ticket.status === 'open' ? 'border-blue-200 bg-blue-50 text-blue-800' :
                                            ticket.status === 'resolved' ? 'border-green-200 bg-green-50 text-green-800' : 'border-zinc-200 bg-zinc-50 text-zinc-650'
                                        }`}>
                                            {ticket.status === 'open' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-950 uppercase tracking-wider">{ticket.subject}</h4>
                                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-zinc-400 font-mono">
                                                <span className={`px-1.5 py-0.5 border uppercase tracking-wider rounded-none ${
                                                    ticket.status === 'open' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-green-200 bg-green-50 text-green-800'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                                <span>REF: {ticket.id.slice(0, 8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-green-700 transition-colors" />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Banner */}
                <Card className="p-8 bg-zinc-950 text-white border border-zinc-800 rounded-none shadow-none flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
                    <div className="space-y-1.5 text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Still have questions?</h3>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-wider leading-relaxed">
                            Support desk is online Monday - Friday. Average escalation audit is committed within 2 hours.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            className="border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 rounded-none px-6 h-10 font-bold uppercase text-[10px] cursor-pointer"
                        >
                            Email Us
                        </button>
                        <button 
                            type="button"
                            className="bg-green-700 hover:bg-green-800 border border-green-700 text-white rounded-none px-6 h-10 font-bold uppercase text-[10px] cursor-pointer"
                        >
                            Live Chat
                        </button>
                    </div>
                </Card>
            </div>

            {/* New Ticket Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="OPEN SUPPORT TICKET">
                <div className="space-y-5 font-mono text-xs text-zinc-900 antialiased pt-2">
                    <div className="bg-green-50 p-4 border border-green-200 text-green-800 rounded-none text-[10px] font-bold uppercase tracking-wider flex items-start gap-2.5 leading-relaxed">
                        <AlertCircle className="text-green-700 shrink-0 mt-0.5" size={14} />
                        <p>Detailed message description log is required. Ensure any transactional order reference is specified.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Subject</label>
                            <Input 
                                value={newTicket.subject}
                                onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                                placeholder="WHAT IS THE ISSUE?"
                                className="h-10 rounded-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Category</label>
                            <select 
                                className="w-full h-11 px-3 bg-white border border-zinc-300 rounded-none outline-none text-xs font-mono focus:border-green-700"
                                value={newTicket.category}
                                onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                            >
                                <option value="general">GENERAL INQUIRY</option>
                                <option value="payment">PAYMENT & REFUNDS</option>
                                <option value="account">ACCOUNT ACCESS</option>
                                <option value="delivery">SHIPPING & DELIVERY</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Detailed Message</label>
                            <textarea 
                                className="w-full p-3 bg-white border border-zinc-300 rounded-none outline-none text-xs font-mono focus:border-green-700 min-h-[120px]"
                                placeholder="DESCRIBE THE ADJUSTMENT DETAILS..."
                                value={newTicket.message}
                                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                            />
                        </div>
                    </div>

                    <Button 
                        fullWidth 
                        onClick={handleSubmitTicket}
                        disabled={submitting || !newTicket.subject || !newTicket.message}
                        className="h-11 rounded-none bg-green-700 hover:bg-green-800 border-green-700 text-white font-bold uppercase tracking-wider text-[10px] shadow-none flex items-center justify-center cursor-pointer"
                    >
                        {submitting ? <Loader2 className="animate-spin text-white" size={14} /> : <Send size={14} className="mr-1.5" />}
                        Submit Support Ticket
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
