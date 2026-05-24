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
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [slugEdited, setSlugEdited] = useState(false);


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

    }, [fetcher])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories]);

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
        console.log("Primary Upload Result:", data);
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
console.log("Other Upload Result:", data);
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
                title,
                slug,
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
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh]  px-1">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PRIMARY IMAGE SECTION */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Primary Image (Cover)</label>
                        <div className="flex gap-2 h-48">
                            {primaryPreview ? (
                                <label className="relative flex-1 cursor-pointer group">
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
                                    <Image src={primaryPreview} alt="Primary" unoptimized fill className="object-cover rounded-lg border-2 border-dashed border-transparent group-hover:border-emerald-500" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                                        <p className="text-white text-sm font-bold">Change Image</p>
                                    </div>
                                </label>
                            ) : (
                                <>
                                    <label className="flex-1 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center text-gray-400 transition">
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
                                        <UploadCloud size={28} className="mb-2" />
                                        <span className="text-xs font-medium">Choose File</span>
                                    </label>
                                    <label className="flex-1 border-2 border-dashed rounded-xl cursor-pointer hover:bg-emerald-50 flex flex-col items-center justify-center text-emerald-600 border-emerald-100 transition">
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setPrimaryFile(file);
                                                    setPrimaryPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        <Camera size={28} className="mb-2" />
                                        <span className="text-xs font-medium">Take Photo</span>
                                    </label>
                                </>
                            )}
                        </div>
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
                    <Input name="title" label="Product Title" defaultValue={initialData?.title}
                        onChange={(e) => setTitle(e.target.value)}
                        required />

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Product URL</label>

                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 text-sm">
                            <span className="text-gray-400 mr-1">{process.env.NEXT_PUBLIC_FRONTEND_URL}/marketplace/</span>
                            <input
                                value={slug}
                                onChange={(e) => {
                                    setSlug(slugify(e.target.value));
                                    setSlugEdited(true); // stop auto updates
                                }}
                                className="bg-transparent outline-none flex-1 text-gray-700"
                            />
                        </div>

                        <p className="text-xs text-gray-400">
                            This is how your product link will appear to customers
                        </p>
                    </div>

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
                                {categories.map((c: any) => (
                                    c.children?.length > 0 ? (
                                        <optgroup key={c.id} label={c.name}>
                                            <option value={c.id}>{c.name} (General)</option>
                                            {c.children.map((child: any) => (
                                                <option key={child.id} value={child.id}>{child.name}</option>
                                            ))}
                                        </optgroup>
                                    ) : (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                        <Input name="location" label=" Location" defaultValue={initialData?.location} required />
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