"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Building2, FileText, Image, Plus, Trash2, X, Tag, Link as LinkIcon } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function BusinessSettingsPage() {
    const { business, updateBusiness, tags, addTag, removeTag } = useDataStore();
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
    const [tagInput, setTagInput] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [slugError, setSlugError] = useState("");

    // Tag handlers
    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        addTag(tagInput.trim());
        setTagInput("");
    };

    const handleRemoveTag = (tag: string) => {
        if (confirm(`"${tag}" etiketini silmek istediğinize emin misiniz?`)) {
            removeTag(tag);
        }
    };

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
            {/* Business Info Card */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Temel Bilgiler</h2>
                </div>

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

                {/* URL Slug */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Menü URL Adresi *
                    </label>
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
                    {slugError && <p className="text-red-400 text-xs mt-1">{slugError}</p>}
                    <p className="text-white/30 text-xs mt-1">Sadece küçük harf, rakam ve tire kullanılabilir</p>
                </div>

                {/* Slogan */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">Slogan</label>
                    <input
                        type="text"
                        value={formData.slogan}
                        onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                        placeholder="Kısa ve akılda kalıcı slogan"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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

            {/* Gallery */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Galeri</h2>
                </div>

                <p className="text-sm text-white/40">İşletmenizi tanıtan fotoğraflar ekleyin (max 2MB)</p>

                {/* Gallery Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {gallery.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    ))}

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-white/40 transition-colors"
                    >
                        <Plus className="w-6 h-6 text-white/40" />
                        <span className="text-xs text-white/40">Ekle</span>
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Additional Details */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Ek Detaylar</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cuisine Type */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Mutfak Türü</label>
                        <input
                            type="text"
                            value={formData.cuisine}
                            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                            placeholder="örn: İtalyan, Türk"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Fiyat Aralığı</label>
                        <select
                            value={formData.priceRange}
                            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <option value="₺">₺ - Ekonomik</option>
                            <option value="₺₺">₺₺ - Orta</option>
                            <option value="₺₺₺">₺₺₺ - Premium</option>
                            <option value="₺₺₺₺">₺₺₺₺ - Lüks</option>
                        </select>
                    </div>

                    {/* Founded Year */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Kuruluş Yılı</label>
                        <input
                            type="number"
                            value={formData.foundedYear}
                            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                            min="1900"
                            max="2025"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            </div>


            {/* Tag Management */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Etiket Yönetimi</h2>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Yeni etiket adı..."
                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                    >
                        Ekle
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg border border-white/10">
                            <span className="text-white text-sm">{tag}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-white/40 hover:text-red-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <div className="w-full text-center py-4 text-white/30 text-sm">
                            Henüz etiket eklenmemiş.
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${isSaved
                    ? "bg-green-500 text-white"
                    : "bg-white text-black hover:bg-neutral-100"
                    }`}
            >
                <Save className="w-5 h-5" />
                {isSaved ? "✓ Kaydedildi" : "Kaydet"}
            </motion.button>
        </form>
    );
}
