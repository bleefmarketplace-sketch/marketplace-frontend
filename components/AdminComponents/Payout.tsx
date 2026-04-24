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
  pending: 'bg-amber-100 text-amber-700',
  processed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Payout Management</h1>
          <p className="text-gray-500 text-sm">Approve seller withdrawal requests</p>
        </div>
        {filter === 'pending' && totalPending > 0 && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-sm font-bold text-amber-700">
            ₦{totalPending.toLocaleString()} pending approval
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {['pending', 'processed', 'failed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : withdrawals.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2">
          <DollarSign className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="font-bold text-gray-400">No {filter} withdrawals</h3>
        </Card>
      ) : (
        <div className="space-y-4">
          {withdrawals.map(w => (
            <Card key={w.id} className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Building size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{w.seller?.businessName || 'Unknown Store'}</p>
                    <p className="text-sm text-gray-500">
                      {w.bankAccount?.accountName} — {w.bankAccount?.accountNumber}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(w.createdAt).toLocaleDateString()} at {new Date(w.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">₦{Number(w.amount).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[w.status] || 'bg-gray-100 text-gray-600'}`}>
                      {w.status}
                    </span>
                  </div>
                  {w.status === 'pending' && (
                    <Button
                      onClick={() => handleApprove(w.id)}
                      disabled={processing === w.id}
                      className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2"
                    >
                      {processing === w.id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <CheckCircle size={16} />
                      }
                      Process
                    </Button>
                  )}
                  {w.status === 'processed' && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                      <CheckCircle size={16} /> Paid
                    </div>
                  )}
                  {w.status === 'failed' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                      <XCircle size={16} /> Failed
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