"use client";
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, User, LogOut, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from './Marketplace/CartDrawer';
import { useAuth } from '@/context/AuthContext';

const SEED_TICKERS = [
  { id: "1", symbol: "ZW1!", name: "CBOT Wheat Futures", price: 6.42, change: 1.42, volume: "124K" },
  { id: "2", symbol: "ZC1!", name: "CBOT Corn Futures", price: 4.85, change: -0.21, volume: "189K" },
  { id: "3", symbol: "ZS1!", name: "CBOT Soybean Futures", price: 12.15, change: 0.83, volume: "94K" },
  { id: "4", symbol: "NPK", name: "Premium NPK Complex (Spot)", price: 390.00, change: -1.27, volume: "18.5K t" },
  { id: "5", symbol: "KCO1!", name: "ICE Coffee Futures", price: 2.18, change: 2.51, volume: "71K" }
];

const LandingPagesNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { logout, user } = useAuth();

  // Rotating live commodity ticker bar
  const [tickerOffset, setTickerOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % SEED_TICKERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'community', label: 'Community' },
    { id: 'learning', label: 'Learning' },
  ];

  const onLogin = () => router.push('/auth/login');
  const onGetStarted = () => router.push('/auth/signup');

  return (
    <>
      <div id="navigation-root" className="w-full bg-white text-zinc-900 border-b border-zinc-200 sticky top-0 z-50 shadow-none">

        {/* Real-time Commodity Ticker Banner */}
        <div id="ticker-banner" className="bg-zinc-50 border-b border-zinc-150 px-4 py-1.5 flex items-center justify-between text-[10px] tracking-wider select-none">
          <div className="flex items-center space-x-2 text-zinc-500 font-mono">
            <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-none animate-pulse"></span>
            <span>BLEEFY AGRITERMINAL LIVE FEED</span>
          </div>

          {/* Sliding Ticker Items */}
          <div className="flex overflow-hidden w-2/3 relative h-5 items-center font-mono text-zinc-800">
            <div
              className="flex space-x-8 absolute transition-transform duration-1000 ease-in-out whitespace-nowrap"
              style={{ transform: `translateX(-${tickerOffset * 15}%)` }}
            >
              {SEED_TICKERS.map((ticker) => (
                <div key={ticker.id} className="inline-flex space-x-2 items-center text-[10px]">
                  <span className="text-zinc-400">{ticker.symbol}</span>
                  <span className="font-bold text-zinc-950 uppercase">{ticker.name}</span>
                  <span className="text-zinc-650">${ticker.price.toFixed(2)}</span>
                  <span className={`inline-flex items-center font-bold ${ticker.change >= 0 ? "text-green-650" : "text-red-650"}`}>
                    {ticker.change >= 0 ? "+" : ""}{ticker.change.toFixed(2)}%
                  </span>
                  <span className="text-zinc-400">Vol: {ticker.volume}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 font-mono text-zinc-450">
            <span>UTC {new Date().toISOString().substring(11, 19)}</span>
            <span className="text-green-700 font-bold inline-flex items-center">
              <Globe className="w-3 h-3 mr-1" /> ACTIVE
            </span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link className="flex items-center gap-3 cursor-pointer" href='/'>
              <div className="border border-green-700 bg-green-50 p-1.5 text-green-700 rounded-none shrink-0">
                <Image src="/logo.png" alt="Bleefy" width={38} height={38} className="object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className="font-mono font-bold tracking-tight text-md text-zinc-950 block leading-tight">
                  BLEEFY<span className="text-green-600 text-[10px] align-super ml-0.5 font-bold">®</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-550 block font-mono">
                  AGRICULTURAL PRODUCTS
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex gap-6 text-xs font-mono uppercase font-bold tracking-wider">
              {navLinks.map(link => {
                const isActive = pathname.startsWith(`/${link.id}`);
                return (
                  <Link
                    key={link.id}
                    href={`/${link.id}`}
                    className={`hover:text-green-700 transition-colors border px-3 py-1.5 rounded-none ${isActive
                        ? 'border-green-700 bg-green-50 text-green-800'
                        : 'border-transparent text-zinc-600 hover:bg-zinc-50'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ACTION AREA */}
            <div className="flex items-center gap-2 md:gap-3 font-mono text-xs">

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-zinc-700 hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-350 rounded-none transition-colors cursor-pointer"
              >
                <ShoppingCart size={18} />
                {mounted && getItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-650 text-white text-[8px] font-bold w-4 h-4 rounded-none flex items-center justify-center animate-pulse">
                    {getItemCount}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-zinc-200 mx-1 hidden md:block" />

              {/* Conditional Auth Buttons */}
              <div className="hidden md:flex items-center gap-2.5">
                {!user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={onLogin}>LOG IN</Button>
                    <Button size="sm" onClick={onGetStarted}>GET STARTED</Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href={user.role === 'buyer' ? '/account' : '/dashboard'}
                      className="w-8 h-8 rounded-none border border-green-700 bg-green-50 text-green-800 flex items-center justify-center hover:bg-green-100 transition-colors font-bold uppercase"
                      title="Account Dashboard"
                    >
                      <User size={16} />
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="p-2 text-zinc-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-none transition-all cursor-pointer"
                      title="Log Out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-zinc-700 border border-zinc-200 rounded-none hover:bg-zinc-50 cursor-pointer"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-zinc-200 absolute w-full px-4 py-6 shadow-none font-mono text-xs uppercase font-bold tracking-wider z-[100] animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.id}
                  href={`/${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 border border-transparent rounded-none ${pathname.startsWith(`/${link.id}`)
                      ? 'border-green-700 bg-green-50 text-green-850'
                      : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-zinc-200" />

              {!user ? (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" fullWidth onClick={() => { onLogin(); setMobileMenuOpen(false); }}>LOG IN</Button>
                  <Button fullWidth onClick={() => { onGetStarted(); setMobileMenuOpen(false); }}>GET STARTED</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      router.push(user.role === 'buyer' ? '/account' : '/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start gap-2"
                  >
                    <User size={16} /> {user.role === 'buyer' ? 'MY ACCOUNT' : 'MY DASHBOARD'}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start gap-2 text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} /> LOG OUT
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default LandingPagesNav;