"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Instagram, Facebook, Twitter, Youtube, Link2 } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function SocialSettingsPage() {
    const { business, updateBusiness } = useDataStore();

    const [formData, setFormData] = useState({
        instagram: business.socialMedia?.instagram || "",
        facebook: business.socialMedia?.facebook || "",
        twitter: business.socialMedia?.twitter || "",
        youtube: business.socialMedia?.youtube || "",
        tiktok: business.socialMedia?.tiktok || "",
        linkedin: "",
        pinterest: "",
        tripadvisor: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBusiness({
            socialMedia: {
                instagram: formData.instagram,
                facebook: formData.facebook,
                twitter: formData.twitter,
                youtube: formData.youtube,
                tiktok: formData.tiktok,
            },
        });
        alert("✓ Sosyal medya bilgileri kaydedildi!");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Main Social Media */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-bold text-white mb-4">Sosyal Medya Hesapları</h2>

                {/* Instagram */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        Instagram
                    </label>
                    <div className="flex">
                        <span className="px-4 py-3 bg-neutral-700 rounded-l-xl text-white/40">
                            @
                        </span>
                        <input
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            placeholder="kullaniciadi"
                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>

                {/* Facebook */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        Facebook
                    </label>
                    <div className="flex">
                        <span className="px-4 py-3 bg-neutral-700 rounded-l-xl text-white/40 text-sm">
                            facebook.com/
                        </span>
                        <input
                            type="text"
                            value={formData.facebook}
                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            placeholder="sayfaadi"
                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>

                {/* Twitter/X */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-sky-500" />
                        Twitter / X
                    </label>
                    <div className="flex">
                        <span className="px-4 py-3 bg-neutral-700 rounded-l-xl text-white/40">
                            @
                        </span>
                        <input
                            type="text"
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            placeholder="kullaniciadi"
                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>

                {/* YouTube */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube
                    </label>
                    <div className="flex">
                        <span className="px-4 py-3 bg-neutral-700 rounded-l-xl text-white/40 text-sm">
                            youtube.com/@
                        </span>
                        <input
                            type="text"
                            value={formData.youtube}
                            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                            placeholder="kanaladi"
                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>

                {/* TikTok */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                        </svg>
                        TikTok
                    </label>
                    <div className="flex">
                        <span className="px-4 py-3 bg-neutral-700 rounded-l-xl text-white/40 text-sm">
                            tiktok.com/@
                        </span>
                        <input
                            type="text"
                            value={formData.tiktok}
                            onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                            placeholder="kullaniciadi"
                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* Other Platforms */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Diğer Platformlar</h2>
                </div>

                {/* LinkedIn */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">LinkedIn</label>
                    <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* TripAdvisor */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">TripAdvisor</label>
                    <input
                        type="url"
                        value={formData.tripadvisor}
                        onChange={(e) => setFormData({ ...formData, tripadvisor: e.target.value })}
                        placeholder="https://tripadvisor.com/Restaurant-..."
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
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
