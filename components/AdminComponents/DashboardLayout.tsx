"use client";

import React, { useState, useEffect } from "react";
import {
  Home, ShoppingBag, Wallet, Users, BookOpen,
  LayoutDashboard, Package, Settings, Bell, LogOut,
  Gavel, Heart, MessageSquare, Library, Star, Store,
  User, CirclePlus, ShieldCheck, BarChart2, CreditCard,
  TrendingUp, TrendingDown, Shield, Layers, Globe,
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

const SEED_TICKERS = [
  { symbol: "ZW1!", name: "CBOT Wheat Futures", price: 6.42, change: 1.42, volume: "124K" },
  { symbol: "ZC1!", name: "CBOT Corn Futures", price: 4.85, change: -0.21, volume: "189K" },
  { symbol: "ZS1!", name: "CBOT Soybean Futures", price: 12.15, change: 0.83, volume: "94K" },
  { symbol: "CT1!", name: "ICE Cotton Futures", price: 0.81, change: -1.12, volume: "42K" },
  { symbol: "NPK", name: "Premium NPK Complex (Spot)", price: 390.00, change: -1.27, volume: "18.5K t" },
  { symbol: "KCO1!", name: "ICE Coffee Futures", price: 2.18, change: 2.51, volume: "71K" },
  { symbol: "NGA-MAZ", name: "Nigeria Maize Spot (NGN)", price: 820.00, change: 1.85, volume: "15K t" },
  { symbol: "NGA-COCOA", name: "Nigeria Cocoa Spot (USD)", price: 9200.00, change: 3.42, volume: "8.2K t" }
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role;
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % SEED_TICKERS.length);
    }, 4000);
    return () => clearInterval(interval);
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
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 font-sans flex flex-col overflow-hidden antialiased select-none">
      
      {/* Real-time Commodity Ticker Banner */}
      <div id="ticker-banner" className="bg-zinc-50 border-b border-zinc-200 px-4 py-1.5 flex items-center justify-between text-[10px] tracking-wider font-mono shrink-0 select-none">
        <div className="flex items-center space-x-2 text-zinc-500 font-bold shrink-0">
          <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-none animate-pulse"></span>
          <span>BLEEFY AGRITERMINAL LIVE FEED</span>
        </div>
        
        {/* Sliding Ticker Items */}
        <div className="flex overflow-hidden w-2/3 relative h-5 items-center text-zinc-800 shrink-0">
          <div 
            className="flex space-x-8 absolute transition-transform duration-1000 ease-in-out whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset * 8}%)` }}
          >
            {SEED_TICKERS.map((ticker, idx) => (
              <div key={idx} className="inline-flex space-x-2 items-center text-[10px]">
                <span className="text-zinc-400 font-sans tracking-normal">{ticker.symbol}</span>
                <span className="font-bold text-zinc-950">{ticker.name}</span>
                <span className="text-zinc-600">${ticker.price.toLocaleString()}</span>
                <span className={`inline-flex items-center ${ticker.change >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}`}>
                  {ticker.change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {ticker.change >= 0 ? "+" : ""}{ticker.change.toFixed(2)}%
                </span>
                <span className="text-zinc-400 font-sans text-[9px] uppercase">Vol: {ticker.volume}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4 text-zinc-400 shrink-0">
          <span>UTC {new Date().toISOString().substring(11, 19)}</span>
          <span className="text-green-600 inline-flex items-center font-bold">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-none mr-1.5"></span> TERMINAL ACTIVE
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 h-full shrink-0 font-mono text-xs z-30 p-4 justify-between select-none">
          <div className="space-y-6">
            <div className="p-3 bg-zinc-50 border border-zinc-200 text-center shrink-0">
              <span className="text-[10px] text-zinc-400 block tracking-widest uppercase font-bold">TERMINAL REGISTRY</span>
              <span className="text-[11px] font-black uppercase text-zinc-950 block mt-1">
                {role === "seller" ? "Seller Command" : role === "creator" ? "Creator Studio" : role === "admin" ? "Admin Overlay" : "Buyer Index"}
              </span>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(({ key, label, icon: Icon, path }) => {
                const active = isActive(path);
                return (
                  <Link key={key} href={path}
                    className={`w-full uppercase font-bold tracking-tight py-2.5 px-3 flex items-center space-x-2.5 transition-all duration-155 border rounded-none cursor-pointer ${
                      active
                        ? "border-green-600 bg-green-50 text-green-800 font-extrabold"
                        : "border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-green-700" : "text-zinc-400"}`} />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Profile Status Panel */}
          <div className="border-t border-zinc-100 bg-zinc-50/50 p-3 space-y-2 mt-8 font-sans text-[10px] text-zinc-500 shrink-0">
            <div className="flex justify-between font-mono text-[9px] font-bold tracking-wider">
              <span>DECENTRA PORT:</span>
              <span className="text-green-700 font-bold">● ACTIVE</span>
            </div>
            <div className="truncate text-zinc-400 font-mono font-bold text-[9px]">
              Linked: <span className="text-zinc-800">{user?.email || user?.fullName?.toUpperCase() || "ANONYMOUS"}</span>
            </div>
            <button 
              onClick={() => logout()} 
              className="w-full text-center py-2 border border-zinc-200 hover:bg-red-50 hover:text-red-600 font-mono text-[9px] uppercase tracking-wide font-black transition-colors rounded-none cursor-pointer"
            >
              Terminal Disconnect
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full relative min-w-0">

          {/* Top Header */}
          <header className="bg-white border-b border-zinc-200 h-16 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 shadow-xs">
            <div className="flex md:hidden items-center">
              <Link href="/">
                <Image src="/logo.png" alt="Bleefy" width={60} height={60} className="object-contain animate-pulse" />
              </Link>
            </div>

            {/* Custom Role Selector Switcher inside Header */}
            {user?.role !== "admin" && (user?.hasCreatedStore || user?.hasCreatedCreatorProfile) ? (
              <div className="hidden lg:flex items-center border border-zinc-300 p-1 bg-zinc-50 font-mono text-xs">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 font-bold">PORT MODE:</span>
                <select
                  id="role-switcher-header"
                  value={role}
                  onChange={(e) => {
                    const targetRole = e.target.value as any;
                    switchRole(targetRole);
                  }}
                  className="bg-white border border-zinc-200 text-[11px] font-mono font-bold text-zinc-950 px-2.5 py-1 focus:outline-none focus:border-green-600 rounded-none w-40 cursor-pointer"
                >
                  <option value="buyer">BUYER INDEX</option>
                  {user?.hasCreatedStore && <option value="seller">SELLER COMMAND</option>}
                  {user?.hasCreatedCreatorProfile && <option value="creator">CREATOR STUDIO</option>}
                </select>
              </div>
            ) : (
              <div className="hidden md:block" />
            )}

            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="relative group flex items-center gap-3 md:pl-4 md:border-l border-zinc-200 cursor-pointer py-2">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-mono font-bold text-zinc-950 leading-none">{user?.fullName}</p>
                  <p className="text-[9px] font-mono font-black text-green-700 tracking-wider mt-0.5 uppercase">{user?.role}</p>
                </div>

                <div
                  className="w-9 h-9 rounded-none relative bg-zinc-100 overflow-hidden shrink-0 border border-zinc-300"
                  onClick={() => router.push(`/dashboard/${role}/settings`)}
                >
                  {user?.userAvatar ? (
                    <Image fill unoptimized src={user.userAvatar} className="object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-600">
                      <User size={16} />
                    </div>
                  )}
                </div>

                {/* Dropdown Menu - Boxy aesthetic */}
                <div className="hidden md:block absolute right-0 top-12 mt-1 w-52 bg-white rounded-none shadow-md border border-zinc-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-1 font-mono text-[10px]">
                    <Link href={`/dashboard/${role}/settings`}
                      className="block px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-none uppercase font-bold tracking-tight">
                      Settings Config
                    </Link>

                    {/* Switcher Divider */}
                    {user?.role !== "admin" && (
                      <>
                        <div className="h-px bg-zinc-100 my-1" />
                        <div className="px-3 py-1 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Switch Registry</div>
                        
                        {/* If currently buyer, and has a store, show switch to seller/creator */}
                        {user?.role === "buyer" && (user?.hasCreatedStore || user?.hasCreatedCreatorProfile) && (
                          <>
                            {user?.hasCreatedStore && (
                              <button
                                onClick={() => switchRole("seller")}
                                className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                              >
                                <Store size={12} /> Seller Dashboard
                              </button>
                            )}
                            {user?.hasCreatedCreatorProfile && (
                              <button
                                onClick={() => switchRole("creator")}
                                className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                              >
                                <BookOpen size={12} /> Creator Dashboard
                              </button>
                            )}
                          </>
                        )}

                        {/* If currently buyer, and does NOT have a store, show become merchant */}
                        {user?.role === "buyer" && !user?.hasCreatedStore && !user?.hasCreatedCreatorProfile && (
                          <Link
                            href="/auth/onboarding"
                            className="block px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2"
                          >
                            <CirclePlus size={12} /> Become Merchant
                          </Link>
                        )}

                        {/* If currently seller, show switch to creator/buyer */}
                        {user?.role === "seller" && (
                          <>
                            <button
                              onClick={() => switchRole("creator")}
                              className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                            >
                              <BookOpen size={12} /> Creator Studio
                            </button>
                            <button
                              onClick={() => switchRole("buyer")}
                              className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                            >
                              <Home size={12} /> Buyer Index
                            </button>
                          </>
                        )}

                        {/* If currently creator, show switch to seller/buyer */}
                        {user?.role === "creator" && (
                          <>
                            <button
                              onClick={() => switchRole("seller")}
                              className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                            >
                              <Store size={12} /> Seller Command
                            </button>
                            <button
                              onClick={() => switchRole("buyer")}
                              className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 rounded-none font-bold uppercase flex items-center gap-2 cursor-pointer"
                            >
                              <Home size={12} /> Buyer Index
                            </button>
                          </>
                        )}
                      </>
                    )}

                    <div className="h-px bg-zinc-100 my-1" />
                    <button onClick={() => logout()}
                      className="w-full text-left px-3 py-2 font-bold text-red-600 hover:bg-red-50 rounded-none uppercase cursor-pointer">
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-zinc-50">
            <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-2 py-2 z-40 flex justify-around items-center font-mono text-[9px] uppercase font-bold">
          {navItems.slice(0, 5).map(({ key, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link key={key} href={path}
                className={`flex flex-col items-center gap-0.5 p-1 min-w-[60px] transition-colors ${
                  active ? "text-green-700" : "text-zinc-400"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate w-full text-center">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

