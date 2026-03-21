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
    }, [fetcher]);

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
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            
        </div>
    );

    return (
        <div  >
             
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                    {/* Marketplace Fees */}
                    <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Zap size={20}/></div>
                            Marketplace Monetization
                        </h3>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-2 px-2">
                                <Input 
                                    label="Platform Commission" 
                                    type="number" step="0.1"
                                    value={settings.COMMISSION_PERCENT}
                                    onChange={(e) => handleChange('COMMISSION_PERCENT', e.target.value)}
                                    icon={<Percent size={16} className="text-emerald-500" />}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">Bleefy&apos;s percentage per sale</p>
                            </div>
                            <div className="space-y-2 px-2">
                                <Input 
                                    label="Withdrawal Processing Fee" 
                                    type="number" step="0.01"
                                    value={settings.PAYSTACK_FLAT_FEE}
                                    onChange={(e) => handleChange('PAYSTACK_FLAT_FEE', e.target.value)}
                                    icon={<DollarSign size={16} className="text-emerald-500" />}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">Fixed cost per payout request</p>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Gateway */}
                    <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><ShieldCheck size={20}/></div>
                            Payment Gateway (Paystack)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-10">
                            <Input 
                            className='px-2'
                                label="Gateway Transaction Fee (%)" 
                                type="number" step="0.001"
                                value={settings.PAYSTACK_PERCENT}
                                onChange={(e) => handleChange('PAYSTACK_PERCENT', e.target.value)}
                            />
                            <Input 
                            className='px-2'
                                label="Transaction Fee Cap" 
                                type="number"
                                value={settings.PAYSTACK_CAP}
                                onChange={(e) => handleChange('PAYSTACK_CAP', e.target.value)}
                            />
                        </div>
                        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                These values define how Paystack fees are deducted from seller payouts. Ensure these match Paystack&apos;s current regional pricing.
                            </p>
                        </div>
                    </Card>
                </div>
          
                <div className="space-y-8 py-5 animate-in slide-in-from-right-4 duration-500">
                      {/* Branding */}
                        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <Mail className="text-emerald-600" size={20} /> Communication
                            </h3>
                            <Input 
                                label="System Support Email" 
                                value={settings.SUPPORT_EMAIL}
                                onChange={(e) => handleChange('SUPPORT_EMAIL', e.target.value)}
                                placeholder="support@bleefy.com"
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-4 px-1">Receiver for system alerts and disputes</p>
                        </Card>

                        
                  
                </div>
                <div className='flex justify-end item-center'>

                 <Button 
                    onClick={() => handleSave()} 
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 className="animate-spin mr-2" size={18}/> : <Save size={18} className="mr-2"/>}
                    Save Changes
                </Button>
                </div>
        
        </div>
    );
};

export default SettingsUtility;