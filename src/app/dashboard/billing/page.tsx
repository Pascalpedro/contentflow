import { createClient } from '@/lib/supabase/server';
import { CreditCard, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const STATUS_STYLE: Record<string, string> = {
  paid:    'text-emerald-700 bg-emerald-50 border border-emerald-100',
  pending: 'text-amber-700 bg-amber-50 border border-amber-100',
  overdue: 'text-red-700 bg-red-50 border border-red-100',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  paid:    <CheckCircle2 size={14} />,
  pending: <Clock size={14} />,
  overdue: <AlertCircle size={14} />,
};

export default async function BillingPage() {
  const supabase = await createClient();

  const [{ data: invoices }, { data: profile }] = await Promise.all([
    supabase.from('invoices').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('plan').single(),
  ]);

  const allInvoices = invoices ?? [];
  const totalPaid = allInvoices.filter(i => i.status === 'paid').reduce((a, i) => a + Number(i.amount), 0);
  const pending   = allInvoices.filter(i => i.status === 'pending').reduce((a, i) => a + Number(i.amount), 0);
  const plan = profile?.plan ?? 'Starter';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your plan, payment method, and invoices</p>
      </div>

      {/* Plan Card */}
      <div className="rounded-3xl p-6 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 100%)' }}>
        <div className="flex items-start justify-between flex-wrap gap-5">
          <div>
            <p className="text-slate-400 text-sm mb-1">Current Plan</p>
            <h3 className="text-3xl font-bold capitalize">{plan}</h3>
            <p className="text-slate-400 text-sm mt-2">Unlimited orders · Priority support · Dedicated writer pool</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/20">Active</span>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold rounded-xl transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs mb-1">Total Paid</p>
            <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-400">${pending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm">
              <CreditCard size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Visa ending in 4242</p>
              <p className="text-xs text-gray-400">Expires 09/27</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">Change</button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Invoice History</h3>
          <span className="text-xs text-gray-400">{allInvoices.length} invoice{allInvoices.length !== 1 ? 's' : ''}</span>
        </div>

        {allInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-300">
            <Download size={32} />
            <p className="text-sm text-slate-400">No invoices yet. They'll appear here once generated.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {allInvoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <Download size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inv.description || 'Content Order'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {inv.due_date ? ` · Due ${new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 text-sm">${Number(inv.amount).toLocaleString()}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[inv.status] || STATUS_STYLE.pending}`}>
                    {STATUS_ICON[inv.status] || STATUS_ICON.pending}
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                  <button className="text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors">PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
