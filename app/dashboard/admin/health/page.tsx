'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Shield, CheckCircle, AlertTriangle, Loader2, Server, Database, HardDrive, Cpu } from 'lucide-react';
import api from '@/helpers/api';

interface HealthStatus {
  status: string;
  info: Record<string, any>;
  error: Record<string, any>;
  details: Record<string, any>;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setHealth(res.data);
    } catch (e: any) {
      setHealth(e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const isHealthy = health?.status === 'ok';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">System Health</h1>
          <p className="text-gray-500 text-sm">Real-time status of backend services and infrastructure</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm ${isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isHealthy ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {isHealthy ? 'System Operational' : 'Action Required'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database */}
        <Card className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${health?.details?.database?.status === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Database size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">MySQL Database</h3>
            <p className="text-xs text-gray-500 mt-1">Core data storage connectivity</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${health?.details?.database?.status === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {health?.details?.database?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </Card>

        {/* Memory */}
        <Card className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${health?.details?.memory_heap?.status === 'up' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
            <Cpu size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">Memory Heap</h3>
            <p className="text-xs text-gray-500 mt-1">Process memory utilization</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${health?.details?.memory_heap?.status === 'up' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {health?.details?.memory_heap?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${health?.details?.storage?.status === 'up' ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600'}`}>
            <HardDrive size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">Disk Storage</h3>
            <p className="text-xs text-gray-500 mt-1">Root filesystem space threshold</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${health?.details?.storage?.status === 'up' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                {health?.details?.storage?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </Card>

        {/* API Server */}
        <Card className="p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gray-50 text-gray-600">
            <Server size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">API Gateway</h3>
            <p className="text-xs text-gray-500 mt-1">Next.js to NestJS proxy health</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                ACTIVE
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900">Health Logs</h3>
        </div>
        <div className="bg-black rounded-2xl p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto">
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
