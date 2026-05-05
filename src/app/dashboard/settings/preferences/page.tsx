'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

const TONES = ['Professional', 'Conversational', 'Authoritative', 'Playful', 'Bold'];

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState({
    defaultTone: 'Professional',
    defaultWordCount: '1000',
    defaultPriority: 'medium',
    colorTheme: 'system',
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-7">
      <div>
        <h3 className="font-semibold text-gray-900">Content Defaults</h3>
        <p className="text-sm text-gray-400 mt-0.5">These will pre-fill new order forms for faster ordering.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t} onClick={() => setPrefs(p => ({ ...p, defaultTone: t }))}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  prefs.defaultTone === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default Word Count</label>
          <select value={prefs.defaultWordCount} onChange={e => setPrefs(p => ({ ...p, defaultWordCount: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-gray-50 text-gray-700">
            {['500', '800', '1000', '1500', '2000', '3000'].map(w => (
              <option key={w} value={w}>{parseInt(w).toLocaleString()} words</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default Priority</label>
          <select value={prefs.defaultPriority} onChange={e => setPrefs(p => ({ ...p, defaultPriority: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-gray-50 text-gray-700">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color Theme</label>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button key={t} onClick={() => setPrefs(p => ({ ...p, colorTheme: t }))}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  prefs.colorTheme === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button onClick={save}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-gray-900 hover:bg-black text-white shadow-gray-200'
          }`}>
          <Save size={15} /> {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
