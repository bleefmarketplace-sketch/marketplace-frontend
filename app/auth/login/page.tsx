"use client";
import React, { Suspense, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { VerificationModal } from '@/components/VerificationModal';

const LoginPage = () => {
  const { signIn, isLoading, verify2FA } = useAuth();
  const router = useRouter();
  
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Field-specific validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [showMfaModal, setShowMfaModal] = useState(false);
  const [tempUserId, setTempUserId] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await signIn(email, password, rememberMe);

    if (result?.mfaRequired) {
        setTempUserId(result.userId);
        setShowMfaModal(true);
    }
  };

  const handleMfaVerify = async (code: string) => {
      await verify2FA(tempUserId, code, rememberMe);
  };

  return (
    <Suspense fallback={
      <div className="flex justify-center py-20 bg-zinc-50 font-mono text-xs">
        <Loader2 className="animate-spin text-green-700" />
      </div>
    }>
    <div className="py-16 w-full flex items-center justify-center relative bg-zinc-50 text-zinc-900 overflow-hidden font-mono text-xs">
      
      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-white border border-zinc-200 rounded-none shadow-none p-8 animate-in fade-in duration-300">

          <div className="text-center mb-8">
            <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">Welcome Back</h2>
            <p className="text-zinc-500 font-sans text-xs">Enter your details to access your account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail size={16} className="text-zinc-400" />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`${errors.email ? "ring-1 ring-red-650" : ""}`}
                />
                {errors.email && <p className="text-red-600 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-green-700 hover:text-green-800 font-bold uppercase tracking-wide">Forgot?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} className="text-zinc-400" />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`${errors.password ? "ring-1 ring-red-650" : ""}`}
                />
                {errors.password && <p className="text-red-600 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-none border-zinc-300 focus:ring-green-600 text-green-700 cursor-pointer"
                />
                <label htmlFor="remember-me" className="block text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            <Button 
                fullWidth 
                size="lg" 
                type="submit" 
                isLoading={isLoading} 
                className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500 font-bold uppercase tracking-wide">
            Don&apos;t have an account?{' '}
            <button onClick={() => router.push('/auth/signup')} className="font-bold text-green-750 hover:text-green-800 hover:underline cursor-pointer">
              Create free account
            </button>
          </p>
        </div>
      </div>
        <VerificationModal 
          key={showMfaModal ? 'active' : 'idle'}
          isOpen={showMfaModal}
          onClose={() => setShowMfaModal(false)}
          onVerify={handleMfaVerify}
          title="Account Protected"
          description="Enter the code from your authenticator app to complete sign in."
       />
    </div>
    </Suspense>
  );
};

export default LoginPage;