'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Video, FileText, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';

export const ContentBuilderModal = ({ isOpen, onClose, onSave }: any) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        primaryAssetUrl: '', // For the AI Reviewer
        assets: [{ title: '', fileUrl: '', fileType: 'video' }]
    });

    const addAsset = () => {
        setForm({ ...form, assets: [...form.assets, { title: '', fileUrl: '', fileType: 'video' }] });
    };

    const updateAsset = (index: number, field: string, value: string) => {
        const newAssets = [...form.assets];
        (newAssets[index] as any)[field] = value;
        setForm({ ...form, assets: newAssets });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Publish Digital Content" size="lg">
            <div className="space-y-8 p-2 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b pb-2">1. Listing Details</h3>
                    <Input label="Course/Guide Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    <textarea 
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="What will farmers learn from this content?"
                        rows={3}
                    />
                </div>

                {/* Section 2: The Vault Builder */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">2. Content Vault (Assets)</h3>
                        <Button variant="ghost" size="sm" onClick={addAsset} className="text-emerald-600 font-bold h-8"><Plus size={14}/> Add Lesson</Button>
                    </div>

                    <div className="space-y-3">
                        {form.assets.map((asset, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4 group">
                                <GripVertical className="text-gray-300 cursor-move" size={18} />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        placeholder="Lesson Title (e.g. Introduction)" 
                                        value={asset.title} 
                                        onChange={e => updateAsset(idx, 'title', e.target.value)}
                                        className="h-10 text-xs"
                                    />
                                    <div className="flex gap-2">
                                        <select 
                                            className="bg-white border rounded-xl px-2 text-[10px] font-bold outline-none"
                                            value={asset.fileType}
                                            onChange={e => updateAsset(idx, 'fileType', e.target.value)}
                                        >
                                            <option value="video">VIDEO</option>
                                            <option value="pdf">PDF</option>
                                        </select>
                                        <Input 
                                            placeholder="S3/File Link" 
                                            value={asset.fileUrl} 
                                            onChange={e => updateAsset(idx, 'fileUrl', e.target.value)}
                                            className="h-10 text-xs"
                                        />
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <Button fullWidth size="lg" className="bg-emerald-600 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100">
                        Submit for AI Verification
                    </Button>
                    <p className="text-[10px] text-gray-400 text-center mt-4">By submitting, you agree to our Content Integrity Policy.</p>
                </div>
            </div>
        </Modal>
    );
};