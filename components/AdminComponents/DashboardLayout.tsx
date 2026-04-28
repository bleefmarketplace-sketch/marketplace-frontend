"use client";

import React, { useState } from "react";
import {
  Home, ShoppingBag, Wallet, Users, BookOpen,
  LayoutDashboard, Package, Settings, Bell, LogOut,
  Gavel, Heart, MessageSquare, Library, Star, Store,
  User, CirclePlus, ShieldCheck, BarChart2, CreditCard,
  TrendingUp, Shield, Layers,
  Mail
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/context/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";

interface LayoutProps { children: React.ReactNode; }
type NavItem = { key: string; label: string; icon: LucideIcon; path: string; };

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const role = user?.role;

  const getNavItems = (role?: UserRole): NavItem[] => {
    if (!role) return [];
    switch (role) {
      case "buyer":
        return [
          // FIX: was /dashboard/buyer/marketplace → correct path is /dashboard/buyer
          { key: "home", label: "Marketplace", icon: Home, path: "/dashboard/buyer" },
          { key: "orders", label: "Orders", icon: Package, path: "/dashboard/buyer/orders" },
          { key: "wallet", label: "Wallet", icon: Wallet, path: "/dashboard/buyer/wallet" },
          // FIX: was /dashboard/buyer/wishlist → page exists in library
          { key: "library", label: "My Library", icon: Library, path: "/dashboard/buyer/library" },
          { key: "vendors", label: "Vendors", icon: Store, path: "/dashboard/buyer/vendors" },
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
          { key: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/creator" },
          { key: "content", label: "Content Vault", icon: Library, path: "/dashboard/creator/inventory" },
          // FIX: was /dashboard/creator/audience → use /dashboard/creator/settings for now
          { key: "settings", label: "Profile & Settings", icon: Settings, path: "/dashboard/creator/settings" },
          // FIX: was /dashboard/creator/wallet → use seller payouts pattern
          { key: "wallet", label: "Earnings", icon: Wallet, path: "/dashboard/seller/payouts" },
          // FIX: was /dashboard/creator/reviews → use disputes as combined hub
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/disputes" },
        ];
      case "admin":
        return [
          { key: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
          { key: "users", label: "Users", icon: Users, path: "/dashboard/admin/users" },
          { key: "verify-sellers", label: "Verify Sellers", icon: ShieldCheck, path: "/dashboard/admin/verification" },
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/admin/disputes" },
          /* { key: "moderation", label: "Moderation", icon: Shield, path: "/dashboard/admin/moderation" }, */
          { key: "payouts", label: "Payouts", icon: CreditCard, path: "/dashboard/admin/payouts" },
          { key: "financials", label: "Financials", icon: TrendingUp, path: "/dashboard/admin/financials" },
          { key: "categories", label: "Categories", icon: CirclePlus, path: "/dashboard/admin/categories" },
          { key: "Newsletter", label: "Newsletter", icon: Mail, path: "/dashboard/admin/newsletter" },
          { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(role);
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full shrink-0 z-30">
        <div className="border-b border-gray-100 flex items-center justify-center h-16 shrink-0">
          <Link href="/">
            <Image src="/logo.png" alt="Bleefy" width={80} height={80} className="object-contain" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon, path }) => (
            <Link key={key} href={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(path)
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Profile Banner */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-full relative bg-gray-200 overflow-hidden shrink-0">
              {user?.userAvatar ? (
                <Image fill unoptimized src={user.userAvatar} className="object-cover" alt="Avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                  <User size={18} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={() => logout()} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 shrink-0 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex md:hidden items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Bleefy" width={60} height={60} className="object-contain" />
            </Link>
          </div>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div className="relative group flex items-center gap-3 md:pl-4 md:border-l border-gray-200 cursor-pointer">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] font-bold text-emerald-600 tracking-widest mt-0.5 capitalize">{user?.role}</p>
              </div>

              <div
                className="w-9 h-9 rounded-full relative bg-gray-200 overflow-hidden shrink-0 border-2 border-gray-200"
                onClick={() => router.push(`/dashboard/${role}/settings`)}
              >
                {user?.userAvatar ? (
                  <Image fill unoptimized src={user.userAvatar} className="object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                    <User size={16} />
                  </div>
                )}
              </div>

              {/* Dropdown */}
              <div className="hidden md:block absolute right-0 top-12 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2">
                  <Link href={`/dashboard/${role}/settings`}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
                    Settings
                  </Link>
                  <button onClick={() => logout()}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl mt-1">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40 flex justify-around items-center">
        {navItems.slice(0, 5).map(({ key, label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <Link key={key} href={path}
              className={`flex flex-col items-center gap-0.5 p-2 min-w-[60px] transition-colors ${
                active ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[9px] font-bold truncate w-full text-center">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
