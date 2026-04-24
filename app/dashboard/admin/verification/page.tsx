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
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Seller Verification Queue</h1>
          <p className="text-gray-500 text-sm">Review and approve seller applications</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm">
          <Clock size={16} /> {queue.length} Pending
        </div>
      </div>

      {queue.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2">
          <CheckCircle className="mx-auto text-emerald-300 mb-4" size={56} />
          <h3 className="text-xl font-bold text-gray-400">Queue is clear</h3>
          <p className="text-gray-400 text-sm mt-1">All seller applications have been reviewed</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map(seller => (
            <Card key={seller.id} className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden relative">
                    {seller.userAvatar ? (
                      <Image fill src={seller.userAvatar} alt={seller.fullName} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={28} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{seller.fullName}</h3>
                    <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Pending Review
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Email</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" /> {seller.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Phone</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" /> {seller.phoneNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Location</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" /> {seller.location || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Farm / Business</p>
                    <p className="font-medium text-gray-700">{seller.farmName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Farm Size</p>
                    <p className="font-medium text-gray-700">{seller.farmSize ? `${seller.farmSize} ha` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Applied</p>
                    <p className="font-medium text-gray-700">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-3 shrink-0 justify-end">
                  <Button
                    onClick={() => handleApprove(seller.id)}
                    disabled={processing === seller.id}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2"
                    size="sm"
                  >
                    {processing === seller.id
                      ? <Loader2 size={16} className="animate-spin" />
                      : <ShieldCheck size={16} />
                    }
                    Approve
                  </Button>
                  <Button
                    onClick={() => setRejectModal({ id: seller.id, name: seller.fullName })}
                    disabled={processing === seller.id}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl gap-2"
                    size="sm"
                  >
                    <ShieldX size={16} /> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Reject Application</h3>
                <p className="text-sm text-gray-500">{rejectModal.name}</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-300"
                placeholder="Explain why this application is being rejected. This will be sent to the seller."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                isLoading={!!processing}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                Confirm Rejection
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}