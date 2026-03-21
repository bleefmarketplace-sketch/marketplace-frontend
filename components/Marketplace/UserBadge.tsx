import { Award, Crown, CheckCircle2 } from 'lucide-react';

export const UserBadge = ({ volume }: { volume: number }) => {
    console.log("UserBadge volume:", volume); // Debug log to check the volume value
    if (volume >= 100000000) return (
        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-200">
            <Crown size={12} /> MASTER
        </div>
    );
    
    if (volume >= 10000000) return (
        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-200">
            <Award size={12} /> ELITE 
        </div>
    );
    
    if (volume >= 1000000) return (
        <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black border border-blue-100">
            <CheckCircle2 size={12} /> VERIFIED
        </div>
    );

    return null;
};