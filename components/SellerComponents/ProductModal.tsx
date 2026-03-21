"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { UploadCloud, Loader2, X, Plus } from "lucide-react";
import { Modal } from "../Modal";
import Image from "next/image";
import { toast } from "react-toastify";
import { useApi } from "@/hooks/useApi";

interface Category {
    id: string;
    name: string;
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
    const fetcher = useApi()
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
 

    const fetchCategories = useCallback(async () => {
        const res = await fetcher("/api/categories");
        try {
            const data = res?.data;
            setCategories(data)
        }
        catch (e) {
            toast.error("Failed to load categories")
        }

    }, [])

    useEffect(() => { 
        fetchCategories() 
    }, []);

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
        files.forEach((file) => fd.append("files", file)); // Note: 'files' plural

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
        // If it's a new file, remove from files array too
        // This logic assumes index matches between previews and files for simplicity
        setOtherFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // 1. Validation
            if (String(formData.get("description")).length < 10) {
                return toast.error("Description must be at least 10 characters");
            }

            // 2. Handle Primary Image Upload
            let primaryImageUrl = initialData?.primaryImage;
            if (primaryFile) {
                primaryImageUrl = await uploadPrimaryImage(primaryFile);
            }

            if (!primaryImageUrl) {
                return toast.error("Primary product image is required");
            }

            // 3. Handle Other Images Upload
            // Filter out already existing URLs from the previews to only upload new files
            const newUploadedUrls = await uploadOtherImages(otherFiles);
            const existingUrls = otherPreviews.filter((p) => p.startsWith("http"));

            const finalOtherImages = [
                ...existingUrls,
                ...newUploadedUrls,
            ];

 
            // 4. Construct Payload (Matches your new DTO)
            const payload = {
                title: formData.get("title"),
                description: formData.get("description"),
                price: Number(formData.get("price")),
                stock: Number(formData.get("stock")),
                categoryId: formData.get("category"), // Category UUID
                location: formData.get("location"),
                primaryImage: primaryImageUrl, // Now a string, not array
                otherImages: finalOtherImages, // Array of strings
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
console.log(initialData)
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Product" : "Add Product"}>
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh]  px-1">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PRIMARY IMAGE SECTION */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Primary Image (Cover)</label>
                        <label className="block border-2 border-dashed rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPrimaryFile(file);
                                        setPrimaryPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {primaryPreview ? (
                                <div className="relative h-48 w-full">
                                    <Image src={primaryPreview} alt="Primary" unoptimized fill className="object-cover rounded-lg" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                        <p className="text-white text-sm font-bold">Change Image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                    <UploadCloud size={32} />
                                    <span className="mt-2 text-xs">Upload Main Image</span>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* OTHER IMAGES SECTION */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Gallery</label>
                        <div className="grid grid-cols-3 gap-2">
                            {otherPreviews.map((url, idx) => (
                                <div key={idx} className="relative h-20 bg-gray-100 rounded-lg">
                                    <Image src={url} unoptimized alt="Gallery" fill className="object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => removeOtherImage(idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="flex items-center justify-center h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="file" hidden multiple accept="image/*" onChange={handleOtherImagesChange} />
                                <Plus className="text-gray-400" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* BASIC INFO */}
                <div className="space-y-4">
                    <Input name="title" label="Product Title" defaultValue={initialData?.title} required />

                    <div className="grid grid-cols-2 gap-4">
                        <Input name="price" label="Price (₦)" type="number" step="0.01" defaultValue={initialData?.price} required />
                        <Input name="stock" label="Stock Quantity" type="number" defaultValue={initialData?.stock} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                defaultValue={initialData?.categoryId || ""}
                                required
                                className="w-full border rounded-lg p-2 text-sm bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <Input name="location" label="Farm Location" defaultValue={initialData?.location} required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={initialData?.description}
                            placeholder="Tell buyers about your product..."
                            className="w-full border rounded-lg p-2 text-sm"
                            required
                        />
                    </div>
                </div>

                {/* ATTRIBUTES */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <p className="text-sm font-bold text-gray-700">Additional Details</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="weight" label="Weight (e.g. 5kg)" defaultValue={initialData?.attributes?.weight} />
                        <Input name="origin" label="Origin (e.g. Kenya)" defaultValue={initialData?.attributes?.origin} />
                    </div>
                    <label className="flex gap-2 items-center cursor-pointer select-none">
                        <input type="checkbox" name="isOrganic" defaultChecked={initialData?.isOrganic} className="w-4 h-4 rounded" />
                        <span className="text-sm">This is a certified organic product</span>
                    </label>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4 ">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-30">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Product"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductModal;