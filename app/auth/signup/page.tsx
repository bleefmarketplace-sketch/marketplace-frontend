"use client";
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mail, Lock, User, ArrowLeft, Sprout } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Page: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during registration");
      }

      
      const { isVerified, isOnboarded } = data.user;

      if (!isVerified) {
        toast("Click on the link sent to your email to verify your account")
      } else if (!isOnboarded) {
        router.push('/auth/onboarding');
      } else {
        router.push('/dashboard/buyer');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
         <Image
            fill 
           src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80" 
           alt="Field background" 
           className="w-full h-full object-cover opacity-50"
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-gray-900/60 to-gray-900/90"></div>
      </div>

      <button 
        onClick={() => router.push('/')} 
        className="absolute top-8 left-8 z-20 text-white/80 hover:text-white flex items-center gap-2 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20"
      >
          <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-500/30">
              <Sprout size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-300 text-sm">Join thousands of farmers today.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
               <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="John Doe"
                    icon={<User size={18} className="text-gray-500" />}
                    required
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                    className="bg-white/80 border-transparent focus:bg-white transition-all"
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    icon={<Mail size={18} className="text-gray-500" />}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/80 border-transparent focus:bg-white transition-all"
                  />
               </div>

               <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Create a strong password"
                    icon={<Lock size={18} className="text-gray-500" />}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/80 border-transparent focus:bg-white transition-all"
                  />
               </div>

               <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded text-green-500 bg-white/20 border-white/30 focus:ring-green-500 focus:ring-offset-gray-900" required />
                  <label htmlFor="terms" className="text-sm text-gray-300 leading-tight">
                    I agree to the <a href="#" className="text-green-400 hover:underline">Terms of Service</a> and <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>.
                  </label>
               </div>

            <Button fullWidth size="lg" type="submit" disabled={loading} className="shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-500 border-none">
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account? {' '}
            <Link href="/auth/login" className="font-bold text-green-400 hover:text-green-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;