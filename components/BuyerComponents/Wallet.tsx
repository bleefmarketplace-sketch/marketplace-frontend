"use client";
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, 
  Plus, ShoppingCart, Trash2, History 
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import TopUpModal from './TopUpModal';
import WithdrawModal from './WithdrawModal';
import { Transaction } from '../types'; // Adjust path as needed

const Wallet = () => {
  const [balance, setBalance] = useState(1240.50);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const handleTopUp = (amount: number) => {
    setBalance(prev => prev + amount);
    const newTrx: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Deposit',
      amount: amount,
      status: 'Completed'
    };
    setTransactions(prev => [newTrx, ...prev]);
    setShowTopUp(false);
  };

  const handleWithdraw = (amount: number) => {
    setBalance(prev => prev - amount);
    const newTrx: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Withdrawal',
      amount: -amount,
      status: 'Completed'
    };
    setTransactions(prev => [newTrx, ...prev]);
    setShowWithdraw(false);
  };

  // Logic to filter transactions
  const filteredTransactions = useMemo(() => {
    if (filterType === 'All') return transactions;
    return transactions.filter(trx => trx.type === filterType);
  }, [transactions, filterType]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Modals with props passed down */}
      <TopUpModal 
        showTopUp={showTopUp} 
        setShowTopUp={setShowTopUp} 
        handleTopUp={handleTopUp} 
      />
      <WithdrawModal 
        showWithdraw={showWithdraw} 
        setShowWithdraw={setShowWithdraw} 
        handleWithdraw={handleWithdraw} 
        balance={balance}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none relative overflow-hidden p-6">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-gray-400 text-sm font-medium">Total Balance</span>
                  <h1 className="text-4xl font-bold mt-1 tracking-tight">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h1>
                </div>
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                  <CreditCard className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">+2.4%</span>
                <span>this month</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border-none" onClick={() => setShowTopUp(true)}>
                <Plus size={18} className="mr-2" /> Top Up
              </Button>
              <Button className="flex-1 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm" onClick={() => setShowWithdraw(true)}>
                <ArrowUpRight size={18} className="mr-2" /> Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Payment Methods</h3>
            <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={18}/></button>
          </div>
          <div className="space-y-3">
            <PaymentMethodItem label="Visa .... 4242" sub="Expires 12/24" icon={<span className="font-bold text-[10px] italic text-blue-800">VISA</span>} />
            <PaymentMethodItem label="Chase Bank" sub="Checking .... 8899" icon={<Landmark size={16} className="text-gray-600" />} />
          </div>
        </Card>
      </div>

      {/* Transaction History Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><History size={20} /> Transaction History</h2>
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {['All', 'Deposit', 'Purchase', 'Withdrawal'].map(filter => (
              <button 
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === filter ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <Card className="overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No transactions found.</div>
          ) : (
            filteredTransactions.map((trx, idx) => (
              <div key={trx.id} className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    trx.type === 'Deposit' ? 'bg-green-100 text-green-600' : 
                    trx.type === 'Withdrawal' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {trx.type === 'Deposit' ? <ArrowDownLeft size={18} /> : 
                     trx.type === 'Withdrawal' ? <ArrowUpRight size={18} /> : 
                     <ShoppingCart size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{trx.type}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {trx.date} • <span className="bg-gray-100 px-1.5 rounded text-[10px] text-gray-600 uppercase">{trx.status}</span>
                    </p>
                  </div>
                </div>
                <span className={`font-bold font-mono ${trx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

// Small helper component for payment methods
const PaymentMethodItem = ({ label, sub, icon }: { label: string, sub: string, icon: React.ReactNode }) => (
  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50 group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-8 bg-white rounded border border-gray-200 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
  </div>
);

export default Wallet;