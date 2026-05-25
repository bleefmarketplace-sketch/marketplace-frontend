"use client";
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
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
    <div className="py-16 w-full flex items-center justify-center relative bg-zinc-50 text-zinc-900 overflow-hidden font-mono text-xs antialiased">
      
      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-white border border-zinc-200 rounded-none shadow-none p-8 animate-in fade-in duration-300">
          
          <div className="text-center mb-8">
            <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">Create Account</h2>
            <p className="text-zinc-500 font-sans text-xs">Join thousands of farmers today.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-none bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
               <div>
                  <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="John Doe"
                    icon={<User size={16} className="text-zinc-400" />}
                    required
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    icon={<Mail size={16} className="text-zinc-400" />}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
               </div>

               <div>
                  <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Create a strong password"
                    icon={<Lock size={16} className="text-zinc-400" />}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               <div className="flex items-start gap-2.5 pt-2">
                  <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded-none border-zinc-300 focus:ring-green-600 text-green-700 cursor-pointer" required />
                  <label htmlFor="terms" className="text-[11px] font-sans text-zinc-500 leading-tight">
                    I agree to the <a href="#" className="text-green-700 hover:text-green-800 font-bold">Terms of Service</a> and <a href="#" className="text-green-700 hover:text-green-800 font-bold">Privacy Policy</a>.
                  </label>
               </div>

            <Button fullWidth size="lg" type="submit" disabled={loading} className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none">
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500 font-bold uppercase tracking-wide">
            Already have an account? {' '}
            <Link href="/auth/login" className="font-bold text-green-750 hover:text-green-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;