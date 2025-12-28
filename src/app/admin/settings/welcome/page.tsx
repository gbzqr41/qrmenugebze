"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Play } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function WelcomeSettingsPage() {
    const { business, updateBusiness } = useDataStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [logoText, setLogoText] = useState(business?.welcomeSettings?.logoText || "RESITAL");
    const [description, setDescription] = useState(
        business?.welcomeSettings?.description || "Lezzetin en saf hali ile tanışın. Premium gastronomi deneyimi için hoş geldiniz."
    );
    const [backgroundImage, setBackgroundImage] = useState(business?.welcomeSettings?.backgroundImage || "");
    const [backgroundVideo, setBackgroundVideo] = useState(business?.welcomeSettings?.backgroundVideo || "");
    const [showWelcome, setShowWelcome] = useState(business?.welcomeSettings?.showWelcome !== false);

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB for images, 20MB for videos)
        const maxSize = file.type.startsWith("video/") ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(file.type.startsWith("video/") ? "Video boyutu 20MB'dan küçük olmalıdır" : "Resim boyutu 5MB'dan küçük olmalıdır");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (file.type.startsWith("video/")) {
                setBackgroundVideo(base64);
                setBackgroundImage("");
            } else {
                setBackgroundImage(base64);
                setBackgroundVideo("");
            }
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeMedia = () => {
        setBackgroundImage("");
        setBackgroundVideo("");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);

        updateBusiness({
            welcomeSettings: {
                logoText,
                description,
                backgroundImage,
                backgroundVideo,
                showWelcome,
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const hasMedia = backgroundImage || backgroundVideo;

    return (
        <div className="max-w-4xl space-y-6">
            {/* Toggle Welcome Page */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-medium">Hoşgeldin Sayfası</h3>
                        <p className="text-white/40 text-sm mt-1">Menüye girmeden önce hoşgeldin sayfası göster</p>
                    </div>
                    <button
                        onClick={() => setShowWelcome(!showWelcome)}
                        className={`w-12 h-6 rounded-full transition-colors ${showWelcome ? "bg-green-500" : "bg-neutral-700"}`}
                    >
                        <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${showWelcome ? "translate-x-6" : "translate-x-0.5"}`}
                        />
                    </button>
                </div>
            </motion.div>

            {/* Logo Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
            >
                <h3 className="text-white font-medium mb-4">Logo Metni</h3>
                <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="RESITAL"
                    className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <p className="text-white/40 text-sm mt-2">Siyah kutu içinde gösterilecek marka adı</p>
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
            >
                <h3 className="text-white font-medium mb-4">Açıklama</h3>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Profesyonel bir açıklama yazın..."
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
                <p className="text-white/40 text-sm mt-2">Logo altında gösterilecek kısa açıklama</p>
            </motion.div>

            {/* Background Media - Gallery Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
            >
                <h3 className="text-white font-medium mb-2">Arka Plan</h3>
                <p className="text-sm text-white/40 mb-4">Resim (max 5MB) veya video (max 20MB) yükleyin</p>

                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Current Media */}
                    {hasMedia && (
                        <div className="relative aspect-square rounded-xl overflow-hidden group">
                            {backgroundVideo ? (
                                <div className="relative w-full h-full">
                                    <video
                                        src={backgroundVideo}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            ) : (
                                <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
                            )}
                            <button
                                type="button"
                                onClick={removeMedia}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Add Button */}
                    {!hasMedia && (
                        <label
                            htmlFor="media-upload"
                            className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
                        >
                            <Plus className="w-10 h-10 text-white/30 mb-2" />
                            <span className="text-sm text-white/40">Ekle</span>
                        </label>
                    )}
                </div>

                {!hasMedia && (
                    <p className="text-white/30 text-sm italic text-center py-4">Henüz arka plan eklenmemiş</p>
                )}
            </motion.div>

            {/* Save Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Kaydet
                    </>
                )}
            </motion.button>

            {/* Saved Toast */}
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
