'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import {
  Activity, Search, Filter, CheckCircle,
  AlertTriangle, XCircle, Info, Loader2
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context: string;
  timestamp: string;
  meta?: Record<string, any>;
}

const LEVEL_STYLES = {
  info: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Info, dot: 'bg-blue-400' },
  warn: { bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle, dot: 'bg-amber-400' },
  error: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, dot: 'bg-red-500' },
};

// Generate mock logs for display (in production, wire to a logging API or a /logs endpoint)
const MOCK_LOGS: LogEntry[] = [
  { id: '1', level: 'info', message: 'User registered: john@example.com', context: 'AuthService', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: '2', level: 'info', message: 'Payment verified: ORD-abc123 via Paystack', context: 'PaymentGatewayController', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '3', level: 'warn', message: 'Failed login attempt: bad@actor.io (3rd attempt)', context: 'AuthService', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: '4', level: 'info', message: 'Seller approved: Green Valley Farms (ID: seller-xyz)', context: 'UsersService', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: '5', level: 'error', message: 'Paystack transfer failed: insufficient balance in settlement account', context: 'PaystackService', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '6', level: 'warn', message: 'Potential token reuse detected for: seller@farm.com', context: 'AuthService', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: '7', level: 'info', message: 'Order confirmed by buyer. Escrow released to seller: ₦45,000', context: 'OrdersService', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: '8', level: 'info', message: 'Digital product audit completed: trust score 87/100 → published', context: 'CreatorService', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: '9', level: 'error', message: 'Database connection timeout (retry 1/3)', context: 'TypeORM', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '10', level: 'info', message: 'Withdrawal request submitted: ₦12,500 by HappyFarm Store', context: 'WalletService', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
];

export default function AdminLogsPage() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    const matchesLevel = filter === 'all' || l.level === filter;
    const matchesSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.context.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const counts = {
    all: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warn: logs.filter(l => l.level === 'warn').length,
    error: logs.filter(l => l.level === 'error').length,
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-gray-900">System Logs</h1>
        <p className="text-gray-500 text-sm">Real-time platform activity and error tracking</p>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-4 gap-3">
        {(['all', 'info', 'warn', 'error'] as const).map(level => {
          const styles = level === 'all'
            ? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' }
            : LEVEL_STYLES[level];
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-sm capitalize transition-all border-2 ${
                filter === level ? `${styles.bg} border-current ${styles.text}` : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
              {level} ({counts[level]})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <Input
        placeholder="Search logs..."
        icon={<Search size={18} />}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Log Entries */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-gray-900 text-gray-300 text-xs font-mono flex items-center gap-2 border-b border-gray-800">
          <Activity size={14} className="text-emerald-400" />
          <span>Live system output — {filtered.length} entries</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live
          </span>
        </div>
        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Activity className="mx-auto mb-3 text-gray-200" size={40} />
              <p className="font-bold">No logs match your filter</p>
            </div>
          ) : (
            filtered.map(log => {
              const style = LEVEL_STYLES[log.level];
              const Icon = style.icon;
              return (
                <div key={log.id} className={`flex items-start gap-3 px-5 py-3 hover:bg-gray-50 ${log.level === 'error' ? 'bg-red-50/30' : ''}`}>
                  <div className={`mt-0.5 p-1 rounded-lg shrink-0 ${style.bg}`}>
                    <Icon size={14} className={style.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{log.message}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{log.context}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{formatTime(log.timestamp)}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.text}`}>
                    {log.level}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <p className="text-xs text-center text-gray-400">
        💡 To wire live logs: expose a <code className="bg-gray-100 px-1 rounded">GET /system-settings/logs</code> endpoint on the backend that reads from your Winston log files.
      </p>
    </div>
  );
}