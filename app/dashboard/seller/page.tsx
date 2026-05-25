'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { 
    TrendingUp, Package, Eye, DollarSign, 
    ArrowUpRight, Calendar, Info, Loader2,
    Trophy, MousePointerClick
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';

export default function Page() {
    const fetcher = useApi();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetcher('/api/seller/analytics');
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
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
                  OPERATIONAL COMMAND
                </span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Seller Command Insights</h1>
                <p className="text-zinc-500 text-[10px] mt-0.5">Detailed business indicators, bulk inventory telemetry, and customer click-rate tracking.</p>
            </div>

            {/* --- TOP ROW: SUMMARY --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-950 text-zinc-50 p-5 border border-zinc-900 rounded-none shadow-none relative overflow-hidden">
                    <div className="relative z-10 space-y-1">
                        <p className="text-green-500 text-[9px] font-bold uppercase tracking-widest leading-none">Gross Revenue</p>
                        <h2 className="text-3xl font-black text-white font-mono pt-1">₦{stats.summary.totalRevenue.toLocaleString()}</h2>
                        <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider pt-2 border-t border-zinc-800 mt-3 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-600 rounded-none inline-block"></span> Total Escrow Swaps Bound
                        </p>
                    </div>
                    <DollarSign className="absolute -right-6 -bottom-6 text-zinc-900/60" size={110} />
                </Card>

                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex flex-col justify-between">
                    <div>
                        <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">Total Volume</p>
                        <h3 className="text-2xl font-black text-zinc-950 font-mono">{stats?.summary.totalUnitsSold} Units</h3>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-100 mt-4 flex items-center gap-2 text-green-700 font-bold text-[10px] uppercase tracking-wide">
                        <Package size={13} /> Total Produce Shipped
                    </div>
                </Card>

                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none flex flex-col justify-between">
                    <div>
                        <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">Customer Interest</p>
                        <h3 className="text-2xl font-black text-zinc-950 font-mono">{stats?.summary.storeViews} Views</h3>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-100 mt-4 flex items-center gap-2 text-zinc-650 font-bold text-[10px] uppercase tracking-wide">
                        <MousePointerClick size={13} /> Tracking Impressions
                    </div>
                </Card>
            </div>

            {/* --- MIDDLE ROW: TOP PRODUCTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 flex items-center gap-2">
                            <Trophy className="text-amber-500" size={16} /> Top Performing Batches
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {stats.topProducts.map((product: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 rounded-none flex items-center justify-center font-bold text-zinc-500 text-[10px] group-hover:bg-green-50 group-hover:text-green-800 transition-colors">
                                        0{idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{product.title}</p>
                                        <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5">{product.totalSold} Units Sold</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-zinc-900 font-mono">₦{Number(product.revenue).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sales Trend Visualization */}
                <Card className="p-5 bg-white border border-zinc-200 shadow-none rounded-none">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 flex items-center gap-2">
                            <Calendar className="text-green-700" size={16} /> 30-Day Escrow Trend
                        </h3>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-1.5 px-1 pb-2 border-b border-zinc-200/60">
                        {stats.salesOverTime.length > 0 ? stats.salesOverTime.map((day: any, idx: number) => (
                            <div key={idx} className="flex-1 group relative h-full flex items-end">
                                <div 
                                    className="bg-green-100 group-hover:bg-green-700 border-t border-x border-green-200/40 w-full transition-all duration-300 cursor-help"
                                    style={{ height: `${(day.revenue / Math.max(...stats.salesOverTime.map((d: any) => d.revenue))) * 100}%`, minHeight: '4px' }}
                                />
                                {/* Monospaced Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-900 text-white text-[9px] py-1 px-2 border border-zinc-800 rounded-none whitespace-nowrap z-20 font-mono">
                                    ₦{Number(day.revenue).toLocaleString()}
                                </div>
                            </div>
                        )) : (
                            <div className="w-full flex items-center justify-center text-zinc-300 italic text-[11px] font-sans pb-10">
                                Not enough telemetry signals to project escrow trends.
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase pt-3 tracking-widest font-mono">
                      <span>T - 30 days</span>
                      <span>Execution Index (Daily)</span>
                      <span>Active</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}