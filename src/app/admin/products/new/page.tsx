"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/context/DataStoreContext";
import MediaUpload from "@/components/MediaUpload";

interface Variation {
    id: string;
    name: string;
    priceModifier: number;
}

interface Extra {
    id: string;
    name: string;
    price: number;
}

export default function NewProductPage() {
    const router = useRouter();
    const { categories, addProduct } = useDataStore();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        originalPrice: "",
        isFeatured: false,
        isNew: true,
        preparationTime: "",
        calories: "",
        allergens: "",
    });
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [variations, setVariations] = useState<Variation[]>([]);
    const [extras, setExtras] = useState<Extra[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("[NewProduct] handleSubmit called");
        console.log("[NewProduct] mediaFiles:", mediaFiles);
        console.log("[NewProduct] mediaFiles length:", mediaFiles.length);

        // Get main image from media files
        const mainImage = mediaFiles[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
        const gallery = mediaFiles.slice(1);

        console.log("[NewProduct] mainImage:", mainImage.substring(0, 100) + "...");
        console.log("[NewProduct] gallery length:", gallery.length);

        // Create product object
        const newProduct = {
            categoryId: formData.categoryId,
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
            image: mainImage,
            gallery: gallery.length > 0 ? gallery : undefined,
            isFeatured: formData.isFeatured,
            isNew: formData.isNew,
            tags: [] as string[],
            variations: variations.filter(v => v.name.trim()),
            extras: extras.filter(e => e.name.trim()),
            allergens: formData.allergens ? formData.allergens.split(",").map(a => a.trim()) : undefined,
            preparationTime: formData.preparationTime || undefined,
            calories: formData.calories ? Number(formData.calories) : undefined,
        };

        console.log("[NewProduct] newProduct:", JSON.stringify(newProduct).substring(0, 500) + "...");

        try {
            addProduct(newProduct);
            console.log("[NewProduct] Product added successfully");
            alert("Ürün başarıyla eklendi!");
            router.push("/admin/products");
        } catch (error) {
            console.error("[NewProduct] Error adding product:", error);
            alert("Ürün eklenirken hata oluştu! Konsolu kontrol edin.");
        }
    };

    const addVariation = () => {
        setVariations((prev) => [
            ...prev,
            { id: Date.now().toString(), name: "", priceModifier: 0 },
        ]);
    };

    const removeVariation = (id: string) => {
        setVariations((prev) => prev.filter((v) => v.id !== id));
    };

    const updateVariation = (id: string, field: keyof Variation, value: string | number) => {
        setVariations((prev) =>
            prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
        );
    };

    const addExtra = () => {
        setExtras((prev) => [
            ...prev,
            { id: Date.now().toString(), name: "", price: 0 },
        ]);
    };

    const removeExtra = (id: string) => {
        setExtras((prev) => prev.filter((e) => e.id !== id));
    };

    const updateExtra = (id: string, field: keyof Extra, value: string | number) => {
        setExtras((prev) =>
            prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <Link
                    href="/admin/products"
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Yeni Ürün</h1>
                    <p className="text-white/40">Menüye yeni ürün ekleyin</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4"
                >
                    <h2 className="text-lg font-bold text-white mb-4">Temel Bilgiler</h2>

                    {/* Name */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Ürün Adı *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="örn: Truffle Burger"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Açıklama *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ürün açıklaması..."
                            rows={3}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Kategori *</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <option value="">Kategori seçin</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Media Upload */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <h2 className="text-lg font-bold text-white mb-4">Görseller & Videolar</h2>
                    <MediaUpload
                        value={mediaFiles}
                        onChange={setMediaFiles}
                        maxFiles={10}
                        acceptVideo={true}
                        label="Ürün görselleri ve videoları"
                    />
                </motion.div>

                {/* Pricing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4"
                >
                    <h2 className="text-lg font-bold text-white mb-4">Fiyatlandırma</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Price */}
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Fiyat (₺) *</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        {/* Original Price */}
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Eski Fiyat (₺)</label>
                            <input
                                type="number"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                placeholder="İndirimli fiyat için"
                                min="0"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Variations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Varyasyonlar</h2>
                        <button
                            type="button"
                            onClick={addVariation}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Ekle
                        </button>
                    </div>

                    {variations.length === 0 ? (
                        <p className="text-sm text-white/40">
                            Boyut, porsiyon gibi seçenekler ekleyin
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {variations.map((variation) => (
                                <div key={variation.id} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={variation.name}
                                        onChange={(e) => updateVariation(variation.id, "name", e.target.value)}
                                        placeholder="Varyasyon adı"
                                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <input
                                        type="number"
                                        value={variation.priceModifier}
                                        onChange={(e) => updateVariation(variation.id, "priceModifier", Number(e.target.value))}
                                        placeholder="Fiyat farkı"
                                        className="w-32 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariation(variation.id)}
                                        className="p-3 bg-neutral-800 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Extras */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Ekstra Malzemeler</h2>
                        <button
                            type="button"
                            onClick={addExtra}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Ekle
                        </button>
                    </div>

                    {extras.length === 0 ? (
                        <p className="text-sm text-white/40">
                            Ek malzeme seçenekleri ekleyin
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {extras.map((extra) => (
                                <div key={extra.id} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={extra.name}
                                        onChange={(e) => updateExtra(extra.id, "name", e.target.value)}
                                        placeholder="Ekstra adı"
                                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <input
                                        type="number"
                                        value={extra.price}
                                        onChange={(e) => updateExtra(extra.id, "price", Number(e.target.value))}
                                        placeholder="Fiyat"
                                        min="0"
                                        className="w-32 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExtra(extra.id)}
                                        className="p-3 bg-neutral-800 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4"
                >
                    <h2 className="text-lg font-bold text-white mb-4">Ek Bilgiler</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Hazırlanma Süresi</label>
                            <input
                                type="text"
                                value={formData.preparationTime}
                                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                                placeholder="örn: 15-20 dk"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Kalori</label>
                            <input
                                type="number"
                                value={formData.calories}
                                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                placeholder="kcal"
                                min="0"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Alerjenler</label>
                        <input
                            type="text"
                            value={formData.allergens}
                            onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                            placeholder="örn: Gluten, Süt, Yumurta"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded bg-neutral-800 border-white/20 text-white focus:ring-white/20"
                            />
                            <span className="text-white/60">Öne Çıkan</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isNew}
                                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                className="w-5 h-5 rounded bg-neutral-800 border-white/20 text-white focus:ring-white/20"
                            />
                            <span className="text-white/60">Yeni Ürün</span>
                        </label>
                    </div>
                </motion.div>

                {/* Submit Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                >
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        <Save className="w-5 h-5" />
                        Ürünü Kaydet
                    </button>
                    <button
                        type="button"
                        className="px-6 py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors border border-white/5"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </motion.div>
            </form>
        </div>
    );
}
