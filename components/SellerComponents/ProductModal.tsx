"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { UploadCloud, Loader2, X, Plus, Camera } from "lucide-react";
import { Modal } from "../Modal";
import Image from "next/image";
import { toast } from "react-toastify";
import { useApi } from "@/hooks/useApi";
import { slugify } from "@/helpers/slugify";
import { CameraCaptureModal } from "../CameraCaptureModal";

interface Category {
    id: string;
    name: string;
    children?: Category[];
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData: any | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const fetcher = useApi();
    const isPublished = initialData?.status === "published";
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [slugEdited, setSlugEdited] = useState(false);

    // --- 3-Tier Category States ---
    const [selectedLevel1, setSelectedLevel1] = useState("");
    const [selectedLevel2, setSelectedLevel2] = useState("");
    const [selectedLevel3, setSelectedLevel3] = useState("");

    const [level2List, setLevel2List] = useState<Category[]>([]);
    const [level3List, setLevel3List] = useState<Category[]>([]);

    // --- Primary Image State ---
    const [primaryFile, setPrimaryFile] = useState<File | null>(null);
    const [primaryPreview, setPrimaryPreview] = useState<string | null>(
        initialData?.primaryImage || null
    );

    // --- Other Images (Gallery) State ---
    const [otherFiles, setOtherFiles] = useState<File[]>([]);
    const [otherPreviews, setOtherPreviews] = useState<string[]>(
        initialData?.otherImages || []
    );

    // --- Drag & Drop & Webcam States ---
    const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraTarget, setCameraTarget] = useState<"primary" | "gallery">("primary");

    const handlePrimaryDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingPrimary(true);
    };

    const handlePrimaryDragLeave = () => {
        setIsDraggingPrimary(false);
    };

    const handlePrimaryDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingPrimary(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPrimaryFile(file);
            setPrimaryPreview(URL.createObjectURL(file));
            toast.info(`Imported: ${file.name}`);
        }
    };

    const handleGalleryDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingGallery(true);
    };

    const handleGalleryDragLeave = () => {
        setIsDraggingGallery(false);
    };

    const handleGalleryDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingGallery(false);
        const files = Array.from(e.dataTransfer.files || []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length > 0) {
            setOtherFiles((prev) => [...prev, ...imageFiles]);
            const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
            setOtherPreviews((prev) => [...prev, ...newPreviews]);
            toast.info(`Added ${imageFiles.length} images to gallery`);
        }
    };

    const handleCameraCapture = (file: File) => {
        if (cameraTarget === "primary") {
            setPrimaryFile(file);
            setPrimaryPreview(URL.createObjectURL(file));
            toast.success("Cover photo captured!");
        } else {
            setOtherFiles((prev) => [...prev, file]);
            setOtherPreviews((prev) => [...prev, URL.createObjectURL(file)]);
            toast.success("Gallery photo captured!");
        }
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetcher("/api/categories");
            const data = res?.data;
            setCategories(data || []);
        } catch (e) {
            toast.error("Failed to load categories");
        }
    }, [fetcher]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Reconstruct product category lineage for edit hydration
    useEffect(() => {
        if (categories.length > 0 && initialData) {
            const catId = initialData?.category?.id || initialData?.categoryId || "";
            const subCatId = initialData?.subCategory?.id || initialData?.subCategoryId || "";

            if (catId) {
                // Check if catId is a Level 2 child of any Level 1 parent
                let foundLevel1Id = "";
                for (const c of categories) {
                    if (c.children?.some((child: any) => child.id === catId)) {
                        foundLevel1Id = c.id;
                        break;
                    }
                }

                if (foundLevel1Id) {
                    // 3rd-tier classification scenario: Level 1 -> Level 2 -> Level 3
                    setSelectedLevel1(foundLevel1Id);
                    setSelectedLevel2(catId);
                    setSelectedLevel3(subCatId);
                } else {
                    // 2-tier classification scenario: Level 1 -> Level 2
                    setSelectedLevel1(catId);
                    setSelectedLevel2(subCatId);
                    setSelectedLevel3("");
                }
            }
        }
    }, [categories, initialData]);

    // Cascading effect Level 1 -> Level 2
    useEffect(() => {
        if (selectedLevel1 && categories.length > 0) {
            const parent = categories.find((c) => c.id === selectedLevel1);
            setLevel2List(parent?.children || []);
        } else {
            setLevel2List([]);
        }
    }, [selectedLevel1, categories]);

    // Cascading effect Level 2 -> Level 3
    useEffect(() => {
        if (selectedLevel2 && level2List.length > 0) {
            const subParent = level2List.find((c) => c.id === selectedLevel2);
            setLevel3List(subParent?.children || []);
        } else {
            setLevel3List([]);
        }
    }, [selectedLevel2, level2List]);

    const handleLevel1Change = (val: string) => {
        setSelectedLevel1(val);
        setSelectedLevel2("");
        setSelectedLevel3("");
    };

    const handleLevel2Change = (val: string) => {
        setSelectedLevel2(val);
        setSelectedLevel3("");
    };

    /* ---------------- API: UPLOAD SINGLE (PRIMARY) ---------------- */
    const uploadPrimaryImage = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload/upload-single-image", {
            method: "POST",
            body: fd,
        });
        if (!res.ok) throw new Error("Primary image upload failed");
        const data = await res.json();
        return data.url;
    };

    /* ---------------- API: UPLOAD MULTIPLE (OTHER IMAGES) ---------------- */
    const uploadOtherImages = async (files: File[]): Promise<string[]> => {
        if (files.length === 0) return [];

        const fd = new FormData();
        files.forEach((file) => fd.append("files", file));

        const res = await fetch("/api/upload/upload-multiple-images", {
            method: "POST",
            body: fd,
        });
        if (!res.ok) throw new Error("Gallery upload failed");
        const data = await res.json();
        return data.map((item: { url: string }) => item.url);
    };

    /* ---------------- HANDLERS ---------------- */
    const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setOtherFiles((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setOtherPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeOtherImage = (index: number) => {
        setOtherPreviews((prev) => prev.filter((_, i) => i !== index));
        setOtherFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            if (String(formData.get("description")).length < 10) {
                return toast.error("Description must be at least 10 characters");
            }

            let primaryImageUrl = initialData?.primaryImage;
            if (primaryFile) {
                primaryImageUrl = await uploadPrimaryImage(primaryFile);
            }

            if (!primaryImageUrl) {
                return toast.error("Primary product image is required");
            }

            const newUploadedUrls = await uploadOtherImages(otherFiles);
            const existingUrls = otherPreviews.filter((p) => p.startsWith("http"));

            const finalOtherImages = [
                ...existingUrls,
                ...newUploadedUrls,
            ];

            // Adaptive 3-Tier Classification Mapping Rule
            let categoryId = "";
            let subCategoryId: string | null = null;

            if (selectedLevel3) {
                categoryId = selectedLevel2;
                subCategoryId = selectedLevel3;
            } else {
                categoryId = selectedLevel1;
                subCategoryId = selectedLevel2 || null;
            }

            const payload = {
                title,
                slug,
                description: formData.get("description"),
                price: Number(formData.get("price")),
                stock: Number(formData.get("stock")),
                categoryId,
                subCategoryId,
                location: formData.get("location"),
                primaryImage: primaryImageUrl,
                otherImages: finalOtherImages,
                isOrganic: formData.get("isOrganic") === "on",
                attributes: {
                    weight: formData.get("weight"),
                    origin: formData.get("origin"),
                },
            };

            await onSave(payload);
            toast.success(initialData ? "Product updated" : "Product created");
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            setSlug(slugify(title));
        }
    }, [title, initialData]);

    useEffect(() => {
        if (!slugEdited) {
            setSlug(slugify(title));
        }
    }, [title, slugEdited]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Product" : "Add Product"}>
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] px-1 font-mono text-xs text-zinc-900">
                {isPublished && (
                    <div className="border border-amber-200 bg-amber-50 text-amber-900 p-3.5 mb-2 rounded-none font-mono text-[9px] uppercase tracking-wider leading-relaxed">
                        <span className="font-black text-amber-700">⚠️ COMPLIANCE ADVISORY</span>: This product is currently live and PUBLISHED. To modify its specs, details, or catalog fields, please unpublish it (set to Draft) using the quick-toggle on the inventory dashboard.
                    </div>
                )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PRIMARY IMAGE SECTION */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-zinc-500">Primary Image (Cover)</label>
                        <div 
                            className={`flex gap-2 h-36 border transition-all duration-150 ${isDraggingPrimary && !isPublished ? "border-green-600 bg-green-50/20" : "border-transparent"}`}
                            onDragOver={isPublished ? undefined : handlePrimaryDragOver}
                            onDragLeave={isPublished ? undefined : handlePrimaryDragLeave}
                            onDrop={isPublished ? undefined : handlePrimaryDrop}
                        >
                            {primaryPreview ? (
                                <label className={`relative flex-1 rounded-none border border-zinc-200 overflow-hidden ${isPublished ? "cursor-not-allowed" : "cursor-pointer group"}`}>
                                    <input
                                        type="file"
                                        hidden
                                        disabled={isPublished}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPrimaryFile(file);
                                                setPrimaryPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <Image src={primaryPreview} alt="Primary" unoptimized fill className="object-cover" />
                                    {!isPublished && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                                            <p className="text-white text-[10px] font-bold uppercase tracking-wider">Change Cover</p>
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <>
                                    <label className={`flex-1 border border-dashed border-zinc-300 rounded-none bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 transition ${isPublished ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-zinc-100/60"}`}>
                                        <input
                                            type="file"
                                            hidden
                                            disabled={isPublished}
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setPrimaryFile(file);
                                                    setPrimaryPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        <UploadCloud size={20} className="mb-1 text-zinc-450" />
                                        <span className="text-[9px] uppercase font-bold tracking-wider">Choose File</span>
                                    </label>
                                    <button 
                                        type="button"
                                        disabled={isPublished}
                                        onClick={() => { setCameraTarget('primary'); setIsCameraOpen(true); }}
                                        className="flex-1 border border-dashed border-green-200 rounded-none bg-green-50/50 hover:bg-green-50 flex flex-col items-center justify-center text-green-700 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Camera size={20} className="mb-1" />
                                        <span className="text-[9px] uppercase font-bold tracking-wider">Take Photo</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* OTHER IMAGES SECTION */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-zinc-500">Product Gallery</label>
                        <div 
                            className={`grid grid-cols-3 gap-2 border transition-all duration-150 p-1.5 min-h-[9rem] ${isDraggingGallery && !isPublished ? "border-green-600 bg-green-50/20" : "border-transparent"}`}
                            onDragOver={isPublished ? undefined : handleGalleryDragOver}
                            onDragLeave={isPublished ? undefined : handleGalleryDragLeave}
                            onDrop={isPublished ? undefined : handleGalleryDrop}
                        >
                            {otherPreviews.map((url, idx) => (
                                <div key={idx} className="relative h-16 bg-zinc-50 border border-zinc-200 rounded-none overflow-hidden">
                                    <Image src={url} unoptimized alt="Gallery" fill className="object-cover" />
                                    {!isPublished && (
                                        <button
                                            type="button"
                                            onClick={() => removeOtherImage(idx)}
                                            className="absolute top-0 right-0 bg-red-600 text-white rounded-none p-1 border border-zinc-200 border-t-0 border-r-0 cursor-pointer"
                                        >
                                            <X size={10} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {!isPublished && (
                                <>
                                    <label className="flex items-center justify-center h-16 border border-dashed border-zinc-300 rounded-none cursor-pointer bg-zinc-50 hover:bg-zinc-100/60">
                                        <input type="file" hidden multiple accept="image/*" onChange={handleOtherImagesChange} />
                                        <Plus className="text-zinc-400" size={16} />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setCameraTarget('gallery'); setIsCameraOpen(true); }}
                                        className="flex items-center justify-center h-16 border border-dashed border-green-200 bg-green-50/20 hover:bg-green-50 text-green-755 rounded-none cursor-pointer"
                                        title="Snap photo from webcam"
                                    >
                                        <Camera size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* BASIC INFO */}
                <div className="space-y-4">
                    <Input name="title" label="Product Title" defaultValue={initialData?.title}
                        onChange={(e) => setTitle(e.target.value)}
                        required disabled={isPublished} />

                    <div className="space-y-1 font-mono">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Product URL path</label>
                        <div className="flex items-center border border-zinc-250 px-3 py-1.5 bg-zinc-50 rounded-none text-xs">
                            <span className="text-zinc-400 mr-0.5 select-none">{process.env.NEXT_PUBLIC_FRONTEND_URL}/marketplace/</span>
                            <input
                                value={slug}
                                onChange={(e) => {
                                    setSlug(slugify(e.target.value));
                                    setSlugEdited(true);
                                }}
                                disabled={isPublished}
                                className="bg-transparent outline-none flex-1 text-zinc-800 font-mono text-xs focus:ring-0 disabled:cursor-not-allowed disabled:text-zinc-400"
                            />
                        </div>
                        <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider pt-0.5">
                            Customer visible resource locator address
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input name="price" label="Price (₦)" type="number" step="0.01" defaultValue={initialData?.price} required disabled={isPublished} />
                        <Input name="stock" label="Stock Quantity" type="number" defaultValue={initialData?.stock} required disabled={isPublished} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono animate-in fade-in duration-200">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Sector/Division</label>
                            <select
                                value={selectedLevel1}
                                onChange={(e) => handleLevel1Change(e.target.value)}
                                required
                                disabled={isPublished}
                                className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none animate-in fade-in duration-100 disabled:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
                            >
                                <option value="">Select Division</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Main Category</label>
                            <select
                                value={selectedLevel2}
                                onChange={(e) => handleLevel2Change(e.target.value)}
                                required={level2List.length > 0}
                                disabled={isPublished || level2List.length === 0}
                                className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none disabled:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
                            >
                                <option value="">Select Category</option>
                                {level2List.map((child: any) => (
                                    <option key={child.id} value={child.id}>{child.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Sub-Category</label>
                            <select
                                value={selectedLevel3}
                                onChange={(e) => setSelectedLevel3(e.target.value)}
                                disabled={isPublished || level3List.length === 0}
                                className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none disabled:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
                            >
                                <option value="">Select Sub-Category (Optional)</option>
                                {level3List.map((child: any) => (
                                    <option key={child.id} value={child.id}>{child.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 font-mono">
                        <Input name="location" label="Location" defaultValue={initialData?.location} required disabled={isPublished} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">Description Specs</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={initialData?.description}
                            placeholder="Provide laboratory specifications, humidity indexes, moisture percentages, loading constraints..."
                            className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none disabled:bg-zinc-55 disabled:cursor-not-allowed disabled:text-zinc-450"
                            required
                            disabled={isPublished}
                        />
                    </div>
                </div>

                {/* ATTRIBUTES */}
                <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-none shadow-none space-y-3 font-mono">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 leading-none pb-1.5 border-b border-zinc-200">Additional Specifications</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="weight" label="Weight (e.g. 1000kg bulk)" defaultValue={initialData?.attributes?.weight} disabled={isPublished} />
                        <Input name="origin" label="Origin (e.g. Kano, Nigeria)" defaultValue={initialData?.attributes?.origin} disabled={isPublished} />
                    </div>
                    <label className="flex gap-2 items-center cursor-pointer select-none mt-2">
                        <input type="checkbox" name="isOrganic" defaultChecked={initialData?.isOrganic} disabled={isPublished} className="w-3.5 h-3.5 rounded-none border border-zinc-300 accent-green-600 cursor-pointer disabled:cursor-not-allowed" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-650">Certified Organic Produce Batch</span>
                    </label>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-150">
                    <Button type="button" variant="ghost" className="rounded-none text-[10px]" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting || isPublished} className="min-w-32 rounded-none text-[10px] uppercase font-bold tracking-wider">
                        {isSubmitting ? <Loader2 className="animate-spin text-green-700" size={14} /> : "Save Batch"}
                    </Button>
                </div>
            </form>

            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />
        </Modal>
    );
};

export default ProductModal;