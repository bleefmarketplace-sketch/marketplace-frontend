'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Loader2, CheckCircle, XCircle, ShoppingBag, PlayCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Marketplace/Footer';

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
                // This endpoint verifies the transaction with backend and updates order status
                const res = await fetcher(`/api/payments/verify?reference=${reference}`);

                if (res.success || res.data?.status === 'success') {
                    setStatus('success');
                    setOrder(res.order || res.data?.order);
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
            <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col antialiased">
                <LandingPagesNav />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white border border-zinc-200 p-8 text-center font-mono text-xs space-y-4">
                        <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-green-700 rounded-full mx-auto" />
                        <h3 className="font-bold text-zinc-950 uppercase tracking-widest">VALIDATING SECURE TRANSACTION RECORD...</h3>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">REF: {reference}</p>
                        <p className="text-zinc-400 text-[10px] italic leading-relaxed">Securing your escrow routing ledger. Please do not close or reload this window.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col antialiased">
                <LandingPagesNav />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white border border-zinc-200 p-8 text-center font-mono text-xs space-y-6">
                        <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-none flex items-center justify-center mx-auto">
                            <XCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-zinc-950 uppercase tracking-widest text-xs">PAYMENT VERIFICATION FAILED</h3>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">REF: {reference || "N/A"}</p>
                        </div>
                        <p className="text-zinc-650 leading-relaxed text-xs font-sans">
                            We were unable to secure verification for your transaction. If funds were debited, please contact our support desk with your transaction reference.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 h-11 rounded-none text-xs font-bold uppercase tracking-wider hover:border-zinc-400" onClick={() => router.push('/marketplace')}>RETURN TO CATALOG</Button>
                            <Button className="flex-1 h-11 rounded-none text-xs font-bold uppercase tracking-wider bg-green-700 hover:bg-green-800" onClick={() => window.location.reload()}>RETRY RESOLVER</Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Success View
    const isDigital = order?.items?.some((item: any) => item.typeSnapshot === 'digital');
    const firstDigitalProduct = order?.items?.find((item: any) => item.typeSnapshot === 'digital')?.product;

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col antialiased">
            <LandingPagesNav />
            <main className="flex-1 max-w-xl mx-auto px-4 py-12 w-full flex items-center justify-center">
                <div className="w-full bg-white border border-zinc-200 p-6 md:p-8 rounded-none shadow-none font-mono text-xs space-y-6">
                    
                    {/* Verification Badge */}
                    <div className="text-center space-y-3 pb-4 border-b border-zinc-150">
                        <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-750 rounded-none flex items-center justify-center mx-auto animate-pulse">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-zinc-950 uppercase tracking-widest">TRANSACTION RECORD SECURED</h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">ESCROW ROUTED LEDGER CONFIRMED</p>
                        </div>
                    </div>

                    {/* Receipt Summary Table */}
                    <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4">
                        <h4 className="font-bold text-zinc-950 uppercase tracking-widest text-[10px] border-b border-zinc-200 pb-1.5 mb-2 font-mono">RECEIPT SUMMARY</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">ORDER ID</span>
                            <span className="font-black text-zinc-950">#{order?.id?.slice(0, 8).toUpperCase() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">PAYMENT REFERENCE</span>
                            <span className="font-black text-zinc-950 uppercase tracking-tight">{reference || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">ESCROW STATUS</span>
                            <span className="font-black text-green-700 uppercase tracking-widest text-[9px]">HELD IN TRUST</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-200 pt-2.5 mt-2">
                            <span className="text-zinc-950 font-bold uppercase tracking-widest text-[9px]">NET SETTLED VALUE</span>
                            <span className="text-sm font-black text-green-800">₦{Number(order?.totalAmount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Items List inside the Receipt */}
                    {order?.items && order.items.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-bold text-zinc-950 uppercase tracking-widest text-[10px] border-b border-zinc-150 pb-1.5 font-mono">PURCHASED ITEMS ({order.items.length})</h4>
                            <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="py-2.5 flex justify-between items-center gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative w-8 h-8 rounded-none border border-zinc-200 bg-zinc-50 flex-shrink-0 overflow-hidden">
                                                <Image unoptimized fill src={item.productSnapshotImage || item.product?.primaryImage} alt="" className="object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-zinc-950 uppercase truncate max-w-[180px] sm:max-w-[240px]">{item.productSnapshotTitle || item.product?.title}</p>
                                                <p className="text-[9px] text-zinc-400 font-bold uppercase block mt-0.5">QTY: {item.quantity} UNITS</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-black text-zinc-950 font-mono">₦{Number(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Badges and routing network info */}
                    <div className="border-t border-zinc-150 pt-4 flex items-center justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={12} className="text-green-700" /> SECURE GATEWAY SETTLED
                        </div>
                        <span>NETWORK: PAYSTACK TRUSTED</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                        {isDigital ? (
                            <Button
                                fullWidth
                                className="h-11 rounded-none bg-green-700 hover:bg-green-800 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                                onClick={() => router.push(`/learning/vault/${firstDigitalProduct?.id}`)}
                            >
                                <PlayCircle size={14} /> START LEARNING NOW
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                className="h-11 rounded-none bg-green-700 hover:bg-green-800 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                                onClick={() => router.push('/account/orders')}
                            >
                                <ShoppingBag size={14} /> TRACK YOUR ORDER
                          </Button>
                      )}

                      <Button
                          variant="outline"
                          fullWidth
                          className="h-11 rounded-none text-xs font-bold uppercase tracking-wider text-zinc-450 hover:text-zinc-950 hover:border-zinc-350 flex items-center justify-center gap-2"
                          onClick={() => router.push('/marketplace')}
                      >
                          BACK TO MARKETPLACE <ArrowRight size={14} />
                      </Button>
                  </div>
              </div>
          </main>
          <Footer />
      </div>
  );
}
