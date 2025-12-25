"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

export default function NotificationsSettingsPage() {
    const [settings, setSettings] = useState({
        // Email Notifications
        emailNewOrder: true,
        emailDailyReport: true,
        emailWeeklyReport: false,
        emailNewReview: true,
        emailLowStock: true,

        // Push Notifications
        pushNewOrder: true,
        pushNewReview: false,
        pushSystemUpdates: true,

        // SMS Notifications
        smsNewOrder: false,
        smsReservation: true,

        // Notification Email
        notificationEmail: "admin@restaurant.com",
        notificationPhone: "+90 555 123 4567",
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving notifications:", settings);
        alert("Bildirim ayarları kaydedildi!");
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-neutral-700"
                }`}
        >
            <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-7" : "translate-x-1"
                    }`}
            />
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Email Notifications */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <Mail className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">E-posta Bildirimleri</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Yeni Sipariş</p>
                            <p className="text-sm text-white/40">Her yeni siparişte bildirim al</p>
                        </div>
                        <ToggleSwitch checked={settings.emailNewOrder} onChange={() => handleToggle("emailNewOrder")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Günlük Rapor</p>
                            <p className="text-sm text-white/40">Her gün özet rapor al</p>
                        </div>
                        <ToggleSwitch checked={settings.emailDailyReport} onChange={() => handleToggle("emailDailyReport")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Haftalık Rapor</p>
                            <p className="text-sm text-white/40">Her hafta detaylı rapor al</p>
                        </div>
                        <ToggleSwitch checked={settings.emailWeeklyReport} onChange={() => handleToggle("emailWeeklyReport")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Yeni Değerlendirme</p>
                            <p className="text-sm text-white/40">Müşteri yorumları için bildirim</p>
                        </div>
                        <ToggleSwitch checked={settings.emailNewReview} onChange={() => handleToggle("emailNewReview")} />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-white/60 mb-2 block">Bildirim E-posta Adresi</label>
                        <input
                            type="email"
                            value={settings.notificationEmail}
                            onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Push Bildirimleri</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Yeni Sipariş</p>
                            <p className="text-sm text-white/40">Anlık sipariş bildirimi</p>
                        </div>
                        <ToggleSwitch checked={settings.pushNewOrder} onChange={() => handleToggle("pushNewOrder")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Yeni Değerlendirme</p>
                            <p className="text-sm text-white/40">Yorum bildirimi</p>
                        </div>
                        <ToggleSwitch checked={settings.pushNewReview} onChange={() => handleToggle("pushNewReview")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Sistem Güncellemeleri</p>
                            <p className="text-sm text-white/40">Önemli güncellemeler hakkında bilgi</p>
                        </div>
                        <ToggleSwitch checked={settings.pushSystemUpdates} onChange={() => handleToggle("pushSystemUpdates")} />
                    </div>
                </div>
            </div>

            {/* SMS Notifications */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <Smartphone className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">SMS Bildirimleri</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Yeni Sipariş</p>
                            <p className="text-sm text-white/40">SMS ile sipariş bildirimi</p>
                        </div>
                        <ToggleSwitch checked={settings.smsNewOrder} onChange={() => handleToggle("smsNewOrder")} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl">
                        <div>
                            <p className="text-white font-medium">Rezervasyon</p>
                            <p className="text-sm text-white/40">Rezervasyon bildirimleri</p>
                        </div>
                        <ToggleSwitch checked={settings.smsReservation} onChange={() => handleToggle("smsReservation")} />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-white/60 mb-2 block">Bildirim Telefon Numarası</label>
                        <input
                            type="tel"
                            value={settings.notificationPhone}
                            onChange={(e) => setSettings({ ...settings, notificationPhone: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
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
