// import React, { useState } from 'react'
// import { Card } from '../Card'
// import {
//     AlertTriangle, Users, DollarSign, Activity, TrendingUp

// } from 'lucide-react';
// import {
//     AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//     PieChart, Pie, Cell
// } from 'recharts';

// const COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];
// const USER_DISTRIBUTION = [
//     { name: 'Buyers', value: 12500 },
//     { name: 'Sellers', value: 850 },
//     { name: 'Creators', value: 120 },


// ];
// const REVENUE_DATA = [
//     { name: 'Jan', commission: 4000, payout: 24000 },
//     { name: 'Feb', commission: 3000, payout: 18000 },
//     { name: 'Mar', commission: 2000, payout: 12000 },
//     { name: 'Apr', commission: 2780, payout: 16000 },
//     { name: 'May', commission: 1890, payout: 11000 },
//     { name: 'Jun', commission: 2390, payout: 14000 },
//     { name: 'Jul', commission: 3490, payout: 21000 },
// ];

// interface Dispute {
//     id: string;
//     orderId: string;
//     complainant: string;
//     accused: string;
//     amount: number;
//     reason: string;
//     status: 'Open' | 'Resolved' | 'Escalated';
//     date: string;
//     description: string;
//     evidence: string[];
// }
// const MOCK_DISPUTES: Dispute[] = [
//     {
//         id: 'DSP-2023-001',
//         orderId: 'ORD-9921',
//         complainant: 'John Doe',
//         accused: 'Green Acres',
//         amount: 150.00,
//         reason: 'Item damaged upon arrival',
//         status: 'Open',
//         date: '2 hours ago',
//         description: 'The fertilizer bags were torn and half the content was spilled in the truck.',
//         evidence: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2']
//     },
//     {
//         id: 'DSP-2023-002',
//         orderId: 'ORD-8812',
//         complainant: 'Sarah Smith',
//         accused: 'Midwest Machinery',
//         amount: 2500.00,
//         reason: 'Item not received',
//         status: 'Escalated',
//         date: '1 day ago',
//         description: 'Seller claims shipped, but tracking number is invalid. No response to messages.',
//         evidence: []
//     }
// ];
// const Dashboard = () => {
//     const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
//     return (
//         <div className="space-y-6 animate-in fade-in">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
//                 <div className="text-sm text-gray-500">Last updated: Just now</div>
//             </div>

//             {/* Key Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <Card className="p-4 flex items-center justify-between">
//                     <div>
//                         <p className="text-xs text-gray-500 font-bold uppercase">Total Users</p>
//                         <p className="font-bold text-2xl text-gray-900">14,203</p>
//                         <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> +12%</p>
//                     </div>
//                     <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Users size={24} /></div>
//                 </Card>
//                 <Card className="p-4 flex items-center justify-between">
//                     <div>
//                         <p className="text-xs text-gray-500 font-bold uppercase">Platform Net</p>
//                         <p className="font-bold text-2xl text-gray-900">$45,200</p>
//                         <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> +8%</p>
//                     </div>
//                     <div className="p-3 bg-green-100 rounded-xl text-green-600"><DollarSign size={24} /></div>
//                 </Card>
//                 <Card className="p-4 flex items-center justify-between">
//                     <div>
//                         <p className="text-xs text-gray-500 font-bold uppercase">Open Disputes</p>
//                         <p className="font-bold text-2xl text-gray-900">{disputes.length}</p>
//                         <p className="text-xs text-red-600 flex items-center mt-1">Needs Action</p>
//                     </div>
//                     <div className="p-3 bg-red-100 rounded-xl text-red-600"><AlertTriangle size={24} /></div>
//                 </Card>
//                 <Card className="p-4 flex items-center justify-between">
//                     <div>
//                         <p className="text-xs text-gray-500 font-bold uppercase">System Health</p>
//                         <p className="font-bold text-2xl text-green-600">99.9%</p>
//                         <p className="text-xs text-gray-400 mt-1">Uptime</p>
//                     </div>
//                     <div className="p-3 bg-purple-100 rounded-xl text-purple-600"><Activity size={24} /></div>
//                 </Card>
//             </div>

//             {/* Charts Area */}
//             <div className="grid lg:grid-cols-3 gap-6">
//                 <Card className="lg:col-span-2 p-6">
//                     <h3 className="font-bold text-gray-900 mb-6">Revenue Breakdown (6 Months)</h3>
//                     <div className="h-80">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <AreaChart data={REVENUE_DATA}>
//                                 <defs>
//                                     <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
//                                         <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//                                     </linearGradient>
//                                 </defs>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
//                                 <YAxis axisLine={false} tickLine={false} tickFormatter={(val: number) => `$${val / 1000}k`} />
//                                 <Tooltip />
//                                 <Area type="monotone" dataKey="commission" name="Platform Commission" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCom)" />
//                                 <Area type="monotone" dataKey="payout" name="Seller Payouts" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>

//                 <Card className="p-6">
//                     <h3 className="font-bold text-gray-900 mb-6">User Distribution</h3>
//                     <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={USER_DISTRIBUTION}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {USER_DISTRIBUTION.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                     <div className="space-y-2 mt-4">
//                         {USER_DISTRIBUTION.map((item, i) => (
//                             <div key={i} className="flex justify-between items-center text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
//                                     <span className="text-gray-600">{item.name}</span>
//                                 </div>
//                                 <span className="font-bold">{item.value.toLocaleString()}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     )
// }

// export default Dashboard


'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { 
    DollarSign, Users, ShoppingBag, TrendingUp, 
    AlertCircle, ArrowUpRight, Leaf, Package, 
    Activity, Loader2, Landmark 
} from 'lucide-react';
import { useApi } from '@/hooks/useApi'; // Using your custom hook

export default function AdminDashboard() {
    const fetcher = useApi();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
   

    useEffect(() => {
    const getStats = async () => {
        try {
            // fetcher returns the 'data' part: { gmv, revenue, totalOrders, ... }
            const result = await fetcher('/api/admin/stats');
            setStats(result.data);
        } catch (error) {
            console.error("Dashboard Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    getStats();
}, [fetcher]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
                <p className="text-gray-500 font-medium">Real-time health and revenue monitoring for Bleefy.</p>
            </div>

            {/* --- TOP ROW: MONEY METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-900 text-white p-8 border-none relative overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-4"> Net Profit</p>
                        <h2 className="text-5xl font-black text-gray-900">${stats.revenue.toLocaleString()}</h2>
                        <div className="mt-6 flex items-center gap-2 text-emerald-300 text-sm font-bold">
                            <TrendingUp size={18} />
                            From {stats?.totalOrders} processed orders
                        </div>
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 text-white/5" size={160} />
                </Card>

                <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-[2.5rem] flex flex-col justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Market GMV</p>
                        <h3 className="text-4xl font-black text-gray-900">${stats?.gmv.toLocaleString()}</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50 mt-4 flex justify-between items-center text-xs font-bold uppercase text-gray-400">
                        <span>Total Volume</span>
                       {/*  <span className="text-emerald-600">+12% this week</span> */}
                    </div>
                </Card>

                <Card className="p-8 bg-gray-900 text-white border-none rounded-[2.5rem] shadow-xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Payout Alerts</p>
                            <h3 className="text-4xl font-black text-gray-900">{stats?.alerts.pendingWithdrawals}</h3>
                        </div>
                        <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase transition-all tracking-widest">
                        Manage Withdrawals
                    </button>
                </Card>
            </div>

            {/* --- MIDDLE ROW: INVENTORY & USERS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Sellers</p>
                        <p className="text-xl font-black text-gray-900">{stats?.users.sellers}</p>
                    </div>
                </Card>

                <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Buyers</p>
                        <p className="text-xl font-black text-gray-900">{stats?.users.buyers}</p>
                    </div>
                </Card>

                <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Listings</p>
                        <p className="text-xl font-black text-gray-900">{stats?.inventory}</p>
                    </div>
                </Card>

                {/* <Card className="p-6 bg-emerald-50 border-emerald-100 shadow-sm rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-800 uppercase">Market Health</p>
                        <p className="text-xl font-black text-emerald-900 font-mono">STABLE</p>
                    </div>
                </Card> */}
            </div>

            {/* --- BOTTOM ROW: LOGS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-8 bg-white border-gray-100 shadow-sm rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xl text-gray-900">Recent Transactions</h3>
                        <button className="text-emerald-600 text-xs font-bold flex items-center gap-1 hover:underline">
                            View Ledger <ArrowUpRight size={14} />
                        </button>
                    </div>
                    {/* Placeholder for Transaction Graph or List */}
                    <div className="h-64 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 font-medium italic">
                        Real-time transaction feed loading...
                    </div>
                </Card>

               {/*  <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-[2.5rem]">
                    <h3 className="font-black text-xl text-gray-900 mb-6">Gateway Status</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Landmark className="text-gray-400" size={20} />
                                <span className="text-sm font-bold text-gray-700">Paystack Live</span>
                            </div>
                            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between opacity-50">
                            <div className="flex items-center gap-3">
                                <Leaf className="text-gray-400" size={20} />
                                <span className="text-sm font-bold text-gray-700">Mail Server</span>
                            </div>
                            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] text-blue-700 leading-relaxed font-medium">
                        Platform earnings are currently calculated at {stats.revenue > 0 ? (stats.revenue / stats.gmv * 100).toFixed(1) : '5.0'}% average commission.
                    </div>
                </Card> */}
            </div>
        </div>
    )
}