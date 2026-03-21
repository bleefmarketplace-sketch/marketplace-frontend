'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Package, ArrowRight, ShoppingBag, ShieldCheck, Clock, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal'; // Assuming your standard Modal component

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

export default function OrderSuccessModal({ isOpen, onClose, orderId }: OrderSuccessModalProps) {
    const router = useRouter();

    const handleTrackOrder = () => {
        onClose();
        router.push('/dashboard/orders');
    };

    const handleContinueShopping = () => {
        onClose();
        router.push('/marketplace');
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="md"
            title="" // We leave title empty to use our custom header design
        >
            <div className="text-center p-2">
                {/* Success Icon Animation */}
                <div className="mb-6 relative inline-block">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
                        <Check className="text-emerald-600" size={40} strokeWidth={3} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                        <Package className="text-white" size={14} />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                    Order Received!
                </h2>
                <p className="text-sm text-gray-500 mb-8 px-4">
                    Your request has been successfully logged. 
                    Suppliers have been notified to begin preparations.
                </p>

                {/* Order ID Card */}
                <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 border border-gray-100 text-left">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Reference</span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            #{orderId?.slice(0, 8).toUpperCase() || 'PROCESSING'}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <Clock size={14} className="text-blue-500" />
                            <span>Confirmation: <strong className="text-gray-900">2-4 Hours</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span>Status: <strong className="text-gray-900">Escrow Secured</strong></span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                   {/*  <Button 
                        fullWidth
                        size="lg" 
                        className="rounded-full h-14 bg-gray-900 hover:bg-black text-white gap-2"
                        onClick={handleTrackOrder}
                    >
                        Track My Order <ArrowRight size={18} />
                    </Button> */}
                    <Button 
                        fullWidth
                        variant="ghost" 
                        size="lg" 
                        className="rounded-full h-12 text-emerald-600 font-bold gap-2"
                        onClick={handleContinueShopping}
                    >
                        <ShoppingBag size={18} /> Continue Shopping
                    </Button>
                </div>

                <p className="mt-6 text-[10px] text-gray-400 font-medium">
                    Need assistance? <button className="text-emerald-600 hover:underline">Contact Support</button>
                </p>
            </div>
        </Modal>
    );
}