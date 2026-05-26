'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Shield, CheckCircle, AlertTriangle, Loader2, Database, Cpu, HardDrive, Server, RefreshCw } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface HealthStatus {
  status: string;
  info: Record<string, any>;
  error: Record<string, any>;
  details: Record<string, any>;
}

export default function HealthPage() {
  const fetcher = useApi();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchHealth = useCallback(async (isManual = false) => {
    if (isManual) setSyncing(true);
    else setLoading(true);
    
    try {
      const res = await fetcher('/api/admin/health');
      setHealth(res.data || res);
    } catch (e: any) {
      setHealth(e.response?.data || null);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [fetcher]);

  useEffect(() => {
    // 1. Initial mounting fetch
    fetchHealth();

    // 2. High-performance, low-load background poller (every 30s)
    // Only fires if the tab is active/visible, preventing background rate-limiting token resets
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchHealth();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchHealth]);

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs select-none">
        <Loader2 className="animate-spin text-green-700 mr-2" size={20} />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Gathering System Metrics...</span>
      </div>
    );
  }

  const isHealthy = health?.status === 'ok';

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 select-none antialiased animate-in fade-in duration-300">
      
      {/* Header telemetry status card */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            SYSTEM DIAGNOSTICS & TELEMETRY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Server Cluster Integrity</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5 font-mono">Monitor real-time status of backend service nodes, memory heaps, and active gateway proxies</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => fetchHealth(true)}
            className="h-9 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
            Diagnostic Check
          </button>
          
          <div className={`flex items-center gap-1.5 px-3 py-2 border font-mono font-bold uppercase text-[9px] shrink-0 ${
            isHealthy 
              ? 'bg-green-50 border-green-200 text-green-850 rounded-none' 
              : 'bg-red-50 border-red-200 text-red-750 rounded-none'
          }`}>
            {isHealthy ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
            {isHealthy ? 'Cluster Operational' : 'Action Required'}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MySQL Database */}
        <div className="p-5 border border-zinc-200 bg-white rounded-none shadow-none flex items-start gap-4">
          <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-none ${
            health?.details?.database?.status === 'up' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-650'
          }`}>
            <Database size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-950 uppercase tracking-tight text-xs">MySQL Relational DB</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Core relational indexing data engine connectivity</p>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">INDEX STATE:</span>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${
                health?.details?.database?.status === 'up' 
                  ? 'bg-green-50 border-green-200 text-green-800 rounded-none' 
                  : 'bg-red-50 border-red-200 text-red-700 rounded-none'
              }`}>
                {health?.details?.database?.status || 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Memory Heap */}
        <div className="p-5 border border-zinc-200 bg-white rounded-none shadow-none flex items-start gap-4">
          <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-none ${
            health?.details?.memory_heap?.status === 'up' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-650'
          }`}>
            <Cpu size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-950 uppercase tracking-tight text-xs">Process Memory Heap</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Node environment runtime heap space allocations</p>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">HEAP THRESHOLD:</span>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${
                health?.details?.memory_heap?.status === 'up' 
                  ? 'bg-green-50 border-green-200 text-green-800 rounded-none' 
                  : 'bg-red-50 border-red-200 text-red-700 rounded-none'
              }`}>
                {health?.details?.memory_heap?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="p-5 border border-zinc-200 bg-white rounded-none shadow-none flex items-start gap-4">
          <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-none ${
            health?.details?.storage?.status === 'up' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-650'
          }`}>
            <HardDrive size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-950 uppercase tracking-tight text-xs">Disk Storage Volumes</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Persistent filesystem media space threshold</p>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">VOLUME DEPTH:</span>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${
                health?.details?.storage?.status === 'up' 
                  ? 'bg-green-50 border-green-200 text-green-800 rounded-none' 
                  : 'bg-red-50 border-red-200 text-red-700 rounded-none'
              }`}>
                {health?.details?.storage?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* API Server */}
        <div className="p-5 border border-zinc-200 bg-white rounded-none shadow-none flex items-start gap-4">
          <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0 rounded-none text-zinc-650">
            <Server size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-950 uppercase tracking-tight text-xs">Agri API Gateway</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Operational proxy mapping gateway metrics</p>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">CONNECTION STATUS:</span>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 border bg-green-50 border-green-200 text-green-800 rounded-none">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Raw Payload Logs Panel */}
      <div className="border border-zinc-200 bg-white rounded-none shadow-none">
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-250 flex items-center gap-2 font-mono">
          <Shield size={14} className="text-green-700" />
          <span className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest">TELEMETRY JSON PAYLOAD</span>
        </div>
        <div className="p-4 bg-zinc-950 text-green-500 text-[10px] font-mono overflow-x-auto leading-normal select-all">
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </div>
      </div>

    </div>
  );
}
