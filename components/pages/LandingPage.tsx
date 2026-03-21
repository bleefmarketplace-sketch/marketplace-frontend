import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, CheckCircle, Sprout, Users, Shield, Menu, X, MousePointer, Search, Star } from 'lucide-react';
import { LandingMarketplace } from './LandingMarketplace';
import { LandingCommunity } from './LandingCommunity';
import { LandingLearning } from './LandingLearning';
import { PendingAction } from '../App';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onAction: (action: PendingAction) => void;
}

type PublicPage = 'home' | 'marketplace' | 'community' | 'learning';

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onAction }) => {
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'community', label: 'Community' },
    { id: 'learning', label: 'Learning' },
  ];

  const handleNavClick = (page: string) => {
    setCurrentPage(page as PublicPage);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const LandingHome = () => (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80" 
            alt="Farm landscape" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
              The #1 Platform for Agriculture
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Cultivating Connections, <br />
              <span className="text-primary-400">Growing Future.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Connect with thousands of farmers, suppliers, and experts. Buy fresh produce, sell your harvest, or learn from the best—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20"
              >
                Join Now <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => handleNavClick('marketplace')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Browse Marketplace
              </button>
            </div>
            
            <div className="mt-12 flex gap-8 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary-400" />
                <span>Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary-400" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary-400" />
                <span>Global Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to thrive</h2>
            <p className="text-lg text-gray-600">Whether you are buying equipment, selling livestock, or teaching the next generation, we have the tools for you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Sprout size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Marketplace</h3>
              <p className="text-gray-600 mb-6">Access a vast catalog of seeds, fertilizers, livestock, and machinery from trusted vendors.</p>
              <button onClick={() => handleNavClick('marketplace')} className="text-primary-600 font-bold hover:underline flex items-center gap-1">Start Buying <ArrowRight size={16}/></button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 mb-6">Join specialized groups, ask questions, and share knowledge with farmers worldwide.</p>
              <button onClick={() => handleNavClick('community')} className="text-primary-600 font-bold hover:underline flex items-center gap-1">Join Groups <ArrowRight size={16}/></button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Trade</h3>
              <p className="text-gray-600 mb-6">Our escrow system ensures that your money is safe until you are satisfied with your order.</p>
              <button onClick={onGetStarted} className="text-primary-600 font-bold hover:underline flex items-center gap-1">Learn More <ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section (NEW) */}
      <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-gray-900 mb-4">How AgriMarket Works</h2>
                 <p className="text-lg text-gray-600">Start trading in three simple steps.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8 relative">
                 {/* Connection Lines (Desktop) */}
                 <div className="hidden md:block absolute top-1/2 left-1/4 w-1/4 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                 <div className="hidden md:block absolute top-1/2 right-1/4 w-1/4 h-0.5 bg-gray-200 -translate-y-1/2"></div>

                 <div className="text-center relative z-10">
                     <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                         <MousePointer className="text-primary-600" size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">1. Join & Explore</h3>
                     <p className="text-gray-600 text-sm px-4">Create your free account and browse products, courses, or community groups tailored to your interests.</p>
                 </div>

                 <div className="text-center relative z-10">
                     <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                         <Search className="text-primary-600" size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">2. Connect & Deal</h3>
                     <p className="text-gray-600 text-sm px-4">Message sellers, negotiate prices, or enroll in expert courses. Our platform makes connection easy.</p>
                 </div>

                 <div className="text-center relative z-10">
                     <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                         <Star className="text-primary-600" size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">3. Grow & Thrive</h3>
                     <p className="text-gray-600 text-sm px-4">Receive your goods securely, leave reviews, and grow your farming business with community support.</p>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold text-gray-900">AgriMarket</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`hover:text-primary-600 transition-colors ${currentPage === link.id ? 'text-primary-600 font-bold' : ''}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex gap-3">
              <Button variant="ghost" onClick={onLogin}>Log In</Button>
              <Button onClick={onGetStarted}>Get Started</Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-lg font-medium ${currentPage === link.id ? 'text-primary-600' : 'text-gray-600'}`}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-gray-100" />
              <Button variant="ghost" fullWidth onClick={onLogin} className="justify-start">Log In</Button>
              <Button fullWidth onClick={onGetStarted}>Get Started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'home' && <LandingHome />}
        {currentPage === 'marketplace' && <LandingMarketplace onGetStarted={onGetStarted} onAction={onAction} />}
        {currentPage === 'community' && <LandingCommunity onGetStarted={onGetStarted} onAction={onAction} />}
        {currentPage === 'learning' && <LandingLearning onGetStarted={onGetStarted} onAction={onAction} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold">AgriMarket</span>
            </div>
            <p className="text-sm">Empowering farmers worldwide with technology and community.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li onClick={() => handleNavClick('marketplace')} className="cursor-pointer hover:text-white">Marketplace</li>
              <li onClick={() => handleNavClick('community')} className="cursor-pointer hover:text-white">Community</li>
              <li onClick={() => handleNavClick('learning')} className="cursor-pointer hover:text-white">Learning</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Legal</h4>
             <ul className="space-y-2 text-sm">
               <li className="hover:text-white cursor-pointer">Privacy Policy</li>
               <li className="hover:text-white cursor-pointer">Terms of Service</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-sm border-t border-gray-800 pt-8">
          <p>&copy; 2024 AgriMarket Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};