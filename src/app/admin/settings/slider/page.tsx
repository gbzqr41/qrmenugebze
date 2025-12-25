"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image, Plus, Trash2, GripVertical, Link2 } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import type { SliderItem } from "@/data/mockData";

export default function SliderSettingsPage() {
    const { business, updateBusiness, categories, products } = useDataStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Load from business
    useEffect(() => {
        setSliderItems(business.sliderItems || []);
    }, [business.sliderItems]);

    const addSliderItem = () => {
        const newItem: SliderItem = {
            id: `slider_${Date.now()}`,
            title: "Yeni Slider",
            subtitle: "",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
            link: "",
        };
        setSliderItems([...sliderItems, newItem]);
        setEditingIndex(sliderItems.length);
    };

    const updateSliderItem = (index: number, updates: Partial<SliderItem>) => {
        setSliderItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
        );
    };

    const removeSliderItem = (index: number) => {
        setSliderItems((prev) => prev.filter((_, i) => i !== index));
        setEditingIndex(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Resim boyutu 2MB'dan küçük olmalıdır");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            updateSliderItem(index, { image: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBusiness({ sliderItems });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        alert("✓ Slider ayarları kaydedildi!");
    };

    // Build link options from categories and products
    const linkOptions = [
        { value: "", label: "Link Yok" },
        { value: "#", label: "Sadece Görsel" },
        ...categories.map((cat) => ({
            value: `/#category-${cat.id}`,
            label: `Kategori: ${cat.name}`,
        })),
        ...products.slice(0, 20).map((prod) => ({
            value: `/?product=${prod.id}`,
            label: `Ürün: ${prod.name}`,
        })),
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Slider Items */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-bold text-white">Slider Görselleri</h2>
                    </div>
                    <button
                        type="button"
                        onClick={addSliderItem}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white/80 text-sm hover:bg-white/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ekle
                    </button>
                </div>

                <p className="text-sm text-white/40 mb-4">
                    Ana sayfada görünecek slider resimlerini ekleyin (önerilen: 1920x600px)
                </p>

                {sliderItems.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Image className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-white/40 mb-4">Henüz slider eklenmemiş</p>
                        <button
                            type="button"
                            onClick={addSliderItem}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                        >
                            <Plus className="w-4 h-4" />
                            İlk Slider'ı Ekle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sliderItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-neutral-800 rounded-xl overflow-hidden"
                            >
                                {/* Slider Preview */}
                                <div className="relative h-32 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                                    <div className="absolute inset-0 flex items-end p-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{item.title || "Başlık Yok"}</h3>
                                            {item.subtitle && (
                                                <p className="text-sm text-white/70">{item.subtitle}</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                            className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70"
                                        >
                                            {editingIndex === index ? "Kapat" : "Düzenle"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeSliderItem(index)}
                                            className="p-2 bg-red-500/50 rounded-lg text-white hover:bg-red-500/70"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                {editingIndex === index && (
                                    <div className="p-4 space-y-4 border-t border-white/5">
                                        {/* Title */}
                                        <div>
                                            <label className="text-sm text-white/60 mb-2 block">Başlık</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateSliderItem(index, { title: e.target.value })}
                                                placeholder="Slider başlığı"
                                                className="w-full px-4 py-3 bg-neutral-700 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        {/* Subtitle */}
                                        <div>
                                            <label className="text-sm text-white/60 mb-2 block">Alt Başlık</label>
                                            <input
                                                type="text"
                                                value={item.subtitle || ""}
                                                onChange={(e) => updateSliderItem(index, { subtitle: e.target.value })}
                                                placeholder="Alt başlık (opsiyonel)"
                                                className="w-full px-4 py-3 bg-neutral-700 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="text-sm text-white/60 mb-2 block">Görsel</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    className="hidden"
                                                    id={`slider-image-${index}`}
                                                />
                                                <label
                                                    htmlFor={`slider-image-${index}`}
                                                    className="flex-1 px-4 py-3 bg-neutral-700 rounded-xl text-white/60 cursor-pointer hover:bg-neutral-600 text-center"
                                                >
                                                    Resim Yükle (max 2MB)
                                                </label>
                                            </div>
                                        </div>

                                        {/* Link Selection */}
                                        <div>
                                            <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                                                <Link2 className="w-4 h-4" />
                                                Tıklandığında Git
                                            </label>
                                            <select
                                                value={item.link || ""}
                                                onChange={(e) => updateSliderItem(index, { link: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                            >
                                                {linkOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
