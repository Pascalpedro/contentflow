import { createClient } from '@/lib/supabase/server';
import { MONTHLY_SPEND, STATUS_LABELS, STATUS_COLORS } from '@/lib/mock-data';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Share2, UserPlus, MoreHorizontal, TrendingUp } from 'lucide-react';


/* ─── Inline SVG helpers ─────────────────────────────────── */
function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1;
  const W = 72, H = 28;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line}L${W},${H}L0,${H}Z`;
  const col = up ? '#10b981' : '#f43f5e';
  const id = `g${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-16 h-7" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.25" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaChart() {
  const data = MONTHLY_SPEND;
  const max = Math.max(...data.map(d => d.amount));
  const W = 400, H = 90, pad = { t: 10, r: 8, b: 22, l: 8 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * cW,
    y: pad.t + cH - (d.amount / max) * cH,
  }));
  const smooth = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }).join(' ');
  const area = `${smooth}L${pts[pts.length-1].x},${H}L${pts[0].x},${H}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={smooth} stroke="#0f766e" strokeWidth="2" fill="none" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#0f766e" strokeWidth="2" />
          <text x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="Plus Jakarta Sans, sans-serif">
            {data[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function WorkloadBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* Decorative SVG blob illustration */
function IllustrationBlob() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full opacity-90" fill="none">
      {/* Stack of document pages */}
      <rect x="60" y="40" width="80" height="100" rx="10" fill="#ede9f6" />
      <rect x="55" y="35" width="80" height="100" rx="10" fill="#ddd6fe" />
      <rect x="50" y="30" width="80" height="100" rx="10" fill="#0f766e" opacity="0.85"/>
      {/* Lines */}
      <rect x="62" y="50" width="56" height="5" rx="2.5" fill="white" opacity="0.5"/>
      <rect x="62" y="62" width="40" height="5" rx="2.5" fill="white" opacity="0.35"/>
      <rect x="62" y="74" width="50" height="5" rx="2.5" fill="white" opacity="0.35"/>
      <rect x="62" y="86" width="35" height="5" rx="2.5" fill="white" opacity="0.35"/>
      <rect x="62" y="98" width="48" height="5" rx="2.5" fill="white" opacity="0.35"/>
      {/* Check badge */}
      <circle cx="130" cy="120" r="18" fill="#10b981" />
      <path d="M122 120 l6 6 l10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pencil */}
      <g transform="rotate(-30, 160, 50)">
        <rect x="152" y="30" width="12" height="40" rx="3" fill="#f59e0b"/>
        <polygon points="152,70 164,70 158,82" fill="#e97316"/>
        <rect x="152" y="28" width="12" height="8" rx="2" fill="#6b7280"/>
      </g>
      {/* Floating dots */}
      <circle cx="40" cy="80" r="5" fill="#14b8a6" opacity="0.5"/>
      <circle cx="170" cy="40" r="4" fill="#34d399" opacity="0.5"/>
      <circle cx="35" cy="130" r="3" fill="#fbbf24" opacity="0.4"/>
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: orders }, { data: messages }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const ORDERS   = orders   ?? [];
  const MESSAGES = messages ?? [];

  const active  = ORDERS.filter(o => ['new', 'in_progress'].includes(o.status));
  const overdue = ORDERS.filter(o => o.priority === 'urgent');
  const review  = ORDERS.filter(o => o.status === 'pending_review');
  const done    = ORDERS.filter(o => o.status === 'completed');

  const total       = ORDERS.length || 1;
  const pctActive   = Math.round((active.length  / total) * 100);
  const pctReview   = Math.round((review.length  / total) * 100);
  const pctDone     = Math.round((done.length    / total) * 100);
  const pctArchived = Math.round((ORDERS.filter(o => o.status === 'archived').length / total) * 100);

  const sparkBase = [310, 380, 290, 420, 390, 480, 520];

  return (
    <div className="max-w-[1280px] mx-auto space-y-6 animate-fade-in">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">
            Tracking ongoing content orders and evaluating performance trends
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-teal-50 hover:border-teal-200 transition-all shadow-sm">
            <Share2 size={14} /> Share Report
          </button>
          <Link
            href="/dashboard/orders/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 shadow-md"
          style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)', boxShadow:'0 4px 14px rgba(15,118,110,0.35)' }}
          >
            <UserPlus size={14} /> Add Order
          </Link>
        </div>
      </div>

      {/* ── 4 Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders',   value: active.length, sub: 'Orders in flight',       up: true,  trend: '+12%', spark: sparkBase },
          { label: 'Urgent',          value: overdue.length,sub: 'Need attention',          up: false, trend: '+2',   spark: [120,90,130,100,80,110,95] },
          { label: 'Pending Review',  value: review.length, sub: 'Awaiting your approval',  up: true,  trend: '+20%', spark: [60,80,55,90,70,100,85] },
          { label: 'Completed',       value: done.length,   sub: 'Successfully delivered',  up: true,  trend: '+8%',  spark: [30,45,35,55,50,65,70] },
          // colours used below in card hover
        ].map(c => (
          <div key={c.label} className="stat-card cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{c.label}</span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-4xl font-extrabold text-gray-900 leading-none">{c.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={c.up ? 'text-emerald-600 bg-emerald-50 text-xs font-semibold px-1.5 py-0.5 rounded-lg' : 'text-red-500 bg-red-50 text-xs font-semibold px-1.5 py-0.5 rounded-lg'}>
                    <ArrowUpRight size={10} className="inline -mt-0.5" /> {c.trend}
                  </span>
                  <span className="text-[11px] text-gray-400">{c.sub}</span>
                </div>
              </div>
              <Sparkline values={c.spark} up={c.up} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid: Left (charts) + Right (workload + activity) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">

        {/* Left column */}
        <div className="space-y-5">

          {/* Spend area chart card */}
          <div className="bg-white rounded-2xl border border-[#ede9f6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-bold text-gray-900">Order Spend</h3>
                <p className="text-xs text-gray-400 mt-0.5">Monthly billing trend</p>
              </div>
              <Link href="/dashboard/analytics" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                Full report <ArrowRight size={12} />
              </Link>
            </div>
            <div className="mt-4">
              <AreaChart />
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-[#ede9f6] p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Order Timeline</h3>
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">May 2026</span>
            </div>

            {/* Time ruler */}
            <div className="flex text-[10px] text-gray-400 font-semibold mb-2 pl-28 gap-0">
              {['May 1','May 3','May 5','May 7','May 9','May 11','May 15'].map(d => (
                <div key={d} className="flex-1 text-center">{d}</div>
              ))}
            </div>

            {/* Gantt rows */}
            <div className="space-y-2">
              {ORDERS.filter(o => !['archived','completed'].includes(o.status)).slice(0, 5).map((order, i) => {
                const cols = ['#0f766e','#f59e0b','#10b981','#3b82f6','#f43f5e'];
                const widths = [45, 70, 30, 55, 80];
                const lefts  = [0, 15, 40, 5, 20];
                return (
                  <div key={order.id} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: cols[i % cols.length] }}>
                        {order.avatar || order.content_type?.slice(0,2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 truncate">{order.order_ref}</span>
                    </div>
                    <div className="flex-1 relative h-7 bg-gray-50 rounded-lg overflow-hidden">
                      <div
                        className="absolute top-1 h-5 rounded-md flex items-center px-2 text-[10px] text-white font-semibold whitespace-nowrap overflow-hidden"
                        style={{ left: `${lefts[i]}%`, width: `${widths[i]}%`, background: cols[i % cols.length], opacity: 0.85 }}
                      >
                        {order.content_type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Illustration + welcome */}
          <div className="bg-white rounded-2xl border border-[#ede9f6] p-5 shadow-sm overflow-hidden relative">
            <div className="absolute -right-4 -top-2 w-36 h-36 opacity-100 pointer-events-none">
              <IllustrationBlob />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">Your progress</p>
            <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">
              {done.length} orders<br/>
              <span className="text-teal-600">completed</span> 🎉
            </h3>
            <p className="text-xs text-gray-400 mt-2 max-w-[160px] leading-relaxed">
              You're in the top 15% of active clients this month.
            </p>
            <Link href="/dashboard/analytics"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View analytics <ArrowRight size={12} />
            </Link>
          </div>

          {/* Workload by status */}
          <div className="bg-white rounded-2xl border border-[#ede9f6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Workload by Status</h3>
              <TrendingUp size={15} className="text-gray-300" />
            </div>
            <div className="space-y-4">
              <WorkloadBar label="Active"         pct={pctActive}   color="#0f766e" />
              <WorkloadBar label="Pending Review" pct={pctReview}   color="#f59e0b" />
              <WorkloadBar label="Completed"      pct={pctDone}     color="#10b981" />
              <WorkloadBar label="Archived"       pct={pctArchived} color="#94a3b8" />
            </div>
            {/* Striped mini bar chart (Taskbito style) */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-end gap-1 h-14">
                {MONTHLY_SPEND.map((m, i) => {
                  const h = (m.amount / Math.max(...MONTHLY_SPEND.map(x=>x.amount))) * 100;
                  const isLast = i === MONTHLY_SPEND.length - 1;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg"
                        style={{
                          height: `${h}%`,
                          background: isLast
                            ? 'linear-gradient(180deg, #0f766e, #14b8a6)'
                            : `repeating-linear-gradient(180deg, #99f6e4 0px, #99f6e4 3px, transparent 3px, transparent 6px)`,
                        }}
                      />
                      <span className="text-[9px] text-gray-400 font-medium">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unread messages */}
          <div className="bg-white rounded-2xl border border-[#ede9f6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Messages</h3>
              <Link href="/dashboard/messages" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {MESSAGES.filter((m: {is_own?: boolean; sender_id?: string}) => !m.is_own).slice(0, 3).map((msg: {id: string; sender_name?: string; sender_avatar?: string; content: string; is_read?: boolean}) => (
                <Link key={msg.id} href="/dashboard/messages"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-teal-50/50 transition-colors group">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-teal-700 shrink-0"
                    style={{ background: 'linear-gradient(135deg,#ccfbf1,#99f6e4)' }}>
                    {msg.sender_avatar || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-gray-800 group-hover:text-teal-700 transition-colors truncate">{msg.sender_name || 'Writer'}</span>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 leading-relaxed">{msg.content}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Order List table ── */}
      <div className="bg-white rounded-2xl border border-[#ede9f6] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ede9f6]">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">Order List</h3>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">{ORDERS.length} total</span>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_90px_110px_120px_40px] gap-3 px-5 py-2.5 bg-[#f9f8ff] border-b border-[#ede9f6]">
          {['Order / Writer','Content Type','Words','Priority','Status',''].map(h => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-[#f5f4fb]">
          {ORDERS.slice(0, 6).map(order => {
            const prioColor: Record<string,string> = {
              urgent:'text-red-600 bg-red-50 border-red-100',
              high:'text-orange-600 bg-orange-50 border-orange-100',
              medium:'text-teal-600 bg-teal-50 border-teal-100',
              low:'text-slate-500 bg-slate-50 border-slate-100',
            };
            return (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                className="grid grid-cols-[1fr_120px_90px_110px_120px_40px] gap-3 items-center px-5 py-3.5 hover:bg-teal-50/30 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                    {order.avatar || (order.content_type as string)?.slice(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors truncate">{order.title || order.content_type}</p>
                    <p className="text-[11px] text-gray-400 truncate">{order.order_ref}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-600 truncate hidden md:block">{order.content_type}</span>
                <span className="text-xs text-gray-500 hidden md:block">{((order.word_count as number) || 0).toLocaleString()}</span>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border capitalize w-fit ${prioColor[order.priority as string] || prioColor.medium}`}>
                  {order.priority}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border w-fit ${STATUS_COLORS[(order.status as string) as keyof typeof STATUS_COLORS] || ''}`}>
                  {STATUS_LABELS[(order.status as string) as keyof typeof STATUS_LABELS] || order.status}
                </span>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
