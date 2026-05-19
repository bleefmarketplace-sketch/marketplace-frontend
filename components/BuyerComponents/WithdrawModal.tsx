import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Landmark, Loader2 } from 'lucide-react';
import { Button } from '../Button';

interface WithdrawModalProps {
  balance: number;
  showWithdraw: boolean;
  setShowWithdraw: (show: boolean) => void;
  handleWithdraw: (amount: number) => Promise<void>;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ 
  balance, 
  setShowWithdraw, 
  handleWithdraw, 
  showWithdraw 
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onWithdrawClick = async () => {
    const numAmount = Number(amount);
    if (numAmount > balance) return;

    setLoading(true);
    try {
        await handleWithdraw(numAmount);
        setAmount('');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Funds" size="sm">
      <div className="space-y-6 py-2">
        <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Withdrawable Balance</p>
          <p className="font-black text-2xl text-emerald-700">₦{Number(balance).toLocaleString()}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Withdraw</label>
          <Input 
            type="number" 
            placeholder="0.00" 
            className="h-14 rounded-2xl text-lg font-bold"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            icon={<span className="text-emerald-600 font-black">₦</span>}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payout Destination</label>
          <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                <Landmark size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Primary Bank Account</p>
                <p className="text-[10px] text-gray-400 font-medium">Auto-selected from your settings</p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                <b>Note:</b> Withdrawals are usually processed within 24–48 hours. 
                Ensure your primary bank account details are correct in settings.
            </p>
        </div>

        <Button 
          fullWidth 
          className="h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-100"
          onClick={onWithdrawClick} 
          disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > balance}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Confirm Withdrawal'}
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawModal;