'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Bell, Settings, PenTool, Menu, X, Plus,
  LayoutDashboard, FileText, MessageSquare, BarChart2,
  Users, CreditCard, UserPlus, HelpCircle, LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV = [
  { label: 'Dashboard', href: '/dashboard',           icon: LayoutDashboard },
  { label: 'Orders',    href: '/dashboard/orders',    icon: FileText },
  { label: 'Messages',  href: '/dashboard/messages',  icon: MessageSquare },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { label: 'Team',      href: '/dashboard/team',      icon: Users },
  { label: 'Billing',   href: '/dashboard/billing',   icon: CreditCard },
  { label: 'Settings',  href: '/dashboard/settings',  icon: Settings },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 h-14 flex items-center justify-between gap-4 shadow-sm">

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          <Menu size={19} />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-200 group">
            <Search size={14} className="text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
            <span className="text-[13px] text-slate-400 flex-1 select-none">Search orders, writers…</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-400">⌘ 1</kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-all">
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
          </button>

          <Link
            href="/dashboard/orders/new"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              boxShadow: '0 2px 8px rgba(15,118,110,0.35)',
            }}
          >
            <Plus size={14} />
            New Order
          </Link>

          <Link
            href="/dashboard/settings"
            className="ml-1 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)' }}
          >
            PA
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                  <PenTool size={13} className="text-white" />
                </div>
                <span className="font-bold text-sm text-slate-800">ContentFlow</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-0.5">
              <Link href="/dashboard/orders/new" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 mb-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                <Plus size={14} /> New Order
              </Link>

              {NAV.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(href)
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                  ].join(' ')}>
                  <Icon size={16} className={isActive(href) ? 'text-teal-600' : 'text-slate-400'} />
                  {label}
                </Link>
              ))}
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 w-full text-left">
                <UserPlus size={16} className="text-slate-400" /> Invite Member
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 w-full text-left">
                <HelpCircle size={16} className="text-slate-400" /> Help
              </button>

              <div className="mt-auto border-t border-slate-100 pt-2">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors"
                >
                  <LogOut size={16} className="text-red-500" /> Sign Out
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
