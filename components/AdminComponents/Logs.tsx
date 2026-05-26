'use client';

import React, { useState } from 'react';
import {
  Activity, Search, CheckCircle,
  AlertTriangle, XCircle, Info, RefreshCw
} from 'lucide-react';

interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context: string;
  timestamp: string;
  meta?: Record<string, any>;
}

const LEVEL_STYLES = {
  info: { bg: 'bg-zinc-50 border-zinc-200 text-zinc-600', icon: Info, label: 'INFO' },
  warn: { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: AlertTriangle, label: 'WARN' },
  error: { bg: 'bg-red-50 border-red-200 text-red-700', icon: XCircle, label: 'ERROR' },
};

// Mock logs for display
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
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  const syncLogs = () => {
    setSyncing(true);
    setTimeout(() => {
      // Simulate polling a fresh batch of logs
      setLogs([...MOCK_LOGS]);
      setSyncing(false);
    }, 1000);
  };

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
    if (mins < 60) return `${mins}M AGO`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}H AGO`;
    return d.toLocaleDateString().toUpperCase();
  };

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 select-none antialiased animate-in fade-in duration-300">
      
      {/* Header Block */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            PLATFORM OPERATION REGISTRY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Active Event Logs</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5 font-mono">Monitor real-time security events, transaction logs, and platform operations outputs</p>
        </div>
        
        <button
          onClick={syncLogs}
          className="h-10 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          title="Force telemetry rebuild"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          Flush Logs Cache
        </button>
      </div>

      {/* Summary Level Switch Filter Tabs */}
      <div className="flex flex-wrap bg-zinc-100 p-1 border border-zinc-200 rounded-none w-fit font-mono">
        {(['all', 'info', 'warn', 'error'] as const).map(level => {
          const isActive = filter === level;
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white border border-zinc-950 font-black'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {level === 'all' ? '● ALL' : level === 'info' ? 'ℹ INFO' : level === 'warn' ? '⚠ WARN' : '✕ ERROR'} ({counts[level]})
            </button>
          );
        })}
      </div>

      {/* Search Input Filter */}
      <div className="relative w-full font-mono text-[10px]">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="FILTER LOG ENTRIES BY MESSAGE CONTENT OR PROCESS LAYER..."
          className="w-full pl-8 pr-4 h-9 bg-zinc-50 border border-zinc-300 rounded-none outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-xs font-mono placeholder:text-zinc-400 uppercase tracking-tight"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Console Output Card */}
      <div className="border border-zinc-200 bg-white rounded-none shadow-none font-mono">
        {/* Terminal Header */}
        <div className="px-4 py-3.5 bg-zinc-950 text-zinc-300 text-[10px] font-mono flex items-center gap-2 border-b border-zinc-900">
          <Activity size={14} className="text-green-500 animate-pulse" />
          <span className="uppercase font-bold tracking-wider">LIVE OPERATIONS DECK — {filtered.length} DISPATCHES MATCHED</span>
          <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-green-950 text-green-400 border border-green-800 text-[8px] font-black uppercase">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-none inline-block animate-ping" /> LIVE LISTENER
          </span>
        </div>
        
        {/* Log Entries Rows */}
        <div className="divide-y divide-zinc-200 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-zinc-400 font-mono">
              <Activity className="mx-auto mb-3 text-zinc-200" size={32} />
              <p className="font-bold uppercase text-[10px]">No dispatcher records matches criteria</p>
            </div>
          ) : (
            filtered.map(log => {
              const style = LEVEL_STYLES[log.level];
              const Icon = style.icon;
              return (
                <div 
                  key={log.id} 
                  className={`flex items-start gap-4 px-5 py-3.5 hover:bg-zinc-50/50 transition-colors ${
                    log.level === 'error' ? 'bg-red-50/5 border-l-2 border-l-red-600' : ''
                  }`}
                >
                  <div className={`w-8 h-8 border flex items-center justify-center shrink-0 rounded-none ${style.bg}`}>
                    <Icon size={14} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-950 uppercase leading-normal">{log.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[8px] font-bold tracking-widest text-zinc-400 uppercase">
                      <span className="text-zinc-650">{log.context}</span>
                      <span>·</span>
                      <span>{formatTime(log.timestamp)}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${style.bg} rounded-none shrink-0`}>
                    {style.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Advisory instruction panel */}
      <div className="border border-dashed border-zinc-350 bg-zinc-50 p-4 rounded-none font-mono">
        <p className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest leading-relaxed">
          💡 Operational Note: In a production cluster workspace, configure a native <code className="bg-zinc-200 px-1 border border-zinc-300 font-black">GET /system-settings/logs</code> REST endpoint that reads records directly from active file streams (Winston logger decks).
        </p>
      </div>

    </div>
  );
}