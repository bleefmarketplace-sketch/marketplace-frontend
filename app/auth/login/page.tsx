"use client";
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mail, Lock, ArrowLeft, Sprout } from 'lucide-react';
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
    } else if (password.length < 6) { // Adjusted to 6 for common standards, or keep at 8
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // The AuthContext's signIn handles:
    // 1. The API call
    // 2. Setting cookies & state
    // 3. Error Toasts
    // 4. Redirecting to Onboarding vs Dashboard
    const result = await signIn(email, password, rememberMe);

     if (result?.mfaRequired) {
        setTempUserId(result.userId);
        setShowMfaModal(true);
    }
  };

  

  const handleMfaVerify = async (code: string) => {
      // Calls the verify2FA context method
      await verify2FA(tempUserId, code, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          fill
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80"
          alt="Farm background"
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/60 to-gray-900/90"></div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 z-20 text-white/80 hover:text-white flex items-center gap-2 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20"
      >
        <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-600/30">
              <Sprout size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300 text-sm">Enter your details to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail size={18} className="text-gray-500" />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`bg-white/90 border-transparent focus:bg-white transition-all text-gray-900 ${errors.email ? "ring-2 ring-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-green-400 hover:text-green-300 font-medium">Forgot Password?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} className="text-gray-500" />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`bg-white/90 border-transparent focus:bg-white transition-all text-gray-900 ${errors.password ? "ring-2 ring-red-500" : ""}`}
                />
                {errors.password && <p className="text-red-400 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-green-500 text-green-600 cursor-pointer"
                />
                <label htmlFor="remember-me" className="block text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            <Button 
                fullWidth 
                size="lg" 
                type="submit" 
                isLoading={isLoading} 
                className="shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <button onClick={() => router.push('/auth/signup')} className="font-bold text-green-400 hover:text-green-300">
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
  );
};

export default LoginPage;