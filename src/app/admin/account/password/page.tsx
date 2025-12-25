"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check } from "lucide-react";

interface AdminInfo {
    name: string;
    email: string;
    password: string;
    package: "starter" | "professional" | "enterprise";
    createdAt: string;
}

export default function PasswordPage() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo>({
        name: "Admin",
        email: "admin@antigravity.com",
        password: "demo123",
        package: "professional",
        createdAt: "2024-01-15",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState("");

    // Load admin info from localStorage
    useEffect(() => {
        const savedInfo = localStorage.getItem("adminInfo");
        if (savedInfo) {
            setAdminInfo(JSON.parse(savedInfo));
        }
    }, []);

    const handleSave = () => {
        setError("");

        // Validate
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError("Tüm alanları doldurun");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Yeni şifreler eşleşmiyor!");
            return;
        }

        if (formData.currentPassword !== adminInfo.password) {
            setError("Mevcut şifre yanlış!");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Yeni şifre en az 6 karakter olmalı!");
            return;
        }

        const updatedInfo = {
            ...adminInfo,
            password: formData.newPassword,
        };

        setAdminInfo(updatedInfo);
        localStorage.setItem("adminInfo", JSON.stringify(updatedInfo));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        // Reset form
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
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
                    <span className="text-green-400">Şifre başarıyla değiştirildi!</span>
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
                >
                    <span className="text-red-400">{error}</span>
                </motion.div>
            )}

            <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-bold text-white">Şifre Değiştir</h2>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Current Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="Mevcut şifrenizi girin"
                                className="w-full px-4 py-3 pr-12 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Yeni Şifre</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="En az 6 karakter"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Yeni Şifre Tekrar</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Yeni şifreyi tekrar girin"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Şifreyi Değiştir
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
