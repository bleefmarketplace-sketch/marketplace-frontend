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
    value: `₦${stats.gmv.toLocaleString()}`,
    sub: 'Total buyer payments',
    icon: DollarSign,
    color: 'bg-emerald-900 text-white',
    iconColor: 'text-white/10',
  },
  {
    label: 'Platform Revenue',
    value: `₦${stats.revenue.toLocaleString()}`,
    sub: 'Commission earned',
    icon: TrendingUp,
    color: 'bg-white',
    iconColor: 'text-emerald-100',
  },
  {
    label: 'Total Orders',
    value: stats.totalOrders.toLocaleString(),
    sub: 'Paid orders',
    icon: ShoppingBag,
    color: 'bg-white',
    iconColor: 'text-blue-100',
  },
  {
    label: 'Pending Withdrawals',
    value: stats.alerts.pendingWithdrawals.toString(),
    sub: 'Awaiting payout',
    icon: AlertCircle,
    color: stats.alerts.pendingWithdrawals > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white',
    iconColor: 'text-amber-100',
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
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  if (!stats) return null;

  const commissionRate = stats.gmv > 0
    ? ((stats.revenue / stats.gmv) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Financial Overview</h1>
        <p className="text-gray-500 text-sm">Platform-wide revenue and order statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_CARDS(stats).map((m, i) => (
          <Card key={i} className={`p-6 relative overflow-hidden ${m.color}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${i === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
              {m.label}
            </p>
            <p className={`text-3xl font-black ${i === 0 ? 'text-white' : 'text-gray-900'}`}>
              {m.value}
            </p>
            <p className={`text-xs mt-1 ${i === 0 ? 'text-emerald-300' : 'text-gray-400'}`}>
              {m.sub}
            </p>
            <m.icon className={`absolute -right-3 -bottom-3 ${m.iconColor}`} size={80} />
          </Card>
        ))}
      </div>

      {/* User + Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total Users</p>
            <p className="text-2xl font-black text-gray-900">{stats.users.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {stats.users.sellers} sellers · {stats.users.buyers} buyers
            </p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Active Listings</p>
            <p className="text-2xl font-black text-gray-900">{stats.inventory.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total products on platform</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Avg Commission</p>
            <p className="text-2xl font-black text-gray-900">{commissionRate}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Of GMV retained as revenue</p>
          </div>
        </Card>
      </div>

      {/* Summary Section */}
      <Card className="p-8">
        <h3 className="font-black text-xl text-gray-900 mb-6">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Seller Payouts</p>
            <p className="text-2xl font-black text-gray-900">
              ₦{(stats.gmv - stats.revenue).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">Paid to farmers</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 text-center border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase font-bold mb-2">Platform Revenue</p>
            <p className="text-2xl font-black text-emerald-700">
              ₦{stats.revenue.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-500 mt-1">Platform earnings</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Total Volume</p>
            <p className="text-2xl font-black text-gray-900">
              ₦{stats.gmv.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">Gross marketplace value</p>
          </div>
        </div>
      </Card>
    </div>
  );
}