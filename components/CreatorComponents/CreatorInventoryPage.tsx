'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  published: { label: 'LIVE', color: 'border-green-200 bg-green-50 text-green-800', icon: CheckCircle },
  draft: { label: 'DRAFT', color: 'border-zinc-200 bg-zinc-50 text-zinc-650', icon: Clock },
  processing: { label: 'PROCESSING', color: 'border-blue-200 bg-blue-50 text-blue-800', icon: Clock },
  pending_review: { label: 'IN REVIEW', color: 'border-amber-200 bg-amber-50 text-amber-800', icon: AlertTriangle },
  rejected: { label: 'REJECTED', color: 'border-red-200 bg-red-50 text-red-800', icon: AlertTriangle },
};

export default function CreatorInventoryPage() {
  const fetcher = useApi();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [search, setSearch] = useState('');
  const hasFetched = useRef(false);

  const { user } = useAuth();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      if (user?.hasCreatedCreatorProfile) {
        const res = await fetcher('/api/creator/products');
        setProducts(res.data || res || []);
      }
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [fetcher, user]);

  useEffect(() => { 
    if (user === undefined || hasFetched.current) return;
    if (user?.hasCreatedCreatorProfile) {
      hasFetched.current = true;
      load(); 
    } else {
      setLoading(false);
    }
  }, [load, user]);

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

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-green-700" size={32} />
    </div>
  );

  if (user && !user.hasCreatedCreatorProfile) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 font-mono text-xs text-zinc-900 antialiased animate-in fade-in">
        <div className="border border-amber-350 bg-amber-50/50 p-6 space-y-6 rounded-none text-center">
          <div className="w-16 h-16 border border-amber-250 bg-amber-50 text-amber-700 flex items-center justify-center mx-auto rounded-none">
            <BookOpen size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-sm font-bold uppercase tracking-wider text-zinc-950">CREATOR PROFILE NOT ACTIVE</h1>
            <p className="text-zinc-500 text-[10px] leading-relaxed max-w-md mx-auto">
              You must configure and verify your Creator Studio settings before launching new digital products and guides.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => router.push('/dashboard/creator/settings?tab=store')}
              className="bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-10 px-6 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
            >
              Configure Studio Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-zinc-200 bg-white p-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            DIGITAL REPOSITORY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Content Vault</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">Manage digital curriculum assets, agronomy handbooks, and knowledge modules.</p>
        </div>
        <Button
          onClick={() => setShowBuilder(true)}
          className="bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-10 px-5 gap-2 uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer shrink-0"
        >
          <Plus size={14} /> Upload Content
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="SEARCH DIGITAL REPOSITORY..."
          className="w-full pl-9 pr-4 py-2.5 border border-zinc-250 rounded-none bg-white font-mono text-xs uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-green-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white">
          <BookOpen className="mx-auto text-zinc-300 mb-4" size={40} />
          <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">
            {search ? 'NO DIGITAL ASSETS MATCH CRITERIA' : 'REPOSITORY IS EMPTY'}
          </h3>
          {!search && (
            <>
              <p className="text-zinc-500 text-[10px] mt-2 max-w-xs mx-auto leading-relaxed">
                Initialize your first premium agronomy blueprint, crop masterclass, or downloadable manual to deploy to the registry.
              </p>
              <Button
                onClick={() => setShowBuilder(true)}
                className="mt-6 bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-10 px-6 uppercase font-bold tracking-wider text-[10px] cursor-pointer"
              >
                <Plus size={14} className="mr-1.5 inline" /> Create First Content
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(product => {
            const statusConf = STATUS_CONFIG[product.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusConf.icon;

            return (
              <Card key={product.id} className="overflow-hidden border border-zinc-200 bg-white rounded-none shadow-none flex flex-col justify-between">
                <div className="flex gap-4 p-5">
                  <div className="relative w-20 h-20 border border-zinc-200 rounded-none overflow-hidden bg-zinc-50 shrink-0 flex items-center justify-center">
                    {product.primaryImage ? (
                      <Image fill src={product.primaryImage} alt={product.title} className="object-cover" unoptimized />
                    ) : (
                      <BookOpen size={24} className="text-zinc-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider truncate" title={product.title}>
                        {product.title}
                      </h3>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 border flex items-center gap-1 shrink-0 rounded-none ${statusConf.color}`}>
                        <StatusIcon size={9} /> {statusConf.label}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-mono font-bold text-green-700 text-[11px] tracking-wide bg-green-50 px-1.5 py-0.5 border border-green-150">
                        ₦{Number(product.price).toLocaleString()}
                      </span>

                      {product.digitalMetadata?.trustScore != null && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-600 bg-zinc-50 px-1.5 py-0.5 border border-zinc-200">
                          <Shield size={10} className={
                            product.digitalMetadata.trustScore >= 75 ? 'text-green-600' :
                            product.digitalMetadata.trustScore >= 50 ? 'text-amber-600' : 'text-red-600'
                          } />
                          <span>
                            TRUST: {product.digitalMetadata.trustScore}/100
                          </span>
                        </div>
                      )}

                      <span className="text-[9px] font-mono text-zinc-400 ml-auto">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 px-5 pb-5 mt-auto">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-250 hover:border-zinc-350 text-zinc-800 font-mono font-bold text-[9px] uppercase tracking-wider rounded-none transition-colors cursor-pointer"
                  >
                    Edit Content
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 border border-zinc-250 hover:border-red-200 hover:bg-red-50 text-zinc-400 hover:text-red-750 rounded-none transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ContentBuilder 
        isOpen={showBuilder || !!editingProduct}
        product={editingProduct}
        onClose={() => { 
          setShowBuilder(false); 
          setEditingProduct(null);
          load(); 
        }} 
      />
    </div>
  );
}