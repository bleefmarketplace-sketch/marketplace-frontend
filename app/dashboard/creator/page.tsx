'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/Card';
import {
  DollarSign, Users, BookOpen, Star,
  TrendingUp, Plus, Loader2, ArrowRight, Shield
} from 'lucide-react';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CreatorStats {
  revenue: number;
  students: number;
  salesCount: number;
  avgTrustScore: number;
}

export default function CreatorDashboardPage() {
  const fetcher = useApi();
  const router = useRouter();
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user === undefined || hasFetched.current) return;

    const load = async () => {
      try {
        if (user?.hasCreatedCreatorProfile) {
          hasFetched.current = true;
          const res = await fetcher('/api/creator/stats');
          setStats(res.data || res);
        }
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, fetcher]);

  if (loading) return (
    <div className="flex justify-center py-20 border border-zinc-200 bg-white font-mono text-xs">
      <Loader2 className="animate-spin text-green-700" size={24} />
    </div>
  );

  if (user && !user.hasCreatedCreatorProfile) {
    return (
      <div className="w-full border border-zinc-200 bg-white p-8 md:p-12 text-center space-y-6 font-mono text-xs animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-800 rounded-none flex items-center justify-center mx-auto">
          <Star size={28} />
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <span className="px-2 py-0.5 text-[9px] font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold uppercase tracking-widest">
            REGISTRY NOT FOUND
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 pt-2">Welcome to Creator Studio</h1>
          <p className="text-zinc-500 text-[10px] leading-relaxed pt-1">
            You are one step away from publishing agronomic content, professional farming guidelines, and building your exclusive circle. Please initialize your Creator Profile to bind credentials.
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={() => router.push('/dashboard/creator/settings?tab=store')}
            className="bg-green-700 hover:bg-green-800 border border-green-700 h-10 px-6 rounded-none font-bold uppercase tracking-wider"
          >
            Setup Creator Profile
          </Button>
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `₦${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-zinc-950 text-zinc-50 border-zinc-900',
      sub: 'From content vault sales',
    },
    {
      label: 'Total Students',
      value: (stats?.students || 0).toLocaleString(),
      icon: Users,
      color: 'bg-white border-zinc-200',
      sub: 'Unique registered buyers',
    },
    {
      label: 'Content Sales',
      value: (stats?.salesCount || 0).toLocaleString(),
      icon: BookOpen,
      color: 'bg-white border-zinc-200',
      sub: 'Digital batches sold',
    },
    {
      label: 'Avg AI Trust Score',
      value: `${stats?.avgTrustScore || 0}/100`,
      icon: Shield,
      color: 'bg-white border-zinc-200',
      sub: 'Quality compliance score',
    },
  ];

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
      <div className="flex items-center justify-between border border-zinc-200 bg-white p-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            STUDIO TELEMETRY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Creator Studio Overview</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">Manage digital broadacre syllabus materials, premium articles, and audience connections.</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/creator/inventory')}
          className="bg-green-700 hover:bg-green-800 border-green-700 gap-2 rounded-none px-4"
        >
          <Plus size={15} /> New Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <Card key={i} className={`p-4 relative overflow-hidden rounded-none shadow-none border ${card.color}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${i === 0 ? 'text-green-500' : 'text-zinc-400'}`}>
              {card.label}
            </p>
            <p className={`text-2xl font-black font-mono ${i === 0 ? 'text-white' : 'text-zinc-950'}`}>
              {card.value}
            </p>
            <p className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${i === 0 ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {card.sub}
            </p>
            <card.icon
              className={`absolute -right-4 -bottom-4 ${i === 0 ? 'text-zinc-900/60' : 'text-zinc-100'}`}
              size={65}
            />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="p-5 cursor-pointer border border-zinc-200 shadow-none rounded-none hover:bg-zinc-50 transition-colors group flex flex-col justify-between"
          onClick={() => router.push('/dashboard/creator/inventory')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 border border-green-200 bg-green-50 text-green-700 rounded-none flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <ArrowRight size={15} className="text-zinc-350 group-hover:text-green-700 transition-colors" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">Content Vault</h3>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Manage your agricultural tutorials, research guides, and syllabus inventories.</p>
          </div>
        </Card>

        <Card
          className="p-5 cursor-pointer border border-zinc-200 shadow-none rounded-none hover:bg-zinc-50 transition-colors group flex flex-col justify-between"
          onClick={() => router.push('/dashboard/creator/circles')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 border border-blue-200 bg-blue-50 text-blue-700 rounded-none flex items-center justify-center">
                <Users size={18} />
              </div>
              <ArrowRight size={15} className="text-zinc-350 group-hover:text-blue-700 transition-colors" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">Community Circles</h3>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Build, moderate, and engage inside your exclusive localized farmer circles.</p>
          </div>
        </Card>

        <Card
          className="p-5 cursor-pointer border border-zinc-200 shadow-none rounded-none hover:bg-zinc-50 transition-colors group flex flex-col justify-between"
          onClick={() => router.push('/dashboard/creator/settings')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 border border-amber-200 bg-amber-50 text-amber-800 rounded-none flex items-center justify-center">
                <Star size={18} />
              </div>
              <ArrowRight size={15} className="text-zinc-350 group-hover:text-amber-800 transition-colors" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">Creator Profile</h3>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Modify your agronomy brand descriptions, research focus areas, and compliance tags.</p>
          </div>
        </Card>
      </div>

      {/* AI Trust Score Info */}
      <Card className="p-5 bg-zinc-50 border border-zinc-200 rounded-none shadow-none flex gap-4 items-start">
        <div className="w-8 h-8 rounded-none border border-green-200 bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
          <Shield size={16} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950">AI Content Compliance Auditing</h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed max-w-3xl">
            Every technical farming manual, moisture guide, and tutorial you upload is instantly evaluated by our automated risk engine. 
            It verifies agronomic relevance, checks moisture specifications coordinates, and reviews crop classifications.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[9px] font-bold uppercase tracking-widest pt-1">
            <span className="text-green-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-none bg-green-600 inline-block"></span> Score 75+ → Auto-published
            </span>
            <span className="text-amber-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-none bg-amber-600 inline-block"></span> Score 50–74 → Flagged for Manual Check
            </span>
            <span className="text-red-650 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-none bg-red-650 inline-block"></span> Score Below 50 → Rejected
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}