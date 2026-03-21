"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../Button';
import { AlertTriangle, Bot, ImageIcon, Send } from 'lucide-react';
import { Input } from '../Input';
import { Modal } from '../Modal';

const SupportModal = ({ orderId, onClose }: { orderId: string, onClose: () => void }) => {
    const [mode, setMode] = useState<'chat' | 'dispute'>('chat');
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
        { sender: 'bot', text: `Hi! I'm your support assistant for order #${orderId}. How can I help you today?` }
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
        <Modal isOpen={!!orderId} onClose={onClose} title={`Support for #${orderId}`} size="lg">
            <div className="flex flex-col h-[500px]">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'chat' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setMode('chat')}
                    >
                        <div className="flex items-center justify-center gap-2"><Bot size={16} /> Chat Assistant</div>
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'dispute' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setMode('dispute')}
                    >
                        <div className="flex items-center justify-center gap-2"><AlertTriangle size={16} /> Raise Dispute</div>
                    </button>
                </div>

                {mode === 'chat' ? (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type your message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1"
                            />
                            <Button onClick={handleSend}><Send size={18} /></Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleDisputeSubmit} className="flex flex-col h-full">
                        <div className="flex-1 space-y-4">
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
                                <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                                <p>Disputes are taken seriously. Please only file if you have a valid issue with your order that couldn&apos;t be resolved via chat.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Dispute</label>
                                <select className="w-full border rounded-lg p-2 bg-white outline-none focus:ring-1 focus:ring-red-500 border-gray-300">
                                    <option>Item not received</option>
                                    <option>Item damaged / defective</option>
                                    <option>Item not as described</option>
                                    <option>Wrong quantity</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full h-32 border rounded-lg p-2 focus:ring-1 focus:ring-red-500 border-gray-300 outline-none resize-none"
                                    placeholder="Please provide details about your issue..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Evidence (Optional)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <ImageIcon className="mx-auto text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500">Click to upload photos</span>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" variant="danger" fullWidth className="mt-4">Submit Dispute</Button>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default SupportModal