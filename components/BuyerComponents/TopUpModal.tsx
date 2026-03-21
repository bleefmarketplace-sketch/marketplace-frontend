"use client";
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { CheckCircle, CreditCard, Plus } from 'lucide-react';
import { Button } from '../Button';

interface TopUpModalProps {
  showTopUp: boolean;
  setShowTopUp: (show: boolean) => void;
  handleTopUp: (amount: number) => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ 
  showTopUp, 
  setShowTopUp, 
  handleTopUp 
}) => {
  const [amount, setAmount] = useState('');

  const onTopUpClick = () => {
    handleTopUp(Number(amount));
    setAmount(''); // Reset input
  };

  return (
    <Modal isOpen={showTopUp} onClose={() => setShowTopUp(false)} title="Top Up Wallet" size="sm">
      <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Card</label>
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <CheckCircle size={16} className="text-blue-600" />
          </div>
          <button className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-1 hover:underline">
            <Plus size={14} /> Add new card
          </button>
        </div>
        <Button 
          fullWidth 
          onClick={onTopUpClick} 
          disabled={!amount || Number(amount) <= 0}
        >
          Confirm Top Up
        </Button>
      </div>
    </Modal>
  );
};

export default TopUpModal;