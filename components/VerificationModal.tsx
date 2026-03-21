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
            <form onSubmit={handleConfirm} className="p-2 pb-6 space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <p className="text-sm text-gray-500 font-medium px-4">{description}</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Input 
                            placeholder="*** ***" 
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            autoComplete="one-time-code"
                             className="flex item-center justify-center p-2  rounded-md text-center text-3xl font-black tracking-[0.5em]    bg-gray-50 border-none"
                        />
                    </div>

                     
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-14 flex-1 rounded-2xl">Cancel</Button>
                    <Button 
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="flex-[2] bg-emerald-600  rounded-2xl font-black shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : actionLabel}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};