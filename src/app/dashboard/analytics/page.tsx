import { createClient } from '@/lib/supabase/server';
import { MONTHLY_SPEND, STATUS_LABELS } from '@/lib/mock-data';

const TYPE_COLORS = ['bg-teal-500', 'bg-indigo-400', 'bg-amber-400', 'bg-emerald-400', 'bg-pink-400', 'bg-blue-400'];
const STATUSES = ['new', 'in_progress', 'pending_review', 'revision', 'completed', 'archived'] as const;

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('status, content_type, price, created_at');

  const all = orders ?? [];
  const total = all.length;
  const completed = all.filter(o => o.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalSpend = MONTHLY_SPEND.reduce((a, m) => a + m.amount, 0);
  const maxSpend = Math.max(...MONTHLY_SPEND.map(m => m.amount));

  // Content type breakdown from real orders
  const byType = all.reduce<Record<string, number>>((acc, o) => {
    acc[o.content_type] = (acc[o.content_type] || 0) + 1;
    return acc;
  }, {});
  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your content order history</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',     value: total.toString(),           sub: 'All time' },
          { label: 'Completed',        value: completed.toString(),       sub: 'Successfully delivered' },
          { label: 'Completion Rate',  value: `${completionRate}%`,       sub: 'On-time delivery' },
          { label: 'Total Spend',      value: `$${totalSpend.toLocaleString()}`, sub: 'Last 6 months' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <p className="text-3xl font-bold text-gray-900">{k.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Monthly Spend</h3>
          <p className="text-xs text-gray-400 mb-6">Last 6 months</p>
          <div className="flex items-end gap-4 h-44">
            {MONTHLY_SPEND.map((m) => {
              const h = (m.amount / maxSpend) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">${m.amount}</span>
                  <div className="w-full relative rounded-t-xl overflow-hidden bg-teal-50" style={{ height: `${h}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-700 to-teal-400 rounded-t-xl" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Mix */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Content Mix</h3>
          <p className="text-xs text-gray-400 mb-5">By content type</p>
          {typeEntries.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Create orders to see your content mix.</p>
          ) : (
            <div className="space-y-3">
              {typeEntries.map(([type, count], i) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 truncate mr-2">{type}</span>
                    <span className="text-xs font-semibold text-gray-500 shrink-0">{count}/{total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${TYPE_COLORS[i % TYPE_COLORS.length]}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-5">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATUSES.map(s => {
            const count = all.filter(o => o.status === s).length;
            return (
              <div key={s} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{STATUS_LABELS[s]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
