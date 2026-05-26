'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import {
  DollarSign, TrendingUp, ShoppingBag, Users,
  Package, AlertCircle, Loader2, ArrowUpRight
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface Stats {
  gmv: number;
  revenue: number;
  totalOrders: number;
  users: { sellers: number; buyers: number; total: number };
  inventory: number;
  alerts: { pendingWithdrawals: number };
}

const METRIC_CARDS = (stats: Stats) => [
  {
    label: 'Gross Merchandise Value',
    value: `₦${stats.gmv.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    sub: 'Total buyer payments',
    icon: DollarSign,
    color: 'bg-zinc-950 text-zinc-50 border-zinc-900',
    labelColor: 'text-green-500',
    valueColor: 'text-white',
    subColor: 'text-zinc-500',
  },
  {
    label: 'Platform Revenue',
    value: `₦${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    sub: 'Commission earned',
    icon: TrendingUp,
    color: 'bg-white border-zinc-200 text-zinc-900',
    labelColor: 'text-zinc-400',
    valueColor: 'text-zinc-950',
    subColor: 'text-zinc-400',
  },
  {
    label: 'Total Orders',
    value: stats.totalOrders.toLocaleString(),
    sub: 'Paid orders',
    icon: ShoppingBag,
    color: 'bg-white border-zinc-200 text-zinc-900',
    labelColor: 'text-zinc-400',
    valueColor: 'text-zinc-950',
    subColor: 'text-zinc-400',
  },
  {
    label: 'Pending Withdrawals',
    value: stats.alerts.pendingWithdrawals.toLocaleString(),
    sub: 'Awaiting payout',
    icon: AlertCircle,
    color: stats.alerts.pendingWithdrawals > 0 ? 'bg-amber-50 border-amber-250 text-amber-900' : 'bg-white border-zinc-200 text-zinc-900',
    labelColor: stats.alerts.pendingWithdrawals > 0 ? 'text-amber-800' : 'text-zinc-400',
    valueColor: stats.alerts.pendingWithdrawals > 0 ? 'text-amber-900 font-black' : 'text-zinc-950',
    subColor: stats.alerts.pendingWithdrawals > 0 ? 'text-amber-700' : 'text-zinc-400',
  },
];

export default function AdminFinancialsPage() {
  const fetcher = useApi();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetcher('/api/admin/stats');
        setStats(res.data || res);
      } catch {
        toast.error('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs select-none">
      <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Ledger...</span>
    </div>
  );

  if (!stats) return null;

  const commissionRate = stats.gmv > 0
    ? ((stats.revenue / stats.gmv) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300 select-none">
      
      {/* Header Bar */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            FINANCIAL TELEMETRY & LEDGER
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Financial Overview</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">Platform-wide revenue, commission schedules, and order transaction statistics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS(stats).map((m, i) => (
          <Card key={i} noPadding className={`p-5 relative overflow-hidden rounded-none shadow-none border ${m.color}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${m.labelColor}`}>
              {m.label}
            </p>
            <p className={`text-2xl font-black font-mono ${m.valueColor}`}>
              {m.value}
            </p>
            <p className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${m.subColor}`}>
              {m.sub}
            </p>
            <m.icon className={`absolute -right-3 -bottom-3 ${i === 0 ? 'text-zinc-900/30' : 'text-zinc-100'}`} size={80} />
          </Card>
        ))}
      </div>

      {/* User + Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card noPadding className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
          <div className="w-11 h-11 border border-zinc-200 bg-zinc-50 text-zinc-650 flex items-center justify-center rounded-none shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Total Users</p>
            <p className="text-xl font-black text-zinc-950 font-mono leading-none">{stats.users.total.toLocaleString()}</p>
            <p className="text-[9px] text-zinc-550 uppercase mt-1 tracking-wider font-bold">
              {stats.users.sellers} sellers · {stats.users.buyers} buyers
            </p>
          </div>
        </Card>
        
        <Card noPadding className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
          <div className="w-11 h-11 border border-zinc-200 bg-zinc-50 text-zinc-650 flex items-center justify-center rounded-none shrink-0">
            <Package size={20} />
          </div>
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Active Listings</p>
            <p className="text-xl font-black text-zinc-950 font-mono leading-none">{stats.inventory.toLocaleString()}</p>
            <p className="text-[9px] text-zinc-500 uppercase mt-1 tracking-wider font-bold">Total products on platform</p>
          </div>
        </Card>
        
        <Card noPadding className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex items-center gap-4">
          <div className="w-11 h-11 border border-zinc-200 bg-zinc-50 text-zinc-650 flex items-center justify-center rounded-none shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Avg Commission</p>
            <p className="text-xl font-black text-zinc-950 font-mono leading-none">{commissionRate}%</p>
            <p className="text-[9px] text-zinc-500 uppercase mt-1 tracking-wider font-bold">Of GMV retained as revenue</p>
          </div>
        </Card>
      </div>

      {/* Summary Section */}
      <Card noPadding className="rounded-none border border-zinc-200 bg-white p-6 space-y-6 shadow-none">
        <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-700 mb-6 pb-2 border-b border-zinc-150">
          Platform Revenue Breakdown
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-zinc-200 bg-zinc-50 p-5 rounded-none text-center">
            <p className="text-[9px] text-zinc-450 uppercase font-bold mb-2 tracking-widest">Seller Payouts</p>
            <p className="text-2xl font-black text-zinc-950 font-mono">
              ₦{(stats.gmv - stats.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Settled to farmers</p>
          </div>
          
          <div className="border border-green-200 bg-green-50/50 p-5 rounded-none text-center">
            <p className="text-[9px] text-green-700 uppercase font-bold mb-2 tracking-widest">Platform Revenue</p>
            <p className="text-2xl font-black text-green-800 font-mono">
              ₦{stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-green-600 mt-1 uppercase font-bold tracking-wider">Platform commission</p>
          </div>
          
          <div className="border border-zinc-200 bg-zinc-50 p-5 rounded-none text-center">
            <p className="text-[9px] text-zinc-450 uppercase font-bold mb-2 tracking-widest">Total Volume</p>
            <p className="text-2xl font-black text-zinc-950 font-mono">
              ₦{stats.gmv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Gross marketplace value</p>
          </div>
        </div>
      </Card>
    </div>
  );
}