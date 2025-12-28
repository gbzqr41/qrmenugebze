"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Image } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function GallerySettingsPage() {
    const { business, updateBusiness } = useDataStore();
    const [gallery, setGallery] = useState<string[]>(business.gallery || []);
    const [isSaved, setIsSaved] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Resim boyutu 2MB'dan küçük olmalıdır");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const newGallery = [...gallery, base64];
            setGallery(newGallery);
            updateBusiness({ gallery: newGallery });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        const newGallery = gallery.filter((_, i) => i !== index);
        setGallery(newGallery);
        updateBusiness({ gallery: newGallery });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-bold text-white mb-2">Galeri</h2>
                <p className="text-sm text-white/40 mb-4">İşletme fotoğraflarını buradan yönetin (max 2MB)</p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="gallery-upload"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gallery.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <label
                        htmlFor="gallery-upload"
                        className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
                    >
                        <Plus className="w-10 h-10 text-white/30 mb-2" />
                        <span className="text-sm text-white/40">Ekle</span>
                    </label>
                </div>

                {gallery.length === 0 && (
                    <p className="text-white/30 text-sm italic text-center py-4">Henüz fotoğraf eklenmemiş</p>
                )}
            </div>

            {isSaved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-medium shadow-lg"
                >
                    Kaydedildi
                </motion.div>
            )}
        </div>
    );
}
