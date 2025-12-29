"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Phone, Mail, MapPin, Globe, ExternalLink } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";

export default function ContactSettingsPage() {
    const { business, updateBusiness } = useDataStore();
    const { showToast } = useTheme();

    const [formData, setFormData] = useState({
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website,
        whatsapp: "",
        reservationPhone: "",
        googleMapsUrl: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBusiness({
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
        });
        showToast("✓ İletişim bilgileri kaydedildi!", "success");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Primary Contact */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Birincil İletişim</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefon
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+90 555 123 4567"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </label>
                        <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            placeholder="+90 555 123 4567"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Reservation Phone */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Rezervasyon Telefonu</label>
                        <input
                            type="tel"
                            value={formData.reservationPhone}
                            onChange={(e) => setFormData({ ...formData, reservationPhone: e.target.value })}
                            placeholder="+90 555 123 4568"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="info@isletme.com"
                            className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Konum</h2>
                </div>

                {/* Address */}
                <div>
                    <label className="text-sm text-white/60 mb-2 block">Adres</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                        placeholder="Tam adres bilgisi..."
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    />
                </div>

                {/* Google Maps URL */}
                <div>
                    <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Google Maps Linki
                    </label>
                    <input
                        type="text"
                        value={formData.googleMapsUrl}
                        onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
            </div>

            {/* Website */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Web Sitesi</h2>
                </div>

                <div>
                    <label className="text-sm text-white/60 mb-2 block">Website URL</label>
                    <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://www.isletme.com"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
            </div>

            {/* Fixed Save Button */}
            <button
                type="submit"
                className="fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-[15px] py-[10px] rounded-xl font-semibold shadow-lg transition-all active:scale-95 bg-white text-black hover:bg-neutral-100"
            >
                <Save className="w-5 h-5" />
                Kaydet
            </button>
        </form>
    );
}
