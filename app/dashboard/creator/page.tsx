'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  TrendingUp, Users, GraduationCap, Sparkles,
  Plus, ArrowUpRight, Zap, PlayCircle,
  FileText, Award, Calendar, ChevronRight,
  Loader2, Wallet
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Page = () => {
  const fetcher = useApi();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetcher('/api/creator/stats')

        setStats(res?.data)
      } catch (e) {
        toast.error("Failed to fetch")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fetcher]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 pb-20 animate-in fade-in duration-500">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Creator Studio</h1>
          <p className="text-gray-500 font-medium mt-1 text-sm flex items-center gap-2">
            Welcome back, {user?.fullName} <span className="h-1 w-1 bg-gray-300 rounded-full" />
            Manage your digital agricultural assets.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="rounded-2xl border-gray-100 font-bold text-xs h-12 px-6">
            <Wallet size={16} className="mr-2" /> Earnings
          </Button>
          <Link href="/dashboard/creator/inventory">
            <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100 gap-2">
              <Plus size={18} /> New Content
            </Button>
          </Link>
        </div>
      </div>

      {/* --- TOP ROW: CORE METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          value={`₦${stats?.revenue?.toLocaleString() || '0'}`}
          subValue="+12% vs last month"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <MetricCard
          label="Active Students"
          value={stats?.students || 0}
          subValue="Unique knowledge buyers"
          icon={<Users size={20} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <MetricCard
          label="Content Quality"
          value={`${stats?.avgTrustScore || 0}%`}
          subValue="Avg. AI Trust Score"
          icon={<Sparkles size={20} className="text-purple-600" />}
          color="bg-purple-50"
        />
        <MetricCard
          label="Enrollments"
          value={stats?.salesCount || 0}
          subValue="Total copies sold"
          icon={<GraduationCap size={20} className="text-amber-600" />}
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- LEFT: PERFORMANCE FEED --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* Course Performance Card */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Top Performing Guides</h3>
              <button className="text-xs font-bold text-emerald-600 hover:underline">Full Analytics</button>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border">
                    <PlayCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">Advanced Irrigation Management for Dry Seasons</h4>
                    <div className="flex items-center gap-4 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>142 Students</span>
                      <span className="h-1 w-1 bg-gray-200 rounded-full" />
                      <span className="text-emerald-600">₦45,000 Earned</span>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-all" />
                </div>
              ))}
            </div>
          </Card>

          {/* AI Audit Queue */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-blue-500 fill-blue-500" />
              <h3 className="text-xl font-black text-gray-900">Recent Content Audits</h3>
            </div>
            <div className="bg-blue-50 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">Cattle Health Protocols V2</p>
                  <p className="text-xs text-blue-700/60 font-medium">Processing through AI Scrutiny Pipeline...</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                Analyzing
              </span>
            </div>
          </Card>
        </div>

        {/* --- RIGHT: SIDEBAR (Earnings & Reputation) --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* Instant Payout Status */}
          <Card className="p-8 rounded-[2.5rem] border-none bg-gray-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Available Payout</p>
              <h2 className="text-4xl font-black mb-6">₦{stats?.revenue?.toLocaleString()}</h2>
              <Button fullWidth className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold gap-2">
                Withdraw Now <ArrowUpRight size={16} />
              </Button>
              <p className="text-[10px] text-gray-500 mt-6 leading-relaxed italic">
                Digital product payouts bypass standard escrow and are available for withdrawal after a 24-hour safety buffer.
              </p>
            </div>
            <Award className="absolute -right-6 -bottom-6 text-white/5 w-40 h-40" />
          </Card>

          {/* Badge Progress */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100 bg-white">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Reputation Tier</h4>
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                <Award size={40} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase tracking-tight">Verified Creator</h3>
                <p className="text-xs text-gray-400 mt-1">100M+ Volume for <span className="text-amber-500 font-bold">Elite Badge</span></p>
              </div>
              <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[15%]" />
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: METRIC CARD ---
const MetricCard = ({ label, value, subValue, icon, color }: any) => (
  <Card className="p-6 rounded-[2rem] border-none shadow-sm ring-1 ring-gray-100 bg-white">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
      <p className="text-[10px] text-gray-400 font-bold mt-2">{subValue}</p>
    </div>
  </Card>
);

export default Page;