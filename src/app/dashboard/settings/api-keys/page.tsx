'use client';

import { useState } from 'react';
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';

const MOCK_KEYS = [
  { id: 'k1', name: 'Production', key: 'cf_live_sk_Xt8mPqR2bNvKLd9', created: '2026-03-15', lastUsed: '2026-04-29' },
  { id: 'k2', name: 'Staging', key: 'cf_test_sk_Ym3nWqP5cOvLe7', created: '2026-04-01', lastUsed: '2026-04-28' },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(MOCK_KEYS);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const copy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteKey = (id: string) => setKeys(k => k.filter(key => key.id !== id));

  const createKey = () => {
    if (!newName.trim()) return;
    setKeys(k => [...k, {
      id: `k${Date.now()}`,
      name: newName,
      key: `cf_live_sk_${Math.random().toString(36).slice(2, 16)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    }]);
    setNewName('');
    setCreating(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">API Keys</h3>
            <p className="text-xs text-gray-400 mt-0.5">Use these keys to place orders programmatically</p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all shadow-sm">
            <Plus size={14} /> New Key
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {keys.map(k => (
            <div key={k.id} className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{k.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
                    {showKey === k.id ? k.key : k.key.slice(0, 14) + '••••••••••••'}
                  </code>
                  <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showKey === k.id ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Created {k.created} · Last used {k.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copy(k.key, k.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    copied === k.id ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}>
                  <Copy size={12} /> {copied === k.id ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => deleteKey(k.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Key Dialog */}
      {creating && (
        <div className="bg-white rounded-3xl border border-violet-100 shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Create New API Key</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Key Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Production, Staging, My App"
              onKeyDown={e => e.key === 'Enter' && createKey()}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-gray-50" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCreating(false)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={createKey} disabled={!newName.trim()}
              className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40">
              Create Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
