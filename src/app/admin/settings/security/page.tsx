"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Key, Eye, EyeOff, Smartphone, History, AlertTriangle } from "lucide-react";

export default function SecuritySettingsPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [twoFactor, setTwoFactor] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    const recentLogins = [
        { device: "Chrome - Windows", location: "İstanbul, TR", time: "Bugün, 14:32", current: true },
        { device: "Safari - iPhone", location: "İstanbul, TR", time: "Dün, 09:15", current: false },
        { device: "Firefox - macOS", location: "Ankara, TR", time: "22 Ara, 18:45", current: false },
    ];

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("Yeni şifreler eşleşmiyor!");
            return;
        }
        console.log("Changing password");
        alert("Şifre başarıyla değiştirildi!");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    const handleSecuritySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving security settings:", { twoFactor, sessionTimeout });
        alert("Güvenlik ayarları kaydedildi!");
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit} className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <Key className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Şifre Değiştir</h2>
                </div>

                <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white pr-12 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Yeni Şifre</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white pr-12 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Yeni Şifreyi Onayla</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                    >
                        <Key className="w-4 h-4" />
                        Şifreyi Değiştir
                    </button>
                </div>
            </form>



            {/* Recent Logins */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <History className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Son Oturumlar</h2>
                </div>

                <div className="space-y-3">
                    {recentLogins.map((login, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl">
                            <div>
                                <p className="text-white font-medium flex items-center gap-2">
                                    {login.device}
                                    {login.current && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                            Aktif
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-white/40">{login.location} • {login.time}</p>
                            </div>
                            {!login.current && (
                                <button className="text-red-400 text-sm hover:underline">
                                    Sonlandır
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-bold text-red-400">Tehlikeli Bölge</h2>
                </div>
                <p className="text-sm text-white/60 mb-4">
                    Bu işlemler geri alınamaz. Dikkatli olun.
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Tüm Verileri Sıfırla
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Hesabı Sil
                    </button>
                </div>
            </div>
        </div>
    );
}
