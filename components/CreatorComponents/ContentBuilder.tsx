'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Video, FileText, Plus, Trash2, GripVertical, Loader2, Image as ImageIcon, Shield } from 'lucide-react';
import api from '@/helpers/api';
import { toast } from 'react-toastify';

const ContentBuilderModal = ({ isOpen, onClose, product }: any) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        primaryImage: '',
        primaryAssetUrl: '', // For the AI Reviewer
        assets: [{ title: '', fileUrl: '', fileType: 'video' }]
    });

    useEffect(() => {
        if (product) {
            setForm({
                title: product.title || '',
                description: product.description || '',
                price: String(product.price || ''),
                categoryId: product.categoryId || '',
                primaryImage: product.primaryImage || '',
                primaryAssetUrl: product.primaryAssetUrl || '',
                assets: product.digitalAssets?.length > 0 ? product.digitalAssets : [{ title: '', fileUrl: '', fileType: 'video' }]
            });
        } else {
            setForm({
                title: '',
                description: '',
                price: '',
                categoryId: '',
                primaryImage: '',
                primaryAssetUrl: '',
                assets: [{ title: '', fileUrl: '', fileType: 'video' }]
            });
        }
    }, [product, isOpen]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data?.data || res.data || []);
            } catch (e) {
                console.error('Failed to load categories');
            }
        };
        if (isOpen) fetchCats();
    }, [isOpen]);

    const addAsset = () => {
        setForm({ ...form, assets: [...form.assets, { title: '', fileUrl: '', fileType: 'video' }] });
    };

    const removeAsset = (index: number) => {
        if (form.assets.length === 1) return;
        const newAssets = form.assets.filter((_, i) => i !== index);
        setForm({ ...form, assets: newAssets });
    };

    const updateAsset = (index: number, field: string, value: string) => {
        const newAssets = [...form.assets];
        (newAssets[index] as any)[field] = value;
        setForm({ ...form, assets: newAssets });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.categoryId || !form.price || !form.primaryAssetUrl) {
            return toast.warn('Please fill in all required fields');
        }

        setLoading(true);
        try {
            if (product?.id) {
                await api.patch(`/creator/products/${product.id}`, {
                    ...form,
                    price: Number(form.price),
                });
                toast.success('Content updated successfully!');
            } else {
                await api.post('/creator/products', {
                    ...form,
                    price: Number(form.price),
                });
                toast.success('Content submitted for AI verification!');
            }
            onClose();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Digital Content" : "Publish Digital Content"} size="lg">
            <div className="space-y-8 p-2 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b pb-2">1. Listing Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Hydroponics Masterclass" />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select 
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                                value={form.categoryId}
                                onChange={e => setForm({...form, categoryId: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Price (₦)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
                        <Input label="Thumbnail URL" value={form.primaryImage} onChange={e => setForm({...form, primaryImage: e.target.value})} placeholder="https://..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="What will farmers learn from this content?"
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                        />
                    </div>
                </div>

                {/* Section 2: Audit Asset */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b pb-2">2. Verification Asset</h3>
                    <p className="text-[10px] text-gray-400">Provide a primary URL for AI auditing (e.g., your main PDF or intro video).</p>
                    <Input placeholder="Verification File URL" value={form.primaryAssetUrl} onChange={e => setForm({...form, primaryAssetUrl: e.target.value})} icon={<Shield size={16} />} />
                </div>

                {/* Section 3: The Vault Builder */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">3. Content Vault (Assets)</h3>
                        <Button variant="ghost" size="sm" onClick={addAsset} className="text-emerald-600 font-bold h-8"><Plus size={14}/> Add Lesson</Button>
                    </div>

                    <div className="space-y-3">
                        {form.assets.map((asset, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4 group">
                                <GripVertical className="text-gray-300" size={18} />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        placeholder="Lesson Title" 
                                        value={asset.title} 
                                        onChange={e => updateAsset(idx, 'title', e.target.value)}
                                        className="h-10 text-xs"
                                    />
                                    <div className="flex gap-2">
                                        <select 
                                            className="bg-white border rounded-xl px-2 text-[10px] font-bold outline-none h-10"
                                            value={asset.fileType}
                                            onChange={e => updateAsset(idx, 'fileType', e.target.value)}
                                        >
                                            <option value="video">VIDEO</option>
                                            <option value="pdf">PDF</option>
                                            <option value="audio">AUDIO</option>
                                        </select>
                                        <Input 
                                            placeholder="File URL" 
                                            value={asset.fileUrl} 
                                            onChange={e => updateAsset(idx, 'fileUrl', e.target.value)}
                                            className="h-10 text-xs flex-1"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeAsset(idx)}
                                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <Button 
                        fullWidth 
                        size="lg" 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (product ? "Save Changes" : "Submit for AI Verification")}
                    </Button>
                    <p className="text-[10px] text-gray-400 text-center mt-4 uppercase font-bold tracking-widest">Secured by Bleefy AI Integrity Engine</p>
                </div>
            </div>
        </Modal>
    );
};

export default ContentBuilderModal;