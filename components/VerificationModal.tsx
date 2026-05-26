'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {  Loader2, Smartphone, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (code: string) => Promise<void>; // The action to perform
    title?: string;
    description?: string;
    actionLabel?: string;
}

export const VerificationModal = ({ 
    isOpen, 
    onClose, 
    onVerify, 
    title = "Verify Identity", 
    description = "Please enter the 6-digit security code from your authenticator app.",
    actionLabel = "Verify & Proceed"
}: VerificationModalProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

  

    const handleConfirm = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (code.length !== 6) return toast.error("Enter a valid 6-digit code");

        setLoading(true);
        try {
            await onVerify(code);
            // We don't close here; let the parent handle success (redirect or toast)
        } catch (err: any) {
            toast.error(err.message || "Invalid verification code");
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleConfirm} className="p-2 pb-4 space-y-6 animate-in fade-in zoom-in duration-200 font-mono text-xs text-zinc-900">
                
                <div className="text-center space-y-2">
                    {/* Flat Square Icon Badge */}
                    <div className="w-12 h-12 border border-green-200 bg-green-50 text-green-700 flex items-center justify-center rounded-none mx-auto mb-4">
                        <Lock size={20} />
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider px-4 leading-relaxed">{description}</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input 
                            placeholder="******" 
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            autoComplete="one-time-code"
                            className="w-full text-center text-3xl font-black tracking-[0.3em] font-mono py-2.5 px-4 border border-zinc-300 rounded-none bg-zinc-50 focus:outline-none focus:border-green-600 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 select-none">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="rounded-none h-11 flex-1 font-mono font-bold uppercase tracking-wider text-[10px] bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="rounded-none h-11 flex-[2] font-mono font-bold uppercase tracking-wider text-[10px] bg-green-700 hover:bg-green-800 border border-green-700 text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : actionLabel}
                    </button>
                </div>

            </form>
        </Modal>
    );
};