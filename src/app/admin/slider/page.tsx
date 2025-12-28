"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Pencil, Trash2, X, Image, Check } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import type { SliderItem } from "@/data/mockData";

export default function SliderManagementPage() {
    const { business, updateBusiness } = useDataStore();
    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [sliderModal, setSliderModal] = useState<{ open: boolean; slider?: SliderItem }>({ open: false });
    const [sliderTitle, setSliderTitle] = useState("");
    const [sliderSubtitle, setSliderSubtitle] = useState("");
    const [sliderImage, setSliderImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Sync with business
    useEffect(() => {
        setSliderItems(business.sliderItems || []);
    }, [business.sliderItems]);

    // Modal reset
    useEffect(() => {
        if (sliderModal.open) {
            if (sliderModal.slider) {
                setSliderTitle(sliderModal.slider.title);
                setSliderSubtitle(sliderModal.slider.subtitle || "");
                setSliderImage(sliderModal.slider.image);
            } else {
                setSliderTitle("");
                setSliderSubtitle("");
                setSliderImage("");
            }
        } else {
            setIsSaving(false);
        }
    }, [sliderModal]);

    const handleSliderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast("Resim boyutu 2MB'dan küçük olmalıdır", 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setSliderImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSlider = () => {
        if (!sliderTitle.trim() || !sliderImage || isSaving) return;
        setIsSaving(true);

        const newSlider: SliderItem = {
            id: sliderModal.slider?.id || `slider_${Date.now()}`,
            title: sliderTitle.trim(),
            subtitle: sliderSubtitle.trim() || undefined,
            image: sliderImage,
            link: "",
        };

        let updatedSliders: SliderItem[];
        if (sliderModal.slider) {
            updatedSliders = sliderItems.map(s => s.id === sliderModal.slider!.id ? newSlider : s);
            showToast("Slider güncellendi");
        } else {
            updatedSliders = [...sliderItems, newSlider];
            showToast("Slider eklendi");
        }

        updateBusiness({ sliderItems: updatedSliders });
        setSliderModal({ open: false });
    };

    const handleDeleteSlider = () => {
        const updatedSliders = sliderItems.filter(s => s.id !== deleteModal.id);
        updateBusiness({ sliderItems: updatedSliders });
        showToast("Slider silindi");
        setDeleteModal({ open: false, id: '', name: '' });
    };

    const goBack = () => {
        window.location.href = '/admin/menu';
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-medium shadow-lg"
                    >
                        <Check className="w-5 h-5" />
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setDeleteModal({ open: false, id: '', name: '' })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-sm border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white mb-2">Slider'ı Sil</h3>
                            <p className="text-white/60 mb-6">
                                <span className="text-white font-medium">{deleteModal.name}</span> slider'ını silmek istediğinize emin misiniz?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ open: false, id: '', name: '' })}
                                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleDeleteSlider}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Slider Yönetimi</h1>
                        <p className="text-white/50">Ana sayfada görünecek slider görselleri</p>
                    </div>
                </div>
                <button
                    onClick={() => setSliderModal({ open: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Slider Ekle
                </button>
            </motion.div>

            {/* Slider List */}
            {sliderItems.length > 0 ? (
                <div className="space-y-3">
                    {sliderItems.map((slider, index) => (
                        <motion.div
                            key={slider.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center gap-4 p-4">
                                {/* Image Preview */}
                                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0">
                                    <img
                                        src={slider.image}
                                        alt={slider.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold truncate">{slider.title}</h3>
                                    {slider.subtitle && (
                                        <p className="text-white/50 text-sm truncate">{slider.subtitle}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSliderModal({ open: true, slider })}
                                        className="p-2.5 text-white/60 hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, id: slider.id, name: slider.title })}
                                        className="p-2.5 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-neutral-900 rounded-2xl p-12 border border-white/10 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Image className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Henüz slider eklenmemiş</h3>
                    <p className="text-white/40 mb-6">Ana sayfada görünecek slider görselleri ekleyin</p>
                    <button
                        onClick={() => setSliderModal({ open: true })}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        İlk Slider'ı Ekle
                    </button>
                </div>
            )}

            {/* Slider Modal */}
            <AnimatePresence>
                {sliderModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSliderModal({ open: false })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-md border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {sliderModal.slider ? "Slider Düzenle" : "Yeni Slider"}
                                </h2>
                                <button
                                    onClick={() => setSliderModal({ open: false })}
                                    className="p-2 text-white/60 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Başlık *</label>
                                    <input
                                        type="text"
                                        value={sliderTitle}
                                        onChange={(e) => setSliderTitle(e.target.value)}
                                        placeholder="Slider başlığı"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Açıklama</label>
                                    <input
                                        type="text"
                                        value={sliderSubtitle}
                                        onChange={(e) => setSliderSubtitle(e.target.value)}
                                        placeholder="Alt başlık (opsiyonel)"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Görsel *</label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleSliderImageUpload}
                                        className="hidden"
                                        id={`slider-image-upload-${sliderModal.slider?.id || 'new'}`}
                                        key={sliderModal.slider?.id || 'new'}
                                    />
                                    {sliderImage ? (
                                        <div className="relative h-32 rounded-xl overflow-hidden group">
                                            <label
                                                htmlFor={`slider-image-upload-${sliderModal.slider?.id || 'new'}`}
                                                className="cursor-pointer block w-full h-full"
                                            >
                                                <img src={sliderImage} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">Değiştirmek için tıklayın</span>
                                                </div>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setSliderImage("")}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`slider-image-upload-${sliderModal.slider?.id || 'new'}`}
                                            className="flex flex-col items-center justify-center h-32 bg-neutral-800 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-white/40"
                                        >
                                            <Image className="w-8 h-8 text-white/40 mb-2" />
                                            <span className="text-sm text-white/40">Resim yükle (max 2MB)</span>
                                        </label>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSliderModal({ open: false })}
                                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 font-medium"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveSlider}
                                        disabled={isSaving || !sliderTitle.trim() || !sliderImage}
                                        className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? "Kaydediliyor..." : (sliderModal.slider ? "Kaydet" : "Ekle")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
