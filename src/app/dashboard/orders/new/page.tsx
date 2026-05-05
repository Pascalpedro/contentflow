'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, FileText, AlignLeft, Settings2, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CONTENT_TYPES = [
  { id: 'Blog Post', label: 'Blog Post', desc: 'Long-form articles, guides, and thought leadership', icon: '✍️' },
  { id: 'Web Copy', label: 'Web Copy', desc: 'Landing pages, product pages, and CTAs', icon: '🌐' },
  { id: 'Social Media', label: 'Social Media', desc: 'Twitter threads, LinkedIn posts, captions', icon: '📱' },
  { id: 'Email Sequence', label: 'Email Sequence', desc: 'Newsletters, onboarding, and drip campaigns', icon: '📧' },
  { id: 'Case Study', label: 'Case Study', desc: 'Customer success stories and ROI reports', icon: '📊' },
  { id: 'Whitepaper', label: 'Whitepaper', desc: 'In-depth research reports and industry analysis', icon: '📋' },
];

const TONES = ['Professional', 'Conversational', 'Authoritative', 'Playful', 'Empathetic', 'Bold'];

const STEPS = [
  { label: 'Content Type', icon: FileText },
  { label: 'Brief', icon: AlignLeft },
  { label: 'Preferences', icon: Settings2 },
  { label: 'Review', icon: Eye },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    contentType: '',
    title: '',
    brief: '',
    audience: '',
    tone: 'Professional',
    keywords: '',
    wordCount: '1000',
    dueDate: '',
    priority: 'medium',
    referenceUrls: '',
    notes: '',
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!form.contentType;
    if (step === 1) return !!form.title && !!form.brief;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const orderRef = `#${Math.floor(Math.random() * 900000) + 100000}`;
    const initials = user.user_metadata?.full_name
      ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'PA';

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_ref: orderRef,
        title: form.title,
        content_type: form.contentType,
        brief: form.brief,
        audience: form.audience,
        tone: form.tone,
        keywords: form.keywords,
        word_count: parseInt(form.wordCount),
        due_date: form.dueDate || null,
        priority: form.priority,
        reference_urls: form.referenceUrls,
        notes: form.notes,
        status: 'new',
        avatar: initials,
        author: user.user_metadata?.full_name || 'Pascal Attama',
      })
      .select()
      .single();

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    router.push(`/dashboard/orders/${order.id}`);
  };


  const estimatePrice = () => {
    const base: Record<string, number> = {
      'Blog Post': 95, 'Web Copy': 80, 'Social Media': 40,
      'Email Sequence': 60, 'Case Study': 200, 'Whitepaper': 350,
    };
    const wordMult = parseInt(form.wordCount) / 1000;
    const priorityMult: Record<string, number> = { low: 1, medium: 1.1, high: 1.25, urgent: 1.5 };
    const b = base[form.contentType] || 100;
    return `$${Math.round(b * wordMult * (priorityMult[form.priority] || 1))}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Step Indicator */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 cursor-default">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    done ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                    : active ? 'bg-gray-900 text-white shadow-md shadow-gray-200'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                    {done ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-400' : 'bg-gray-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[380px]">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">What type of content do you need?</h2>
            <p className="text-sm text-gray-500 mb-6">Select one to continue.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={() => update('contentType', ct.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    form.contentType === ct.id
                      ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl leading-none mt-0.5">{ct.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{ct.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ct.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about your content</h2>
              <p className="text-sm text-gray-500">The more detail you provide, the better the output.</p>
            </div>
            <FormField label="Title / Topic *">
              <input value={form.title} onChange={e => update('title', e.target.value)}
                placeholder="e.g. 10 Ways to Reduce Customer Churn in 2026"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50" />
            </FormField>
            <FormField label="Brief / Description *">
              <textarea value={form.brief} onChange={e => update('brief', e.target.value)} rows={4}
                placeholder="Describe what you want written, your goals, key points to cover…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50 resize-none" />
            </FormField>
            <FormField label="Target Audience">
              <input value={form.audience} onChange={e => update('audience', e.target.value)}
                placeholder="e.g. SaaS founders, B2B marketing managers"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50" />
            </FormField>
            <FormField label="Tone of Voice">
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} onClick={() => update('tone', t)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.tone === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Target Keywords">
              <input value={form.keywords} onChange={e => update('keywords', e.target.value)}
                placeholder="e.g. customer churn, SaaS retention, churn rate"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50" />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
              <p className="text-sm text-gray-500">Set your requirements and deadline.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Word Count">
                <select value={form.wordCount} onChange={e => update('wordCount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-gray-50 text-gray-700">
                  {['500', '800', '1000', '1500', '2000', '3000', '5000'].map(w => (
                    <option key={w} value={w}>{parseInt(w).toLocaleString()} words</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Priority">
                <select value={form.priority} onChange={e => update('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-gray-50 text-gray-700">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (+25%)</option>
                  <option value="urgent">Urgent (+50%)</option>
                </select>
              </FormField>
            </div>
            <FormField label="Desired Delivery Date">
              <input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50" />
            </FormField>
            <FormField label="Reference URLs (optional)">
              <textarea value={form.referenceUrls} onChange={e => update('referenceUrls', e.target.value)} rows={2}
                placeholder="https://example.com/article-1&#10;https://example.com/competitor"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50 resize-none" />
            </FormField>
            <FormField label="Additional Notes">
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3}
                placeholder="Any other specific instructions for your writer…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 bg-gray-50 resize-none" />
            </FormField>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Submit</h2>
              <p className="text-sm text-gray-500">Confirm your order details before submitting.</p>
            </div>
            <div className="bg-gradient-to-br from-[#11131a] to-[#1d1f30] rounded-2xl p-5 text-white">
              <div className="grid grid-cols-2 gap-4">
                <ReviewRow label="Content Type" value={form.contentType} />
                <ReviewRow label="Tone" value={form.tone} />
                <ReviewRow label="Word Count" value={`${parseInt(form.wordCount).toLocaleString()} words`} />
                <ReviewRow label="Priority" value={form.priority.charAt(0).toUpperCase() + form.priority.slice(1)} />
                <ReviewRow label="Due Date" value={form.dueDate || 'Flexible'} />
                <ReviewRow label="Estimated Price" value={estimatePrice()} highlight />
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
              <ReviewLine label="Title" value={form.title || '—'} />
              <ReviewLine label="Audience" value={form.audience || '—'} />
              <ReviewLine label="Keywords" value={form.keywords || '—'} />
              {form.brief && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Brief</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{form.brief}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree that this is an estimate. Final pricing may vary based on actual scope.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', boxShadow: '0 3px 10px rgba(15,118,110,0.35)' }}
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <><Check size={16} /> Submit Order</>
            )}
          </button>
        )}
      </div>
      {submitError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium text-center">
          {submitError}
        </div>
      )}
    </div>
  );
}


function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-violet-400 text-lg' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">{label}</span>
      <span className="text-sm text-gray-700 text-right">{value}</span>
    </div>
  );
}
