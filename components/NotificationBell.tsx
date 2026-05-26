'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Package, Banknote, AlertTriangle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payout' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const NotificationBell = () => {
  const fetcher = useApi();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const loadNotifications = async () => {
    try {
      const res = await fetcher('/api/notifications');
      const data: NotificationItem[] = res.data.data ?? [];

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to sync alerts registry:", error);
      // Suppress rate limit crashes gracefully without clearing active count
    }
  };

  useEffect(() => {
    // 1. Initial load on mounting
    loadNotifications();

    // 2. High-performance, low-frequency polling (every 3 minutes)
    // Only fires if the tab is active/visible, preventing token-refresh loops & rate limit logouts across multiple open tabs
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    }, 180000);

    // 3. Tab focus restoration listener (fetch fresh alerts when tab gains active focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sync on manual dropdown click to guarantee instant data freshness
  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      loadNotifications();
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markRead = async (id: string, link?: string) => {
    try {
      await fetcher(`/api/notifications/${id}`, { method: 'PATCH' });
      setIsOpen(false);
      await loadNotifications();
      if (link) router.push(link);
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  };

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      
      {/* 🔔 Flat Tactical Trigger Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 h-9 w-9 border flex items-center justify-center transition-colors cursor-pointer select-none rounded-none outline-none ${
          isOpen 
            ? 'bg-zinc-100 border-zinc-350 text-zinc-950' 
            : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:border-zinc-300'
        }`}
      >
        <Bell size={16} />

        {/* Flat Rectangular Counter Badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute 
              -top-1.5 
              -right-1.5 
              min-w-[18px] 
              h-4.5 
              px-1 
              bg-zinc-950 
              text-white 
              text-[8px] 
              font-mono 
              font-black 
              rounded-none 
              flex 
              items-center 
              justify-center 
              border 
              border-zinc-950
              animate-pulse
            "
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 🔽 B2B Tactical Dropdown Board */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-zinc-250 rounded-none shadow-none z-50 overflow-hidden animate-in fade-in duration-150 select-none">
          
          {/* Header Bar */}
          <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-250 flex items-center justify-between font-mono">
            <h3 className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest">
              ALERTS & TELEMETRY REGISTRY
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-green-50 border border-green-200 text-green-800 uppercase tracking-wider">
                {unreadCount} UNREAD
              </span>
            )}
          </div>

          {/* Content Queue */}
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-zinc-200">
            {notifications.length === 0 ? (
              <div className="p-8 text-center select-none font-mono my-8">
                <div className="mx-auto w-12 h-12 border border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50 mb-3 rounded-none">
                  <Bell className="text-zinc-350" size={16} />
                </div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">No active alerts in queue</p>
                <p className="text-zinc-400 text-[9px] mt-1 uppercase">Platform is running standard sync cycles</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id, n.link)}
                  className={`
                    flex gap-3 px-4 py-3.5 cursor-pointer
                    hover:bg-zinc-50/50 transition-colors
                    items-start
                    ${!n.isRead ? 'bg-green-50/10 border-l-2 border-l-green-700' : ''}
                  `}
                >
                  {/* Indicator Square Icon */}
                  <div
                    className={`
                      w-8 h-8 rounded-none border flex items-center justify-center shrink-0
                      ${
                        n.type === 'order'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : n.type === 'payout'
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-650'
                      }
                    `}
                  >
                    {n.type === 'order' ? (
                      <Package size={14} />
                    ) : n.type === 'payout' ? (
                      <Banknote size={14} />
                    ) : (
                      <Bell size={12} />
                    )}
                  </div>

                  {/* Text Information Panel */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight leading-tight">
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 bg-green-700 rounded-none mt-1 shrink-0 animate-ping" />
                      )}
                    </div>

                    <p className="text-zinc-500 text-[10px] mt-1 font-sans leading-relaxed">
                      {n.message}
                    </p>

                    <p className="text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-widest mt-2 block">
                      TIMESTAMP: {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};