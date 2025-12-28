"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Instagram, Facebook, Twitter, Youtube, Globe, Music2 } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function SocialSettingsPage() {
    const { business, updateBusiness } = useDataStore();
    const [isSaved, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        instagram: "",
        facebook: "",
        twitter: "",
        tiktok: "",
        youtube: "",
        website: "",
    });

    useEffect(() => {
        setFormData({
            instagram: business.socialMedia?.instagram || "",
            facebook: business.socialMedia?.facebook || "",
            twitter: business.socialMedia?.twitter || "",
            tiktok: business.socialMedia?.tiktok || "",
            youtube: business.socialMedia?.youtube || "",
            website: business.socialMedia?.website || "",
        });
    }, [business.socialMedia]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBusiness({
            socialMedia: {
                instagram: formData.instagram,
                facebook: formData.facebook,
                twitter: formData.twitter,
                tiktok: formData.tiktok,
                youtube: formData.youtube,
                website: formData.website,
            },
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
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
                    <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="instagram.com/kullanici-adi"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* Facebook */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        Facebook
                    </label>
                    <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="facebook.com/sayfa-adi"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* Twitter */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-sky-400" />
                        Twitter / X
                    </label>
                    <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="twitter.com/kullanici-adi"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* TikTok */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Music2 className="w-4 h-4 text-white" />
                        TikTok
                    </label>
                    <input
                        type="text"
                        value={formData.tiktok}
                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                        placeholder="tiktok.com/@kullanici-adi"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* YouTube */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube
                    </label>
                    <input
                        type="text"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="youtube.com/@kanal-adi"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-400" />
                        Website
                    </label>
                    <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="www.siteniz.com"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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

