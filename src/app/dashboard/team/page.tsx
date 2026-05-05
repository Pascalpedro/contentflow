import { Users, Mail, Shield, MoreHorizontal } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Pascal Attama', email: 'Attamapascalpedro@gmail.com', avatar: 'PA', role: 'Admin', status: 'active', joined: '2026-01-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya@acmecorp.io', avatar: 'PS', role: 'Editor', status: 'active', joined: '2026-02-03' },
  { id: 3, name: 'Tom Walker', email: 'tom@acmecorp.io', avatar: 'TW', role: 'Viewer', status: 'invited', joined: '2026-04-28' },
];

const ROLE_STYLE: Record<string, string> = {
  Admin: 'text-violet-700 bg-violet-50 border border-violet-100',
  Editor: 'text-blue-700 bg-blue-50 border border-blue-100',
  Viewer: 'text-slate-600 bg-slate-50 border border-slate-200',
};

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team</h2>
          <p className="text-sm text-gray-500 mt-1">Manage access for your organization</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
          <Mail size={15} /> Invite Member
        </button>
      </div>

      {/* Plan note */}
      <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4">
        <Shield size={18} className="text-violet-500 shrink-0" />
        <p className="text-sm text-violet-800">
          Your <strong>Pro plan</strong> supports up to <strong>5 team members</strong>.{' '}
          <span className="underline underline-offset-2 cursor-pointer hover:no-underline">Upgrade to Enterprise</span> for unlimited seats.
        </p>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_180px_100px_100px_44px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
          {['Member', 'Email', 'Role', 'Status', ''].map(h => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {TEAM_MEMBERS.map(member => (
            <div key={member.id} className="flex sm:grid sm:grid-cols-[1fr_180px_100px_100px_44px] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-700 text-xs font-bold border border-violet-100 shrink-0">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-400 sm:hidden">{member.email}</p>
                </div>
              </div>
              <span className="hidden sm:block text-sm text-gray-500 truncate">{member.email}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start sm:self-auto w-fit ${ROLE_STYLE[member.role]}`}>
                {member.role}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start sm:self-auto w-fit ${
                member.status === 'active' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
              }`}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </span>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
