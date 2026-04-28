'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            if (!token) {
                if (!isMounted) return;
                setStatus('error');
                setMessage('Invalid unsubscribe link. Please contact support.');
                return;
            }

            try {
                const res = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
                const data = await res.json();

                if (!isMounted) return;

                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'You have been unsubscribed.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Something went wrong.');
                }
            } catch {
                if (!isMounted) return;
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-6" />
                        <h1 className="text-xl font-bold text-gray-900">Processing your request...</h1>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-3">Unsubscribed</h1>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <p className="text-gray-400 text-sm mb-6">
                            Changed your mind? You can re-subscribe anytime from our homepage.
                        </p>
                        <Link href="/"
                            className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-700 transition-colors">
                            Back to Bleefy
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={32} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-3">Link Invalid</h1>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <Link href="/"
                            className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-2xl hover:bg-gray-700 transition-colors">
                            Go Home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
