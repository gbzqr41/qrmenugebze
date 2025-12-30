"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
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

        if (formData.newPassword.length < 6) {
            setError("Yeni şifre en az 6 karakter olmalı!");
            return;
        }

        setIsLoading(true);

        try {
            const businessId = localStorage.getItem("currentBusinessId");
            const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";
            const adminPhone = localStorage.getItem("adminPhone");

            if (isSuperAdmin && adminPhone) {
                // Verify current password for super admin
                const { data: adminData } = await supabase
                    .from("admins")
                    .select("id")
                    .eq("phone", adminPhone)
                    .eq("password", formData.currentPassword)
                    .single();

                if (!adminData) {
                    setError("Mevcut şifre yanlış!");
                    setIsLoading(false);
                    return;
                }

                // Update super admin password
                const { error: updateError } = await supabase
                    .from("admins")
                    .update({ password: formData.newPassword })
                    .eq("phone", adminPhone);

                if (updateError) throw updateError;
            } else if (businessId) {
                // Verify current password for business
                const { data: businessData } = await supabase
                    .from("businesses")
                    .select("id")
                    .eq("id", businessId)
                    .eq("password", formData.currentPassword)
                    .single();

                if (!businessData) {
                    setError("Mevcut şifre yanlış!");
                    setIsLoading(false);
                    return;
                }

                // Update business password
                const { error: updateError } = await supabase
                    .from("businesses")
                    .update({ password: formData.newPassword })
                    .eq("id", businessId);

                if (updateError) throw updateError;
            } else {
                setError("Oturum bilgisi bulunamadı");
                setIsLoading(false);
                return;
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            // Reset form
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error("Password update error:", err);
            setError("Şifre güncellenirken bir hata oluştu");
        }

        setIsLoading(false);
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
                        disabled={isLoading}
                        className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            "Şifreyi Değiştir"
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
