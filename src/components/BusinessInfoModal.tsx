"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Instagram, Globe, Clock } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface BusinessInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessInfoModal({ isOpen, onClose }: BusinessInfoModalProps) {
    const { business } = useDataStore();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setActiveImageIndex(0);
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const gallery = business.gallery || [];
    const hasGallery = gallery.length > 0;

    // Helper to get icon for social media
    const getSocialIcon = (key: string) => {
        switch (key) {
            case "instagram": return <Instagram className="w-5 h-5" />;
            case "facebook": return <span className="w-5 h-5 font-bold">f</span>;
            case "twitter": return <span className="w-5 h-5 font-bold">X</span>;
            case "website": return <Globe className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal - Fullscreen like Filter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">İşletme Bilgileri</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Gallery/Header Image */}
                            <div className="relative w-full h-[300px] bg-neutral-800">
                                {hasGallery ? (
                                    <>
                                        <div
                                            className="w-full h-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${gallery[activeImageIndex]})` }}
                                        />
                                        {/* Dots */}
                                        {gallery.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                {gallery.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveImageIndex(idx)}
                                                        className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? "bg-white w-4" : "bg-white/40"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                        <span className="text-white/20">Görsel Yok</span>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                                {/* Business Name & Logo Overlay */}
                                <div className="absolute -bottom-6 left-6 right-6 flex items-end gap-4">
                                    {/* Logo */}
                                    <div className="w-20 h-20 rounded-2xl bg-neutral-900 border-4 border-neutral-900 shadow-xl overflow-hidden shrink-0">
                                        {business.logo ? (
                                            <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-2xl font-bold text-white">
                                                {business.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Name & Slogan */}
                                    <div className="pb-8 flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-1">{business.name || "İşletme Adı"}</h2>
                                        <p className="text-white/80 text-sm line-clamp-1">{business.slogan || "Hoş geldiniz"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="pt-10 px-6 pb-10 space-y-6">

                                {/* Description */}
                                {business.description && (
                                    <div className="text-center">
                                        <p className="text-white/80 leading-relaxed text-sm">
                                            {business.description}
                                        </p>
                                    </div>
                                )}

                                <div className="h-px bg-white/10" />

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                        İletişim Bilgileri
                                    </h3>
                                    {business.address && (
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                            <span className="text-sm text-white">{business.address}</span>
                                        </div>
                                    )}
                                    {business.phone && (
                                        <div className="flex items-center gap-4">
                                            <Phone className="w-5 h-5 text-white/60 shrink-0" />
                                            <a href={`tel:${business.phone}`} className="text-sm text-white hover:underline">{business.phone}</a>
                                        </div>
                                    )}
                                    {business.website && (
                                        <div className="flex items-center gap-4">
                                            <Globe className="w-5 h-5 text-white/60 shrink-0" />
                                            <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline">{business.website}</a>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Working Hours */}
                                {business.workingHours && business.workingHours.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                                            Çalışma Saatleri
                                        </h3>
                                        <div className="space-y-3">
                                            {business.workingHours.map((hour, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <span className="text-white/70">{hour.day}</span>
                                                    <span className="text-white font-medium">
                                                        {hour.isClosed ? (
                                                            <span className="text-white/50">Kapalı</span>
                                                        ) : (
                                                            `${hour.open} - ${hour.close}`
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="h-px bg-white/10" />

                                {/* Social Media Icons */}
                                {business.socialMedia && (
                                    <div className="flex justify-center gap-4">
                                        {Object.entries(business.socialMedia).map(([key, url]) => (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                                            >
                                                {getSocialIcon(key)}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
