'use client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SellerSetupGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const router = useRouter();

    // If the user is a seller but hasn't created a profile yet
    if (user?.role === 'seller' && !user?.hasCreatedStore) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100 animate-bounce">
                    <Store size={20} />
                </div>
                
                <div className="max-w-md space-y-2">
                    <h2 className="text-xl font-black text-gray-900">Setup your Store</h2>
                    <p className="text-gray-500 font-medium text-sm">
                        You&apos;re almost there! To start listing produce, you need to provide your store details.
                    </p>
                </div>

                <div className="flex flex-col    gap-3">
                    <Button 
                        onClick={() => router.push('/dashboard/seller/settings?tab=store')}
                        className="bg-emerald-600  rounded-2xl font-bold gap-2"
                    >
                        Setup Store  <ArrowRight size={18} />
                    </Button>
                     
                </div>
            </div>
        );
    }

    return <>{children}</>;
};