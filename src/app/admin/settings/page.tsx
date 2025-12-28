"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Building2, FileText, Image, Plus, X, Link as LinkIcon } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function BusinessSettingsPage() {
    const { business, updateBusiness } = useDataStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        slogan: "Premium Dining Experience",
        cuisine: "Türk Mutfağı, Dünya Mutfağı",
        priceRange: "₺₺₺",
        foundedYear: "2020",
    });

    const [gallery, setGallery] = useState<string[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [slugError, setSlugError] = useState("");

    // Load from business
    useEffect(() => {
        setFormData({
            name: business.name || "",
            slug: business.slug || "",
            description: business.description || "",
            slogan: "Premium Dining Experience",
            cuisine: "Türk Mutfağı, Dünya Mutfağı",
            priceRange: "₺₺₺",
            foundedYear: "2020",
        });
        setGallery(business.gallery || []);
    }, [business]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Resim boyutu 2MB'dan küçük olmalıdır");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setGallery((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index: number) => {
        setGallery((prev) => prev.filter((_, i) => i !== index));
    };

    // Validate slug format
    const validateSlug = (value: string): string => {
        // Remove spaces and special chars, convert to lowercase
        return value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleSlugChange = (value: string) => {
        const validated = validateSlug(value);
        setFormData({ ...formData, slug: validated });
        setSlugError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate slug
        if (!formData.slug.trim()) {
            setSlugError("URL adresi zorunludur");
            return;
        }

        updateBusiness({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            gallery: gallery,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        alert("✓ İşletme bilgileri kaydedildi!\n\nMenünüz şu adreste görüntülenebilir:\ngbzqr.com/" + formData.slug);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Menu URL Address - Separate Top Section */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-3">
                <h2 className="text-lg font-bold text-white mb-2">Menü URL Adresi</h2>
                <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">gbzqr.com/</span>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="mikail-cafe"
                        className={`flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 ${slugError ? "ring-2 ring-red-500" : "focus:ring-white/20"}`}
                        required
                    />
                </div>
                {slugError && <p className="text-red-400 text-xs">{slugError}</p>}
                <p className="text-white/30 text-xs">Sadece küçük harf, rakam ve tire kullanılabilir</p>
            </div>

            {/* Business Info Card */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-bold text-white mb-2">Temel Bilgiler</h2>

                {/* Name */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">İşletme Adı *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">Açıklama</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="İşletmenizi tanıtan detaylı açıklama..."
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    />
                </div>
            </div>


            {/* Fixed Save Button */}
            <button
                type="submit"
                className={`fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-[15px] py-[10px] rounded-xl font-semibold shadow-lg transition-all active:scale-95 ${isSaved
                    ? "bg-green-500 text-white"
                    : "bg-white text-black hover:bg-neutral-100"
                    }`}
            >
                <Save className="w-5 h-5" />
                {isSaved ? "Kaydedildi" : "Kaydet"}
            </button>
        </form>
    );
}
