'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Camera } from 'lucide-react';

type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  timezone: string | null;
  plan: string | null;
};

export default function SettingsProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ full_name: '', company: '', timezone: 'America/New_York' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? '');

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name ?? user.user_metadata?.full_name ?? '',
          company: data.company ?? '',
          timezone: data.timezone ?? 'America/New_York',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        company: form.company,
        timezone: form.timezone,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const initials = form.full_name
    ? form.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PA';

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-48">
        <svg className="animate-spin w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-7">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', boxShadow: '0 8px 24px rgba(15,118,110,0.3)' }}
          >
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{form.full_name || 'Your Name'}</p>
          <p className="text-sm text-gray-400">{email}</p>
          <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full">
            {profile?.plan ?? 'Starter'} Plan
          </span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name">
          <input
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            placeholder="Pascal Attama"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
          />
        </Field>
        <Field label="Company">
          <input
            value={form.company}
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            placeholder="Acme Corp"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all"
          />
        </Field>
        <Field label="Timezone">
          <select
            value={form.timezone}
            onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Berlin">Berlin (CET)</option>
            <option value="Africa/Lagos">Lagos (WAT)</option>
          </select>
        </Field>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] disabled:opacity-60 ${
            saved
              ? 'bg-emerald-500 text-white shadow-emerald-200'
              : 'text-white hover:opacity-90 hover:shadow-lg'
          }`}
          style={saved ? {} : { background: 'linear-gradient(135deg, #0f766e, #0d9488)', boxShadow: '0 3px 10px rgba(15,118,110,0.35)' }}
        >
          {saving ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <Save size={15} />
          )}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
