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
  approve: 'text-emerald-600 bg-emerald-50',
  flag: 'text-amber-600 bg-amber-50',
  reject: 'text-red-600 bg-red-50',
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
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Content Moderation</h1>
          <p className="text-gray-500 text-sm">Review digital products flagged by AI audit</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {products.length} Pending Review
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2">
          <Shield className="mx-auto text-emerald-300 mb-4" size={56} />
          <h3 className="text-xl font-bold text-gray-400">Queue is clear</h3>
          <p className="text-sm text-gray-400 mt-1">No digital products require manual review</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="space-y-3 lg:col-span-1 overflow-y-auto max-h-[70vh]">
            {products.map(product => (
              <Card
                key={product.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-all ${selected?.id === product.id ? 'border-emerald-400 bg-emerald-50/30' : ''}`}
                onClick={() => setSelected(product)}
              >
                <div className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {product.primaryImage ? (
                      <Image fill src={product.primaryImage} alt={product.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={24} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500 truncate">{product.seller?.businessName}</p>
                    {product.digitalMetadata?.aiAuditLog && (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${
                        RISK_COLORS[product.digitalMetadata.aiAuditLog.suggestedAction] || 'bg-gray-100 text-gray-600'
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
              <Card className="p-16 text-center h-full flex items-center justify-center">
                <div className="text-gray-400">
                  <Eye size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="font-bold">Select a product</p>
                  <p className="text-sm">Choose a product from the list to review details</p>
                </div>
              </Card>
            ) : (
              <Card className="p-6 space-y-6">
                {/* Header */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    {selected.primaryImage ? (
                      <Image fill src={selected.primaryImage} alt={selected.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={32} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-gray-900">{selected.title}</h2>
                    <p className="text-sm text-gray-500">By {selected.seller?.businessName}</p>
                    <p className="font-bold text-emerald-600 mt-1">₦{Number(selected.price).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
                </div>

                {/* AI Audit Results */}
                {selected.digitalMetadata?.aiAuditLog && (
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Shield size={18} className="text-emerald-500" /> AI Audit Report
                      </h3>
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-sm">Trust Score: {selected.digitalMetadata.trustScore}/100</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Summary</p>
                      <p className="text-sm text-gray-700">{selected.digitalMetadata.aiAuditLog.summary}</p>
                    </div>

                    {selected.digitalMetadata.aiAuditLog.riskFlags.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-500 uppercase mb-2">Risk Flags</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.digitalMetadata.aiAuditLog.riskFlags.map((flag, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                              {flag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${
                      RISK_COLORS[selected.digitalMetadata.aiAuditLog.suggestedAction]
                    }`}>
                      AI Recommendation: {selected.digitalMetadata.aiAuditLog.suggestedAction.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleAction(selected.id, 'publish')}
                    disabled={!!processing}
                    isLoading={processing === selected.id}
                    className="bg-emerald-600 hover:bg-emerald-700 flex-1 gap-2 rounded-xl"
                  >
                    <CheckCircle size={16} /> Approve & Publish
                  </Button>
                  <Button
                    onClick={() => handleAction(selected.id, 'reject')}
                    disabled={!!processing}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 flex-1 gap-2 rounded-xl"
                  >
                    <XCircle size={16} /> Reject
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}