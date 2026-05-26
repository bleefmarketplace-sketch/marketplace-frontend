"use client";
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, 
  Plus, ShoppingCart, Trash2, History, Loader2, 
  ShieldCheck
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import TopUpModal from './TopUpModal';
import WithdrawModal from './WithdrawModal';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

export const Wallet = () => {
  const fetcher = useApi();
  const [balance, setBalance] = useState({ availableBalance: 0, pendingBalance: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const hasFetched = useRef(false);

  // --- FETCH DATA ---
  const loadWalletData = useCallback(async () => {
    setLoading(true);
    try {
      const [balanceRes, txRes] = await Promise.all([
        fetcher('/api/wallet/balance'),
        fetcher('/api/wallet/transactions')
      ]);

      setBalance(balanceRes.data || { availableBalance: 0, pendingBalance: 0 });
      setTransactions(txRes.data || []);
    } catch (e: any) {
      console.error("Wallet Error:", e);
      // toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadWalletData();
  }, [loadWalletData]);

  const handleWithdraw = async (amount: number) => {
    try {
      await fetcher('/api/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ 
            amount, 
            bankAccountId: 'primary' // Backend logic should pick primary if not provided or handled specifically
        })
      });
      toast.success("Withdrawal request submitted successfully");
      loadWalletData(); // Refresh
      setShowWithdraw(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to process withdrawal");
    }
  };

  const filteredTransactions = useMemo(() => {
    if (filterType === 'All') return transactions;
    const map: Record<string, string> = {
        'Deposit': 'deposit',
        'Purchase': 'sale_revenue',
        'Withdrawal': 'withdrawal'
    };
    return transactions.filter(trx => trx.type === map[filterType]);
  }, [transactions, filterType]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TopUpModal 
        showTopUp={showTopUp} 
        setShowTopUp={() => setShowTopUp(false)} 
        handleTopUp={() => {}} // Integration for top-up would go to a payment gateway
      />
      <WithdrawModal 
        showWithdraw={showWithdraw} 
        setShowWithdraw={setShowWithdraw} 
        handleWithdraw={handleWithdraw} 
        balance={balance.availableBalance}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gray-900 text-white border-none relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Available Funds</span>
                  <h1 className="text-5xl font-black mt-2 tracking-tight text-emerald-400">
                    ₦{Number(balance.availableBalance).toLocaleString()}
                  </h1>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <CreditCard className="text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div>
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Pending</span>
                    <p className="text-sm font-bold text-gray-300">₦{Number(balance.pendingBalance).toLocaleString()}</p>
                 </div>
                 <div className="w-px h-8 bg-white/10" />
                 <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Escrow Protected
                 </div>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none h-14 rounded-2xl font-bold shadow-lg shadow-emerald-900/40" onClick={() => setShowTopUp(true)}>
                <Plus size={18} className="mr-2" /> Top Up
              </Button>
              <Button className="flex-1 bg-white/5 text-white hover:bg-white/10 border-white/10 backdrop-blur-sm h-14 rounded-2xl font-bold" onClick={() => setShowWithdraw(true)}>
                <ArrowUpRight size={18} className="mr-2" /> Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-8 rounded-[2.5rem] border-gray-100 flex flex-col justify-center bg-white shadow-sm">
            <ShieldCheck size={40} className="text-emerald-500 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Secure Escrow System</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
                Your funds are held safely in escrow during transactions. 
                Pending balances are released once the delivery is confirmed by the buyer.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-50">
                <Button variant="ghost" className="text-emerald-600 font-bold text-xs p-0 h-auto hover:bg-transparent">
                    View Escrow Policy <ArrowRight size={14} className="ml-1" />
                </Button>
            </div>
        </Card>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><History size={24} className="text-emerald-600" /> Activity Log</h2>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            {['All', 'Deposit', 'Purchase', 'Withdrawal'].map(filter => (
              <button 
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filterType === filter ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <Card className="overflow-hidden border-gray-100 rounded-[2.5rem] bg-white shadow-sm">
          {filteredTransactions.length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-medium italic">No recent activity to display.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredTransactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      trx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 
                      trx.type === 'withdrawal' ? 'bg-orange-100 text-orange-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {trx.type === 'deposit' ? <ArrowDownLeft size={20} /> : 
                       trx.type === 'withdrawal' ? <ArrowUpRight size={20} /> : 
                       <ShoppingCart size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm capitalize">{trx.type.replace('_', ' ')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(trx.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            trx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {trx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black font-mono ${trx.amount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {trx.amount > 0 ? '+' : ''}₦{Math.abs(Number(trx.amount)).toLocaleString()}
                    </span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        Ref: {trx.reference?.slice(0, 8) || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
);

export default Wallet;