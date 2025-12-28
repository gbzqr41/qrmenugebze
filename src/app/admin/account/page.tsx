"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Check } from "lucide-react";

interface AdminInfo {
    name: string;
    email: string;
    password: string;
    package: "starter" | "professional" | "enterprise";
    createdAt: string;
}

export default function ProfilePage() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo>({
        name: "Admin",
        email: "admin@antigravity.com",
        password: "demo123",
        package: "professional",
        createdAt: "2024-01-15",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: adminInfo.name,
        email: adminInfo.email,
    });
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load admin info from localStorage
    useEffect(() => {
        const savedInfo = localStorage.getItem("adminInfo");
        if (savedInfo) {
            const parsed = JSON.parse(savedInfo);
            setAdminInfo(parsed);
            setFormData({
                name: parsed.name,
                email: parsed.email,
            });
        }
    }, []);

    const handleSave = () => {
        const updatedInfo = {
            ...adminInfo,
            name: formData.name,
            email: formData.email,
        };

        setAdminInfo(updatedInfo);
        localStorage.setItem("adminInfo", JSON.stringify(updatedInfo));
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

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
                        <h2 className="text-lg font-bold text-white">Profil Bilgileri</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                            {isEditing ? "İptal" : "Düzenle"}
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">

                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                            <User className="w-4 h-4" />
                            Ad Soyad
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
                                {adminInfo.name}
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
                                {adminInfo.email}
                            </p>
                        )}
                    </div>

                    {isEditing && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                        >
                            Değişiklikleri Kaydet
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
