"use client"
import React, { useState } from 'react'
import { Button } from './Button'
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore'; // Import your zustand store
import { CartDrawer } from './Marketplace/CartDrawer';
import { useAuth } from '@/context/AuthContext';
// Assuming you have an auth hook. Replace with your actual auth logic.
// import { useAuth } from '@/context/AuthContext'; 

const LandingPagesNav = () => {
  const router = useRouter();
  const pathname = usePathname(); // Use this to detect active page automatically
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {logout, user} =useAuth()

  // Zustand Store logic
  const getItemCount = useCartStore((state) => state.getItemCount());
 
  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'community', label: 'Community' },
    { id: 'learning', label: 'Learning' },
  ];

  const onLogin = () => router.push('/auth/login');
  const onGetStarted = () => router.push('/auth/signup');

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO */}
            <Link className="flex items-center gap-2 cursor-pointer" href='/'>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Bleefy</span>
            </Link>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              {navLinks.map(link => {
                const isActive = pathname.startsWith(`/${link.id}`);
                return (
                  <Link 
                    key={link.id}
                    href={`/${link.id}`} // Fixed: Absolute path starts with /
                    className={`hover:text-emerald-600 transition-colors ${isActive ? 'text-emerald-600 font-bold' : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ACTION AREA */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Shopping Cart Icon (Visible for everyone) */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <ShoppingCart size={22} />
                {getItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                    {getItemCount > 9 ? '9+' : getItemCount}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

              {/* Conditional Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {!user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={onLogin}>Log In</Button>
                    <Button size="sm" onClick={onGetStarted}>Get Started</Button>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link 
                      href={user.role === 'buyer' ? '/account' : '/dashboard'} 
                      className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                      title="Account"
                    >
                      <User size={18} />
                    </Link>
                    <button 
                        onClick={() => logout()} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
                  {mobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-4 py-6 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-5">
              {navLinks.map(link => (
                <Link 
                  key={link.id}
                  href={`/${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium ${pathname.startsWith(`/${link.id}`) ? 'text-emerald-600' : 'text-gray-600'}`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-100" />
              
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Button variant="ghost" fullWidth onClick={onLogin} className="justify-start">Log In</Button>
                  <Button fullWidth onClick={onGetStarted}>Get Started</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={() => {
                        router.push(user.role === 'buyer' ? '/account' : '/dashboard');
                        setMobileMenuOpen(false);
                    }} 
                    className="justify-start gap-2"
                  >
                    <User size={18} /> {user.role === 'buyer' ? 'My Profile' : 'My Dashboard'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                    }} 
                    className="justify-start gap-2 text-red-500"
                  >
                    <LogOut size={18} /> Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default LandingPagesNav