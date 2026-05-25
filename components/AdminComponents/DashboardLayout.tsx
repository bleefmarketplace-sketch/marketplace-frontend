"use client";

import React, { useState, useEffect } from "react";
import {
  Home, ShoppingBag, Wallet, Users, BookOpen,
  LayoutDashboard, Package, Settings, Bell, LogOut,
  Gavel, Heart, MessageSquare, Library, Star, Store,
  User, CirclePlus, ShieldCheck, BarChart2, CreditCard,
  TrendingUp, Shield, Layers, Mail, Globe, Cpu
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
  const { logout, user, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role;

  // Live Telemetry Ticker States
  const [tickerOffset, setTickerOffset] = useState(0);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    setTimeStr(new Date().toISOString().substring(11, 19));
    const clockInterval = setInterval(() => {
      setTimeStr(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const getNavItems = (role?: UserRole): NavItem[] => {
    if (!role) return [];
    switch (role) {
      case "buyer":
        return [
          { key: "home", label: "Marketplace", icon: Home, path: "/dashboard/buyer" },
          { key: "orders", label: "Orders", icon: Package, path: "/dashboard/buyer/orders" },
          { key: "wallet", label: "Wallet", icon: Wallet, path: "/dashboard/buyer/wallet" },
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
          { key: "settings", label: "Profile & Settings", icon: Settings, path: "/dashboard/creator/settings" },
          { key: "wallet", label: "Earnings", icon: Wallet, path: "/dashboard/seller/payouts" },
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/disputes" },
        ];
      case "admin":
        return [
          { key: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
          { key: "users", label: "Users", icon: Users, path: "/dashboard/admin/users" },
          { key: "verify-sellers", label: "Verify Sellers", icon: ShieldCheck, path: "/dashboard/admin/verification" },
          { key: "disputes", label: "Disputes", icon: Gavel, path: "/dashboard/admin/disputes" },
          { key: "moderation", label: "Moderation", icon: Shield, path: "/dashboard/admin/moderation" },
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
    <div className="h-screen w-full bg-zinc-50 flex flex-col overflow-hidden font-mono text-xs text-zinc-900 antialiased">


      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 h-full shrink-0 z-30 font-mono text-xs">
          {/* Logo & Identity */}
          <div className="border-b border-zinc-200 p-4 shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="border border-green-700 bg-green-50 p-1.5 text-green-700 rounded-none shrink-0 flex items-center justify-center">
                  <Image src="/logo.png" alt="Bleefy" width={32} height={32} className="object-contain" />
                </div>
              </Link>
              <div>
                <span className="font-mono font-bold tracking-tight text-sm text-zinc-950 block leading-tight">
                  BLEEFY AGRI<span className="text-green-700 text-[10px] align-super ml-0.5">®</span>
                </span>
                <span className="text-[8px] uppercase tracking-wider text-zinc-400 block mt-0.5">
                  OPERATIONS GRID
                </span>
              </div>
            </div>
          </div>

          {/* Active Registry Indicator */}
          <div className="p-3 bg-zinc-50 border-b border-zinc-200 shrink-0">
            <span className="text-[9px] text-zinc-400 block tracking-widest font-mono font-bold uppercase leading-none">ACTIVE REGISTRY</span>
            <span className="text-xs font-bold uppercase text-green-800 font-mono block mt-1 tracking-wider leading-none">
              {role === "buyer" ? "Buyer Portal" : role === "seller" ? "Seller Command" : role === "creator" ? "Creator Studio" : role === "admin" ? "Admin Overlay" : "GUEST MODE"}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
            {navItems.map(({ key, label, icon: Icon, path }) => (
              <Link key={key} href={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-colors ${isActive(path)
                  ? "border border-green-700 bg-green-50 text-green-800"
                  : "border border-transparent text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Profile Banner */}
          <div className="p-4 border-t border-zinc-200 shrink-0 bg-zinc-50/50">
            <div className="flex items-center gap-3 px-3 py-2 border border-zinc-200 bg-white rounded-none">
              <div className="w-8 h-8 rounded-none border border-zinc-200 relative bg-zinc-50 overflow-hidden shrink-0">
                {user?.userAvatar ? (
                  <Image fill unoptimized src={user.userAvatar} className="object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-700">
                    <User size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-zinc-950 uppercase tracking-wide leading-none">{user?.fullName}</p>
                <p className="text-[9px] text-zinc-500 capitalize font-bold tracking-wider mt-1">{user?.role}</p>
              </div>
              <button onClick={() => logout()} className="p-1.5 text-zinc-400 hover:text-red-650 transition-colors cursor-pointer" title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Telemetry / Connection Logs */}
          <div className="p-3.5 border-t border-zinc-200 shrink-0 bg-zinc-50 font-mono text-[9px] text-zinc-500 space-y-1.5 select-none">
            <div className="flex justify-between items-center leading-none">
              <span>DECENTRA PORT:</span>
              <span className="text-green-700 font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-none bg-green-600 inline-block animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <div className="truncate text-zinc-400 leading-none">
              Linked: <span className="text-zinc-800 font-bold uppercase select-all">{user?.email || "ANONYMOUS_OPERATOR"}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full relative min-w-0 bg-zinc-50">
          {/* Top Header Navbar */}
          <header className="bg-white border-b border-zinc-200 h-16 shrink-0 flex items-center justify-between px-6 z-20">
            {/* Mobile Branding Link */}
            <div className="flex md:hidden items-center">
              <Link href="/">
                <div className="border border-green-700 bg-green-50 p-1 text-green-700 rounded-none shrink-0 flex items-center justify-center">
                  <Image src="/logo.png" alt="Bleefy" width={24} height={24} className="object-contain" />
                </div>
              </Link>
            </div>
            <div className="hidden md:block" />

            {/* Top Navbar Actions */}
            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="relative group flex items-center gap-3 md:pl-4 md:border-l border-zinc-200 cursor-pointer">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-zinc-950 uppercase tracking-wide leading-none">{user?.fullName}</p>
                  <p className="text-[9px] font-bold text-green-700 tracking-widest mt-1 uppercase">{user?.role}</p>
                </div>

                <div
                  className="w-8 h-8 rounded-none border border-zinc-200 relative bg-zinc-50 overflow-hidden shrink-0"
                  onClick={() => router.push(`/dashboard/${role}/settings`)}
                >
                  {user?.userAvatar ? (
                    <Image fill unoptimized src={user.userAvatar} className="object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-700">
                      <User size={14} />
                    </div>
                  )}
                </div>

                {/* Switch View Dynamic Dropdown */}
                <div className="hidden md:block absolute right-0 top-12 mt-1 w-56 bg-white rounded-none border border-zinc-200 shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 font-mono text-xs uppercase font-bold tracking-wider">
                  <div className="p-2">
                    <Link href={`/dashboard/${role}/settings`}
                      className="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 rounded-none border border-transparent">
                      Settings
                    </Link>

                    {/* Switcher Divider */}
                    {user?.role !== "admin" && (
                      <>
                        <div className="h-px bg-zinc-200 my-1" />
                        <div className="px-4 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Switch View</div>

                        {/* Switch triggers */}
                        {user?.role === "buyer" && (user?.hasCreatedStore || user?.hasCreatedCreatorProfile) && (
                          <>
                            <button
                              onClick={() => switchRole("seller")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <Store size={14} /> Seller Dashboard
                            </button>
                            <button
                              onClick={() => switchRole("creator")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <BookOpen size={14} /> Creator Dashboard
                            </button>
                          </>
                        )}

                        {user?.role === "buyer" && !user?.hasCreatedStore && !user?.hasCreatedCreatorProfile && (
                          <Link
                            href="/auth/onboarding"
                            className="block px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 border border-transparent"
                          >
                            <CirclePlus size={14} /> Become a Merchant
                          </Link>
                        )}

                        {user?.role === "seller" && (
                          <>
                            <button
                              onClick={() => switchRole("creator")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <BookOpen size={14} /> Creator Dashboard
                            </button>
                            <button
                              onClick={() => switchRole("buyer")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <Home size={14} /> Buyer Marketplace
                            </button>
                          </>
                        )}

                        {user?.role === "creator" && (
                          <>
                            <button
                              onClick={() => switchRole("seller")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <Store size={14} /> Seller Dashboard
                            </button>
                            <button
                              onClick={() => switchRole("buyer")}
                              className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-green-700 hover:bg-green-50 rounded-none flex items-center gap-2 cursor-pointer border border-transparent"
                            >
                              <Home size={14} /> Buyer Marketplace
                            </button>
                          </>
                        )}
                      </>
                    )}

                    <div className="h-px bg-zinc-205 my-1" />
                    <button onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-red-650 hover:bg-red-50 rounded-none cursor-pointer border border-transparent">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* High-density, reduced-spacing scrollable dashboard view pane */}
          <div className="flex-1 overflow-y-auto bg-zinc-50">
            <div className="w-full p-4 md:p-5 pb-24 md:pb-8">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-2 py-1.5 z-40 flex justify-around items-center">
          {navItems.slice(0, 5).map(({ key, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link key={key} href={path}
                className={`flex flex-col items-center gap-0.5 p-1.5 min-w-[60px] transition-colors ${active ? "text-green-700 font-bold" : "text-zinc-400 hover:text-zinc-950"
                  }`}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider truncate w-full text-center mt-0.5">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
