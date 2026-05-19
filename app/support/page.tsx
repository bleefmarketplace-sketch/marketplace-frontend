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
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header Area */}
            <div className="bg-emerald-600 text-white pt-16 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-6 text-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mx-auto text-sm font-bold">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">How can we help?</h1>
                    <p className="text-emerald-100 text-lg opacity-90">Find answers or reach out to our dedicated support team.</p>
                    
                    <div className="relative max-w-2xl mx-auto mt-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search help articles..." 
                            className="w-full h-16 pl-16 pr-6 rounded-[2rem] bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder:text-emerald-200 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 outline-none transition-all shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-16 space-y-12">
                {/* Fast Help Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {faqs.map((faq, i) => (
                        <Card key={i} className="p-8 hover:shadow-xl transition-all border-none group cursor-pointer bg-white rounded-[2rem]">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <LifeBuoy size={24} />
                            </div>
                            <h3 className="font-black text-gray-900 mb-3 leading-tight">{faq.q}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                        </Card>
                    ))}
                </div>

                {/* Tickets Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <MessageSquare size={28} className="text-emerald-600" /> Your Tickets
                        </h2>
                        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl px-6 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                            <Plus size={20} className="mr-2" /> New Ticket
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-emerald-600" size={40} />
                        </div>
                    ) : tickets.length === 0 ? (
                        <Card className="p-20 text-center border-dashed border-2 border-gray-200 bg-transparent rounded-[3rem]">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">No active tickets</h3>
                            <p className="text-sm text-gray-400 mt-2 italic">If you have a problem, we're here to solve it.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            ticket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                                            ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {ticket.status === 'open' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{ticket.subject}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                    ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className="text-xs text-gray-400">Ref: {ticket.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Banner */}
                <Card className="p-10 bg-gray-900 text-white rounded-[3rem] border-none flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-black">Still have questions?</h3>
                        <p className="text-gray-400 text-sm max-w-md">Our support team is available Monday - Friday, 9am - 5pm. Average response time is 2 hours.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="border-gray-700 text-white hover:bg-white hover:text-gray-900 rounded-2xl px-8 h-14 font-bold">Email Us</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-8 h-14 font-black">Live Chat</Button>
                    </div>
                </Card>
            </div>

            {/* New Ticket Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Open Support Ticket">
                <div className="space-y-6 pt-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                        <AlertCircle className="text-emerald-600 shrink-0" size={20} />
                        <p className="text-xs text-emerald-800 leading-relaxed">Please describe your issue in detail. If it's about an order, include the order reference number.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                            <Input 
                                value={newTicket.subject}
                                onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                                placeholder="What's the issue?"
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <select 
                                className="w-full h-14 px-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
                                value={newTicket.category}
                                onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                            >
                                <option value="general">General Inquiry</option>
                                <option value="payment">Payment & Refunds</option>
                                <option value="account">Account Access</option>
                                <option value="delivery">Shipping & Delivery</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Message</label>
                            <textarea 
                                className="w-full p-4 bg-gray-50 border-none rounded-3xl outline-none text-sm min-h-[150px] focus:ring-2 focus:ring-emerald-500"
                                placeholder="Describe exactly what happened..."
                                value={newTicket.message}
                                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                            />
                        </div>
                    </div>

                    <Button 
                        fullWidth 
                        onClick={handleSubmitTicket}
                        disabled={submitting || !newTicket.subject || !newTicket.message}
                        className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-lg shadow-xl shadow-emerald-100"
                    >
                        {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                        Send Ticket
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
