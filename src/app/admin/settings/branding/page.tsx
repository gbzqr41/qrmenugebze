"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image, Upload, Trash2, Eye } from "lucide-react";

export default function BrandingSettingsPage() {
    const [logo, setLogo] = useState<string | null>(null);
    const [favicon, setFavicon] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: string | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setter(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving branding:", { logo, favicon, coverImage });
        alert("✓ Görsel ayarları kaydedildi!");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Logo */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4">Logo</h2>
                <p className="text-sm text-white/40 mb-4">
                    Önerilen boyut: 512x512 px, PNG veya SVG formatı
                </p>

                <div className="flex items-start gap-6">
                    <div
                        className="w-32 h-32 bg-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20"
                    >
                        {logo ? (
                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            <Image className="w-10 h-10 text-white/30" />
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setLogo)}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                        >
                            <Upload className="w-4 h-4" />
                            Logo Yükle
                        </button>
                        {logo && (
                            <button
                                type="button"
                                onClick={() => setLogo(null)}
                                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                Kaldır
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Favicon */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4">Favicon</h2>
                <p className="text-sm text-white/40 mb-4">
                    Tarayıcı sekmesinde görünen küçük ikon. 32x32 veya 64x64 px önerilir.
                </p>

                <div className="flex items-start gap-6">
                    <div
                        className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20"
                    >
                        {favicon ? (
                            <img src={favicon} alt="Favicon" className="w-full h-full object-contain p-1" />
                        ) : (
                            <Image className="w-6 h-6 text-white/30" />
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            ref={faviconInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setFavicon)}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => faviconInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                        >
                            <Upload className="w-4 h-4" />
                            Favicon Yükle
                        </button>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4">Kapak Görseli</h2>
                <p className="text-sm text-white/40 mb-4">
                    Menü sayfasının üstünde gösterilecek geniş banner. 1920x600 px önerilir.
                </p>

                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setCoverImage)}
                    className="hidden"
                />

                <div
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full h-48 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 cursor-pointer hover:border-white/40 transition-colors"
                >
                    {coverImage ? (
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <Upload className="w-10 h-10 text-white/30 mx-auto mb-2" />
                            <p className="text-white/40 text-sm">Kapak görseli yüklemek için tıklayın</p>
                        </div>
                    )}
                </div>

                {coverImage && (
                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                        >
                            <Upload className="w-4 h-4" />
                            Değiştir
                        </button>
                        <button
                            type="button"
                            onClick={() => setCoverImage(null)}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                            Kaldır
                        </button>
                    </div>
                )}
            </div>

            {/* Submit */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
            >
                <Save className="w-5 h-5" />
                Kaydet
            </motion.button>
        </form>
    );
}
