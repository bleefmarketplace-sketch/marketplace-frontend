
import React from 'react';
import { UserRole, User, AdminTier } from '../types';
import { Button } from './Button';

interface LayoutProps {
  user: User | null;
  activeRole: UserRole;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  currentView: string;
  children: React.ReactNode;
}

const Icons = {
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Market: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
  Orders: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>,
  Wallet: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Groups: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  Learn: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  Admin: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
};

export const Layout: React.FC<LayoutProps> = ({ user, activeRole, onNavigate, onLogout, onSwitchRole, currentView, children }) => {
  const getNavItems = () => {
    switch (activeRole) {
      case UserRole.BUYER:
        return [
          { label: 'Home', icon: <Icons.Home />, view: 'home' },
          { label: 'Market', icon: <Icons.Market />, view: 'market' },
          { label: 'Orders', icon: <Icons.Orders />, view: 'orders' },
          { label: 'Wallet', icon: <Icons.Wallet />, view: 'wallet' },
          { label: 'Community', icon: <Icons.Groups />, view: 'community' },
          { label: 'Learn', icon: <Icons.Learn />, view: 'courses' },
        ];
      case UserRole.SELLER:
        return [
          { label: 'Dashboard', icon: <Icons.Home />, view: 'dashboard' },
          { label: 'Products', icon: <Icons.Market />, view: 'inventory' },
          { label: 'Sales', icon: <Icons.Orders />, view: 'sales' },
          { label: 'Messages', icon: <Icons.Groups />, view: 'messages' },
          { label: 'Earnings', icon: <Icons.Wallet />, view: 'earnings' },
          { label: 'Settings', icon: <Icons.Learn />, view: 'shop_settings' },
        ];
      case UserRole.CREATOR:
        return [
          { label: 'Dashboard', icon: <Icons.Home />, view: 'dashboard' },
          { label: 'Courses', icon: <Icons.Learn />, view: 'my_courses' },
          { label: 'Upload', icon: <Icons.Market />, view: 'upload' },
          { label: 'Students', icon: <Icons.Groups />, view: 'students' },
          { label: 'Wallet', icon: <Icons.Wallet />, view: 'wallet' },
        ];
      case UserRole.ADMIN:
        const baseAdmin = [
          { label: 'Overview', icon: <Icons.Home />, view: 'dashboard' },
          { label: 'Moderation', icon: <Icons.Admin />, view: 'moderation' },
          { label: 'Finance', icon: <Icons.Wallet />, view: 'finance' },
          { label: 'Settings', icon: <Icons.Learn />, view: 'system_settings' },
        ];
        if (user?.adminTier === AdminTier.SUPER_ADMIN) {
          baseAdmin.push({ label: 'System', icon: <Icons.Learn />, view: 'system_settings' });
        }
        return baseAdmin;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Bleefy</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.view 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-2 mb-4">
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{activeRole}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500" onClick={onLogout}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-gray-50">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-20 sticky top-0 z-40 shrink-0">
          <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
            {/* Mobile Logo (Hidden on Desktop) */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Bleefy</span>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder="Search livestock, seeds, machinery..." 
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-6">
              {/* Quick Action Button (Desktop) */}
              <div className="hidden xl:block">
                <Button 
                  size="sm" 
                  className="rounded-xl px-6 bg-green-600 hover:bg-green-700 border-none shadow-lg shadow-green-600/20"
                  onClick={() => {
                    if (activeRole === UserRole.BUYER) onNavigate('market');
                    if (activeRole === UserRole.SELLER) onNavigate('inventory');
                    if (activeRole === UserRole.CREATOR) onNavigate('upload');
                    if (activeRole === UserRole.ADMIN) onNavigate('moderation');
                  }}
                >
                  {activeRole === UserRole.BUYER && 'Browse Market'}
                  {activeRole === UserRole.SELLER && 'Add Product'}
                  {activeRole === UserRole.CREATOR && 'New Course'}
                  {activeRole === UserRole.ADMIN && 'Moderation'}
                </Button>
              </div>

              {/* Wallet Balance (Desktop) */}
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Wallet</p>
                <p className="text-sm font-black text-gray-900">${user?.walletBalance.toLocaleString()}</p>
              </div>

              {/* Notifications */}
              <button 
                className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => onNavigate('notifications')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              {/* User Profile Summary & Role Switcher */}
              <div className="flex items-center space-x-3 pl-2 md:pl-6 border-l border-gray-100 group relative">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{activeRole}</p>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
                <img 
                  src={user?.avatar} 
                  alt="" 
                  className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm object-cover cursor-pointer"
                />
                
                {/* Role Switcher Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Switch Role</p>
                  {[UserRole.BUYER, UserRole.SELLER, UserRole.CREATOR].map(role => (
                    <button 
                      key={role}
                      onClick={() => onSwitchRole(role)}
                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${activeRole === role ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">Logout</button>
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              currentView === item.view ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
