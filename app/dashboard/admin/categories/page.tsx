'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { 
    Plus, Folder, ChevronRight, Trash2, Edit3, 
    Loader2, AlertCircle, Upload 
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

export default function AdminCategoriesPage() {
    const fetcher = useApi();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // NEW: Track if we are editing
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    
    const [form, setForm] = useState({ name: '', icon: '', parentId: '' });
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload/upload-single-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                setForm(prev => ({ ...prev, icon: data.url }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Upload failed: No URL returned");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetcher('/api/admin/categories');
            setCategories(res.data || []);
        } catch (e) { toast.error("Failed to load categories"); }
        finally { setLoading(false); }
    }, [fetcher]);

    useEffect(() => { loadData(); }, [loadData]);

    // TRIGGER EDIT MODAL
    const onEditClick = (cat: any) => {
        setEditingCategory(cat);
        setForm({
            name: cat.name,
            icon: cat.icon || '',
            parentId: cat.parent?.id || ''
        });
        setIsModalOpen(true);
    };

    // TRIGGER CREATE MODAL
    const onCreateClick = () => {
        setEditingCategory(null);
        setForm({ name: '', icon: '', parentId: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                icon: form.icon,
                parentId: form.parentId === "" ? null : form.parentId 
            };

            const url = editingCategory 
                ? `/api/admin/categories/${editingCategory.id}` 
                : '/api/admin/categories';

            await fetcher(url, {
                method: editingCategory ? 'PATCH' : 'POST',
                body: JSON.stringify(payload)
            });

            toast.success(editingCategory ? "Category updated" : "Category created");
            setIsModalOpen(false);
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this category? Note: Categories with products cannot be deleted.")) return;
        try {
            await fetcher(`/api/admin/categories/${id}`, { method: 'DELETE' });
            toast.success("Category removed");
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto  px-4 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Market Categories</h1>
                    <p className="text-gray-500 text-sm font-medium">Manage top-level and sub-categories.</p>
                </div>
                <Button onClick={onCreateClick} className="rounded-full bg-emerald-600 gap-2">
                    <Plus size={18} /> New Category
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
            ) : (
                <div className="grid gap-4">
                    {categories.map((cat) => (
                        <Card key={cat.id} className="p-0 overflow-hidden border-gray-100 shadow-sm">
                            <div className="p-6 flex items-center justify-between bg-white group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center overflow-hidden text-emerald-600 text-xl shrink-0">
                                        {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                            <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            cat.icon || <Folder size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{cat.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase">PARENT CATEGORY</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEditClick(cat)} className="p-2 text-gray-400 hover:text-emerald-600" title="Edit"><Edit3 size={18}/></button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={18}/></button>
                                </div>
                            </div>

                            {/* Sub-categories */}
                            {cat.children?.length > 0 && (
                                <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 space-y-3">
                                    {cat.children.map((child: any) => (
                                        <div key={child.id} className="flex items-center justify-between group/child">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <ChevronRight size={14} className="text-emerald-300" />
                                                <span className="font-medium">{child.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-child-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEditClick(child)} className="p-1 text-gray-300 hover:text-emerald-600"><Edit3 size={14}/></button>
                                                <button onClick={() => handleDelete(child.id)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* --- CREATE / EDIT MODAL --- */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingCategory ? "Update Category" : "New Category"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Category Name" 
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                    />
                    
                    <div className="space-y-2">
                        <Input 
                            label="Icon / Emoji" 
                            placeholder="🌽 or image URL" 
                            value={form.icon}
                            onChange={(e) => setForm({...form, icon: e.target.value})}
                        />
                        
                        <div className="relative border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-emerald-50/10">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageUpload} 
                                disabled={uploadingImage}
                            />
                            {uploadingImage ? (
                                <Loader2 className="animate-spin text-emerald-600 mb-2" size={24} />
                            ) : (
                                <Upload className="text-gray-400 mb-2" size={24} />
                            )}
                            <span className="text-xs text-gray-600 font-bold">
                                {uploadingImage ? "Uploading file..." : "Upload Custom Category Image"}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                        </div>

                        {form.icon && (form.icon.startsWith('http') || form.icon.startsWith('/')) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                                <img src={form.icon} alt="Preview" className="w-10 h-10 object-cover rounded-xl" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-emerald-600">Active Custom Image</p>
                                    <p className="text-xs text-gray-500 truncate">{form.icon}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Parent Category</label>
                        <select 
                            className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            value={form.parentId}
                            onChange={(e) => setForm({...form, parentId: e.target.value})}
                        >
                            <option value="">None (Top Level)</option>
                            {/* Filter out children when choosing a parent for a top-level cat, 
                                and ensure a category can't be its own parent */}
                            {categories
                                .filter(c => c.id !== editingCategory?.id)
                                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                            }
                        </select>
                    </div>
<>{console.log(categories)}</>
                    <Button fullWidth size="md" disabled={saving} className="bg-emerald-600 rounded-2xl">
                        {saving ? <Loader2 className="animate-spin" /> : editingCategory ? "Update Category" : "Create Category"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}