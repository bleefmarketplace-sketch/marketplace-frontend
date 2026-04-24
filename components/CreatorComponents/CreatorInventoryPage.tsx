'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Plus, BookOpen, Shield, Trash2,
  Loader2, CheckCircle, Clock, AlertTriangle, Search
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import ContentBuilder from '@/components/CreatorComponents/ContentBuilder';

interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  primaryImage: string;
  createdAt: string;
  type: string;
  digitalMetadata?: {
    trustScore: number;
    aiAuditLog?: {
      summary: string;
      riskFlags: string[];
      suggestedAction: string;
    };
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  published: { label: 'Live', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Clock },
  pending_review: { label: 'In Review', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

export default function CreatorInventoryPage() {
  const fetcher = useApi();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetcher('/api/creator/products');
      setProducts(res.data || res || []);
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this content? This cannot be undone.')) return;
    try {
      await fetcher(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Content removed');
      setProducts(p => p.filter(pr => pr.id !== id));
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const filtered = products.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (showBuilder) {
    return <ContentBuilder onClose={() => { setShowBuilder(false); load(); }} />;
  }

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Content Vault</h1>
          <p className="text-gray-500 text-sm">Manage your digital courses, guides and resources</p>
        </div>
        <Button
          onClick={() => setShowBuilder(true)}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-2xl shrink-0"
        >
          <Plus size={18} /> Upload Content
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search content..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2">
          <BookOpen className="mx-auto text-gray-200 mb-4" size={56} />
          <h3 className="text-xl font-bold text-gray-400">
            {search ? 'No content matches your search' : 'No content yet'}
          </h3>
          {!search && (
            <>
              <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                Upload your first course, guide, or digital resource to start earning from your expertise.
              </p>
              <Button
                onClick={() => setShowBuilder(true)}
                className="mt-6 bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Plus size={18} /> Create First Content
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(product => {
            const statusConf = STATUS_CONFIG[product.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusConf.icon;

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-5">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {product.primaryImage ? (
                      <Image fill src={product.primaryImage} alt={product.title} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={28} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{product.title}</h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${statusConf.color}`}>
                        <StatusIcon size={10} /> {statusConf.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-black text-emerald-600 text-sm">
                        ₦{Number(product.price).toLocaleString()}
                      </span>

                      {product.digitalMetadata?.trustScore != null && (
                        <div className="flex items-center gap-1 text-xs">
                          <Shield size={12} className={
                            product.digitalMetadata.trustScore >= 75 ? 'text-emerald-500' :
                            product.digitalMetadata.trustScore >= 50 ? 'text-amber-500' : 'text-red-500'
                          } />
                          <span className="font-bold text-gray-600">
                            {product.digitalMetadata.trustScore}/100
                          </span>
                        </div>
                      )}

                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Flags Banner */}
               {/*  {product.digitalMetadata?.aiAuditLog?.riskFlags?.length > 0 && (
                  <div className="mx-5 mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-1">
                      <AlertTriangle size={12} /> AI Flags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.digitalMetadata.aiAuditLog.riskFlags.slice(0, 3).map((flag, i) => (
                        <span key={i} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {flag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Actions */}
                <div className="flex gap-2 px-5 pb-5">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}