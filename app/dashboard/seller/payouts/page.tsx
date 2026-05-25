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

    const fetcher = useApi();

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
            loadInitialData();
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
        <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs">
            <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Ledger...</span>
        </div>
    );

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">

            {/* Header Block */}
            <div className="border border-zinc-200 bg-white p-5">
                <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                  ESCROW LEDGER COMMAND
                </span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Payouts & Wallet</h1>
                <p className="text-zinc-500 text-[10px] mt-0.5">Withdraw available liquidity funds, manage verified bank registries, and monitor transaction histories.</p>
            </div>

            {/* --- TOP SECTION: BALANCES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* WALLET CARD */}
                <Card className="bg-zinc-950 text-zinc-50 p-5 border border-zinc-900 rounded-none shadow-none flex flex-col justify-between relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 z-10">
                        <div className="space-y-1">
                            <p className="text-green-500 text-[9px] font-bold uppercase tracking-widest leading-none">Available Balance</p>
                            <h2 className="text-2xl font-black text-white font-mono pt-1">
                                ₦{wallet?.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                            </h2>
                        </div>
                        <div className="space-y-1">
                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest leading-none">Escrow Locked</p>
                            <h2 className="text-2xl font-black text-zinc-450 font-mono pt-1">
                                ₦{wallet?.pendingBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                            </h2>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end z-10">
                        <Button 
                          onClick={() => setIsWithdrawOpen(true)} 
                          className="rounded-none h-8 text-[10px] uppercase font-bold tracking-wider"
                        >
                            <ArrowUpRight size={14} className="mr-1.5" /> Withdraw Funds
                        </Button>
                    </div>
                    <WalletIcon className="absolute -right-6 -bottom-6 text-zinc-900/60 select-none pointer-events-none" size={100} />
                </Card>

                {/* PRIMARY BANK CARD */}
                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xs text-zinc-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Landmark size={14} className="text-green-700 animate-pulse" /> Primary Payout Registry
                        </h3>

                        {primaryBank ? (
                            <div className="space-y-3 font-mono">
                                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-none relative">
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 size={15} className="text-green-700" />
                                    </div>
                                    <p className="text-[9px] font-bold text-green-800 uppercase tracking-wider">
                                        {primaryBank.bankName}
                                    </p>
                                    <p className="text-lg font-black text-zinc-950 tracking-tight font-mono mt-1 select-all">
                                        {primaryBank.accountNumber}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide truncate mt-1">
                                        {primaryBank.accountName}
                                    </p>
                                </div>
                                <Button
                                    fullWidth
                                    variant="outline"
                                    className="rounded-none h-8 text-[10px] uppercase font-bold tracking-wider border-zinc-250 hover:bg-zinc-50"
                                    onClick={() => setIsAddBankOpen(true)}
                                >
                                    <Plus size={13} className="mr-1.5" /> Link New Account
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4 space-y-3 font-mono">
                                <div className="w-10 h-10 border border-zinc-200 rounded-none bg-zinc-50 flex items-center justify-center mx-auto text-zinc-400">
                                    <Landmark size={16} />
                                </div>
                                <p className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider italic">
                                    No primary bank coordinates link
                                </p>
                                <Button
                                    className="rounded-none h-8 text-[10px] uppercase font-bold tracking-wider"
                                    onClick={() => setIsAddBankOpen(true)}
                                >
                                    <Plus size={13} className="mr-1" /> Link Bank Profile
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* SAVED ACCOUNTS */}
                {otherBanks.length > 0 && (
                    <div className="md:col-span-2 space-y-3">
                        <h3 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">
                            Other Saved Bank Accounts
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {otherBanks.map(bank => (
                                <Card
                                    key={bank.id}
                                    className="p-3.5 bg-white border border-zinc-200 shadow-none rounded-none hover:bg-zinc-50 transition-colors group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2 leading-none">
                                            <div className="p-1.5 border border-zinc-200 rounded-none bg-zinc-50 text-zinc-500">
                                                <Landmark size={13} />
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-150 select-none">
                                                <button
                                                    onClick={() => handleSetPrimary(bank.id)}
                                                    className="p-1 border border-zinc-200 bg-white hover:bg-zinc-50 text-green-700 cursor-pointer"
                                                    title="Set as Primary"
                                                >
                                                    <Star size={12} className="fill-green-50" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBank(bank.id)}
                                                    className="p-1 border border-zinc-200 bg-white hover:bg-red-55 text-red-650 cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                                            {bank.bankName}
                                        </p>
                                        <p className="text-sm font-bold text-zinc-950 font-mono mt-0.5 select-all">
                                            {bank.accountNumber}
                                        </p>
                                        <p className="text-[9px] text-zinc-500 uppercase tracking-wide truncate mt-0.5">
                                            {bank.accountName}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- ACTIVITY --- */}
            <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 flex items-center gap-2 mb-2">
                    <History size={15} className="text-green-700" /> Transaction Activity History
                </h3>

                <Card noPadding className="border border-zinc-200 bg-white rounded-none shadow-none overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50 font-bold tracking-widest border-b border-zinc-200">
                                <tr>
                                    <th className="px-5 py-3.5">Execution Date</th>
                                    <th className="px-5 py-3.5">Operation Type</th>
                                    <th className="px-5 py-3.5">Amount Value</th>
                                    <th className="px-5 py-3.5 text-right">Ledger Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 font-mono">
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-zinc-50/45 transition-colors">
                                        <td className="px-5 py-4 text-zinc-650 font-bold">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {tx.amount < 0 ? <ArrowUpRight size={13} className="text-red-650 shrink-0" /> : <ArrowDownLeft size={13} className="text-green-700 shrink-0" />}
                                                <span className="font-bold text-zinc-950 text-xs uppercase tracking-wider capitalize">{tx.type.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className={`px-5 py-4 font-black ${tx.amount < 0 ? 'text-red-650 font-bold' : 'text-green-755 font-bold'}`}>
                                            {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border ${
                                                tx.status === 'completed' 
                                                  ? 'border-green-200 bg-green-50 text-green-800' 
                                                  : 'border-amber-200 bg-amber-50 text-amber-800'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-16 text-center text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                                            No verified transaction records found inside active ledger.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* --- WITHDRAW MODAL --- */}
            <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Withdraw Ledger Funds">
                <div className="space-y-5 font-mono text-xs text-zinc-900">
                    <div className="p-5 bg-zinc-950 text-zinc-50 border border-zinc-900 rounded-none shadow-none">
                        <p className="text-[9px] uppercase font-bold text-green-500 mb-1.5 tracking-widest">Available to withdraw</p>
                        <p className="text-3xl font-black font-mono">₦{wallet?.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Amount to Withdraw (₦)"
                            type="number"
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <div className="p-3.5 border border-zinc-200 rounded-none flex justify-between items-center bg-zinc-50">
                            <div>
                                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1 leading-none">Payout Destination</p>
                                <p className="text-xs font-bold text-zinc-950 uppercase tracking-wide">{primaryBank?.bankName}</p>
                                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{primaryBank?.accountNumber}</p>
                            </div>
                            <Landmark size={20} className="text-green-700" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            fullWidth
                            size="lg"
                            disabled={saving || !withdrawAmount}
                            onClick={handleWithdrawal}
                            className="rounded-none h-10 bg-green-700 hover:bg-green-800 border-green-700 text-white uppercase font-bold tracking-wider text-[10px] flex items-center justify-center"
                        >
                            {saving ? <Loader2 className="animate-spin text-white" size={14} /> : "Confirm & Execute Withdrawal"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* --- ADD BANK MODAL --- */}
            <Modal isOpen={isAddBankOpen} onClose={() => setIsAddBankOpen(false)} title="Link Payout Bank Account">
                <div className="space-y-5 font-mono text-xs text-zinc-900">
                    <div className="bg-zinc-50 border border-zinc-205 p-3.5 rounded-none flex gap-3 font-mono text-[10px] text-zinc-650">
                        <Info size={16} className="text-green-700 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            Ensure the resolved account name matches your registered agribusiness merchant name exactly to prevent security arbitration holds.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Select Financial Institution</label>
                            <select
                                className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none"
                                value={newBank.bankCode}
                                onChange={(e) => setNewBank(prev => ({ ...prev, bankCode: e.target.value, accountName: '' }))}
                            >
                                <option value="">CHOOSE REGISTERED BANK...</option>
                                {banksList.map((b, i) => <option key={i} value={b.code}>{b.name.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <Input
                            label="Account Number"
                            placeholder="10-digit NUBAN account number"
                            maxLength={10}
                            value={newBank.accountNumber}
                            onChange={(e) => setNewBank(prev => ({ ...prev, accountNumber: e.target.value, accountName: '' }))}
                        />

                        {verifying && (
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 px-1 italic">
                                <Loader2 className="animate-spin text-green-700" size={12} /> Resolving account details on Paystack mesh...
                            </div>
                        )}

                        {newBank.accountName && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-none flex items-center justify-between text-green-800 animate-in zoom-in duration-150">
                                <div>
                                    <p className="text-[8px] text-green-650 font-bold uppercase tracking-widest mb-1.5">Verified Account Name</p>
                                    <p className="font-black text-sm uppercase tracking-wide">{newBank.accountName}</p>
                                </div>
                                <CheckCircle2 className="text-green-700 shrink-0" size={20} />
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            fullWidth
                            size="lg"
                            disabled={!newBank.accountName || saving}
                            onClick={handleAddBank}
                            className="rounded-none h-10 bg-green-700 hover:bg-green-800 border-green-700 text-white uppercase font-bold tracking-wider text-[10px] flex items-center justify-center"
                        >
                            {saving ? <Loader2 className="animate-spin text-white" size={14} /> : "Link Verified Account"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WalletPage;