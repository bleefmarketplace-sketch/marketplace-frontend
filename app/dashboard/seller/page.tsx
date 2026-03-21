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
                 
                console.log(res.data)
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
        <div className="flex items-center justify-center h-96">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Insights</h1>
                <p className="text-gray-500 text-sm font-medium">Detailed performance metrics .</p>
            </div>

            {/* --- TOP ROW: SUMMARY --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-900 text-white p-8 border-none rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Gross Revenue</p>
                        <h2 className="text-5xl font-black text-gray-900">₦{stats.summary.totalRevenue.toLocaleString()}</h2>
                         
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 text-white/5" size={140} />
                </Card>

                <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-[xl] flex flex-col justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Volume</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats?.summary.totalUnitsSold} Units</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50 mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold">
                        <Package size={14} /> Total Produce Shipped
                    </div>
                </Card>

                <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-2xl flex flex-col justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Customer Interest</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats?.summary.storeViews} Views</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50 mt-4 flex items-center gap-2 text-blue-600 text-xs font-bold">
                        <MousePointerClick size={14} /> Tracking Marketplace Impressions
                    </div>
                </Card>
            </div>

            {/* --- MIDDLE ROW: TOP PRODUCTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
                            <Trophy className="text-amber-500" size={20} /> Top Performing
                        </h3>
                    </div>
                    
                    <div className="space-y-6">
                        {stats.topProducts.map((product: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 text-xs group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        0{idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{product.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{product.totalSold} Units Sold</p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-gray-900">₦{Number(product.revenue).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sales Trend Visualization */}
                <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
                            <Calendar className="text-emerald-500" size={20} /> 30-Day Sales Trend
                        </h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {/* Simple CSS-based Bar Chart */}
                        {stats.salesOverTime.length > 0 ? stats.salesOverTime.map((day: any, idx: number) => (
                            <div key={idx} className="flex-1 group relative">
                                <div 
                                    className="bg-emerald-100 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-500 cursor-help"
                                    style={{ height: `${(day.revenue / Math.max(...stats.salesOverTime.map((d: any) => d.revenue))) * 100}%`, minHeight: '4px' }}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg whitespace-nowrap z-20">
                                    ₦{Number(day.revenue).toLocaleString()}
                                </div>
                            </div>
                        )) : (
                            <div className="w-full flex items-center justify-center text-gray-300 italic text-sm">
                                Not enough sales data to generate trend.
                            </div>
                        )}
                    </div>
                     
                </Card>
            </div>

          
        </div>
    );
}