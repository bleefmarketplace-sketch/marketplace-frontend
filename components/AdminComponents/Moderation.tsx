'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Shield, CheckCircle, XCircle, Eye,
  Loader2, AlertTriangle, BookOpen, Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
  primaryImage: string;
  createdAt: string;
  seller: { businessName: string; id: string };
  digitalMetadata?: {
    trustScore: number;
    aiAuditLog: {
      summary: string;
      riskFlags: string[];
      suggestedAction: string;
    };
  };
}

const RISK_COLORS: Record<string, string> = {
  approve: 'text-green-700 bg-green-50 border border-green-200',
  flag: 'text-amber-700 bg-amber-50 border border-amber-200',
  reject: 'text-red-700 bg-red-50 border border-red-200',
};

export default function AdminModerationPage() {
  const fetcher = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const load = async () => {
    try {
      const res = await fetcher('/api/admin/moderation');
      setProducts(res.data || res || []);
    } catch {
      toast.error('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id: string, action: 'publish' | 'reject') => {
    setProcessing(id);
    try {
      await fetcher(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'publish' ? 'published' : 'rejected' }),
      });
      toast.success(`Product ${action === 'publish' ? 'approved and published' : 'rejected'}`);
      setProducts(p => p.filter(pr => pr.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 font-mono text-xs text-zinc-500 uppercase tracking-widest gap-3 select-none">
      <Loader2 className="animate-spin text-green-700" size={32} />
      <span>Fetching digital product moderation queue...</span>
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-mono text-xs text-zinc-900 select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-zinc-200 bg-white p-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            CONTENT REVIEW COMMAND
          </span>
          <h1 className="text-xl font-black uppercase tracking-wider text-zinc-950 mt-2">Content Moderation</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Review digital products flagged by AI audit Compliance Engine</p>
        </div>
        <div className="border border-amber-200 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-none flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-wider shrink-0">
          <AlertTriangle size={12} /> {products.length} PENDING IN QUEUE
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="rounded-none border border-zinc-200 bg-white p-20 text-center shadow-none">
          <Shield className="mx-auto text-green-700 mb-4" size={48} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700">Verification Queue is Clear</h3>
          <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-1">No digital products require manual review</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Product List */}
          <div className="space-y-3 lg:col-span-1 overflow-y-auto max-h-[70vh] custom-scrollbar pr-1">
            {products.map(product => (
              <Card
                key={product.id}
                className={`p-4 cursor-pointer rounded-none shadow-none border transition-colors ${
                  selected?.id === product.id 
                    ? 'border-green-600 bg-green-50/20 border-l-4' 
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
                }`}
                onClick={() => setSelected(product)}
              >
                <div className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-none border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0">
                    {product.primaryImage ? (
                      <Image fill src={product.primaryImage} alt={product.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-zinc-950 uppercase truncate tracking-tight">{product.title}</p>
                    <p className="text-[10px] text-zinc-400 uppercase truncate tracking-wider mt-0.5">{product.seller?.businessName}</p>
                    {product.digitalMetadata?.aiAuditLog && (
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-none mt-2 inline-block border ${
                        RISK_COLORS[product.digitalMetadata.aiAuditLog.suggestedAction] || 'bg-zinc-100 text-zinc-650 border-zinc-200'
                      }`}>
                        AI: {product.digitalMetadata.aiAuditLog.suggestedAction}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="rounded-none border border-zinc-200 bg-white p-16 text-center h-full flex items-center justify-center shadow-none">
                <div className="text-zinc-400 space-y-2">
                  <Eye size={40} className="mx-auto text-zinc-200" />
                  <p className="font-bold uppercase tracking-wider text-zinc-700">Select a Product</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-450">Choose an asset from the queue to moderate</p>
                </div>
              </Card>
            ) : (
              <Card className="rounded-none border border-zinc-200 bg-white p-6 space-y-6 shadow-none">
                
                {/* Header */}
                <div className="flex gap-4 border-b border-zinc-200 pb-4">
                  <div className="relative w-20 h-20 rounded-none border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0">
                    {selected.primaryImage ? (
                      <Image fill src={selected.primaryImage} alt={selected.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <BookOpen size={28} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-zinc-200 bg-zinc-50 text-zinc-700">
                      PRODUCT TELEMETRY
                    </span>
                    <h2 className="font-black text-base text-zinc-950 uppercase tracking-tight mt-1">{selected.title}</h2>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Seller: {selected.seller?.businessName}</p>
                    <p className="font-bold text-green-700 text-sm mt-1 font-mono">₦{Number(selected.price).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-1.5">Description</p>
                  <p className="text-xs text-zinc-750 leading-relaxed max-w-2xl select-text">{selected.description}</p>
                </div>

                {/* AI Audit Results */}
                {selected.digitalMetadata?.aiAuditLog && (
                  <div className="border border-zinc-200 bg-zinc-50 p-5 rounded-none space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <h3 className="font-bold text-zinc-950 flex items-center gap-2 uppercase tracking-wider text-xs">
                        <Shield size={16} className="text-green-700" /> AI Compliance Audit Report
                      </h3>
                      <div className="flex items-center gap-2 border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-zinc-800">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span>TRUST INDEX: {selected.digitalMetadata.trustScore}/100</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Audit Summary</p>
                      <p className="text-xs text-zinc-800 font-medium uppercase tracking-tight">{selected.digitalMetadata.aiAuditLog.summary}</p>
                    </div>

                    {selected.digitalMetadata.aiAuditLog.riskFlags.length > 0 && (
                      <div>
                        <p className="text-[9px] text-red-650 uppercase font-bold tracking-widest mb-1.5">Risk Flags Triggered</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.digitalMetadata.aiAuditLog.riskFlags.map((flag, i) => (
                            <span key={i} className="text-[9px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-none font-mono">
                              {flag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-none border text-[10px] font-bold uppercase tracking-wider font-mono ${
                      RISK_COLORS[selected.digitalMetadata.aiAuditLog.suggestedAction] || 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}>
                      AI RECOMMENDATION RESULT: {selected.digitalMetadata.aiAuditLog.suggestedAction}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-zinc-150 pt-4">
                  <button
                    onClick={() => handleAction(selected.id, 'publish')}
                    disabled={!!processing}
                    className="rounded-none h-10 px-5 bg-green-700 hover:bg-green-800 border border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                  >
                    {processing === selected.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'reject')}
                    disabled={!!processing}
                    className="rounded-none h-10 px-5 bg-white border border-zinc-300 text-red-650 hover:bg-zinc-50 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}