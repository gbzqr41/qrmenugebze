"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Check, Phone, Store } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function ProfilePage() {
    const { business, updateBusiness, isLoading } = useDataStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load business info
    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || "",
                email: business.email || "",
                phone: business.phone || "",
            });
        }
    }, [business]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateBusiness({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            });
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Error saving profile:", err);
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-xl">
                <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-neutral-800 rounded w-1/3" />
                        <div className="h-12 bg-neutral-800 rounded" />
                        <div className="h-12 bg-neutral-800 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl">
            {/* Success Message */}
            {saveSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Profil bilgileri kaydedildi!</span>
                </motion.div>
            )}

            <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-bold text-white">İşletme Bilgileri</h2>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                            {isEditing ? "İptal" : "Düzenle"}
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Business Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                            <User className="w-4 h-4" />
                            İşletme Adı
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        ) : (
                            <p className="text-white font-medium px-4 py-3 bg-neutral-800/50 rounded-xl">
                                {business?.name || "-"}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                            <Mail className="w-4 h-4" />
                            E-posta
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        ) : (
                            <p className="text-white font-medium px-4 py-3 bg-neutral-800/50 rounded-xl">
                                {business?.email || "-"}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                            <Phone className="w-4 h-4" />
                            Telefon
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        ) : (
                            <p className="text-white font-medium px-4 py-3 bg-neutral-800/50 rounded-xl">
                                {business?.phone || "-"}
                            </p>
                        )}
                    </div>

                    {/* Slug - Read only */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">
                            Menü URL
                        </label>
                        <p className="text-white/40 font-medium px-4 py-3 bg-neutral-800/30 rounded-xl text-sm">
                            gbzqr.com/{business?.slug || "..."}
                        </p>
                    </div>

                    {isEditing && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                "Değişiklikleri Kaydet"
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
