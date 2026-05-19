'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import {
    ArrowUpRight, Landmark, Plus, CheckCircle2,
    Loader2, ShieldCheck, History, Wallet as WalletIcon, Trash2,
    Info, Star, AlertCircle, Clock, ArrowDownLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';

// --- TYPES ---
interface Bank {
    name: string;
    code: string;
}

interface SavedBank {
    id: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    isPrimary: boolean;
}

// Fixed to match Backend Wallet Entity
interface WalletData {
    availableBalance: number;
    pendingBalance: number;
}

interface Transaction {
    id: string;
    amount: number;
    type: 'sale_revenue' | 'withdrawal' | 'refund';
    status: string;
    reference: string;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const WalletPage = () => {
    // --- STATE ---
    const [isAddBankOpen, setIsAddBankOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [banksList, setBanksList] = useState<Bank[]>([]);
    const [verifying, setVerifying] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [savedBanks, setSavedBanks] = useState<SavedBank[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallet, setWallet] = useState<WalletData | null>(null);

    // Form States
    const [newBank, setNewBank] = useState({ bankCode: '', accountNumber: '', accountName: '' });
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const fetcher = useApi()

    // --- API HELPER ---
    const safeFetch = async <T,>(url: string, options?: RequestInit): Promise<T> => {
        const res = await fetcher(url, options);
        return res.data as T;
    };

    // --- INITIAL LOAD ---
    const loadInitialData = useCallback(async () => {
        try {
            const [banks, userBanks, walletData, txData] = await Promise.all([
                safeFetch<Bank[]>('/api/payments/banks'),
                safeFetch<SavedBank[]>('/api/seller/banks'),
                safeFetch<WalletData>('/api/wallet/balance'),
                safeFetch<Transaction[]>('/api/wallet/transactions')
            ]);


            setBanksList(banks);
            setSavedBanks(userBanks);
            setWallet(walletData);
            setTransactions(txData || []);
        } catch (err: any) {
            console.error("Data load failed:", err.message);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => { loadInitialData(); }, [loadInitialData]);

    // --- ACCOUNT RESOLUTION ---
    const resolveAccount = useCallback(async () => {
        if (newBank.accountNumber.length !== 10 || !newBank.bankCode) return;
        setVerifying(true);
        try {
            const result = await safeFetch<{ account_name: string }>(
                `/api/payments/resolve?account=${newBank.accountNumber}&bank=${newBank.bankCode}`
            );
            setNewBank(prev => ({ ...prev, accountName: result.account_name }));
        } catch (err: any) {
            toast.error(err.message);
            setNewBank(prev => ({ ...prev, accountName: '' }));
        } finally {
            setVerifying(false);
        }
    }, [newBank.accountNumber, newBank.bankCode]);

    useEffect(() => { resolveAccount(); }, [resolveAccount]);

    // --- HANDLERS ---
    const handleAddBank = async () => {
        const selectedBank = banksList.find(b => b.code === newBank.bankCode);
        if (!selectedBank || !newBank.accountName) return;

        setSaving(true);
        try {
            const created = await safeFetch<SavedBank>('/api/seller/banks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newBank, bankName: selectedBank.name })
            });
            setSavedBanks(prev => [...prev, created]);
            setIsAddBankOpen(false);
            setNewBank({ bankCode: '', accountNumber: '', accountName: '' });
            toast.success("Bank account linked");
        } catch (err: any) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const handleWithdrawal = async () => {
        const amount = parseFloat(withdrawAmount);
        const primaryBank = savedBanks.find(b => b.isPrimary);

        if (!amount || amount <= 0) return toast.error("Enter a valid amount");
        if (!primaryBank) return toast.error("Link a bank account first");
        if (amount > (wallet?.availableBalance || 0)) return toast.error("Insufficient balance");

        setSaving(true);
        try {
            await safeFetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, bankAccountId: primaryBank.id })
            });
            toast.success("Withdrawal request submitted");
            setIsWithdrawOpen(false);
            loadInitialData(); // Refresh balances
        } catch (err: any) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const handleSetPrimary = async (bankId: string) => {
        try {
            await safeFetch(`/api/seller/banks/${bankId}`, { method: 'PATCH' });
            setSavedBanks(prev => prev.map(b => ({
                ...b,
                isPrimary: b.id === bankId
            })));
            toast.success("Primary account updated");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeleteBank = async (bankId: string) => {
        if (!confirm("Are you sure you want to remove this bank account?")) return;
        try {
            await safeFetch(`/api/seller/banks/${bankId}`, { method: 'DELETE' });
            setSavedBanks(prev => prev.filter(b => b.id !== bankId));
            toast.success("Bank account removed");
        } catch (err: any) {
            toast.error(err.message);
        }
    };


    const primaryBank = savedBanks.find(b => b.isPrimary);
    const otherBanks = savedBanks.filter(b => !b.isPrimary);

    if (loadingData) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />

        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">

            {/* --- TOP SECTION: BALANCES --- */}
            <div className="grid sm:grid-cols-2 gap-4">

                {/* WALLET CARD */}
                <Card className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-none p-4 sm:p-6 flex flex-col justify-between shadow-lg">

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

                        <div>
                            <p className="text-emerald-200 text-[10px] font-semibold uppercase tracking-widest">
                                Available Balance
                            </p>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                ₦{wallet?.availableBalance?.toLocaleString() || '0.00'}
                            </h2>
                        </div>

                        <div>
                            <p className="text-emerald-200 text-[10px] font-semibold uppercase tracking-widest">
                                Escrow Balance
                            </p>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                ₦{wallet?.pendingBalance?.toLocaleString() || '0.00'}
                            </h2>
                        </div>

                    </div>

                    <div className="mt-4 flex sm:justify-end">
                        <Button onClick={() => setIsWithdrawOpen(true)} size="sm">
                            <ArrowUpRight size={16} className="mr-2" />
                            Withdraw
                        </Button>
                    </div>

                </Card>


                {/* PRIMARY BANK CARD */}
                <Card className="p-4 sm:p-6 flex flex-col justify-between border-gray-100 shadow-sm">

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                            <Landmark size={16} className="text-emerald-600" />
                            Primary Payout
                        </h3>

                        {primaryBank ? (
                            <div className="space-y-3">

                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative">

                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>

                                    <p className="text-[9px] font-bold text-emerald-600 uppercase">
                                        {primaryBank.bankName}
                                    </p>

                                    <p className="text-lg font-black text-gray-900 tracking-tight">
                                        {primaryBank.accountNumber}
                                    </p>

                                    <p className="text-[11px] text-gray-500 truncate">
                                        {primaryBank.accountName}
                                    </p>

                                </div>

                                <Button
                                    fullWidth
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg border-gray-200"
                                    onClick={() => setIsAddBankOpen(true)}
                                >
                                    <Plus size={14} className="mr-2" />
                                    Link New Account
                                </Button>

                            </div>
                        ) : (
                            <div className="text-center py-4 space-y-3">

                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                    <Landmark size={20} />
                                </div>

                                <p className="text-[11px] text-gray-400 px-4 italic">
                                    No active bank account linked
                                </p>

                                <Button
                                    size="sm"
                                    className="rounded-full bg-emerald-600"
                                    onClick={() => setIsAddBankOpen(true)}
                                >
                                    <Plus size={14} className="mr-1" />
                                    Link Bank
                                </Button>

                            </div>
                        )}
                    </div>

                </Card>


                {/* SAVED ACCOUNTS */}
                {otherBanks.length > 0 && (
                    <div className="sm:col-span-2">

                        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-3">
                            Other Saved Accounts
                        </h3>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">

                            {otherBanks.map(bank => (
                                <Card
                                    key={bank.id}
                                    className="p-3 border-gray-100 shadow-sm hover:border-emerald-200 transition group"
                                >

                                    <div className="flex justify-between items-start mb-2">

                                        <div className="p-2 bg-gray-50 rounded-md text-gray-400">
                                            <Landmark size={14} />
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">

                                            <button
                                                onClick={() => handleSetPrimary(bank.id)}
                                                className="p-1.5 hover:bg-emerald-50 rounded-full text-emerald-600"
                                                title="Set as Primary"
                                            >
                                                <Star size={13} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteBank(bank.id)}
                                                className="p-1.5 hover:bg-red-50 rounded-full text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 size={13} />
                                            </button>

                                        </div>

                                    </div>

                                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                                        {bank.bankName}
                                    </p>

                                    <p className="text-sm font-bold text-gray-900">
                                        {bank.accountNumber}
                                    </p>

                                    <p className="text-[10px] text-gray-500 truncate">
                                        {bank.accountName}
                                    </p>

                                </Card>
                            ))}

                        </div>
                    </div>
                )}

            </div>

            {/* --- ACTIVITY --- */}
            <div>
                <h3 className="font-black text-2xl text-gray-900 flex items-center gap-2 mb-6">
                    <History size={24} className="text-emerald-600" /> Activity History
                </h3>

                <Card noPadding className="border-none shadow-sm ring-1 ring-gray-100 rounded-[2rem] overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-gray-400 uppercase bg-gray-50 font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-gray-600 font-medium">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {tx.amount < 0 ? <ArrowUpRight size={14} className="text-red-500" /> : <ArrowDownLeft size={14} className="text-emerald-500" />}
                                                <span className="font-bold text-gray-900 text-xs capitalize">{tx.type.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className={`px-8 py-5 font-black ${tx.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* --- WITHDRAW MODAL --- */}
            <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Withdraw Funds">
                <div className="space-y-6">
                    <div className="p-6 bg-emerald-900 rounded-3xl text-white shadow-xl shadow-emerald-100">
                        <p className="text-[10px] uppercase font-bold text-emerald-400 mb-1 tracking-widest">Available to withdraw</p>
                        <p className="text-4xl font-black">₦{wallet?.availableBalance?.toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Amount to Withdraw"
                            type="number"
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <div className="p-4 border rounded-2xl flex justify-between items-center bg-gray-50 border-gray-100">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Payout Destination</p>
                                <p className="text-sm font-bold text-gray-900">{primaryBank?.bankName}</p>
                                <p className="text-xs text-gray-500">{primaryBank?.accountNumber}</p>
                            </div>
                            <Landmark size={24} className="text-emerald-600" />
                        </div>
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        disabled={saving || !withdrawAmount}
                        onClick={handleWithdrawal}
                        className="rounded-2xl h-14 bg-emerald-600 font-bold"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : "Confirm & Send"}
                    </Button>
                </div>
            </Modal>

            {/* --- ADD BANK MODAL (Previous implementation logic) --- */}
            <Modal isOpen={isAddBankOpen} onClose={() => setIsAddBankOpen(false)} title="Link Payout Account">
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3">
                        <Info size={20} className="text-emerald-600 shrink-0" />
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                            Ensure the account name matches your registered business name exactly to prevent payout delays.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Select Bank</label>
                            <select
                                className="w-full mt-1 py-2 px-3 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                                value={newBank.bankCode}
                                onChange={(e) => setNewBank(prev => ({ ...prev, bankCode: e.target.value, accountName: '' }))}
                            >
                                <option value="">Choose Bank...</option>
                                {banksList.map((b, i) => <option key={i} value={b.code}>{b.name}</option>)}
                            </select>
                        </div>

                        <Input
                            label="Account Number"
                            placeholder="10-digit account number"
                            maxLength={10}
                            value={newBank.accountNumber}
                            onChange={(e) => setNewBank(prev => ({ ...prev, accountNumber: e.target.value, accountName: '' }))}
                        />

                        {verifying && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 px-2 italic">
                                <Loader2 className="animate-spin" size={14} /> Resolving account details...
                            </div>
                        )}

                        {newBank.accountName && (
                            <div className="p-5 bg-emerald-900 rounded-2xl border-2 border-emerald-500 animate-in zoom-in duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Verified Account Name</p>
                                        <p className="text-white font-black text-lg">{newBank.accountName}</p>
                                    </div>
                                    <CheckCircle2 className="text-emerald-400" size={24} />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        disabled={!newBank.accountName || saving}
                        onClick={handleAddBank}
                        className="rounded-2xl h-14 bg-emerald-600 shadow-xl shadow-emerald-100 font-bold"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : "Link This Account"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default WalletPage;