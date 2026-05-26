"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../Button';
import { AlertTriangle, Bot, ImageIcon, Send } from 'lucide-react';
import { Input } from '../Input';
import { Modal } from '../Modal';

const SupportModal = ({ orderId, onClose }: { orderId: string, onClose: () => void }) => {
    const [mode, setMode] = useState<'chat' | 'dispute'>('chat');
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
        { sender: 'bot', text: `Hi! I'm your support assistant for order #${orderId.toUpperCase()}. How can I help you today?` }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
        setInputText('');

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "I understand. I'm checking the status of your order with the seller. This might take a moment."
            }]);
        }, 1000);
    };

    const handleDisputeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Dispute filed successfully! Our team will review it shortly.");
        onClose();
    };

    return (
        <Modal isOpen={!!orderId} onClose={onClose} title={`ORDER RECONCILIATION: #${orderId.slice(0, 8).toUpperCase()}`} size="lg">
            <div className="flex flex-col h-[480px] font-mono text-xs text-zinc-900 antialiased">
                <div className="flex bg-zinc-100 p-1 rounded-none border border-zinc-200 w-full select-none mb-4 shrink-0 font-bold">
                    <button
                        className={`flex-1 py-2 text-xs font-bold rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-transparent ${
                            mode === 'chat' ? 'bg-white text-green-800' : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                        onClick={() => setMode('chat')}
                    >
                        <Bot size={13} /> Chat Assistant
                    </button>
                    <button
                        className={`flex-1 py-2 text-xs font-bold rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-transparent ${
                            mode === 'dispute' ? 'bg-white text-red-750' : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                        onClick={() => setMode('dispute')}
                    >
                        <AlertTriangle size={13} /> Raise Dispute
                    </button>
                </div>

                {mode === 'chat' ? (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-zinc-50 border border-zinc-200 rounded-none mb-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 border text-xs leading-relaxed rounded-none ${
                                        msg.sender === 'user' 
                                            ? 'bg-green-700 border-green-700 text-white' 
                                            : 'bg-white border-zinc-200 text-zinc-900'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Input
                                placeholder="TYPE MESSAGE TO SUPPORT AGENT..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 rounded-none font-mono"
                            />
                            <Button 
                                onClick={handleSend}
                                className="bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-[42px] w-12 flex items-center justify-center cursor-pointer shadow-none"
                            >
                                <Send size={14} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleDisputeSubmit} className="flex flex-col flex-1 overflow-y-auto pr-1">
                        <div className="space-y-4 flex-1">
                            <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-none text-[10px] font-bold uppercase tracking-wider flex items-start gap-2.5 leading-relaxed">
                                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-750" />
                                <p>
                                    arbitration warning: Escrow claims are legally evaluated. File only in cases of contract breach, damaged produce, or zero delivery.
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-450 mb-1">Reason for Dispute</label>
                                <select className="w-full border border-zinc-300 rounded-none px-3 h-10 bg-white outline-none focus:border-red-700 font-mono text-xs">
                                    <option>ITEM NOT RECEIVED</option>
                                    <option>PRODUCE DAMAGED / ROT / SPOILED</option>
                                    <option>ASSETS NOT AS DESCRIBED</option>
                                    <option>WRONG QUANTITY SUPPLIED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-450 mb-1">Detailed Description</label>
                                <textarea
                                    className="w-full h-24 border border-zinc-300 rounded-none p-3 bg-white outline-none focus:border-red-700 resize-none font-mono text-xs"
                                    placeholder="PLEASE SPECIFY RECONCILIATION DETAILS AND EVIDENCE LOGS..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-450 mb-1">Upload Evidence (Optional)</label>
                                <div className="border border-dashed border-zinc-300 rounded-none p-5 text-center cursor-pointer hover:bg-zinc-50 transition-colors">
                                    <ImageIcon className="mx-auto text-zinc-450 mb-2" size={16} />
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">CLICK TO UPLOADS EVIDENCE FILES / PHOTOS</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            variant="danger" 
                            fullWidth 
                            className="mt-4 bg-red-700 border-red-700 hover:bg-red-800 text-white rounded-none h-11 uppercase font-bold tracking-wider text-[10px] cursor-pointer shadow-none shrink-0"
                        >
                            Submit Dispute File
                        </Button>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default SupportModal