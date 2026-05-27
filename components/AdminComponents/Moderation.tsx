'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Shield, CheckCircle, XCircle, Eye,
  Loader2, AlertTriangle, BookOpen, Star, Search, RefreshCw
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
  stock?: number;
  location?: string;
  isOrganic?: boolean;
  attributes?: Record<string, any>;
  seller: { businessName: string; id: string };
  category?: { name: string };
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

const STATUS_BADGES: Record<string, string> = {
  published: 'border-green-200 bg-green-50 text-green-850',
  draft: 'border-zinc-200 bg-zinc-50 text-zinc-650',
  suspended: 'border-red-200 bg-red-50 text-red-700',
  pending_review: 'border-amber-250 bg-amber-50 text-amber-850',
  rejected: 'border-red-300 bg-red-50/70 text-red-800',
};

export default function AdminModerationPage() {
  const fetcher = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  // Split Channel States
  const [channel, setChannel] = useState<'content' | 'products'>('content');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load Content Moderation Queue (pending review digital items)
  const loadContentQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher('/api/admin/moderation');
      // The Next.js proxy wraps payload inside { success: true, data: [...] }
      setProducts(res.data || res || []);
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load content moderation queue');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  // Load Marketplace Products (all physical/digital catalog items with status override)
  const loadProductsCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/products?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`;
      const res = await fetcher(url);
      setProducts(res.data || res || []);
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load products catalog');
    } finally {
      setLoading(false);
    }
  }, [fetcher, search, statusFilter]);

  // Handle Initial Load and channel switches
  useEffect(() => {
    if (channel === 'content') {
      loadContentQueue();
    } else {
      loadProductsCatalog();
    }
  }, [channel, loadContentQueue, loadProductsCatalog]);

  // Debounced search for product catalog
  useEffect(() => {
    if (channel === 'products') {
      const delay = setTimeout(() => {
        loadProductsCatalog();
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [search, statusFilter, channel]);

  // Unified Admin Status Modification (Bypasses Seller ownership check)
  const handleAdminAction = async (id: string, action: 'publish' | 'suspend' | 'reject' | 'delete') => {
    if (action === 'delete') {
      if (!confirm('Are you sure you want to permanently remove this product listing from the platform?')) return;
    }

    setProcessing(id);
    try {
      if (action === 'delete') {
        await fetcher(`/api/admin/products/${id}`, { method: 'DELETE' });
        toast.success('Product listing permanently removed');
        setProducts(prev => prev.filter(p => p.id !== id));
        if (selected?.id === id) setSelected(null);
      } else {
        const targetStatus = action === 'publish' ? 'published' : action === 'suspend' ? 'suspended' : 'rejected';
        await fetcher(`/api/admin/products/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus }),
        });
        toast.success(`Product compliance status set to ${targetStatus}`);

        // Update local state to show change instantly
        if (channel === 'content') {
          // In content queue, approved/rejected items drop off the audit checklist
          setProducts(prev => prev.filter(p => p.id !== id));
          if (selected?.id === id) setSelected(null);
        } else {
          // In catalog audit, update the status column in place
          setProducts(prev => prev.map(p => p.id === id ? { ...p, status: targetStatus } : p));
          if (selected?.id === id) {
            setSelected(prev => prev ? { ...prev, status: targetStatus } : null);
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || 'Moderation override request failed');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-mono text-xs text-zinc-900 select-none">
      
      {/* Header telemetry box */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-zinc-200 bg-white p-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            COMPLIANCE CONTROL CENTER
          </span>
          <h1 className="text-xl font-black uppercase tracking-wider text-zinc-950 mt-2">Admin Moderation</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
            Audit digital uploads, manage active product batches, and enforce platform regulations.
          </p>
        </div>
        <button 
          onClick={channel === 'content' ? loadContentQueue : loadProductsCatalog}
          className="border border-zinc-250 bg-white text-zinc-700 hover:text-zinc-950 p-2 rounded-none transition duration-150 cursor-pointer flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider"
          title="Force telemetry reload"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Reload Feed
        </button>
      </div>

      {/* Moderation Channel Selectors Bar */}
      <div className="border border-zinc-200 bg-white p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-[9px] text-zinc-400">ACTIVE TELEMETRY CHANNEL:</span>
          <div className="flex border border-zinc-200">
            <button
              onClick={() => setChannel('content')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-zinc-200 transition duration-150 rounded-none ${
                channel === 'content' 
                  ? 'bg-zinc-950 text-white' 
                  : 'bg-white text-zinc-650 hover:bg-zinc-50'
              }`}
            >
              Content Audit Queue
            </button>
            <button
              onClick={() => setChannel('products')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition duration-150 rounded-none ${
                channel === 'products' 
                  ? 'bg-zinc-950 text-white' 
                  : 'bg-white text-zinc-650 hover:bg-zinc-50'
              }`}
            >
              Marketplace Products Catalog
            </button>
          </div>
        </div>

        {/* Catalog search controls */}
        {channel === 'products' && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 animate-in fade-in duration-200">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-450" size={13} />
              <input
                type="text"
                placeholder="Filter catalog / seller..."
                className="pl-9 pr-4 py-1.5 border border-zinc-250 bg-white font-mono text-xs w-full focus:border-green-600 focus:outline-none rounded-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-zinc-250 bg-white text-zinc-950 font-bold font-mono text-xs uppercase px-3 py-1.5 focus:border-green-600 focus:outline-none rounded-none cursor-pointer"
            >
              <option value="all">ALL COMPLIANCE STATUSES</option>
              <option value="published">PUBLISHED (LIVE)</option>
              <option value="draft">DRAFT (HIDDEN)</option>
              <option value="suspended">SUSPENDED</option>
              <option value="pending_review">PENDING REVIEW</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 font-mono text-xs text-zinc-500 uppercase tracking-widest gap-3 select-none">
          <Loader2 className="animate-spin text-green-700" size={32} />
          <span>Syncing compliance registry...</span>
        </div>
      ) : products.length === 0 ? (
        <Card className="rounded-none border border-zinc-200 bg-white p-20 text-center shadow-none">
          <Shield className="mx-auto text-green-700 mb-4" size={48} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700">Verification Queue is Clear</h3>
          <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-1">
            {channel === 'content' 
              ? 'No digital uploads require manual compliance reviews' 
              : 'No product listings found matching current filters'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Product/Content List Panel */}
          <div className="space-y-3 lg:col-span-1 overflow-y-auto max-h-[70vh] custom-scrollbar pr-1">
            {products.map(product => (
              <Card
                key={product.id}
                className={`p-4 cursor-pointer rounded-none shadow-none border transition-all ${
                  selected?.id === product.id 
                    ? 'border-green-600 bg-green-50/10 border-l-4' 
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
                }`}
                onClick={() => setSelected(product)}
              >
                <div className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-none border border-zinc-200 overflow-hidden bg-zinc-50 shrink-0">
                    {product.primaryImage ? (
                      <Image fill src={product.primaryImage} alt={product.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="font-bold text-xs text-zinc-950 uppercase truncate tracking-tight flex-1">{product.title}</p>
                      <span className={`inline-block px-1.5 py-0.25 text-[7px] font-black uppercase border shrink-0 ${
                        STATUS_BADGES[product.status] || 'bg-zinc-50 text-zinc-650 border-zinc-200'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 uppercase truncate tracking-wider mt-1">{product.seller?.businessName}</p>
                    
                    {/* Compliance/Telemetry markers */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-100 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>{product.type} cargo</span>
                      <span>₦{Number(product.price).toLocaleString()}</span>
                    </div>

                    {channel === 'content' && product.digitalMetadata?.aiAuditLog && (
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-none mt-2 inline-block border ${
                        RISK_COLORS[product.digitalMetadata.aiAuditLog.suggestedAction] || 'bg-zinc-100 text-zinc-650 border-zinc-200'
                      }`}>
                        AI RECOMMENDS: {product.digitalMetadata.aiAuditLog.suggestedAction}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Details & Action Panel */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="rounded-none border border-zinc-200 bg-white p-16 text-center h-full flex items-center justify-center shadow-none min-h-[40vh]">
                <div className="text-zinc-400 space-y-2">
                  <Eye size={40} className="mx-auto text-zinc-200" />
                  <p className="font-bold uppercase tracking-wider text-zinc-700">Audit Detailed Specs</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-450">Select an item from the registry queue to moderate</p>
                </div>
              </Card>
            ) : (
              <Card className="rounded-none border border-zinc-200 bg-white p-6 space-y-6 shadow-none">
                
                {/* Header Information */}
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
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-zinc-200 bg-zinc-50 text-zinc-700">
                        PRODUCT CODE: {selected.id.split('-')[0].toUpperCase()}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${
                        STATUS_BADGES[selected.status] || 'bg-zinc-50 text-zinc-650'
                      }`}>
                        STATUS: {selected.status}
                      </span>
                    </div>
                    <h2 className="font-black text-base text-zinc-950 uppercase tracking-tight mt-1 truncate">{selected.title}</h2>
                    <p className="text-[10px] text-zinc-450 uppercase tracking-wider mt-0.5">
                      Seller Store: <span className="text-zinc-800 font-bold">{selected.seller?.businessName}</span> (Owner ID: {selected.seller?.id.split('-')[0].toUpperCase()})
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-bold text-green-700 text-sm font-mono">₦{Number(selected.price).toLocaleString()}</span>
                      {selected.stock !== undefined && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Stock: {selected.stock} units</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid of basic parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-200 bg-zinc-50/40 p-4 font-mono text-[10px] uppercase">
                  <div className="space-y-2">
                    <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Catalog specs</p>
                    <p className="text-zinc-650">Category: <span className="text-zinc-950 font-bold">{selected.category?.name || 'UNCATEGORIZED'}</span></p>
                    <p className="text-zinc-650">Origin: <span className="text-zinc-950 font-bold">{selected.attributes?.origin || selected.location || 'NOT PROVIDED'}</span></p>
                    <p className="text-zinc-650">Weight: <span className="text-zinc-950 font-bold">{selected.attributes?.weight || 'NOT PROVIDED'}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">E-Commerce telemetry</p>
                    <p className="text-zinc-650">Type Index: <span className="text-zinc-950 font-bold">{selected.type}</span></p>
                    <p className="text-zinc-650">Organic Batch: <span className="text-zinc-950 font-bold">{selected.isOrganic ? 'YES (CERTIFIED)' : 'NO'}</span></p>
                    <p className="text-zinc-650">Created on: <span className="text-zinc-950 font-bold">{new Date(selected.createdAt).toLocaleDateString()}</span></p>
                  </div>
                </div>

                {/* Description details */}
                <div>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-1.5">Description Specs</p>
                  <p className="text-xs text-zinc-750 leading-relaxed max-w-2xl select-text border border-zinc-200 bg-white p-3 whitespace-pre-wrap">{selected.description}</p>
                </div>

                {/* AI Audit Compliance Logs (Show if channel is content or metadata exists) */}
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

                {/* Operational Moderation Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-150">
                  {/* Approve/Publish Option (Show if suspended, draft, rejected, or pending review) */}
                  {(selected.status === 'suspended' || selected.status === 'rejected' || selected.status === 'draft' || selected.status === 'pending_review') && (
                    <button
                      onClick={() => handleAdminAction(selected.id, 'publish')}
                      disabled={processing === selected.id}
                      className="rounded-none h-10 px-5 bg-green-700 hover:bg-green-800 border border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                    >
                      {processing === selected.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve & Publish Listing
                    </button>
                  )}

                  {/* Suspend option (Show if active/published) */}
                  {selected.status === 'published' && (
                    <button
                      onClick={() => handleAdminAction(selected.id, 'suspend')}
                      disabled={processing === selected.id}
                      className="rounded-none h-10 px-5 bg-amber-500 hover:bg-amber-600 border border-amber-500 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                    >
                      {processing === selected.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <AlertTriangle size={14} />
                      )}
                      Suspend Listing
                    </button>
                  )}

                  {/* Reject option for compliance audit */}
                  {selected.status === 'pending_review' && (
                    <button
                      onClick={() => handleAdminAction(selected.id, 'reject')}
                      disabled={processing === selected.id}
                      className="rounded-none h-10 px-5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-350 text-red-750 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject & Suspend
                    </button>
                  )}

                  {/* Hard remove/delete option for catalog audit */}
                  {channel === 'products' && (
                    <button
                      onClick={() => handleAdminAction(selected.id, 'delete')}
                      disabled={processing === selected.id}
                      className="rounded-none h-10 px-5 bg-white border border-red-300 text-red-655 hover:bg-red-50 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 disabled:opacity-50"
                    >
                      <XCircle size={14} /> Remove Listing (Delete)
                    </button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}