'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  ShieldCheck, ShieldX, Clock, MapPin,
  Phone, Mail, Loader2, User, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';

interface Seller {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  farmName: string;
  farmSize: string;
  userAvatar?: string;
  createdAt: string;
  status: string;
}

export default function AdminVerificationPage() {
  const fetcher = useApi();
  const [queue, setQueue] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    try {
      const res = await fetcher('/api/admin/verify/verify-queue');
      setQueue(res.data || res || []);
    } catch {
      toast.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this seller? They will be notified by email.')) return;
    setProcessing(id);
    try {
      await fetcher(`/api/admin/verify/${id}`, { method: 'PATCH' });
      toast.success('Seller approved and notified!');
      setQueue(q => q.filter(s => s.id !== id));
    } catch (e: any) {
      toast.error(e.message || 'Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error('A rejection reason is required');
    if (!rejectModal) return;
    setProcessing(rejectModal.id);
    try {
      await fetcher(`/api/admin/verify/${rejectModal.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      toast.success('Seller rejected and notified.');
      setQueue(q => q.filter(s => s.id !== rejectModal.id));
      setRejectModal(null);
      setRejectReason('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to reject');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 font-mono text-xs text-zinc-500 uppercase tracking-widest gap-3 select-none">
      <Loader2 className="animate-spin text-green-700" size={32} />
      <span>Fetching KYC seller partition queue...</span>
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-mono text-xs text-zinc-900 select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-zinc-200 bg-white p-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            REGISTRY VERIFICATION
          </span>
          <h1 className="text-xl font-black uppercase tracking-wider text-zinc-950 mt-2">Seller Verification Queue</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Review and approve credentials of pending merchant registrations</p>
        </div>
        <div className="border border-amber-200 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-none flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-wider shrink-0">
          <Clock size={12} /> {queue.length} PENDING IN QUEUE
        </div>
      </div>

      {queue.length === 0 ? (
        <Card className="rounded-none border border-zinc-200 bg-white p-20 text-center shadow-none">
          <CheckCircle className="mx-auto text-green-700 mb-4" size={48} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700">Verification Queue is Clear</h3>
          <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-1">All seller applications have been reviewed</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map(seller => (
            <Card key={seller.id} className="rounded-none border border-zinc-200 bg-white p-6 shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 shrink-0 md:border-r md:border-zinc-150 md:pr-6">
                  <div className="w-16 h-16 rounded-none border border-zinc-200 bg-zinc-100 overflow-hidden relative shrink-0">
                    {seller.userAvatar ? (
                      <Image fill src={seller.userAvatar} alt={seller.fullName} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-950 uppercase tracking-tight text-sm">{seller.fullName}</h3>
                    <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-250 px-1.5 py-0.5 rounded-none mt-1 inline-block tracking-wider">
                      ● PENDING REVIEW
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5">
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Email Address</p>
                    <p className="font-bold text-zinc-700 flex items-center gap-1.5 font-mono select-text lowercase">
                      <Mail size={12} className="text-zinc-400" /> {seller.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Phone Contact</p>
                    <p className="font-bold text-zinc-700 flex items-center gap-1.5 font-mono">
                      <Phone size={12} className="text-zinc-400" /> {seller.phoneNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Geographical Region</p>
                    <p className="font-bold text-zinc-750 flex items-center gap-1.5 uppercase tracking-tight">
                      <MapPin size={12} className="text-zinc-400" /> {seller.location || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Farm / Business Title</p>
                    <p className="font-bold text-zinc-800 uppercase tracking-tight">{seller.farmName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Total Farm Size</p>
                    <p className="font-bold text-zinc-800 font-mono uppercase">{seller.farmSize ? `${seller.farmSize} HA` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Application Log Date</p>
                    <p className="font-bold text-zinc-800 font-mono">
                      {new Date(seller.createdAt).toISOString().substring(0, 10)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-row md:flex-col gap-2 shrink-0 justify-end md:border-l md:border-zinc-150 md:pl-6">
                  <button
                    onClick={() => handleApprove(seller.id)}
                    disabled={processing === seller.id}
                    className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-green-700 hover:bg-green-800 border border-green-700 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {processing === seller.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={13} />
                    )}
                    Approve
                  </button>
                  
                  <button
                    onClick={() => setRejectModal({ id: seller.id, name: seller.fullName })}
                    disabled={processing === seller.id}
                    className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-white border border-zinc-300 text-red-650 hover:bg-zinc-50 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <ShieldX size={13} /> Reject
                  </button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-300 rounded-none p-6 max-w-md w-full shadow-none font-mono text-xs text-zinc-900">
            
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 mb-4">
              <div className="w-8 h-8 border border-red-200 bg-red-50 text-red-750 flex items-center justify-center rounded-none shrink-0">
                <ShieldX size={16} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs">Reject Seller Application</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tight mt-0.5">{rejectModal.name}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full border border-zinc-300 rounded-none p-3 text-xs font-mono bg-white focus:outline-none focus:border-green-600 transition-colors uppercase placeholder:text-zinc-300"
                placeholder="EXPLAIN REJECTION CAUSE. THIS WILL BE TRANSMITTED TO THE APPLICANT."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>

            <div className="flex gap-2 select-none">
              <button
                onClick={handleReject}
                disabled={!!processing || !rejectReason.trim()}
                className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-red-700 hover:bg-red-800 border border-red-700 text-white flex-1 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {processing ? <Loader2 size={13} className="animate-spin" /> : "Confirm Rejection"}
              </button>
              
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}