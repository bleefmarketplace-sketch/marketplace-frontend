'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { 
    DollarSign, Users, ShoppingBag, TrendingUp, 
    AlertCircle, ArrowUpRight, Leaf, Package, 
    Activity, Loader2, Landmark 
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';

export default function AdminDashboard() {
    const fetcher = useApi();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const result = await fetcher('/api/admin/stats');
                setStats(result.data);
            } catch (error) {
                console.error("Dashboard Load Error:", error);
            } finally {
                setLoading(false);
            }
        };

        getStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs">
            <Loader2 className="animate-spin text-green-700" size={24} />
        </div>
    );

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
            {/* Header */}
            <div className="border border-zinc-200 bg-white p-5">
                <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                  ADMIN COMMAND OVERLAY
                </span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Platform Overview</h1>
                <p className="text-zinc-500 text-[10px] mt-0.5">Real-time health, system logs, escrow volumes, and fee revenues for Bleefy.</p>
            </div>

            {/* --- TOP ROW: MONEY METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-950 text-zinc-50 p-5 border border-zinc-900 relative overflow-hidden rounded-none shadow-none">
                    <div className="relative z-10 space-y-1">
                        <p className="text-green-500 text-[9px] font-bold uppercase tracking-widest leading-none">Net Fee Profit</p>
                        <h2 className="text-3xl font-black text-white font-mono pt-1">₦{stats.revenue.toLocaleString()}</h2>
                        <div className="mt-4 flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-wider pt-2.5 border-t border-zinc-800">
                            <TrendingUp size={14} className="text-green-600" />
                            From {stats?.totalOrders} bound escrow orders
                        </div>
                    </div>
                    <DollarSign className="absolute -right-6 -bottom-6 text-zinc-900/60" size={110} />
                </Card>

                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex flex-col justify-between">
                    <div>
                        <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">Market GMV Volume</p>
                        <h3 className="text-2xl font-black text-zinc-950 font-mono">₦{stats?.gmv.toLocaleString()}</h3>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-100 mt-4 flex justify-between items-center text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
                        <span>Liquidity Aggregate</span>
                    </div>
                </Card>

                <Card className="p-5 bg-zinc-900 text-white border border-zinc-800 rounded-none shadow-none flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">Pending Withdrawals</p>
                            <h3 className="text-2xl font-black text-white font-mono">{stats?.alerts.pendingWithdrawals}</h3>
                        </div>
                        <div className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-none shrink-0">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2 border border-zinc-700 bg-white/5 hover:bg-white/10 rounded-none text-[10px] font-bold uppercase transition-colors tracking-widest font-mono cursor-pointer">
                        Manage Ledger Withdrawals
                    </button>
                </Card>
            </div>

            {/* --- MIDDLE ROW: INVENTORY & USERS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 text-zinc-850 rounded-none flex items-center justify-center shrink-0">
                        <Users size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Registered Sellers</p>
                        <p className="text-lg font-black text-zinc-950 font-mono leading-none mt-1">{stats?.users.sellers}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 text-zinc-850 rounded-none flex items-center justify-center shrink-0">
                        <ShoppingBag size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active Buyers</p>
                        <p className="text-lg font-black text-zinc-950 font-mono leading-none mt-1">{stats?.users.buyers}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 text-zinc-850 rounded-none flex items-center justify-center shrink-0">
                        <Package size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active Listings</p>
                        <p className="text-lg font-black text-zinc-950 font-mono leading-none mt-1">{stats?.inventory}</p>
                    </div>
                </Card>
            </div>

            {/* --- BOTTOM ROW: LOGS --- */}
            <div className="grid grid-cols-1 gap-4">
                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">Recent System Transactions Ledger</h3>
                        <button className="text-green-700 text-[10px] font-bold flex items-center gap-1 hover:underline uppercase tracking-wide">
                            View Full Ledger <ArrowUpRight size={13} />
                        </button>
                    </div>
                    <div className="h-64 bg-zinc-50 rounded-none border border-dashed border-zinc-250 flex items-center justify-center text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        Real-time transaction feed loading from system socket...
                    </div>
                </Card>
            </div>
        </div>
    );
}