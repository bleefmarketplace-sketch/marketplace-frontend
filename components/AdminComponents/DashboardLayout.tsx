"use client";

import React, { useState } from "react";
import { Role } from "../types";
import {
  Home,
  ShoppingBag,
  Wallet,
  Users,
  BookOpen,
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  Bell,
  User as UserIcon,
  LogOut,
  Gavel,
  ShieldAlert,
  DollarSign,
  Heart,
  MessageSquare,
  HelpCircle,
  Banknote,
  Library,
  Star,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "../NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payout' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'You just received a new order for your product.',
    type: 'order',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Payout Processed',
    message: 'Your withdrawal request has been approved.',
    type: 'payout',
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(dummyNotifications);

  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role;

  const getNavItems = (role?: Role): NavItem[] => {
    if (!role) return [];

    switch (role) {
      case "buyer":
        return [
          { key: "home", label: "Home", icon: Home, path: "/dashboard/buyer/marketplace" },
          { key: "orders", label: "Orders", icon: Package, path: "/dashboard/buyer/orders" },
          { key: "wallet", label: "Wallet", icon: Wallet, path: "/dashboard/buyer/wallet" },
          { key: "wishlist", label: "Saved", icon: Heart, path: "/dashboard/buyer/wishlist" },
          { key: "community", label: "Community", icon: Users, path: "/dashboard/buyer/community" },
          { key: "courses", label: "Courses", icon: BookOpen, path: "/dashboard/buyer/courses" },
        ];

      case "seller":
        return [
          { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/seller" },
          { key: "products", label: "Products", icon: ShoppingBag, path: "/dashboard/seller/products" },
          { key: "orders", label: "Orders", icon: Package, path: "/dashboard/seller/orders" },
          { key: "payouts", label: "Payouts", icon: Wallet, path: "/dashboard/seller/payouts" },
          { key: "messages", label: "Messages", icon: MessageSquare, path: "/dashboard/seller/messages" },
          { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/seller/settings" },
        ];

      case "creator":
        return [
          { key: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard/creator' },
          { key: 'content', label: 'Content Vault', icon: Library, path: '/dashboard/creator/inventory' },
          { key: 'my-students', label: 'My Students', icon: Users, path: '/dashboard/creator/audience' },
          { key: "earning", label: 'Earnings', icon: Wallet, path: '/dashboard/creator/wallet' },
          { key: "", label: 'Reviews', icon: Star, path: '/dashboard/creator/reviews' },
          { key: "creator-disputes", label: 'Disputes', icon: Gavel, path: '/dashboard/creator/disputes' },
          { key: "store-profile", label: 'Store Profile', icon: Store, path: '/dashboard/creator/profile' },
        ];

      case "admin":
        return [
          { key: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
          { key: "users", label: "Users", icon: Users, path: "/dashboard/admin/users" },
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/admin/disputes" },
          { key: "moderation", label: "Moderation", icon: ShieldAlert, path: "/dashboard/admin/moderation" },
          { key: "financials", label: "Financials", icon: DollarSign, path: "/dashboard/admin/financials" },
          { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const onNavigate = (view: "profile" | "notifications") => {
    if (!role) return;
    router.push(`/dashboard/${role}/${view}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-30">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-xl font-bold text-gray-900">Bleefy</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={key}
                href={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${active
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer ${pathname.includes("/profile") ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            onClick={() => role && router.push(`/dashboard/${role}/profile`)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <Image
                unoptimized
                width={40}
                height={40}
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                alt="User"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="p-1.5 text-gray-400 hover:text-red-600"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white border-b px-4 py-3 flex justify-between">
        <span className="font-bold">Bleefy</span>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("notifications")}>
            <Bell size={22} />
          </button>

          <div
            className="relative w-8 h-8 rounded-full overflow-hidden"
            onClick={() => onNavigate("profile")}
          >
            <Image
              fill
              unoptimized
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
              alt="User"
            />
          </div>

          <button onClick={() => logout}>
            <LogOut size={20} />
          </button>

          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-20 flex justify-between items-center pb-safe">


            {navItems.slice(0, 4).map(({ key, label, icon: Icon, path }) => {

              const active = isActive(path);
              return (

                <Link
                  key={key}
                  href={path}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-primary-600' : 'text-gray-400'
                    }`}
                >
                  <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}

          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-gray-50 relative">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-18 sticky top-0 z-40 shrink-0 p-3">
          <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-end">
            {/* Mobile Logo (Hidden on Desktop) */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Bleefy</span>
            </div>


            {/* Right Side Actions */}
            <div className="flex items-center justify-end gap-4">



              {/* User Profile */}
              <div className="relative group flex items-center px-3 pl-3 md:pl-6 border-l border-gray-100">

                <div className="hidden md:block text-right cursor-pointer">
                  <p className="text-sm font-bold text-gray-900 leading-none">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] font-black text-green-600   tracking-widest mt-1">
                    {user?.email}
                  </p>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-8 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">

                  <div className="p-4 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Account
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Profile
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};