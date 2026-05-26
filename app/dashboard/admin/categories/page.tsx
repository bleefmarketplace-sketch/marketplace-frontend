'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import {
    Plus, Folder, ChevronRight, Trash2, Edit3,
    Loader2, AlertCircle, Upload, Camera
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';

export default function AdminCategoriesPage() {
    const fetcher = useApi();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Selected parent category ID for the split-pane visual tree explorer
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    const [form, setForm] = useState({ name: '', icon: '', parentId: '' });
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // --- Drag & Drop & Webcam States & Handlers ---
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDragDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            await uploadSingleFile(file);
        }
    };

    const uploadSingleFile = async (file: File) => {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadSingleFile(file);
    };

    const handleCameraCapture = async (file: File) => {
        await uploadSingleFile(file);
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetcher('/api/admin/categories');
            const data = res.data || [];
            setCategories(data);

            // Auto select first parent category if none selected
            if (data.length > 0) {
                setSelectedParentId(prev => {
                    const exists = data.some((c: any) => c.id === prev);
                    return exists ? prev : data[0].id;
                });
            } else {
                setSelectedParentId(null);
            }
        } catch (e) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TRIGGER EDIT MODAL
    const onEditClick = (cat: any) => {
        setEditingCategory(cat);
        // Find parentId from either cat.parent or scanning root categories to match child lists
        const parentId = cat.parent?.id || categories.find(c => c.children?.some((child: any) => child.id === cat.id))?.id || '';
        setForm({
            name: cat.name,
            icon: cat.icon || '',
            parentId: parentId
        });
        setIsModalOpen(true);
    };

    // TRIGGER CREATE MODAL
    const onCreateClick = () => {
        setEditingCategory(null);
        setForm({ name: '', icon: '', parentId: '' });
        setIsModalOpen(true);
    };

    // TRIGGER SUB-CATEGORY CREATE
    const onAddSubClick = (parentCat: any) => {
        setEditingCategory(null);
        setForm({ name: '', icon: '', parentId: parentCat.id });
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

    // Find the currently active parent object for split details
    const selectedParent = categories.find(c => c.id === selectedParentId) || null;

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300 select-none">

            {/* Header Block */}
            <div className="border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                        CLASSIFIED MARKET TAXONOMY & REGISTRY
                    </span>
                    <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Category Command Center</h1>
                    <p className="text-zinc-500 text-[10px] mt-0.5">Configure platform classification levels, parent structures, and agricultural catalog sub-indices</p>
                </div>
                <button
                    onClick={onCreateClick}
                    className="rounded-none h-10 px-5 bg-green-700 hover:bg-green-800 border border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                    <Plus size={14} /> New Parent Category
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96 border border-zinc-200 bg-white font-mono text-xs select-none">
                    <Loader2 className="animate-spin text-green-700 mr-2" size={24} />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing Taxonomy...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Parent Ledger directory list */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="border border-zinc-200 bg-zinc-50 p-4 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest font-mono">
                                PARENT LEDGER DIRECTORY
                            </span>
                            <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-white border border-zinc-200 text-zinc-600 uppercase">
                                {categories.length} GROUPS
                            </span>
                        </div>

                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                            {categories.length === 0 ? (
                                <Card noPadding className="p-8 text-center border-dashed border-2 border-zinc-200 bg-white">
                                    <Folder className="mx-auto text-zinc-300 mb-2" size={32} />
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">No categories defined</p>
                                </Card>
                            ) : (
                                categories.map((cat) => {
                                    const isActive = selectedParentId === cat.id;
                                    const childCount = cat.children?.length || 0;
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => setSelectedParentId(cat.id)}
                                            className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${isActive
                                                ? 'bg-green-50/40 border-l-4 border-l-green-700 border-zinc-300'
                                                : 'bg-white border-zinc-200 hover:bg-zinc-50/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 border border-zinc-250 bg-zinc-50 flex items-center justify-center text-lg rounded-none shrink-0 overflow-hidden">
                                                    {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                                        <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (cat.icon && !cat.icon.includes('/') ? cat.icon : null) || <Folder className="text-zinc-400" size={16} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-zinc-950 truncate uppercase tracking-tight text-xs">{cat.name}</p>
                                                    <span className="text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-widest mt-0.5 block truncate max-w-[150px]">
                                                        SLUG: {cat.slug}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-3">
                                                <span className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider border ${childCount > 0
                                                    ? 'bg-zinc-100 text-zinc-650 border-zinc-250'
                                                    : 'bg-zinc-50 text-zinc-400 border-zinc-200 border-dashed'
                                                    }`}>
                                                    {childCount} {childCount === 1 ? 'SUB-INDEX' : 'SUB-INDICES'}
                                                </span>
                                                <ChevronRight size={14} className={isActive ? 'text-green-700' : 'text-zinc-300'} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Column: Active Parent details & Sub-categories table */}
                    <div className="lg:col-span-7 space-y-4">
                        {selectedParent ? (
                            <div className="space-y-4">

                                {/* Selected Parent details header */}
                                <Card noPadding className="border border-zinc-200 bg-white p-5 shadow-none rounded-none">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 border border-zinc-250 bg-zinc-50 flex items-center justify-center text-2xl rounded-none shrink-0 overflow-hidden">
                                                {selectedParent.icon && (selectedParent.icon.startsWith('http') || selectedParent.icon.startsWith('/')) ? (
                                                    <img src={selectedParent.icon} alt={selectedParent.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    (selectedParent.icon && !selectedParent.icon.includes('/') ? selectedParent.icon : null) || <Folder className="text-zinc-400" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-green-200 bg-green-50 text-green-800">
                                                    ACTIVE PARENT CATALOG
                                                </span>
                                                <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wide mt-1.5">{selectedParent.name}</h3>
                                                <p className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5">SLUG: {selectedParent.slug}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                            <button
                                                onClick={() => onEditClick(selectedParent)}
                                                className="flex-1 sm:flex-none h-8 px-4 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                                            >
                                                Edit Parent
                                            </button>
                                            <button
                                                onClick={() => handleDelete(selectedParent.id)}
                                                className="flex-1 sm:flex-none h-8 px-4 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                                            >
                                                Delete Group
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Subcategories ledger table */}
                                <Card noPadding className="border border-zinc-200 bg-white shadow-none rounded-none">
                                    <div className="border-b border-zinc-200 bg-zinc-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <span className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest font-mono">
                                            SUB-CATEGORIES REGISTRY UNDER {selectedParent.name.toUpperCase()}
                                        </span>
                                        <button
                                            onClick={() => onAddSubClick(selectedParent)}
                                            className="h-8 px-3.5 bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-2 rounded-none"
                                        >
                                            <Plus size={12} /> Add Sub-Category
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        {!selectedParent.children || selectedParent.children.length === 0 ? (
                                            <div className="border border-dashed border-zinc-200 p-16 text-center select-none font-mono">
                                                <Folder className="mx-auto text-zinc-300 mb-2" size={32} />
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">No sub-categories defined</p>
                                                <p className="text-zinc-400 text-[9px] mt-1.5 uppercase">Click "Add Sub-Category" above to configure classifications under this parent group.</p>
                                            </div>
                                        ) : (
                                            <div className="border border-zinc-200 overflow-hidden font-mono text-[10px]">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider">
                                                            <th className="p-3">Index Sub-Class</th>
                                                            <th className="p-3 hidden sm:table-cell">Sub-Category Slug</th>
                                                            <th className="p-3 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-zinc-200">
                                                        {selectedParent.children.map((child: any) => (
                                                            <tr key={child.id} className="hover:bg-zinc-50/50 transition-colors">
                                                                <td className="p-3 font-bold text-zinc-900 flex items-center gap-3">
                                                                    <ChevronRight size={12} className="text-green-700 shrink-0" />
                                                                    <div className="w-8 h-8 border border-zinc-250 bg-zinc-50 flex items-center justify-center text-xs rounded-none shrink-0 overflow-hidden">
                                                                        {child.icon && (child.icon.startsWith('http') || child.icon.startsWith('/')) ? (
                                                                            <img src={child.icon} alt={child.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            (child.icon && !child.icon.includes('/') ? child.icon : null) || <Folder className="text-zinc-400" size={14} />
                                                                        )}
                                                                    </div>
                                                                    <span className="uppercase">{child.name}</span>
                                                                </td>
                                                                <td className="p-3 text-zinc-400 font-mono hidden sm:table-cell">{child.slug}</td>
                                                                <td className="p-3 text-right">
                                                                    <div className="inline-flex gap-2">
                                                                        <button
                                                                            onClick={() => onEditClick(child)}
                                                                            className="h-7 px-3 border border-zinc-350 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[8px] cursor-pointer"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(child.id)}
                                                                            className="h-7 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-[8px] cursor-pointer"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card noPadding className="border border-dashed border-2 border-zinc-200 bg-white p-20 text-center select-none font-mono">
                                <AlertCircle className="mx-auto text-zinc-300 mb-4" size={48} />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700">No Parent Selected</h3>
                                <p className="text-zinc-400 text-[9px] uppercase tracking-wider mt-1">Select a parent category from the left ledger to explore its taxonomy hierarchy</p>
                            </Card>
                        )}
                    </div>
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
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="e.g. Grain Crops"
                    />

                    <div className="space-y-2">
                        <Input
                            label="Icon / Emoji"
                            placeholder="🌽 or image URL"
                            value={form.icon}
                            onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        />

                        <div className="flex gap-3">
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDragDrop}
                                className={`relative flex-1 border border-dashed p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 rounded-none ${
                                    isDragging ? "border-green-600 bg-green-50/20" : "border-zinc-300 hover:border-green-600 hover:bg-zinc-50/20"
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                                {uploadingImage ? (
                                    <Loader2 className="animate-spin text-green-700 mb-2" size={20} />
                                ) : (
                                    <Upload className="text-zinc-400 mb-2" size={20} />
                                )}
                                <span className="text-[10px] text-zinc-650 font-bold uppercase tracking-wider">
                                    {uploadingImage ? "Uploading file..." : "Upload Custom Category Image"}
                                </span>
                                <span className="text-[9px] text-zinc-400 mt-1 uppercase">
                                    Drag & Drop or Click to Select
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCameraOpen(true)}
                                className="w-24 border border-dashed border-green-200 bg-green-50/20 hover:bg-green-50 text-green-700 flex flex-col items-center justify-center rounded-none cursor-pointer"
                                title="Snap custom icon from webcam"
                            >
                                <Camera size={20} />
                                <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Webcam Snap</span>
                            </button>
                        </div>

                        {form.icon && (form.icon.startsWith('http') || form.icon.startsWith('/')) && (
                            <div className="mt-3 p-3 bg-zinc-50 rounded-none flex items-center gap-3 border border-zinc-200">
                                <img src={form.icon} alt="Preview" className="w-10 h-10 object-cover rounded-none" />

                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5 font-mono">Parent Category</label>
                        <select
                            className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-300 rounded-none outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/30 text-xs font-mono"
                            value={form.parentId}
                            onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                        >
                            <option value="">None (Top Level Parent Category)</option>
                            {categories
                                .filter(c => c.id !== editingCategory?.id)
                                .map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)
                            }
                        </select>
                    </div>

                    <Button
                        fullWidth
                        size="md"
                        disabled={saving}
                        className="bg-green-700 hover:bg-green-800 text-white rounded-none uppercase font-bold tracking-wider font-mono text-[10px] h-10 flex items-center justify-center cursor-pointer"
                    >
                        {saving ? <Loader2 className="animate-spin text-white" size={14} /> : editingCategory ? "Update Category" : "Create Category"}
                    </Button>
                </form>
            </Modal>

            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
}