'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Video, FileText, Plus, Trash2, GripVertical, Loader2, Image as ImageIcon, Shield } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const ContentBuilderModal = ({ isOpen, onClose, product }: any) => {
    const fetcher = useApi();
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
                const res = await fetcher('/api/categories');
                setCategories(res.data?.data || res.data || []);
            } catch (e) {
                console.error('Failed to load categories');
            }
        };
        if (isOpen) fetchCats();
    }, [isOpen, fetcher]);

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
                await fetcher(`/api/creator/products/${product.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                    })
                });
                toast.success('Content updated successfully!');
            } else {
                await fetcher('/api/creator/products', {
                    method: 'POST',
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                    })
                });
                toast.success('Content submitted for AI verification!');
            }
            onClose();
        } catch (e: any) {
            toast.error(e.message || 'Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "EDIT DIGITAL CONTENT" : "PUBLISH DIGITAL CONTENT"} size="lg">
            <div className="space-y-6 font-mono text-xs text-zinc-900 antialiased p-1 max-h-[85vh] overflow-y-auto pr-3">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-green-700 uppercase tracking-widest border-b border-zinc-200 pb-1.5 flex items-center justify-between">
                        <span>1. Listing Details</span>
                        <span className="text-[8px] text-zinc-400 font-normal">REQUIRED</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Hydroponics Masterclass" />
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Category</label>
                            <select 
                                className="w-full h-10 px-3 bg-white border border-zinc-300 rounded-none text-xs font-mono outline-none focus:border-green-700"
                                value={form.categoryId}
                                onChange={e => setForm({...form, categoryId: e.target.value})}
                            >
                                <option value="">SELECT CATEGORY</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Price (₦)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
                        <Input label="Thumbnail URL" value={form.primaryImage} onChange={e => setForm({...form, primaryImage: e.target.value})} placeholder="https://..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Description</label>
                        <textarea 
                            className="w-full p-3 bg-white border border-zinc-300 rounded-none text-xs font-mono outline-none focus:border-green-700"
                            placeholder="What will farmers learn from this digital resource?"
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                        />
                    </div>
                </div>

                {/* Section 2: Audit Asset */}
                <div className="space-y-4 border-t border-zinc-150 pt-5">
                    <h3 className="text-[10px] font-bold text-green-700 uppercase tracking-widest border-b border-zinc-200 pb-1.5 flex items-center justify-between">
                        <span>2. Verification Asset</span>
                        <span className="text-[8px] text-zinc-400 font-normal">REQUIRED FOR AUDIT</span>
                    </h3>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-wider leading-relaxed">
                        Provide a primary asset URL for automated integrity evaluation (e.g., your primary handbook PDF or intro module).
                    </p>
                    <Input placeholder="VERIFICATION FILE URL (e.g., https://...)" value={form.primaryAssetUrl} onChange={e => setForm({...form, primaryAssetUrl: e.target.value})} icon={<Shield size={14} />} />
                </div>

                {/* Section 3: The Vault Builder */}
                <div className="space-y-4 border-t border-zinc-150 pt-5">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                        <h3 className="text-[10px] font-bold text-green-700 uppercase tracking-widest">3. Content Vault (Assets)</h3>
                        <button 
                            type="button" 
                            onClick={addAsset} 
                            className="text-green-700 hover:text-green-800 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={12}/> Add Lesson
                        </button>
                    </div>

                    <div className="space-y-3">
                        {form.assets.map((asset, idx) => (
                            <div key={idx} className="bg-zinc-50 border border-zinc-200 p-4 rounded-none flex items-center gap-3 group">
                                <GripVertical className="text-zinc-350 cursor-grab shrink-0" size={14} />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input 
                                        placeholder="Lesson Title" 
                                        value={asset.title} 
                                        onChange={e => updateAsset(idx, 'title', e.target.value)}
                                        className="h-10 text-xs rounded-none"
                                    />
                                    <div className="flex gap-2">
                                        <select 
                                            className="bg-white border border-zinc-300 rounded-none px-2 text-[9px] font-bold outline-none h-10 shrink-0 font-mono focus:border-green-700"
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
                                            className="h-10 text-xs flex-1 rounded-none"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeAsset(idx)}
                                    type="button"
                                    className="p-1.5 border border-zinc-200 hover:border-red-200 hover:bg-red-50 text-zinc-300 hover:text-red-750 transition-colors shrink-0 cursor-pointer"
                                >
                                    <Trash2 size={13}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 mt-6">
                    <Button 
                        fullWidth 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-green-700 hover:bg-green-800 border-green-700 text-white rounded-none h-11 uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer shadow-none"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" size={14} /> : (product ? "COMMIT CHANGES" : "SUBMIT FOR INTEGRITY CHECK")}
                    </Button>
                    <p className="text-[8px] text-zinc-400 text-center mt-3 uppercase tracking-widest font-mono">
                        Secured by Bleefy AI Integrity Engine
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ContentBuilderModal;