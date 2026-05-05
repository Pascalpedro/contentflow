import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, FileText, Calendar, Tag,
  MessageSquare, CheckCircle2, Clock, AlertTriangle, User,
} from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/mock-data';

const STATUS_STEPS = ['new', 'in_progress', 'pending_review', 'completed'] as const;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  const stepIndex = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
  const createdDate = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dueDate = order.due_date
    ? new Date(order.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Flexible';

  const priceBase: Record<string, number> = {
    'Blog Post': 95, 'Web Copy': 80, 'Social Media': 40,
    'Email Sequence': 60, 'Case Study': 200, 'Whitepaper': 350,
  };
  const wordMult = (order.word_count || 1000) / 1000;
  const prioMult: Record<string, number> = { low: 1, medium: 1.1, high: 1.25, urgent: 1.5 };
  const estimatedPrice = `$${Math.round((priceBase[order.content_type] || 100) * wordMult * (prioMult[order.priority] || 1))}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Order {order.order_ref}</p>
            <h2 className="text-2xl font-bold">{order.title || order.content_type}</h2>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || 'bg-slate-700 text-white'}`}>
                {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] || order.status}
              </span>
              {order.author && (
                <span className="text-slate-400 text-sm flex items-center gap-1.5">
                  <User size={13} /> {order.author}
                </span>
              )}
              <span className="text-slate-400 text-sm flex items-center gap-1.5">
                <Calendar size={13} /> Due {dueDate}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Estimated</p>
            <p className="text-3xl font-bold mt-1">{estimatedPrice}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-6 flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done
                      ? active
                        ? 'border-teal-400 bg-teal-500 text-white'
                        : 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-700 text-slate-500'
                  }`}>
                    {done && !active ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap hidden sm:block ${done ? 'text-slate-300' : 'text-slate-600'}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all ${i < stepIndex ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Meta */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Brief Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <MetaItem icon={<FileText size={15} />} label="Content Type" value={order.content_type} />
              <MetaItem icon={<Tag size={15} />} label="Word Count" value={`${(order.word_count || 0).toLocaleString()} words`} />
              <MetaItem icon={<Calendar size={15} />} label="Due Date" value={dueDate} />
              <MetaItem icon={<AlertTriangle size={15} />} label="Priority" value={order.priority?.charAt(0).toUpperCase() + order.priority?.slice(1) || 'Medium'} />
              {order.tone && <MetaItem icon={<Tag size={15} />} label="Tone" value={order.tone} />}
              {order.audience && <MetaItem icon={<User size={15} />} label="Audience" value={order.audience} />}
            </div>
          </div>

          {/* Brief */}
          {order.brief && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Brief</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 p-4 rounded-2xl whitespace-pre-wrap">
                {order.brief}
              </p>
            </div>
          )}

          {/* Keywords / Notes */}
          {(order.keywords || order.notes) && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              {order.keywords && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Target Keywords</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 p-3 rounded-xl">{order.keywords}</p>
                </div>
              )}
              {order.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Additional Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 p-3 rounded-xl">{order.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Delivered Content */}
          {order.delivered_content && (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <h3 className="font-semibold text-gray-900">Delivered Content</h3>
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 border border-gray-100 p-4 rounded-2xl whitespace-pre-wrap leading-relaxed font-mono">
                {order.delivered_content}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                  ✓ Approve
                </button>
                <button className="flex-1 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-semibold transition-colors">
                  Request Revision
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2.5">
              <Link href="/dashboard/messages" className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-100 rounded-2xl text-sm font-medium text-gray-700 hover:text-teal-700 transition-all">
                <MessageSquare size={16} className="text-gray-400" />
                Message Writer
              </Link>
              <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 transition-all">
                <Clock size={16} className="text-gray-400" />
                Request Extension
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Order Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold text-gray-900 text-xs">{order.order_ref}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || ''}`}>
                  {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] || order.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="font-semibold text-gray-900">{createdDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due date</span>
                <span className="font-semibold text-gray-900">{dueDate}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Estimated</span>
                <span className="font-bold text-gray-900 text-base">{estimatedPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
