'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown, Plus, MoreHorizontal, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/mock-data';

type Order = {
  id: string;
  order_ref: string;
  content_type: string;
  status: string;
  priority: string;
  word_count: number;
  created_at: string;
  due_date: string | null;
  title: string | null;
  avatar: string | null;
};

const STATUSES = ['all', 'new', 'in_progress', 'pending_review', 'revision', 'completed', 'archived'] as const;

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'text-red-600 bg-red-50 border-red-100',
  high:   'text-orange-600 bg-orange-50 border-orange-100',
  medium: 'text-teal-600 bg-teal-50 border-teal-100',
  low:    'text-slate-500 bg-slate-50 border-slate-100',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_ref, content_type, status, priority, word_count, created_at, due_date, title, avatar')
        .order(sortBy, { ascending: sortDir === 'asc' });
      if (!error && data) setOrders(data);
      setLoading(false);
    };
    fetch();
  }, [sortBy, sortDir]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !search ||
        o.content_type.toLowerCase().includes(search.toLowerCase()) ||
        o.order_ref.toLowerCase().includes(search.toLowerCase()) ||
        (o.title ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {orders.length} orders</p>
        </div>
        <Link
          href="/dashboard/orders/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', boxShadow: '0 3px 10px rgba(15,118,110,0.35)' }}
        >
          <Plus size={15} /> New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders…"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all ${
                statusFilter === s
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s as keyof typeof STATUS_LABELS] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_90px_100px_110px_40px] gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {[
            { label: 'Order', col: null },
            { label: 'Type', col: null },
            { label: 'Words', col: null },
            { label: 'Priority', col: 'priority' },
            { label: 'Status', col: null },
            { label: '', col: null },
          ].map(({ label, col }) => (
            <button
              key={label}
              onClick={() => col && toggleSort(col as typeof sortBy)}
              className={`text-[10px] font-bold uppercase tracking-wider text-left flex items-center gap-1 ${col ? 'text-slate-500 hover:text-teal-600 cursor-pointer' : 'text-slate-400 cursor-default'}`}
            >
              {label}
              {col && <ArrowUpDown size={10} className="opacity-50" />}
            </button>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <svg className="animate-spin w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No orders found</p>
            <p className="text-xs text-slate-400">
              {orders.length === 0 ? 'Create your first order to get started.' : 'Try adjusting your filters.'}
            </p>
            {orders.length === 0 && (
              <Link href="/dashboard/orders/new"
                className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                + New Order
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(order => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                className="grid grid-cols-[1fr_120px_90px_100px_110px_40px] gap-3 items-center px-5 py-3.5 hover:bg-teal-50/30 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                    {order.avatar || order.content_type.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors truncate">
                      {order.title || order.content_type}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{order.order_ref}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-600 truncate hidden md:block">{order.content_type}</span>
                <span className="text-xs text-slate-500 hidden md:block">{(order.word_count || 0).toLocaleString()}</span>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border capitalize w-fit ${PRIORITY_COLOR[order.priority] || PRIORITY_COLOR.medium}`}>
                  {order.priority}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border w-fit ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                  {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] || order.status}
                </span>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
