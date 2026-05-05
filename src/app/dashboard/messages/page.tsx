'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, MessageSquare } from 'lucide-react';

type Order = { id: string; order_ref: string; content_type: string; avatar: string | null; title: string | null; };
type Message = { id: string; order_id: string; sender_name: string | null; sender_avatar: string | null; content: string; is_own: boolean; created_at: string; };

export default function MessagesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load orders with messages, and current user
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // Fetch all user's orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_ref, content_type, avatar, title')
        .order('created_at', { ascending: false });

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
        setActiveOrderId(ordersData[0].id);
      }
    };
    load();
  }, []);

  // Load messages for active order + subscribe to realtime
  useEffect(() => {
    if (!activeOrderId) return;
    const supabase = createClient();

    // Initial fetch
    supabase.from('messages')
      .select('*')
      .eq('order_id', activeOrderId)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setMessages(data); });

    // Realtime subscription
    const channel = supabase
      .channel(`messages:${activeOrderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${activeOrderId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeOrderId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeOrderId || !userId) return;
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('messages').insert({
      order_id: activeOrderId,
      sender_id: userId,
      sender_name: user?.user_metadata?.full_name || 'Pascal Attama',
      sender_avatar: 'PA',
      content: input.trim(),
      is_own: true,
      is_read: true,
    });
    setInput('');
    setSending(false);
  };

  const activeOrder = orders.find(o => o.id === activeOrderId);
  const unreadCount = (orderId: string) => messages.filter(m => m.order_id === orderId && !m.is_own).length;

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)]">
      <div className="flex h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Thread list */}
        <aside className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-400 mt-0.5">{orders.length} order thread{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-5 py-10">
                <MessageSquare size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400 text-center">No orders yet. Create an order to start messaging your writer.</p>
              </div>
            ) : orders.map(order => {
              const u = unreadCount(order.id);
              return (
                <button
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                  className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-50 ${activeOrderId === order.id ? 'bg-teal-50' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                        {order.avatar || order.content_type.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${activeOrderId === order.id ? 'text-teal-700' : 'text-gray-900'}`}>
                          {order.title || order.content_type}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{order.order_ref}</p>
                      </div>
                    </div>
                    {u > 0 && (
                      <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{u}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeOrder ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}>
                  {activeOrder.avatar || activeOrder.content_type.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{activeOrder.title || activeOrder.content_type}</p>
                  <p className="text-xs text-gray-400">{activeOrder.order_ref} · Writer thread</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
                    <MessageSquare size={32} />
                    <p className="text-sm text-slate-400">No messages yet. Start the conversation!</p>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                    {!msg.is_own && (
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold mr-2.5 shrink-0 self-end">
                        {msg.sender_avatar || '?'}
                      </div>
                    )}
                    <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.is_own
                      ? 'bg-gray-900 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                      {msg.content}
                      <p className={`text-[10px] mt-1.5 ${msg.is_own ? 'text-white/40' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-teal-300 transition-all">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type your message…"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)' }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm">Select an order thread to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
