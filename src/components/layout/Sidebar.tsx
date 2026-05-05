'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, FileText, MessageSquare, BarChart2,
  Settings, CreditCard, Users, PenTool, Plus,
  UserPlus, HelpCircle, ChevronRight, LogOut,
} from 'lucide-react';

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard',           icon: LayoutDashboard },
  { label: 'Orders',    href: '/dashboard/orders',    icon: FileText },
  { label: 'Messages',  href: '/dashboard/messages',  icon: MessageSquare, badge: 3 },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { label: 'Team',      href: '/dashboard/team',      icon: Users },
];

const PROJECTS = [
  { label: 'Blog Content',    color: '#10b981' },
  { label: 'Web Copy',        color: '#3b82f6' },
  { label: 'Social Media',    color: '#f59e0b' },
  { label: 'Email Campaigns', color: '#f43f5e' },
];

const SUPPORT_NAV = [
  { label: 'Billing',  href: '/dashboard/billing',  icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen sticky top-0 bg-white border-r border-slate-100">

      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)' }}
          >
            <PenTool size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px] text-slate-800 tracking-tight">ContentFlow</span>
        </div>
      </div>

      {/* ── Scrollable nav body ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">

        {/* New Order CTA */}
        <Link
          href="/dashboard/orders/new"
          className="flex items-center justify-center gap-2 mb-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            boxShadow: '0 3px 10px rgba(15,118,110,0.35)',
          }}
        >
          <Plus size={15} />
          New Order
        </Link>

        {/* ─ GENERAL section ─ */}
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          General
        </p>

        {MAIN_NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-200 group',
                active
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-0.5',
              ].join(' ')}
            >
              <Icon
                size={16}
                className={[
                  'shrink-0 transition-all duration-200',
                  active
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-teal-500 group-hover:scale-110',
                ].join(' ')}
              />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold">
                  {badge}
                </span>
              )}
              {active && <ChevronRight size={13} className="text-teal-400" />}
            </Link>
          );
        })}

        {/* ─ PROJECTS section ─ */}
        <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Projects
        </p>

        {PROJECTS.map((p) => (
          <button
            key={p.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 w-full text-left group hover:translate-x-0.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
              style={{
                background: p.color,
                boxShadow: `0 0 5px ${p.color}80`,
              }}
            />
            <span className="flex-1 truncate">{p.label}</span>
          </button>
        ))}

        {/* ─ SUPPORT section ─ */}
        <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Support
        </p>

        {SUPPORT_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-200 group',
                active
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-0.5',
              ].join(' ')}
            >
              <Icon
                size={16}
                className={[
                  'shrink-0 transition-all duration-200',
                  active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500 group-hover:scale-110',
                ].join(' ')}
              />
              {label}
            </Link>
          );
        })}

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 w-full text-left group hover:translate-x-0.5">
          <UserPlus size={16} className="text-slate-400 group-hover:text-teal-500 transition-all duration-200 group-hover:scale-110 shrink-0" />
          Invite Member
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 w-full text-left group hover:translate-x-0.5">
          <HelpCircle size={16} className="text-slate-400 group-hover:text-teal-500 transition-all duration-200 group-hover:scale-110 shrink-0" />
          Help
        </button>
      </div>

      {/* ── User card ── */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-red-50 hover:border-red-100 transition-all duration-200 group"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)' }}
          >
            PA
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-red-700 transition-colors">Pascal Attama</p>
            <p className="text-[10px] text-slate-400 truncate">Attamapascalpedro@gmail.com</p>
          </div>
          <LogOut size={13} className="text-slate-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </aside>
  );
}
