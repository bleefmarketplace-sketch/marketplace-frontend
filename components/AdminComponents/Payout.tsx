'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  DollarSign, CheckCircle, Clock, XCircle,
  Loader2, Filter, CreditCard, Building
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  seller: { id: string; businessName: string };
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    paystackRecipientCode: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  processed: 'border-green-200 bg-green-50 text-green-700',
  failed: 'border-red-200 bg-red-50 text-red-700',
};

export default function AdminPayoutsPage() {
  const fetcher = useApi();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetcher(`/api/admin/withdrawals?status=${filter}`);
      setWithdrawals(res.data || res || []);
    } catch {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id: string) => {
    if (!confirm('Process this withdrawal? This will trigger a Paystack transfer.')) return;
    setProcessing(id);
    try {
      await fetcher(`/api/admin/withdrawals/${id}/approve`, { method: 'POST' });
      toast.success('Withdrawal processed via Paystack!');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Transfer failed');
    } finally {
      setProcessing(null);
    }
  };

  const totalPending = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + Number(w.amount), 0);

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300 select-none">
      
      {/* Header Block */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            PAYOUT DISPATCH CENTER
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Payout Management</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">Approve seller withdrawal requests and monitor settlement queues</p>
        </div>
        {filter === 'pending' && totalPending > 0 && (
          <div className="border border-amber-250 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-none flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-wider shrink-0">
            ₦{totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })} PENDING APPROVAL
          </div>
        )}
      </div>

      {/* Filter Tabs Block */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-none border border-zinc-200 w-fit select-none font-mono font-bold">
        {['pending', 'processed', 'failed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-none text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              filter === s 
                ? 'bg-white shadow-sm border border-zinc-350 text-zinc-950 font-bold' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs select-none">
          <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Ledger...</span>
        </div>
      ) : withdrawals.length === 0 ? (
        <Card className="rounded-none border border-zinc-200 bg-white p-20 text-center shadow-none border-dashed border-2">
          <DollarSign className="mx-auto text-zinc-300 mb-4" size={48} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700">No {filter} withdrawals</h3>
          <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-1">Settlement partitions are up to date</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {withdrawals.map(w => (
            <Card key={w.id} className="rounded-none border border-zinc-200 bg-white p-6 shadow-none">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                
                {/* Details Section */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 border border-zinc-200 bg-zinc-50 text-zinc-650 flex items-center justify-center rounded-none shrink-0">
                    <Building size={20} />
                  </div>
                  <div>
                    <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-zinc-200 bg-zinc-50 text-zinc-700">
                      SELLER SETTLEMENT
                    </span>
                    <p className="font-bold text-zinc-950 uppercase tracking-tight text-sm mt-1">{w.seller?.businessName || 'Unknown Store'}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {w.bankAccount?.accountName} — {w.bankAccount?.accountNumber} ({w.bankAccount?.paystackRecipientCode || 'N/A'})
                    </p>
                    <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">
                      Applied: {new Date(w.createdAt).toLocaleDateString()} at {new Date(w.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Amount / Action Section */}
                <div className="flex items-center justify-end w-full md:w-auto gap-6 md:border-l md:border-zinc-150 md:pl-6">
                  <div className="text-right">
                    <p className="text-xl font-black text-zinc-950 font-mono">₦{Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border rounded-none mt-1 select-none ${STATUS_STYLES[w.status] || 'border-zinc-200 bg-zinc-100 text-zinc-600'}`}>
                      {w.status}
                    </span>
                  </div>

                  {w.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(w.id)}
                      disabled={processing === w.id}
                      className="rounded-none h-10 px-5 bg-green-700 hover:bg-green-800 border border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {processing === w.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Process
                    </button>
                  )}
                  {w.status === 'processed' && (
                    <div className="flex items-center gap-2 text-green-700 text-xs font-bold uppercase select-none border border-green-200 bg-green-50 px-2 py-1 shrink-0">
                      <CheckCircle size={14} /> Paid Settlement
                    </div>
                  )}
                  {w.status === 'failed' && (
                    <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase select-none border border-red-200 bg-red-50 px-2 py-1 shrink-0">
                      <XCircle size={14} /> Transfer Failed
                    </div>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}