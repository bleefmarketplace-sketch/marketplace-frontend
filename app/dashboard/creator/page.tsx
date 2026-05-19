'use client';
import React, { useEffect, useState } from 'react';
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

  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.hasCreatedCreatorProfile) {
          const res = await fetcher('/api/creator/stats');
          setStats(res.data || res);
        }
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    if (user !== undefined) load();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  if (user && !user.hasCreatedCreatorProfile) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
          <Star size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Welcome to Creator Studio!</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          You are one step away from publishing content and building your community. Please set up your Creator Profile to get started.
        </p>
        <Button
          onClick={() => router.push('/dashboard/creator/settings?tab=store')}
          className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl font-bold"
        >
          Setup Creator Profile
        </Button>
      </div>
    );
  }

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `₦${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-900 text-white',
      sub: 'From all content sales',
    },
    {
      label: 'Total Students',
      value: (stats?.students || 0).toLocaleString(),
      icon: Users,
      color: 'bg-white',
      sub: 'Unique buyers',
    },
    {
      label: 'Content Sales',
      value: (stats?.salesCount || 0).toLocaleString(),
      icon: BookOpen,
      color: 'bg-white',
      sub: 'Units sold',
    },
    {
      label: 'Avg AI Trust Score',
      value: `${stats?.avgTrustScore || 0}/100`,
      icon: Shield,
      color: 'bg-white',
      sub: 'Content quality score',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Creator Studio</h1>
          <p className="text-gray-500 text-sm">Your content performance overview</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/creator/inventory')}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-2xl"
        >
          <Plus size={18} /> New Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card, i) => (
          <Card key={i} className={`p-6 relative overflow-hidden ${card.color} border-gray-100`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${i === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
              {card.label}
            </p>
            <p className={`text-3xl font-black ${i === 0 ? 'text-white' : 'text-gray-900'}`}>
              {card.value}
            </p>
            <p className={`text-xs mt-1 ${i === 0 ? 'text-emerald-300' : 'text-gray-400'}`}>
              {card.sub}
            </p>
            <card.icon
              className={`absolute -right-3 -bottom-3 ${i === 0 ? 'text-white/5' : 'text-gray-100'}`}
              size={70}
            />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => router.push('/dashboard/creator/inventory')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <BookOpen size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900">Content Vault</h3>
          <p className="text-sm text-gray-500 mt-1">Manage your courses, guides and digital products</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => router.push('/dashboard/creator/circles')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900">Community Circles</h3>
          <p className="text-sm text-gray-500 mt-1">Build and moderate your exclusive farmer groups</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => router.push('/dashboard/creator/settings')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
              <Star size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900">Creator Profile</h3>
          <p className="text-sm text-gray-500 mt-1">Update your bio, specialization and social links</p>
        </Card>
      </div>

      {/* AI Trust Score Info */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Content Audit</h3>
            <p className="text-sm text-gray-600 mt-1">
              Every piece of content you publish is automatically reviewed by our AI audit system.
              It checks for accuracy, agricultural relevance, and content safety. Products scoring above
              75 are auto-approved. Scores below 50 go to manual review.
            </p>
            <div className="flex gap-4 mt-3 text-xs font-bold">
              <span className="text-emerald-600">✓ 75+ → Auto-published</span>
              <span className="text-amber-600">⚠ 50–74 → Flagged for review</span>
              <span className="text-red-600">✗ Below 50 → Rejected</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}