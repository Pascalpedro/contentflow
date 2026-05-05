'use client';

import { useState } from 'react';

const NOTIF_GROUPS = [
  {
    title: 'Order Updates',
    items: [
      { id: 'order_new', label: 'Order accepted by writer', desc: 'When a writer picks up your order' },
      { id: 'order_progress', label: 'Order in progress', desc: 'When a writer starts writing' },
      { id: 'order_delivered', label: 'Content delivered', desc: 'When your content is ready for review' },
      { id: 'order_revision', label: 'Revision requested', desc: 'Status updates on revision requests' },
    ],
  },
  {
    title: 'Messages',
    items: [
      { id: 'msg_received', label: 'New message from writer', desc: 'When a writer sends you a message' },
      { id: 'msg_digest', label: 'Daily message digest', desc: 'A daily summary of all messages' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { id: 'bill_invoice', label: 'New invoice', desc: 'When a new invoice is generated' },
      { id: 'bill_overdue', label: 'Payment overdue', desc: 'If a payment becomes overdue' },
    ],
  },
];

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    order_new: true, order_progress: true, order_delivered: true,
    order_revision: false, msg_received: true, msg_digest: false,
    bill_invoice: true, bill_overdue: true,
  });

  const toggle = (id: string) => setEnabled(e => ({ ...e, [id]: !e[id] }));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
      {NOTIF_GROUPS.map(group => (
        <div key={group.title} className="p-6 sm:p-8 space-y-5">
          <h3 className="font-semibold text-gray-900">{group.title}</h3>
          <div className="space-y-4">
            {group.items.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${enabled[item.id] ? 'bg-violet-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${enabled[item.id] ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
