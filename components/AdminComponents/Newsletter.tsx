'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mail, Users, UserMinus, Send, Search,
  Loader2, CheckCircle, AlertCircle, Download,
  RefreshCw, ChevronLeft, ChevronRight, Eye, X, Sparkles
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import Image from 'next/image';

/* ─── Types ─────────────────────────────────── */
interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
}

interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  status: 'active' | 'unsubscribed';
  promoCode?: string;
  createdAt: string;
}

interface SubscriberPage {
  data: Subscriber[];
  total: number;
  page: number;
  limit: number;
}

type ActiveTab = 'overview' | 'subscribers' | 'compose';

/* ─── Stat Card Component ─────────────────────── */
const StatCard = ({
  label, value, sub, icon: Icon, accent = false,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent?: boolean;
}) => (
  <div className={`p-5 border relative overflow-hidden rounded-none shadow-none font-mono ${accent
    ? 'bg-zinc-950 text-zinc-50 border-zinc-950'
    : 'bg-white text-zinc-900 border-zinc-200'
    }`}>
    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${accent ? 'text-green-600' : 'text-zinc-400'}`}>
      {label}
    </p>
    <p className={`text-2xl font-black font-mono leading-none`}>{value}</p>
    <p className={`text-[9px] uppercase tracking-wider mt-1.5 ${accent ? 'text-zinc-400' : 'text-zinc-500'}`}>{sub}</p>
    <Icon className={`absolute -right-4 -bottom-4 ${accent ? 'text-white/5' : 'text-zinc-50'}`} size={72} />
  </div>
);

/* ─── Rich Text Toolbar Options ────────────────── */
const TOOLBAR_ACTIONS = [
  { cmd: 'bold', label: 'B', style: 'font-bold' },
  { cmd: 'italic', label: 'I', style: 'italic' },
  { cmd: 'underline', label: 'U', style: 'underline' },
  { cmd: 'insertUnorderedList', label: '• List', style: '' },
  { cmd: 'insertOrderedList', label: '1. List', style: '' },
];

/* ─── Main Component ─────────────────────────── */
export default function NewsletterAdmin() {
  const fetcher = useApi();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<SubscriberPage | null>(null);
  const [subsLoading, setSubsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Compose State
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  /* ── Load stats ── */
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetcher('/api/admin/newsletter/stats');
      setStats(res.data || res);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load newsletter stats');
    } finally {
      setStatsLoading(false);
    }
  }, [fetcher]);

  // Run once on mount to prevent infinite API call dependencies
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load subscribers ── */
  const loadSubscribers = useCallback(async () => {
    setSubsLoading(true);
    try {
      const res = await fetcher(`/api/admin/newsletter/subscribers?page=${page}&limit=20&search=${search}`);
      setSubscribers(res.data.data || res);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load subscribers');
    } finally {
      setSubsLoading(false);
    }
  }, [fetcher, page, search]);

  // Decoupled effect strictly depending on tab changes, page numbers, and query text inputs to prevent loop re-fetching
  useEffect(() => {
    if (activeTab === 'subscribers') {
      loadSubscribers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, search]);

  /* ── Export CSV ── */
  const exportCSV = () => {
    if (!subscribers?.data?.length) return;
    const rows = [
      ['Email', 'First Name', 'Status', 'Promo Code', 'Subscribed On'],
      ...subscribers.data.map(s => [
        s.email,
        s.firstName || '',
        s.status,
        s.promoCode || '',
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bleefy-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Toolbar Command ── */
  const execCmd = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  /* ── Send Blast ── */
  const handleSendBlast = async () => {
    const body = editorRef.current?.innerHTML?.trim();
    if (!subject.trim()) return toast.error('Subject line is required');
    if (!body || body === '<br>') return toast.error('Email body cannot be empty');

    if (!confirm(`Send this newsletter to ${stats?.active?.toLocaleString() || '?'} active subscribers?`)) return;

    setSending(true);
    try {
      const res = await fetcher('/api/admin/newsletter/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      toast.success(res.message || `Newsletter sent to subscribers!`);
      setSubject('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      setActiveTab('overview');
      loadStats();
    } catch (e: any) {
      toast.error(e.message || 'Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const totalPages = subscribers ? Math.ceil(subscribers.total / 20) : 1;

  return (
    <div className="w-full space-y-6 font-mono text-xs text-zinc-900 select-none antialiased animate-in fade-in duration-300">

      {/* Header Block */}
      <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            COMMUNITY ALERTS & TELEMETRY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Newsletter Command Center</h1>
          <p className="text-zinc-500 text-[10px] mt-0.5 font-mono">Manage subscriber indices, broadcast tactical alerts, and monitor list health parameters</p>
        </div>
        <button
          onClick={loadStats}
          className="h-10 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold uppercase tracking-wider text-[9px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          title="Refresh statistics"
        >
          <RefreshCw size={12} className={statsLoading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex bg-zinc-100 p-1 border border-zinc-200 rounded-none w-fit">
        {(['overview', 'subscribers', 'compose'] as ActiveTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab
              ? 'bg-white text-zinc-950 border border-zinc-200 font-black'
              : 'text-zinc-400 hover:text-zinc-700'
              }`}
          >
            {tab === 'compose' ? '✉ COMPOSE' : tab === 'subscribers' ? '👥 SUBSCRIBERS' : '📊 OVERVIEW'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex items-center justify-center h-64 border border-zinc-200 bg-white font-mono text-xs select-none">
              <Loader2 className="animate-spin text-green-700 mr-2" size={20} />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Diagnostics...</span>
            </div>
          ) : stats ? (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                  accent
                  label="Active Subscribers"
                  value={stats.active?.toLocaleString() ?? '0'}
                  sub="Will receive next campaign"
                  icon={Users}
                />
                <StatCard
                  label="Total Ever Subscribed"
                  value={stats.total.toLocaleString()}
                  sub="Including unsubscribed"
                  icon={Mail}
                />
                <StatCard
                  label="Unsubscribed Churn"
                  value={stats.unsubscribed.toLocaleString()}
                  sub={`${stats.total > 0 ? ((stats.unsubscribed / stats.total) * 100).toFixed(1) : 0}% churn rate`}
                  icon={UserMinus}
                />
              </div>

              {/* Technical Health Banner */}
              <div className="p-5 border border-zinc-200 bg-white rounded-none shadow-none font-mono">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-150 pb-4">
                  <div>
                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-green-50 border border-green-200 text-green-800 uppercase tracking-widest">
                      METRIC INTEGRITY REPORT
                    </span>
                    <h3 className="font-bold text-zinc-950 text-sm uppercase tracking-wide mt-2">Subscriber List Health</h3>
                    <p className="text-zinc-500 text-[10px] mt-0.5">Retention and churn calculation of active farmer registry</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-700 font-mono">
                        {stats.total > 0
                          ? ((stats.active / stats.total) * 100).toFixed(1)
                          : '100'}%
                      </p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">RETENTION RATIO</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
                    <span>ACTIVE INDEX: {stats.active.toLocaleString()}</span>
                    <span>UNSUBSCRIBED: {stats.unsubscribed.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-none h-3 overflow-hidden border border-zinc-200 p-0.5">
                    <div
                      className="bg-green-700 h-full rounded-none transition-all duration-700"
                      style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Action Navigation Panels */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div
                  className="p-5 border border-zinc-200 bg-white hover:bg-zinc-50/50 cursor-pointer transition-colors rounded-none flex items-center gap-4"
                  onClick={() => setActiveTab('compose')}
                >
                  <div className="w-10 h-10 border border-green-200 bg-green-50 flex items-center justify-center text-green-700 shrink-0 rounded-none">
                    <Send size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950 uppercase tracking-tight text-xs">Send Campaign Alert</p>
                    <p className="text-[10px] text-zinc-400 uppercase mt-0.5">
                      Broadcast to {stats.active.toLocaleString()} active recipients
                    </p>
                  </div>
                </div>

                <div
                  className="p-5 border border-zinc-200 bg-white hover:bg-zinc-50/50 cursor-pointer transition-colors rounded-none flex items-center gap-4"
                  onClick={() => setActiveTab('subscribers')}
                >
                  <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-650 shrink-0 rounded-none">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950 uppercase tracking-tight text-xs">Browse Subscriber Directory</p>
                    <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Search database entries and export ledger CSV</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="border border-dashed border-2 border-zinc-200 bg-white p-20 text-center select-none font-mono">
              <Mail className="mx-auto text-zinc-200 mb-4" size={48} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700">No Subscriber Registrations</h3>
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider mt-1.5">Statistics will generate once newsletter entries are registered on the platform</p>
            </div>
          )}
        </div>
      )}

      {/* ── SUBSCRIBERS TAB ── */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">

          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-85 font-mono text-[10px]">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="SEARCH BY EMAIL OR NAME..."
                className="w-full pl-8 pr-4 h-9 bg-zinc-50 border border-zinc-300 rounded-none outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-xs font-mono placeholder:text-zinc-400 uppercase tracking-tight"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { setSearch(searchInput); setPage(1); }
                }}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => { setSearch(searchInput); setPage(1); }}
                className="flex-1 sm:flex-none h-9 px-4 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-750 font-bold uppercase tracking-wider text-[9px] cursor-pointer"
              >
                Search List
              </button>
              <button
                onClick={exportCSV}
                disabled={!subscribers?.data?.length}
                className="flex-1 sm:flex-none h-9 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-50 text-zinc-650 font-bold uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={12} /> Export CSV
              </button>
            </div>
          </div>

          {/* Subscribers Ledger Table */}
          <div className="border border-zinc-200 bg-white rounded-none shadow-none font-mono">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-550 font-bold uppercase tracking-widest">
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Subscriber Name</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Promo Code</th>
                    <th className="p-3.5">Subscribed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {subsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2 className="animate-spin text-green-700 mx-auto" size={24} />
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-2 block">Syncing Registry...</span>
                      </td>
                    </tr>
                  ) : !subscribers?.data?.length ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-zinc-400 font-mono">
                        <Users className="mx-auto mb-3 text-zinc-200" size={32} />
                        <p className="font-bold uppercase text-[10px]">No matches found in directory</p>
                        {search && (
                          <button
                            onClick={() => { setSearch(''); setSearchInput(''); }}
                            className="text-green-700 text-[10px] mt-2 underline cursor-pointer uppercase font-bold"
                          >
                            Clear search filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    subscribers.data.map(sub => (
                      <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-zinc-950 lowercase font-mono">{sub.email}</td>
                        <td className="px-5 py-3.5 text-zinc-500 uppercase">{sub.firstName || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 border ${sub.status === 'active'
                            ? 'bg-green-50 text-green-800 border-green-200 rounded-none'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-250 rounded-none'
                            }`}>
                            {sub.status === 'active'
                              ? <CheckCircle size={10} className="text-green-700" />
                              : <X size={10} className="text-zinc-400" />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {sub.promoCode ? (
                            <span className="font-mono text-[9px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 border border-amber-200 rounded-none">
                              {sub.promoCode}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-450 uppercase">
                          {new Date(sub.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          }).toUpperCase()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {subscribers && subscribers.total > 20 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-200 bg-zinc-50 font-mono text-[10px]">
                <p className="text-zinc-400 uppercase font-bold">
                  INDEX: {((page - 1) * 20) + 1}–{Math.min(page * 20, subscribers.total)} OF {subscribers.total.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1 rounded-none border border-zinc-300 bg-white text-zinc-500 disabled:opacity-40 hover:border-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] font-bold text-zinc-700 min-w-[60px] text-center uppercase">
                    PAGE {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1 rounded-none border border-zinc-300 bg-white text-zinc-500 disabled:opacity-40 hover:border-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COMPOSE TAB ── */}
      {activeTab === 'compose' && (
        <div className="space-y-6">

          {/* Recipient telemetry notification */}
          <div className="border border-green-200 bg-green-50/10 px-5 py-4 flex items-center gap-3 rounded-none font-mono">
            <div className="w-8 h-8 border border-green-200 bg-green-50 flex items-center justify-center shrink-0 rounded-none text-green-700">
              <Users size={16} />
            </div>
            <div>
              <p className="font-bold text-green-950 text-xs uppercase tracking-tight">
                BROADCAST QUEUE: {statsLoading ? '...' : (stats?.active?.toLocaleString() ?? 0)} ACTIVE TARGET RECIPIENTS
              </p>
              <p className="text-green-800 text-[10px] mt-0.5 uppercase tracking-wide">
                Unsubscribed client emails are automatically filtered out from this broadcast list
              </p>
            </div>
          </div>

          {/* Compose Control Panel */}
          <div className="border border-zinc-200 bg-white p-5 shadow-none rounded-none space-y-5">
            {/* Subject Input */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Campaign Subject Line <span className="text-red-650">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 🌾 Weekly grain catalog spot price adjustments"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full h-10 bg-zinc-50 border border-zinc-300 rounded-none outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/30 px-3.5 text-xs font-mono"
              />
              <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">
                <span>LENGTH: {subject.length} CHARS</span>
                <span className={subject.length < 40 ? 'text-amber-700' : subject.length > 70 ? 'text-amber-700' : 'text-green-700'}>
                  STATUS: {subject.length < 40 ? 'TOO SHORT' : subject.length > 70 ? 'TOO LONG' : 'PERFECT COMPRESSION'}
                </span>
              </div>
            </div>

            {/* Content Editor Block */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Broadcast Body Payload <span className="text-red-650">*</span>
              </label>

              {/* Format Control Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border border-zinc-200 border-b-0 rounded-none bg-zinc-50 font-mono">
                {TOOLBAR_ACTIONS.map(({ cmd, label, style }) => (
                  <button
                    key={cmd}
                    type="button"
                    onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                    className={`px-3 py-1 bg-white border border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-650 hover:bg-zinc-100 transition-colors cursor-pointer rounded-none ${style}`}
                  >
                    {label}
                  </button>
                ))}
                <div className="w-px bg-zinc-200 mx-1" />
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); execCmd('createLink'); }}
                  className="px-3 py-1 bg-white border border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-650 hover:bg-zinc-100 transition-colors cursor-pointer rounded-none"
                >
                  🔗 Add Link
                </button>
              </div>

              {/* WYSIWYG Editor box */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[260px] border border-zinc-200 rounded-none p-4 text-xs font-mono text-zinc-800 leading-relaxed focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/30 transition-all bg-white"
                style={{ whiteSpace: 'pre-wrap' }}
                data-placeholder="Input campaign body payload here...

Agricultural broadcast guidelines:
- State weekly wholesale pricing updates clearly in tabular form.
- Spotlight verified farms or new regional logistics listings.
- Maintain professional, objective data metrics."
              />

              <style>{`
                [contenteditable]:empty:before {
                  content: attr(data-placeholder);
                  color: #a1a1aa;
                  pointer-events: none;
                  white-space: pre-line;
                }
              `}</style>
            </div>

            {/* Technical alert tips banner */}
            <div className="border border-amber-250 bg-amber-50/50 p-4 rounded-none font-mono">
              <p className="text-[10px] font-bold text-amber-850 flex items-center gap-1.5 mb-1.5 uppercase tracking-widest">
                <Sparkles size={12} /> Optimization Guidelines
              </p>
              <ul className="text-[9px] text-amber-800 space-y-1 list-disc list-inside uppercase font-bold tracking-wide">
                <li>Limit campaigns to under 250 words to increase conversion indices.</li>
                <li>Anchor commodity price points inside the initial two sentences.</li>
                <li>Verify embedded links before launching the transaction broadcast.</li>
              </ul>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <Eye size={14} /> Open preview viewer
            </button>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => { setSubject(''); if (editorRef.current) editorRef.current.innerHTML = ''; }}
                className="flex-1 sm:flex-none h-10 px-5 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Clear Form
              </button>
              <button
                onClick={handleSendBlast}
                disabled={sending || !subject.trim()}
                className="flex-1 sm:flex-none h-10 px-5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {sending ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={14} />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Launch Broadcast to {stats?.active?.toLocaleString() ?? '?'} clients</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TACTICAL PREVIEW MODAL ── */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 rounded-none shadow-none max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden font-mono">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 bg-zinc-50">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wide text-zinc-950">Active Broadcast Preview</h3>
                <p className="text-[9px] text-zinc-400 uppercase mt-0.5">Inbox rendering configuration test</p>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-650 cursor-pointer rounded-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 bg-zinc-50">

              <div className="bg-white border border-zinc-200 rounded-none shadow-none max-w-lg mx-auto overflow-hidden">
                <div className=" p-6 text-white text-center border-b border-zinc-900">
                  <div className="text-xl mb-1 flex items-center justify-center">
                    <Image src="/logo.png" width={100} height={100} alt="logo" className='w-24 h-24' />
                  </div>
                  <h1 className="text-sm font-black uppercase tracking-widest text-green-500">Bleefy Agri</h1>
                </div>
                <div className="p-6 text-[10px] text-zinc-800 leading-normal">
                  <div className="mb-4">
                    <p className="text-[8px] text-zinc-400 uppercase font-black tracking-widest mb-1">Subject</p>
                    <p className="font-bold text-zinc-950 uppercase">{subject || '(no subject set)'}</p>
                  </div>
                  <hr className="my-4 border-zinc-200 border-dashed" />
                  <div
                    className="text-[10px] text-zinc-700 leading-relaxed font-mono prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editorRef.current?.innerHTML || '<p class="text-zinc-450 italic uppercase">No body payload entered...</p>'
                    }}
                  />
                  <hr className="mt-8 mb-4 border-zinc-200 border-dashed" />
                  <p className="text-[8px] text-zinc-400 text-center font-mono font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} BLEEFY AGRIMARKET
                    <br />
                    <span className="underline mt-1 block cursor-pointer">Unsubscribe</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
              <button
                onClick={() => setPreviewOpen(false)}
                className="h-8 px-4 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}