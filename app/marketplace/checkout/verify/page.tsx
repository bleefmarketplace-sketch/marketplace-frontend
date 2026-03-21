'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/Button';

export default function VerifyOrderPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (reference) {
            // Call your backend to verify the transaction
            fetch(`/api/payments/verify?reference=${reference}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setStatus('success');
                    else setStatus('error');
                })
                .catch(() => setStatus('error'));
        }
    }, [reference]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {status === 'loading' && (
                    <>
                        <Loader2 className="mx-auto animate-spin text-emerald-600" size={48} />
                        <h1 className="text-xl font-bold">Verifying Payment...</h1>
                        <p className="text-gray-500">Please do not refresh the page.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="text-emerald-600" size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
                        <p className="text-gray-500">Your funds are now held in escrow. The farmer has been notified to ship your produce.</p>
                        <Button fullWidth onClick={() => router.push('/dashboard/buyer/orders')}>
                            Track My Order
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="mx-auto text-red-500" size={64} />
                        <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
                        <p className="text-gray-500">We couldn&apos;t confirm your payment. If you were debited, please contact support.</p>
                        <Button variant="outline" fullWidth onClick={() => router.push('/marketplace')}>
                            Return to Market
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}