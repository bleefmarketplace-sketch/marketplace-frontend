'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Loader2, CheckCircle, XCircle, ShoppingBag, PlayCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { toast } from 'react-toastify';

export default function CheckoutCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const fetcher = useApi();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [order, setOrder] = useState<any>(null);

    const reference = searchParams.get('reference');

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            return;
        }

        const verifyPayment = async () => {
            try {
                // This endpoint should verify the transaction with Paystack and update order status
                const res = await fetcher(`/api/payments/verify?reference=${reference}`);

                if (res.success || res.data?.status === 'success') {
                    setStatus('success');
                    setOrder(res.data?.order);
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [reference, fetcher]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Verifying Payment...</h2>
                <p className="text-gray-500 font-medium italic text-sm">Securing your transaction, please don&apos;t close this window.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <XCircle className="text-red-500 mb-6" size={80} />
                <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-500 text-center max-w-md mb-8">
                    We couldn&apos;t verify your payment. If you were debited, please contact our support with your reference: <strong>{reference}</strong>
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.push('/marketplace')}>Return to Store</Button>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    // Success View
    const isDigital = order?.items?.some((item: any) => item.typeSnapshot === 'digital');
    const firstDigitalProduct = order?.items?.find((item: any) => item.typeSnapshot === 'digital')?.product;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
                <div className="relative inline-block">
                    <CheckCircle className="text-emerald-500" size={100} />
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Payment Received!</h1>
                    <p className="text-gray-500 font-medium">Your order has been confirmed and secured in escrow.</p>
                </div>

                <Card className="p-6 bg-white border-none shadow-xl rounded-[2.5rem] divide-y divide-gray-50">
                    <div className="pb-4 flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span>
                        <span className="font-black text-gray-900">#{order?.id?.slice(0, 8).toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="py-4 flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Paid</span>
                        <span className="font-black text-emerald-600">₦{Number(order?.totalAmount || 0).toLocaleString()}</span>
                    </div>
                </Card>

                <div className="grid gap-3">
                    {isDigital ? (
                        <Button
                            fullWidth
                            className="h-16 rounded-2xl bg-emerald-600 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100"
                            onClick={() => router.push(`/learning/vault/${firstDigitalProduct?.id}`)}
                        >
                            <PlayCircle className="mr-2" /> Start Learning Now
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            className="h-16 rounded-2xl bg-emerald-600 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100"
                            onClick={() => router.push('/dashboard/buyer/orders')}
                        >
                            <ShoppingBag className="mr-2" /> Track Your Order
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        fullWidth
                        className="text-gray-400 font-bold hover:text-gray-900"
                        onClick={() => router.push('/marketplace')}
                    >
                        Back to Marketplace <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
