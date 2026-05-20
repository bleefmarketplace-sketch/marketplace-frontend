'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Package, Banknote } from 'lucide-react';
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
      console.error(error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
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
      console.error(error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
      >
        <Bell size={26} className="text-gray-600" />

        {/* Counter Badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute 
              -top-1 
              -right-1 
              min-w-[20px] 
              h-5 
              px-1 
              bg-black 
              text-white 
              text-[10px] 
              font-bold 
              rounded-full 
              flex 
              items-center 
              justify-center 
              border-2 
              border-white
            "
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 🔽 Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-emerald-600 font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              // 🔥 Full height empty state
              <div className="h-[420px] flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  Nothing to show here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id, n.link)}
                  className={`
                    flex gap-4 px-4 py-4 cursor-pointer
                    hover:bg-gray-50 transition
                    border-b last:border-none
                    ${!n.isRead ? 'bg-emerald-50/40' : ''}
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${
                        n.type === 'order'
                          ? 'bg-blue-100 text-blue-600'
                          : n.type === 'payout'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {n.type === 'order' ? (
                      <Package size={18} />
                    ) : n.type === 'payout' ? (
                      <Banknote size={18} />
                    ) : (
                      <Bell size={16} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1 ml-2 shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {n.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleDateString()}
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