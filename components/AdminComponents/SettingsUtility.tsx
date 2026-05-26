'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { 
    DollarSign, Globe, Lock, Percent, Save, 
    Wallet, Loader2, Info, ShieldCheck, 
    Settings, Activity, Mail, Zap
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';

const SettingsUtility = () => {
    const fetcher = useApi();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
  
    const [settings, setSettings] = useState({
        COMMISSION_PERCENT: '',
        PAYSTACK_PERCENT: '',
        PAYSTACK_FLAT_FEE: '',
        PAYSTACK_CAP: '',
        SUPPORT_EMAIL: 'support@bleefy.com',
        MAINTENANCE_MODE: 'false'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetcher('/api/admin/settings');
                setSettings(res); 
            } catch (error: any) {
                toast.error(error.message || "Failed to load system settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSaving(true);
        try {
            await fetcher('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify(settings)
            });
            toast.success("System configuration updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Error updating settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 font-mono text-xs">
            <Loader2 className="animate-spin text-green-700" size={32} />
            <span className="text-zinc-400 uppercase tracking-widest text-[9px]">RETRIEVING LEDGER CONF...</span>
        </div>
    );

    return (
        <div className="space-y-6 font-mono text-xs text-zinc-900 antialiased">
             
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
                {/* Marketplace Fees */}
                <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-150 flex items-center gap-2">
                        <div className="w-8 h-8 border border-zinc-250 bg-zinc-50 flex items-center justify-center shrink-0 rounded-none text-green-700">
                            <Zap size={14}/>
                        </div>
                        Marketplace Monetization
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Input 
                                label="Platform Commission" 
                                type="number" step="0.1"
                                value={settings.COMMISSION_PERCENT}
                                onChange={(e) => handleChange('COMMISSION_PERCENT', e.target.value)}
                                icon={<Percent size={14} className="text-green-700" />}
                            />
                            <p className="text-[9px] text-zinc-450 uppercase tracking-wider font-bold">Bleefy commission per transactional sale</p>
                        </div>
                        <div className="space-y-1">
                            <Input 
                                label="Withdrawal Processing Fee" 
                                type="number" step="0.01"
                                value={settings.PAYSTACK_FLAT_FEE}
                                onChange={(e) => handleChange('PAYSTACK_FLAT_FEE', e.target.value)}
                                icon={<DollarSign size={14} className="text-green-700" />}
                            />
                            <p className="text-[9px] text-zinc-450 uppercase tracking-wider font-bold">Fixed administrative cost per payout request</p>
                        </div>
                    </div>
                </Card>

                {/* Payment Gateway */}
                <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-150 flex items-center gap-2">
                        <div className="w-8 h-8 border border-zinc-250 bg-zinc-50 flex items-center justify-center shrink-0 rounded-none text-green-700">
                            <ShieldCheck size={14}/>
                        </div>
                        Payment Gateway (Paystack)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input 
                            label="Gateway Transaction Fee (%)" 
                            type="number" step="0.001"
                            value={settings.PAYSTACK_PERCENT}
                            onChange={(e) => handleChange('PAYSTACK_PERCENT', e.target.value)}
                        />
                        <Input 
                            label="Transaction Fee Cap" 
                            type="number"
                            value={settings.PAYSTACK_CAP}
                            onChange={(e) => handleChange('PAYSTACK_CAP', e.target.value)}
                        />
                    </div>
                    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 text-blue-800 rounded-none flex items-start gap-3">
                        <Info className="text-blue-700 shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] leading-relaxed font-bold uppercase tracking-wider">
                            These variables determine how intermediary Paystack processing fees are distributed and capped. Ensure sync values align with regional merchant pricing.
                        </p>
                    </div>
                </Card>
            </div>
      
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                {/* Branding */}
                <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-150 flex items-center gap-2">
                        <div className="w-8 h-8 border border-zinc-250 bg-zinc-50 flex items-center justify-center shrink-0 rounded-none text-green-700">
                            <Mail size={14} />
                        </div>
                        Communication
                    </h3>
                    <Input 
                        label="System Support Email" 
                        value={settings.SUPPORT_EMAIL}
                        onChange={(e) => handleChange('SUPPORT_EMAIL', e.target.value)}
                        placeholder="support@bleefy.com"
                    />
                    <p className="text-[9px] text-zinc-450 uppercase tracking-wider font-bold mt-2">Receiver for system escalations, transaction logs, and platform disputes</p>
                </Card>
            </div>

            <div className="flex justify-end pt-2">
                 <Button 
                    onClick={() => handleSave()} 
                    disabled={saving}
                    className="bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-10 px-6 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center cursor-pointer shadow-none"
                >
                    {saving ? <Loader2 className="animate-spin mr-1.5" size={13}/> : <Save size={13} className="mr-1.5"/>}
                    Commit Configuration
                </Button>
            </div>
        
        </div>
    );
};

export default SettingsUtility;