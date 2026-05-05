'use client';

import { User, Bell, Sliders, Key } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Profile', href: '/dashboard/settings', icon: User },
  { label: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
  { label: 'Preferences', href: '/dashboard/settings/preferences', icon: Sliders },
  { label: 'API Keys', href: '/dashboard/settings/api-keys', icon: Key },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard/settings' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
