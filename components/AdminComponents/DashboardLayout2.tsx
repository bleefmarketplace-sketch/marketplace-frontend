"use client";

import React, { useState } from "react";
import {
  Home,
  ShoppingBag,
  Wallet,
  Users,
  BookOpen,
  LayoutDashboard,
  Package,
  Settings,
  Bell,
  LogOut,
  Gavel,
  Heart,
  MessageSquare,
  Library,
  Star,
  Store,
  User,
  CirclePlus,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

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
          { key: "home", label: "Home", icon: Home, path: "/dashboard/buyer/marketplace" },
          { key: "orders", label: "Orders", icon: Package, path: "/account/orders" },
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
          { key: "reviews", label: 'Reviews', icon: Star, path: '/dashboard/creator/reviews' }, // Fixed empty key
          { key: "creator-disputes", label: 'Disputes', icon: Gavel, path: '/dashboard/creator/disputes' },
          { key: "store-profile", label: 'Store Profile', icon: Store, path: '/dashboard/creator/profile' },
        ];
      case "admin":
        return [
          { key: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
          { key: "users", label: "Users", icon: Users, path: "/dashboard/admin/users" },
          { key: "verify-sellers", label: "Verify Sellers", icon: ShieldCheck, path: "/dashboard/admin/verification" },
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/admin/disputes" },
          { key: "categories", label: "Categories", icon: CirclePlus, path: "/dashboard/admin/categories" },
          { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(role);
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    // 1. Fixed Root Layout: Strict screen height, hides body scrollbars
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      
      {/* 2. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full shrink-0 z-30">
        <div className="border-b border-gray-100 flex items-center justify-center h-16 shrink-0 relative">
          <Image src="/logo.png" alt="logo" width={80} height={80} className="object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon, path }) => (
            <Link
              key={key}
              href={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Profile Banner */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full relative bg-gray-200 overflow-hidden shrink-0">
              {user?.userAvatar ? (
                <Image fill unoptimized src={user?.userAvatar} className="object-cover" alt="Avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={() => logout()} className="p-1.5 text-gray-400 hover:text-red-600">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Unified Top Header (Mobile & Desktop) */}
        <header className="bg-white border-b border-gray-200 h-16 shrink-0 flex items-center justify-between px-4 md:px-8 z-20">
          
          {/* Mobile Left: Logo */}
          <div className="flex md:hidden items-center gap-2">
            
            <Image src="/logo.png" alt="logo" width={70} height={70} className="object-contain md:hidden" />
          </div>

          {/* Desktop Left: Blank space to push right elements to edge */}
          <div className="hidden md:block"></div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => router.push(`/dashboard/${role}/notifications`)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={20} />
              {/* Optional: Add a red dot here if unread notifications exist */}
            </button>

            {/* User Profile Container */}
            <div className="relative group flex items-center gap-3 md:pl-4 md:border-l border-gray-200 cursor-pointer">
              
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] font-black text-green-600 tracking-widest mt-1 truncate max-w-[120px]">
                  {user?.email}
                </p>
              </div>

              {/* Fixed: Mobile profile image width/height applied */}
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full relative bg-gray-200 overflow-hidden shrink-0 border border-gray-200"
                onClick={() => router.push(`/dashboard/${role}/profile`)}
              >
                {user?.userAvatar ? (
                  <Image fill unoptimized src={user?.userAvatar} className="object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <User size={18} />
                  </div>
                )}
              </div>

              {/* Desktop Dropdown (Hidden on Mobile) */}
              <div className="hidden md:block absolute right-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2">
                  <Link href={`/dashboard/${role}/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    Profile Settings
                  </Link>
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg mt-1">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 4. Scrollable Content Viewport */}
        {/* Note: pb-24 adds padding at the bottom on mobile so content isn't hidden behind the bottom tab bar */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </div>

      </main>

      {/* 5. Mobile Bottom Navigation (Isolated properly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 flex justify-between items-center pb-safe">
        {navItems.slice(0, 4).map(({ key, label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={key}
              href={path}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${
                active ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      
    </div>
  );
};