'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Mail, Users, UserMinus, Send, Search,
  Loader2, CheckCircle, AlertCircle, Download,
  RefreshCw, ChevronLeft, ChevronRight, Eye, X, Sparkles
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

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

/* ─── Stat Card ─────────────────────────────── */
const StatCard = ({
  label, value, sub, icon: Icon, accent = false,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent?: boolean;
}) => (
  <Card className={`p-6 relative overflow-hidden ${accent ? 'bg-emerald-900 border-none' : ''}`}>
    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${accent ? 'text-emerald-400' : 'text-gray-400'}`}>
      {label}
    </p>
    <p className={`text-4xl font-black ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    <p className={`text-xs mt-1 ${accent ? 'text-emerald-300' : 'text-gray-400'}`}>{sub}</p>
    <Icon className={`absolute -right-3 -bottom-3 ${accent ? 'text-white/5' : 'text-gray-100'}`} size={80} />
  </Card>
);

/* ─── Rich Text Toolbar ─────────────────────── */
const TOOLBAR_ACTIONS = [
  { cmd: 'bold',          label: 'B',   style: 'font-bold' },
  { cmd: 'italic',        label: 'I',   style: 'italic' },
  { cmd: 'underline',     label: 'U',   style: 'underline' },
  { cmd: 'insertUnorderedList', label: '• List', style: '' },
  { cmd: 'insertOrderedList',   label: '1. List', style: '' },
];

/* ─── Main Component ─────────────────────────── */
export default function NewsletterAdmin() {
  const fetcher = useApi();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<SubscriberPage | null>(null);
  const [subsLoading, setSubsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Compose state
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
    } catch {
      toast.error('Failed to load newsletter stats');
    } finally {
      setStatsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { loadStats(); }, [loadStats]);

  /* ── Load subscribers ── */
  const loadSubscribers = useCallback(async () => {
    setSubsLoading(true);
    try {
      const res = await fetcher(`/api/admin/newsletter/subscribers?page=${page}&limit=20&search=${search}`);

      setSubscribers(res.data.data || res);
    } catch {
      toast.error('Failed to load subscribers');
    } finally {
      setSubsLoading(false);
    }
  }, [fetcher, page, search]);

  useEffect(() => {
    if (activeTab === 'subscribers') loadSubscribers();
  }, [activeTab, loadSubscribers]);

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

  /* ── Toolbar command ── */
  const execCmd = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  /* ── Send blast ── */
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
      toast.success(res.message || `Newsletter sent to ${res.sent} subscribers!`);
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

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Mail size={24} className="text-emerald-500" /> Newsletter Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage subscribers and send email campaigns to your farming community
          </p>
        </div>
        <button
          onClick={loadStats}
          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['overview', 'subscribers', 'compose'] as ActiveTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'compose' ? '✉️ Compose' : tab === 'subscribers' ? '👥 Subscribers' : '📊 Overview'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={36} />
            </div>
          ) : stats ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                  accent
                  label="Active Subscribers"
                  value={""/* stats.active.toLocaleString() */}
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
                  label="Unsubscribed"
                  value={stats.unsubscribed.toLocaleString()}
                  sub={`${stats.total > 0 ? ((stats.unsubscribed / stats.total) * 100).toFixed(1) : 0}% churn rate`}
                  icon={UserMinus}
                />
              </div>

              {/* Health Banner */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">List Health</h3>
                    <p className="text-gray-500 text-sm mt-0.5">Retention rate of your subscriber base</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-3xl font-black text-emerald-600">
                        {stats.total > 0
                          ? ((stats.active / stats.total) * 100).toFixed(1)
                          : '100'}%
                      </p>
                      <p className="text-xs text-gray-400">Retention</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Active ({stats.active.toLocaleString()})</span>
                    <span>Unsubscribed ({stats.unsubscribed.toLocaleString()})</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => setActiveTab('compose')}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Send size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Send Campaign</p>
                      <p className="text-sm text-gray-500">
                        Reach {stats.active.toLocaleString()} active subscribers
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => setActiveTab('subscribers')}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Users size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">View Subscribers</p>
                      <p className="text-sm text-gray-500">Browse, search & export list</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card className="p-16 text-center border-dashed border-2">
              <Mail className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold">No newsletter data yet</p>
              <p className="text-gray-400 text-sm">Stats will appear once people subscribe</p>
            </Card>
          )}
        </div>
      )}

      {/* ── SUBSCRIBERS TAB ── */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or name..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { setSearch(searchInput); setPage(1); }
                }}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setSearch(searchInput); setPage(1); }}
                className="rounded-xl"
              >
                Search
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={exportCSV}
                disabled={!subscribers?.data?.length}
                className="rounded-xl gap-1.5"
              >
                <Download size={15} /> Export CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Promo Code</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <Loader2 className="animate-spin text-emerald-500 mx-auto" size={28} />
                      </td>
                    </tr>
                  ) : !subscribers?.data?.length ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-400">
                        <Users className="mx-auto mb-3 text-gray-200" size={40} />
                        <p className="font-bold">No subscribers found</p>
                        {search && (
                          <button
                            onClick={() => { setSearch(''); setSearchInput(''); }}
                            className="text-emerald-600 text-sm mt-2 hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    subscribers.data.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900">{sub.email}</td>
                        <td className="px-5 py-4 text-gray-500">{sub.firstName || '—'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                            sub.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {sub.status === 'active'
                              ? <CheckCircle size={10} />
                              : <X size={10} />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {sub.promoCode ? (
                            <span className="font-mono text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100">
                              {sub.promoCode}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs">
                          {new Date(sub.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {subscribers && subscribers.total > 20 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, subscribers.total)} of {subscribers.total.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-700 min-w-[60px] text-center">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── COMPOSE TAB ── */}
      {activeTab === 'compose' && (
        <div className="space-y-6">

          {/* Recipient Banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <Users size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-emerald-900 text-sm">
                Sending to {statsLoading ? '...' : (stats?.active?.toLocaleString() ?? 0)} active subscribers
              </p>
              <p className="text-emerald-600 text-xs mt-0.5">
                Unsubscribed users are automatically excluded
              </p>
            </div>
          </div>

          {/* Compose Card */}
          <Card className="p-6 space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 🌾 This week's best farm deals — don't miss out!"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                {subject.length}/80 chars — {subject.length < 40 ? '⚠️ too short' : subject.length > 60 ? '⚠️ may be truncated in some clients' : '✅ good length'}
              </p>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email Body <span className="text-red-500">*</span>
              </label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border border-gray-200 border-b-0 rounded-t-xl bg-gray-50">
                {TOOLBAR_ACTIONS.map(({ cmd, label, style }) => (
                  <button
                    key={cmd}
                    type="button"
                    onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                    className={`px-3 py-1.5 text-sm rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all border border-transparent hover:border-gray-200 ${style}`}
                  >
                    {label}
                  </button>
                ))}
                <div className="w-px bg-gray-200 mx-1" />
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); execCmd('createLink'); }}
                  className="px-3 py-1.5 text-sm rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all border border-transparent hover:border-gray-200"
                >
                  🔗 Link
                </button>
              </div>

              {/* Content Editable */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[280px] border border-gray-200 rounded-b-xl p-4 text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                style={{ whiteSpace: 'pre-wrap' }}
                data-placeholder="Write your newsletter content here…

Tips for great farm newsletters:
• Share weekly price updates for key commodities
• Spotlight a verified seller or success story
• Include an agri-tip or seasonal growing advice
• Add a clear call-to-action button"
              />

              <style>{`
                [contenteditable]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  pointer-events: none;
                  white-space: pre-line;
                }
              `}</style>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-2">
                <Sparkles size={14} /> Writing Tips
              </p>
              <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                <li>Keep emails under 300 words — open rates drop with long emails</li>
                <li>Start with the most valuable info in the first 2 lines</li>
                <li>Include one clear CTA (e.g. "Shop this week's deals →")</li>
                <li>Emojis in the subject line increase open rates by 15–25%</li>
              </ul>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Eye size={16} /> Preview email
            </button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={() => { setSubject(''); if (editorRef.current) editorRef.current.innerHTML = ''; }}
                className="rounded-xl"
              >
                Clear
              </Button>
              <Button
                onClick={handleSendBlast}
                isLoading={sending}
                disabled={sending || !subject.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 flex-1 sm:flex-none"
              >
                <Send size={16} />
                {sending ? 'Sending...' : `Send to ${stats?.active?.toLocaleString() ?? '?'} subscribers`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW MODAL ── */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Email Preview</h3>
                <p className="text-xs text-gray-400 mt-0.5">How it looks in a subscriber's inbox</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              {/* Simulated email client */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-lg mx-auto">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 p-8 text-white text-center">
                  <div className="text-3xl mb-2">🌾</div>
                  <h1 className="text-xl font-black">Bleefy Weekly</h1>
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Subject</p>
                    <p className="font-bold text-gray-900">{subject || '(no subject yet)'}</p>
                  </div>
                  <hr className="my-4 border-gray-100" />
                  <div
                    className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editorRef.current?.innerHTML || '<p class="text-gray-400 italic">No body content yet...</p>'
                    }}
                  />
                  <hr className="mt-8 mb-4 border-gray-100" />
                  <p className="text-xs text-gray-400 text-center">
                    © {new Date().getFullYear()} Bleefy Marketplace · Nigeria
                    <br />
                    <span className="underline">Unsubscribe</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setPreviewOpen(false)} variant="ghost" size="sm" className="rounded-xl">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}