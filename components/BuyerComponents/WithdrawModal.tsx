import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Landmark } from 'lucide-react';
import { Button } from '../Button';

interface WithdrawModalProps {
  balance: number;
  showWithdraw: boolean;
  setShowWithdraw: (show: boolean) => void;
  handleWithdraw: (amount: number) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ 
  balance, 
  setShowWithdraw, 
  handleWithdraw, 
  showWithdraw 
}) => {
  const [amount, setAmount] = useState('');

  const onWithdrawClick = () => {
    const numAmount = Number(amount);
    if (numAmount > balance) {
      alert("Insufficient funds!");
      return;
    }
    handleWithdraw(numAmount);
    setAmount(''); // Reset input
  };

  return (
    <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Funds" size="sm">
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Available Balance</p>
          <p className="font-bold text-xl">${balance.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            icon={<span className="text-gray-500 font-bold">$</span>}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank Account</label>
          <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-500">
            <div className="flex items-center gap-3">
              <Landmark className="text-gray-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Chase Bank - Checking</p>
                <p className="text-xs text-gray-500">**** 8899</p>
              </div>
            </div>
            <div className="w-4 h-4 rounded-full border border-blue-500 bg-blue-500/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
        <Button 
          fullWidth 
          onClick={onWithdrawClick} 
          disabled={!amount || Number(amount) <= 0 || Number(amount) > balance}
        >
          Withdraw
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawModal;